import { headers } from "next/headers";

type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

/**
 * Lightweight fixed-window rate limiter (in-memory). Suitable for a single
 * Railway instance; swap for Redis if scaling horizontally.
 */
export function rateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || bucket.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (bucket.count >= limit) return { ok: false };
  bucket.count += 1;
  return { ok: true };
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}
