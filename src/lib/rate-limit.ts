/**
 * Serverless-compatible distributed rate limiter using Upstash Redis REST API.
 *
 * Fail-safe policy:
 * - In production (NODE_ENV === "production"), missing or unreachable Upstash
 *   credentials fail closed (HTTP 503) so the endpoint never silently runs
 *   without distributed rate limiting.
 * - In non-production (local development), unconfigured Upstash credentials
 *   explicitly bypass rate limiting for local testing.
 */

export interface RateLimitResult {
  allowed: boolean;
  unavailable?: boolean;
  mode: "upstash" | "dev_disabled";
  remaining?: number;
}

const WINDOW_SECONDS = 600; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;
const UPSTASH_TIMEOUT_MS = 4000;

export async function checkRateLimit(
  identifier: string
): Promise<RateLimitResult> {
  const isProduction = process.env.NODE_ENV === "production";
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!redisUrl || !redisToken) {
    if (isProduction) {
      return {
        allowed: false,
        unavailable: true,
        mode: "upstash",
      };
    }

    return {
      allowed: true,
      mode: "dev_disabled",
    };
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(redisUrl);
    const isLoopback =
      parsedUrl.hostname === "127.0.0.1" || parsedUrl.hostname === "localhost";
    if (
      parsedUrl.protocol !== "https:" &&
      (parsedUrl.protocol !== "http:" || (isProduction && !isLoopback))
    ) {
      return { allowed: false, unavailable: true, mode: "upstash" };
    }
  } catch {
    return { allowed: false, unavailable: true, mode: "upstash" };
  }

  const normalizedKey = `portfolio:contact:rl:${identifier.slice(0, 120)}`;
  const endpoint = `${parsedUrl.origin}/pipeline`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redisToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", normalizedKey],
        ["EXPIRE", normalizedKey, WINDOW_SECONDS, "NX"],
      ]),
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTASH_TIMEOUT_MS),
    });

    if (!response.ok) {
      return { allowed: false, unavailable: true, mode: "upstash" };
    }

    const results = (await response.json()) as Array<{ result?: unknown }>;
    const count = Number(results?.[0]?.result);

    if (!Number.isFinite(count) || count < 1) {
      return { allowed: false, unavailable: true, mode: "upstash" };
    }

    return {
      allowed: count <= MAX_REQUESTS_PER_WINDOW,
      mode: "upstash",
      remaining: Math.max(0, MAX_REQUESTS_PER_WINDOW - count),
    };
  } catch {
    // Fail closed when distributed rate-limit store is unreachable or times out
    return { allowed: false, unavailable: true, mode: "upstash" };
  }
}
