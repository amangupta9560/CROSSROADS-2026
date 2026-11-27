/**
 * Zero-dependency sliding-window in-memory rate limiter for Express 5.
 * Generously dimensioned to support shared campus NAT IPs (50+ concurrent students)
 * while shielding Node event loops & MongoDB against runaway bursts.
 */
function createRateLimiter({
  windowMs = 60 * 1000,
  max = 180,
  message = 'Too many requests right now. Please wait a few seconds and try again.'
} = {}) {
  const hits = new Map();

  // Periodic sweep prevents unbounded Map growth over long server uptimes
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits.entries()) {
      if (now >= entry.resetAt) {
        hits.delete(key);
      }
    }
  }, Math.max(windowMs, 60000));

  if (typeof cleanupTimer.unref === 'function') {
    cleanupTimer.unref();
  }

  return function rateLimitMiddleware(req, res, next) {
    const ip =
      req.ip ||
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      'unknown';

    const now = Date.now();
    let entry = hits.get(ip);

    if (!entry || now >= entry.resetAt) {
      entry = { count: 1, resetAt: now + windowMs };
      hits.set(ip, entry);
      return next();
    }

    entry.count += 1;

    if (entry.count > max) {
      const retryAfterSec = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
      res.setHeader('Retry-After', String(retryAfterSec));
      return res.status(429).json({ message });
    }

    return next();
  };
}

module.exports = { createRateLimiter };
