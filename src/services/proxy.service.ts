import { Redis } from "@upstash/redis";
import crypto from "crypto";
// ─────────────────────────────────────────────
// Proxy Service
// Constructs and forwards requests to upstream
// AI providers (Multi-Provider Smart Router)
// ─────────────────────────────────────────────

export interface ProxyRequestOptions {
  body: Record<string, unknown>;
  /** Override the upstream base URL for this request */
  endpoint?: "chat" | "embeddings";
  upstreamUrl?: string;
  /** Override the upstream API key for this request */
  upstreamKey?: string;
  /** Additional headers to forward (e.g. custom metadata) */
  extraHeaders?: Record<string, string>;
}

export interface ProxyResult {
  response: Response;
  isStream: boolean;
  model: string;
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

/**
 * 🧠 BỘ ĐỊNH TUYẾN (ROUTER): Tự động chọn URL và Key dựa vào tên Model
 */
function getProviderConfig(model: string) {
  const lowerModel = model.toLowerCase();

  // 1. DeepSeek
  if (lowerModel.startsWith("deepseek")) {
    return {
      url: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1",
      key: process.env.DEEPSEEK_API_KEY || "",
    };
  }
  // 2. Google Gemini (Sử dụng endpoint tương thích OpenAI mới nhất)
  if (lowerModel.startsWith("gemini")) {
    return {
      url: process.env.GOOGLE_BASE_URL || "https://generativelanguage.googleapis.com/v1beta/openai",
      key: process.env.GOOGLE_API_KEY || "",
    };
  }
  // 3. Alibaba Qwen
  if (lowerModel.startsWith("qwen")) {
    return {
      url: process.env.QWEN_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1",
      key: process.env.QWEN_API_KEY || "",
    };
  }
  // 4. Anthropic Claude
  if (lowerModel.startsWith("claude")) {
    return {
      url: process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com/v1",
      key: process.env.ANTHROPIC_API_KEY || "",
    };
  }

  // Mặc định (Fallback): Chạy về OpenAI (gpt-4o, gpt-5, o1, o3...)
  return {
    url: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
    key: process.env.OPENAI_API_KEY || "",
  };
}

/**
 * Forward a chat completion request to the correct upstream AI provider.
 */
export async function proxyRequest(
  options: ProxyRequestOptions
): Promise<ProxyResult> {
  const { body, extraHeaders = {}, endpoint = "chat" } = options;

  const isStream = body.stream === true;
  const model = (body.model as string) || "unknown";

  // 1. TẠO CACHE KEY TỪ NỘI DUNG CÂU HỎI
  // Hash toàn bộ mảng messages để làm key (Bỏ qua max_tokens hay temperature để tăng tỉ lệ cache hit)
  const cachePayload = { model: body.model, messages: body.messages };
  const cacheKey = `cache:chat:${crypto.createHash("sha256").update(JSON.stringify(cachePayload)).digest("hex")}`;

  // 2. KIỂM TRA XEM CÓ TRONG CACHE KHÔNG?
  // Chỉ cache nếu khách không dùng tính năng Streaming (Stream khó cache hơn)
  if (!body.stream && endpoint === "chat") {
    const cachedResponse = await redis.get(cacheKey) as Record<string, any> | null;
    if (cachedResponse) {
      console.log(`[Cache Hit] Đã trả lời từ Redis cho câu hỏi: ${cacheKey}`);

      if (cachedResponse.usage) {
        const originalPromptTokens = cachedResponse.usage.prompt_tokens || 0;

        cachedResponse.usage = {
          ...cachedResponse.usage,
          prompt_tokens_details: {
            ...(cachedResponse.usage.prompt_tokens_details || {}),
            // Ép toàn bộ prompt token thành cached token để tính giá 5%
            cached_tokens: originalPromptTokens
          }
        };
      }
      // Giả lập một Response ảo trả về cho Client
      const fakeResponse = new Response(JSON.stringify(cachedResponse), {
        status: 200,
        headers: { "Content-Type": "application/json", "X-Cache": "HIT" }
      });
      return { response: fakeResponse, isStream: false, model: body.model as string };
    }
  }

  // 1. ── Lấy cấu hình hãng từ Router ─────────────────
  const providerConfig = getProviderConfig(model);

  const finalUpstreamUrl = options.upstreamUrl || providerConfig.url;
  const finalUpstreamKey = options.upstreamKey || providerConfig.key;

  if (!finalUpstreamKey) {
    throw new Error(`[Proxy Error] Thiếu API Key cho model: ${model}. Vui lòng kiểm tra file .env!`);
  }

  // 2. ── Bơm stream_options để đo lường Usage ───────
  const requestBody = { ...body };

  if (isStream) {
    requestBody.stream_options = {
      ...(typeof requestBody.stream_options === "object" && requestBody.stream_options !== null
        ? (requestBody.stream_options as Record<string, unknown>)
        : {}),
      include_usage: true,
    };
  }

  // 3. ── Xử lý URL & Headers (Đặc trị các hãng) ──────
  const baseUrlCleaned = finalUpstreamUrl.replace(/\/+$/, "");
  let targetUrl = endpoint === "embeddings"
    ? `${baseUrlCleaned}/embeddings`
    : `${baseUrlCleaned}/chat/completions`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${finalUpstreamKey}`,
    ...extraHeaders,
  };

  // 🚨 Đặc trị Anthropic: Bọn này chảnh, không xài Bearer Token và URL chuẩn
  if (model.startsWith("claude") && finalUpstreamUrl.includes("anthropic.com")) {
    targetUrl = `${baseUrlCleaned}/messages`;
    headers["x-api-key"] = finalUpstreamKey;
    headers["anthropic-version"] = "2023-06-01";
    delete headers["Authorization"];
  }

  // 4. ── Bắn request lên Hãng ───────────────────────
  const upstreamResponse = await fetch(targetUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody),
  });

  // 5. ── Xử lý lỗi từ Hãng ──────────────────────────
  if (!upstreamResponse.ok) {
    const errorText = await upstreamResponse.text().catch(() => "Unknown Upstream Error");
    let cleanMessage = errorText;
    try {
      const parsedError = JSON.parse(errorText);
      if (parsedError.error && parsedError.error.message) {
        cleanMessage = parsedError.error.message;
      } else if (parsedError.message) {
        cleanMessage = parsedError.message;
      }
    } catch (e) {
      // Nếu không phải JSON (VD: Cloudflare 502 HTML) thì giữ nguyên errorText
    }

    // Ném lỗi ra ngoài với message đã được dọn sạch
    const error = new Error(cleanMessage);
    (error as Error & { status: number }).status = upstreamResponse.status;
    throw error;
  }

  if (upstreamResponse.ok && !body.stream && endpoint === "chat") {
    // Clone response ra để vừa lưu cache vừa trả về cho khách
    const responseClone = upstreamResponse.clone();
    try {
      const responseData = await responseClone.json();
      // Lưu vào Redis trong 24 tiếng (86400 giây)
      await redis.setex(cacheKey, 86400, responseData);
      console.log(`[Cache Miss] Đã lưu câu trả lời mới vào Redis: ${cacheKey}`);
    } catch (e) {
      console.error("Lỗi khi lưu Cache:", e);
    }
  }

  return {
    response: upstreamResponse,
    isStream,
    model,
  };
}