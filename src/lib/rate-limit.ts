const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// Prevent unbounded memory growth in long-lived serverless instances.
// Evict all expired entries once the map exceeds this threshold.
const MAX_ENTRIES = 5_000;

export function checkRateLimit(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();

  // Periodic eviction: purge expired keys when the map grows too large.
  if (rateLimitMap.size > MAX_ENTRIES) {
    for (const [k, v] of rateLimitMap) {
      if (now > v.resetAt) rateLimitMap.delete(k);
    }
  }

  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}
