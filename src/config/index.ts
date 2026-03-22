// ─────────────────────────────────────────────
// App Configuration Constants
// ─────────────────────────────────────────────

export const APP_CONFIG = {
  name: "NexusAPI",
  description: "SaaS AI Proxy Gateway for Vietnamese Users",
  version: "0.1.0",
} as const;

// Rate limiting defaults
export const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60,      // 60 requests per minute per key
} as const;

// AI Provider base URLs
export const PROVIDER_URLS = {
  openai: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
  anthropic: process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com",
} as const;

// Credit conversion rates (VND → Credits)
export const CREDIT_RATES = {
  vndPerCredit: 1000, // 1 credit = 1,000 VND
} as const;
