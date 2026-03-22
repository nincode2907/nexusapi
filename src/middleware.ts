import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

export function middleware(request: NextRequest) {
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

  return response;
}

// Only apply CORS middleware to /api/v1/* routes
export const config = {
  matcher: "/api/v1/:path*",
};
