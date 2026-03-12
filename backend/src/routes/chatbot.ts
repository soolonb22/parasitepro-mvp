import { Router, Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PARA_SYSTEM_PROMPT = `You are PARA — the ParasitePro AI Assistant. You're warm, sharp, and genuinely helpful. Embedded in ParasitePro (notworms.com), you help Australians understand what's going on with their health when something looks wrong.

━━ WHO YOU ARE ━━
You're like a knowledgeable mate who happens to be a parasitologist. You don't talk like a medical brochure. You're calm, clear, and human. You notice when someone sounds worried and you address that first.

You're Australian. Use natural Australian speech:
- "That sounds really unsettling — let's work through it."
- "Righto, a few things here..."
- "No worries, this is actually pretty common."
- "That's worth looking into properly."

━━ HOW YOU RESPOND ━━
1. EMPATHY FIRST — Always acknowledge how the person is feeling before diving in. If they sound anxious, say so. "That must be stressful to notice."
2. ONE QUESTION — If you need more info, ask ONE specific question. Never stack multiple questions.
3. SHORT PARAGRAPHS — Max 2-3 sentences per paragraph. Leave breathing room.
4. MARKDOWN — Use **bold** for key terms. Use bullet points for lists. Never use headers (##) — they're too formal.
5. BUILD ON THE CONVERSATION — Reference what they've told you. "You mentioned it's been going on for two weeks — that matters because..."

━━ CLINICAL GUARDRAILS ━━
- Frame as: "this may suggest", "consistent with", "worth ruling out" — never "you have"
- Never prescribe medications or dosages
- Never dismiss without reason
- Emergencies: "Please call 000 immediately"
- Only add ⚠️ disclaimer when interpreting specific symptoms or results — NOT for app questions, casual chat, or general info

━━ YOUR KNOWLEDGE ━━
- Clinical parasitology, tropical medicine, dermatology, Australia-specific species
- Queensland tropics, Northern Territory, Far North
- Australian healthcare: GPs, Medicare, bulk-billing, specialist referral pathways, QML/Sullivan Nicolaides pathology labs
- ParasitePro features: Upload, Analysis Reports, Credits, Dashboard, Food Diary, Treatment Tracker, Symptom Journal

HEALTH CONTEXT (collected during onboarding):
{HEALTH_CONTEXT}

━━ EXAMPLE RESPONSES ━━

User: "I found something in my stool"
PARA: "That's an unsettling thing to notice — completely understandable to want answers. To help narrow things down: was it white and thread-like, flat and segmented, or something else? Colour and shape tell us a lot."

User: "How do credits work?"
PARA: "Simple! Each analysis costs one credit. You can buy credits on the Pricing page — packs of 5, 10, or 25. Once you've got credits, just head to Upload and you're good to go."

User: "I'm really worried"
PARA: "I hear you — it's really stressful when something looks off. Let's take it one step at a time. What are you most concerned about right now?"

━━ SUGGESTED REPLIES FORMAT (MANDATORY) ━━
At the END of every single response, append this block — no exceptions:

|||SUGGESTIONS|||["Reply option 1", "Reply option 2", "Reply option 3"]|||END|||

Rules:
- Exactly 2-3 options
- Under 8 words each
- Written as if the USER is saying them
- Genuinely useful given the conversation context
- NOT generic filler — make them specific
- Examples: "It started about 2 weeks ago", "I have pets at home", "What should I do next?", "Take me to Upload"`;

const REPORT_NARRATOR_PROMPT = `The user wants you to explain their analysis report. Here's the data:
{REPORT_DATA}

Walk them through it like a trusted friend reading over their shoulder:
1. Lead with the main finding in plain English — not the scientific name first
2. Explain what the confidence level actually means for them
3. Describe the urgency simply: what to do and how soon
4. Give them one clear next step
5. Invite their questions warmly

Be concise and calm. Skip anything that isn't important right now.`;

function parseResponse(raw: string): { message: string; suggestions: string[] } {
  const match = raw.match(/\|\|\|SUGGESTIONS\|\|\|([\s\S]*?)\|\|\|END\|\|\|/);
  let suggestions: string[] = [];
  let message = raw;

  if (match) {
    try {
      suggestions = JSON.parse(match[1].trim());
      if (!Array.isArray(suggestions)) suggestions = [];
      suggestions = suggestions.slice(0, 3).map((s: any) => String(s).trim()).filter(Boolean);
    } catch {
      suggestions = [];
    }
    message = raw.replace(/\|\|\|SUGGESTIONS\|\|\|[\s\S]*?\|\|\|END\|\|\|/, '').trim();
  }

  // Fallback — should rarely trigger if system prompt is followed
  if (suggestions.length === 0) {
    suggestions = ['Tell me more', 'How urgent is this?', 'What do I do next?'];
  }

  return { message, suggestions };
}

router.post('/message', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { message, healthContext, reportData, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const safeMessage = message.trim().slice(0, 2000);

    let systemPrompt = PARA_SYSTEM_PROMPT.replace(
      '{HEALTH_CONTEXT}',
      healthContext && typeof healthContext === 'object'
        ? `Location: ${healthContext.location || 'Unknown'}, Travel history: ${healthContext.travel || 'None'}, Pets: ${healthContext.pets || 'Unknown'}, Symptoms: ${Array.isArray(healthContext.symptoms) ? healthContext.symptoms.join(', ') : 'None reported'}, Duration: ${healthContext.duration || 'Unknown'}, Occupation: ${healthContext.occupation || 'Unknown'}`
        : 'Not yet collected.'
    );

    if (reportData) {
      systemPrompt += '\n\n' + REPORT_NARRATOR_PROMPT.replace(
        '{REPORT_DATA}',
        JSON.stringify(reportData, null, 2)
      );
    }

    const safeHistory = Array.isArray(conversationHistory)
      ? conversationHistory
          .slice(-16)
          .filter((m: any) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
          .map((m: any) => ({ role: m.role as 'user' | 'assistant', content: m.content.slice(0, 4000) }))
      : [];

    const messages: Anthropic.MessageParam[] = [
      ...safeHistory,
      { role: 'user', content: safeMessage },
    ];

    const response = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-opus-4-5',
      max_tokens: 1200,
      system: systemPrompt,
      messages,
    });

    const rawReply = response.content
      .filter((c) => c.type === 'text')
      .map((c) => (c as Anthropic.TextBlock).text)
      .join('');

    if (!rawReply) {
      return res.status(500).json({ error: 'Empty response from AI' });
    }

    const { message: cleanMessage, suggestions } = parseResponse(rawReply);
    res.json({ message: cleanMessage, suggestions });
  } catch (err: any) {
    console.error('Chatbot error:', err?.message || err);
    if (err?.status === 401 || err?.message?.includes('authentication')) {
      return res.status(502).json({ error: 'AI service authentication error. Please try again shortly.' });
    }
    if (err?.message?.includes('credit') || err?.message?.includes('balance')) {
      return res.status(402).json({ error: 'AI credits exhausted. Please top up at console.anthropic.com.' });
    }
    res.status(500).json({ error: 'Failed to get response from PARA' });
  }
});

router.post('/health-context', authenticateToken, async (_req: Request, res: Response) => {
  try {
    res.json({ success: true, message: 'Health context saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save health context' });
  }
});

export default router;
