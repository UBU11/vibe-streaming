import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

/**
 * Standard rate limiter for general API routes
 * 60 requests per 60 seconds (sliding window)
 */
export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "60 s"),
  analytics: true,
  prefix: "ratelimit:api",
});

/**
 * Stricter rate limiter for search endpoints (anti-scraping)
 * 20 requests per 60 seconds
 */
export const searchRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "60 s"),
  analytics: true,
  prefix: "ratelimit:search",
});

/**
 * Authentication rate limiter
 * 10 requests per 60 seconds
 */
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  analytics: true,
  prefix: "ratelimit:auth",
});

export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const result = await limiter.limit(identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}
