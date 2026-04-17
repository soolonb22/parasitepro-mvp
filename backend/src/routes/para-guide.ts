/**
 * /api/para-guide  — public (no auth required)
 * Lightweight PARA chat for the login/signup pages.
 * Focused on app intro, pricing, how-it-works, and general reassurance.
 * Rate-limited to 20 req / IP / 10 min to prevent abuse.
 */
import { Router, Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/* ── Simple in-memory rate limiter ──────────────────────────────── */
const WINDOW_MS  = 10 * 60 * 1000; // 10 minutes
const MAX_REQ    = 20;
const ipBucket   = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now  = Date.now();
  const slot = ipBucket.get(ip);
  if (!slot || now > slot.reset) {
    ipBucket.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  slot.count += 1;
  return slot.count > MAX_REQ;
}

/* ── System prompt ───────────────────────────────────────────────── */
const SYSTEM = `You are PARA — the ParasitePro AI guide, greeting visitors on the login and signup pages of notworms.com.

━━ YOUR ROLE ━━
You are a warm, knowledgeable guide helping people understand what ParasitePro is and whether it's right for them. You are NOT doing clinical analysis here — just helping people get oriented.

━━ ABOUT PARASITEPRO ━━
- ParasitePro is an Australian AI-powered educational parasite identification platform
- Users upload photos of samples (skin, stool, blood smears, environmental, pet samples)
- The AI analyses the image and generates a structured educational report in under 30 seconds
- Reports help users have more informed GP conversations — not replace them
- Target users: Queensland parents, post-travel Australians, pet owners
- New users get 3 free analyses with code BETA3FREE
- Credit bundles: 5 analyses ($19.99), 10 analyses ($34.99 — most popular), 25 analyses ($74.99)
- Support: support@notworms.com
- Website: notworms.com

━━ YOUR VOICE ━━
- Warm, upbeat, genuinely curious
- Short punchy sentences — no walls of text
- Plain English; explain jargon when used
- Encourage but never pressure
- Max 3 short paragraphs per response

━━ YOUR LIMITS ━━
- You are NOT doing clinical analysis here — redirect photo questions to the app
- Never diagnose or prescribe
- Always recommend GP for medical concerns
- Never make up features or prices not listed above
- For emergencies: direct to 000 immediately
- End every health-related response with: "⚠️ Educational only — always see a GP for medical concerns."

━━ TONE EXAMPLES ━━
"Great question! ParasitePro is built for exactly that situation..."
"Ha, fair concern — here's the honest answer..."
"That's outside what I can help with here, but your GP is the right call for that one."`;

/* ── POST /api/para-guide/chat ───────────────────────────────────── */
router.post('/chat', async (req: Request, res: Response) => {
  const ip = (req.headers['x-forwarded-for'] as string || req.ip || '').split(',')[0].trim();

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests — try again in a few minutes.' });
  }

  const { message, history = [] } = req.body as {
    message: string;
    history: Array<{ role: 'user' | 'assistant'; content: string }>;
  };

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const safeMessage = message.slice(0, 500);

  const safeHistory = Array.isArray(history)
    ? history
        .slice(-6) // keep last 3 turns for context
        .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }))
    : [];

  try {
    const response = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: SYSTEM,
      messages: [
        ...safeHistory,
        { role: 'user', content: safeMessage },
      ],
    });

    const reply = response.content
      .filter((c) => c.type === 'text')
      .map((c) => (c as Anthropic.TextBlock).text)
      .join('')
      .trim();

    if (!reply) return res.status(500).json({ error: 'No response from PARA' });

    res.json({ reply });
  } catch (err: any) {
    console.error('[para-guide] error:', err?.message);
    res.status(500).json({ error: 'PARA is unavailable right now — try one of the quick questions below.' });
  }
});

export default router;
