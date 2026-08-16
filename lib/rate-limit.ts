type Bucket = { count: number; resetAt: number };

type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim().slice(0, 100);
  return request.headers.get('x-real-ip')?.trim().slice(0, 100) || 'unknown';
}

export function checkRateLimit(key: string, options: RateLimitOptions): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) {
      const oldest = buckets.keys().next().value;
      if (oldest) buckets.delete(oldest);
    }
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= options.limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
