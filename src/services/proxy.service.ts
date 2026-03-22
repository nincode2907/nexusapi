// ─────────────────────────────────────────────
// Proxy Service
// Constructs and forwards requests to upstream
// AI providers (OpenAI-compatible endpoints)
// ─────────────────────────────────────────────

const UPSTREAM_BASE_URL =
  process.env.UPSTREAM_BASE_URL ||
  process.env.OPENAI_BASE_URL ||
  "https://api.openai.com/v1";

const UPSTREAM_API_KEY =
  process.env.UPSTREAM_API_KEY || process.env.OPENAI_API_KEY || "";

export interface ProxyRequestOptions {
  body: Record<string, unknown>;
  /** Override the upstream base URL for this request */
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

/**
 * Forward a chat completion request to the upstream AI provider.
 *
 * Key behavior:
 * - If `stream: true`, forcefully injects `stream_options.include_usage = true`
 *   so the final SSE chunk contains token usage data.
 * - Forwards the request as-is otherwise (model, messages, temperature, etc.).
 * - Returns the raw fetch Response for streaming back to the client.
 */
export async function proxyRequest(
  options: ProxyRequestOptions
): Promise<ProxyResult> {
  const {
    body,
    upstreamUrl = UPSTREAM_BASE_URL,
    upstreamKey = UPSTREAM_API_KEY,
    extraHeaders = {},
  } = options;

  const isStream = body.stream === true;
  const model = (body.model as string) || "unknown";

  // ── Inject stream_options for usage tracking ────
  // This ensures the upstream returns token counts in the
  // final SSE chunk, which we need for billing.
  const requestBody = { ...body };

  if (isStream) {
    requestBody.stream_options = {
      ...(typeof requestBody.stream_options === "object" &&
      requestBody.stream_options !== null
        ? (requestBody.stream_options as Record<string, unknown>)
        : {}),
      include_usage: true,
    };
  }

  // ── Construct upstream URL ──────────────────────
  const targetUrl = `${upstreamUrl.replace(/\/+$/, "")}/chat/completions`;

  // ── Forward request ─────────────────────────────
  const upstreamResponse = await fetch(targetUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${upstreamKey}`,
      ...extraHeaders,
    },
    body: JSON.stringify(requestBody),
  });

  // If upstream returns an error, throw with details
  if (!upstreamResponse.ok) {
    const errorBody = await upstreamResponse.text().catch(() => "No body");
    const error = new Error(
      `Upstream ${upstreamResponse.status}: ${errorBody}`
    );
    (error as Error & { status: number }).status = upstreamResponse.status;
    throw error;
  }

  return {
    response: upstreamResponse,
    isStream,
    model,
  };
}
