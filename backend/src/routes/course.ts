import { Router, Request, Response } from 'express';

const router = Router();

// ── Simple in-memory rate limiter ─────────────────────────────────────────
// Caps brute-force attempts at 20 per IP per 5 min window. Resets on redeploy.
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 5 * 60 * 1000;
const MAX_PER_WINDOW = 20;

function rateLimitOk(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  entry.count += 1;
  return entry.count <= MAX_PER_WINDOW;
}

// Timing-safe string comparison to avoid timing-attack code leakage
function safeEqual(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

// ── POST /api/course/validate-access ──────────────────────────────────────
// Body: { code: string }
// Returns: { valid: boolean }
router.post('/validate-access', (req: Request, res: Response) => {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';

  if (!rateLimitOk(ip)) {
    res.status(429).json({ valid: false, error: 'Too many attempts. Wait a few minutes and try again.' });
    return;
  }

  const expected = process.env.COURSE_ACCESS_CODE;
  if (!expected) {
    console.error('❌ COURSE_ACCESS_CODE env var not set');
    res.status(500).json({ valid: false, error: 'Server not configured' });
    return;
  }

  const submitted = String(req.body?.code || '').trim().toUpperCase();
  const valid = safeEqual(submitted, expected.trim().toUpperCase());

  if (valid) {
    console.log(`✅ Course access granted (ip=${ip})`);
  } else {
    console.warn(`❌ Course access denied (ip=${ip}, submitted_len=${submitted.length})`);
  }

  res.json({ valid });
});

export default router;
