import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { proxyRequest } from "@/services/proxy.service";
import { processBilling } from "@/services/billing.service";
import { createHash } from "crypto";

// ─────────────────────────────────────────────
// POST /api/v1/chat/completions
// AI Proxy Gateway — Main entry point
// ─────────────────────────────────────────────
// Node.js runtime (Prisma requires it — no Edge)
// Extended timeout for long AI streaming responses
export const maxDuration = 60;

/**
 * Extracts the API key from the Authorization header.
 * Expects format: "Bearer sk-nexus-xxx"
 */
function extractApiKey(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") return null;

  const key = parts[1].trim();
  if (!key || !key.startsWith("sk-nexus-")) return null;

  return key;
}

/**
 * Creates a JSON error response matching the OpenAI error format.
 */
function errorResponse(
  message: string,
  status: number,
  type = "invalid_request_error"
) {
  return NextResponse.json(
    {
      error: {
        message,
        type,
        code: status,
      },
    },
    { status }
  );
}

// ─────────────────────────────────────────────
// SSE Stream Interceptor
// Parses SSE chunks flowing through the stream
// to extract token usage (including cached_tokens)
// from the final chunk, then fires async billing.
// ─────────────────────────────────────────────
interface UsageData {
  prompt_tokens: number;
  completion_tokens: number;
  cached_tokens: number;
}

function createStreamInterceptor(
  upstreamBody: ReadableStream<Uint8Array>,
  onUsageFound: (usage: UsageData) => void
): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  let buffer = ""; // Leftover partial line from previous chunk
  let usage: UsageData | null = null;
  let usageReported = false;

  const reportUsage = () => {
    if (usage && !usageReported) {
      usageReported = true;
      onUsageFound(usage);
    }
  };

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstreamBody.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            // Stream ended — fire billing if we found usage
            reportUsage();
            controller.close();
            break;
          }

          // Pass the raw bytes through to the client immediately
          controller.enqueue(value);

          // Decode and scan for usage data in SSE lines
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");

          // Keep the last (potentially incomplete) line in the buffer
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();

            // Skip non-data lines
            if (!trimmed.startsWith("data: ")) {
              continue;
            }

            // [DONE] signal — finalize billing with whatever we have
            if (trimmed === "data: [DONE]") {
              reportUsage();
              continue;
            }

            // Parse the JSON payload
            const jsonStr = trimmed.slice(6); // Remove "data: " prefix
            try {
              const parsed = JSON.parse(jsonStr);

              // The usage object appears in the final data chunk
              // (when stream_options.include_usage is true)
              // OpenAI format: usage.prompt_tokens_details.cached_tokens
              if (parsed.usage?.prompt_tokens != null) {
                usage = {
                  prompt_tokens: parsed.usage.prompt_tokens,
                  completion_tokens: parsed.usage.completion_tokens,
                  cached_tokens:
                    parsed.usage.prompt_tokens_details?.cached_tokens || 0,
                };
              }
            } catch {
              // Not valid JSON — skip (could be partial or malformed)
            }
          }
        }
      } catch (error) {
        // If we found usage before the error, still bill
        reportUsage();
        controller.error(error);
      }
    },

    cancel() {
      // Client disconnected — still bill if we found usage
      reportUsage();
    },
  });
}

// ─────────────────────────────────────────────
// POST Handler
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  // ── Step A: Extract and validate API key ────────
  const apiKeyRaw = extractApiKey(request);

  if (!apiKeyRaw) {
    return errorResponse(
      "Thiếu hoặc sai API key. Vui lòng kiểm tra lại.",
      401,
      "authentication_error"
    );
  }

  // ── Step B: Verify key in database ──────────────
  const hashedKey = createHash("sha256").update(apiKeyRaw).digest("hex");

  const apiKeyRecord = await prisma.apiKey.findUnique({
    where: { hashedKey },
    include: {
      user: {
        select: {
          id: true,
          totalCredit: true,
          role: true,
        },
      },
    },
  });

  if (!apiKeyRecord || apiKeyRecord.status !== "ACTIVE") {
    return errorResponse(
      "API key không hợp lệ hoặc đã bị thu hồi.",
      401,
      "authentication_error"
    );
  }

  // ── Step C: Check credit balance ────────────────
  const user = apiKeyRecord.user;

  if (user.totalCredit <= 0) {
    return errorResponse(
      `Không đủ credits. Số dư của bạn là ${user.totalCredit.toFixed(4)} credits. ` +
      `Vui lòng nạp thêm tại https://nexusapi.vn/billing`,
      402,
      "insufficient_credits"
    );
  }

  // ── Step D: Parse request body ──────────────────
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON in request body.", 400);
  }

  if (!body.model || !body.messages) {
    return errorResponse(
      "Thiếu required fields: 'model' and 'messages'.",
      400
    );
  }

  // ── Step D.1: Absolute Minimum Block (Dynamic from DB) ──
  const modelNameRequested = String(body.model);
  const modelPricing = await prisma.modelPricing.findUnique({
    where: { modelId: modelNameRequested }
  });

  // Strict Model Validation: Only allow models in ModelPricing (unless user is ADMIN)
  if (!modelPricing && user.role !== "ADMIN") {
    return errorResponse(
      `Mô hình '${modelNameRequested}' hiện chưa được hỗ trợ. Vui lòng liên hệ quản trị viên hoặc sử dụng mô hình trong danh mục.`,
      400,
      "unsupported_model"
    );
  }

  // ── Step D.2: Overdraft Protection — throttle max_tokens ──
  // Prevent low-balance users from requesting massive generations
  const LOW_BALANCE_THRESHOLD = 200;
  const minRequired = modelPricing?.minCreditRequired ?? LOW_BALANCE_THRESHOLD;

  if (user.totalCredit < minRequired) {
    if (minRequired > LOW_BALANCE_THRESHOLD) {
      return errorResponse(
        `Mô hình này yêu cầu số dư tối thiểu ${minRequired} credits để hoạt động. Vui lòng nạp thêm.`,
        402,
        "insufficient_credits"
      );
    } else {
      const THROTTLED_MAX_TOKENS = 300;

      const isNewGenerationModel =
        modelNameRequested.startsWith("o1") ||
        modelNameRequested.startsWith("o3") ||
        modelNameRequested.startsWith("o4") ||
        modelNameRequested.startsWith("gpt-4o") ||
        modelNameRequested.startsWith("gpt-5");

      if (isNewGenerationModel) {
        // VỚI MODEL ĐỜI MỚI: Bắt buộc dùng max_completion_tokens, TUYỆT ĐỐI KHÔNG gửi max_tokens
        const currentMaxCompletion = body.max_completion_tokens as number | undefined;
        body.max_completion_tokens = Math.min(currentMaxCompletion || THROTTLED_MAX_TOKENS, THROTTLED_MAX_TOKENS);

        // Cẩn tắc vô áy náy: Xóa sạch dấu vết của max_tokens (nếu khách lỡ tay gửi lên)
        if ('max_tokens' in body) {
          delete body.max_tokens;
        }

        console.log(`[Throttle] Model MỚI: Dùng max_completion_tokens bóp về ${body.max_completion_tokens}`);
      } else {
        // VỚI MODEL ĐỜI CŨ (gpt-3.5, gpt-4, claude cũ): Dùng max_tokens như bình thường
        const currentMax = body.max_tokens as number | undefined;
        body.max_tokens = Math.min(currentMax || THROTTLED_MAX_TOKENS, THROTTLED_MAX_TOKENS);

        console.log(`[Throttle] Model CŨ: Dùng max_tokens bóp về ${body.max_tokens}`);
      }
    }
  }

  // ── Step E: Proxy to upstream ───────────────────
  let proxyResult;
  try {
    proxyResult = await proxyRequest({ body });
  } catch (error) {
    const status = (error as Error & { status?: number }).status || 502;
    const message =
      error instanceof Error ? error.message : "Upstream request failed";

    console.error(`[Proxy] Upstream error for user=${user.id}:`, message);
    return errorResponse(`Upstream error: ${message}`, status, "upstream_error");
  }

  const { response: upstreamResponse, isStream, model } = proxyResult;
  const apiKeyId = apiKeyRecord.id;
  const userId = user.id;

  // ── Step F: Handle streaming response ───────────
  if (isStream && upstreamResponse.body) {
    const interceptedStream = createStreamInterceptor(
      upstreamResponse.body,
      (usage) => {
        // Fire-and-forget billing — do NOT await
        const durationMs = Date.now() - startTime;
        processBilling(
          apiKeyId,
          userId,
          model,
          usage.prompt_tokens,
          usage.completion_tokens,
          usage.cached_tokens,
          durationMs,
          200  // Stream luôn thành công nếu có usage
        ).catch(console.error);
      }
    );

    return new NextResponse(interceptedStream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-NexusAPI-Model": model,
      },
    });
  }

  // ── Step G: Handle non-streaming response ───────
  // For non-stream requests, the usage is in the JSON body directly
  try {
    const responseData = await upstreamResponse.json();

    // Extract usage and bill immediately (still fire-and-forget)
    if (responseData.usage) {
      const durationMs = Date.now() - startTime;
      const cachedTokens =
        responseData.usage.prompt_tokens_details?.cached_tokens || 0;

      processBilling(
        apiKeyId,
        userId,
        model,
        responseData.usage.prompt_tokens || 0,
        responseData.usage.completion_tokens || 0,
        cachedTokens,
        durationMs,
        200
      ).catch(console.error);
    }

    return NextResponse.json(responseData, {
      status: 200,
      headers: { "X-NexusAPI-Model": model },
    });
  } catch {
    return errorResponse("Failed to parse upstream response.", 502);
  }
}
