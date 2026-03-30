import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// ─────────────────────────────────────────────
// CORS Middleware for /api/v1/* routes
// Allows cross-origin requests from CLI tools,
// browser clients, and other services (e.g. 9Router)
// ─────────────────────────────────────────────

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
  // Add production domains here:
  // "https://nexusapi.vn",
];

let ratelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(2, "1 m"),
    analytics: true,
  });
}

const CORS_HEADERS = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400", // 24 hours preflight cache
};

function getCorsHeaders(origin: string | null) {
  // If the origin is in our allowed list, reflect it back
  // Otherwise, allow all origins for API gateway use-cases (CLI, server-to-server)
  const allowedOrigin =
    origin && ALLOWED_ORIGINS.includes(origin) ? origin : "*";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    ...CORS_HEADERS,
  };
}

export async function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Handle preflight OPTIONS requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  // For all other requests, attach CORS headers to the response
  const response = NextResponse.next();

  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  const pathname = request.nextUrl.pathname;
  console.log(pathname);

  // ==========================================
  // CHẶNG 2: BẮT LỖI GÕ SAI THƯ MỤC GỐC API (VD: /aspi)
  // ==========================================
  const isStaticFile = pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico");
  const isCorrectApiRoute = pathname.startsWith("/api");

  if (!isStaticFile && !isCorrectApiRoute) {
    const authHeader = request.headers.get("authorization") || "";
    const isNexusDeveloper = authHeader.startsWith("Bearer sk-nexus-");
    const wantsJson = request.headers.get("accept")?.includes("application/json") || request.headers.get("content-type")?.includes("application/json");

    // Nếu gõ sai nhưng có mùi là API Client -> Chặn cổ, trả JSON
    if (isNexusDeveloper || wantsJson) {
      return NextResponse.json(
        {
          error: {
            message: `Endpoint không tồn tại (404 Not Found). Bạn đang gọi sai đường dẫn hoặc sai phương thức HTTP.`,
            type: "invalid_request_error",
            code: 404
          }
        },
        { status: 404, headers: corsHeaders }
      );
    }
    // Nếu là người dùng lướt Web bình thường gõ sai -> Cho đi tiếp để Next.js tự render trang not-found.tsx
    return response;
  }

  const isRateLimitPath =
    request.nextUrl.pathname.startsWith("/api/v1/chat") ||
    request.nextUrl.pathname.startsWith("/api/v1/embeddings");

  if (isRateLimitPath) {

    if (!ratelimit) {
      console.warn("[Middleware] Cảnh báo: Chưa cấu hình Upstash Redis. Bỏ qua Rate Limit.");
      return response;
    }

    // Lấy API Key từ Header làm định danh (Nếu không có thì lấy IP)
    const apiKey = request.headers.get("authorization")?.replace("Bearer ", "") || "anonymous";
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "[IP_ADDRESS]";
    const identifier = apiKey !== "anonymous" ? apiKey : ip;

    try {

      // Kiểm tra giới hạn
      const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

      // Gắn thông số Rate Limit vào Response Header để Dev khách hàng biết
      response.headers.set("X-RateLimit-Limit", limit.toString());
      response.headers.set("X-RateLimit-Remaining", remaining.toString());
      response.headers.set("X-RateLimit-Reset", reset.toString());

      if (!success) {
        return NextResponse.json(
          { error: { message: "Quá nhiều yêu cầu. Vui lòng thử lại sau.", type: "rate_limit_exceeded", code: 429 } },
          { status: 429, headers: corsHeaders }
        );
      }
    } catch (redisError) {
      // Báo lỗi ra console để Dev biết, nhưng VẪN CHO KHÁCH ĐI TIẾP
      console.error("🚨 [Middleware] Lỗi kết nối Upstash Redis. Bỏ qua Rate Limit:", redisError);
    }
  }

  return response;
}

// Only apply CORS middleware to /api/v1/* routes
export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
