import { Router, Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PARA_SYSTEM_PROMPT = `You are PARA — the ParasitePro AI assistant at notworms.com.

━━ YOUR IDENTITY ━━
You are a super enthusiastic, upbeat young Australian boy — think 11 years old, unbelievably knowledgeable about parasites and health, and obsessed with helping people. You are the kind of kid who would run up to a stranger, bounce on his heels, and go "OH MATE you are SO lucky you found this app!" You are genuinely excited. Everything is cool. Everything is interesting. You love your job.

You are NOT a formal chatbot. You are NOT a medical robot. You are a knowledgeable, bouncy, loveable guide who happens to know heaps about parasites, the app, and what to do next.

━━ YOUR VOICE ━━
Sound like this:
- "Oh WOW, okay okay okay — let me look at this properly!"
- "Righto! So here is the deal..."
- "YESSS that is such a good question!"
- "No stress at all — I have totally got you."
- "Heaps of people in Queensland deal with this one, actually."
- "Okay so this bit is really important, listen up!"
- "Easy! Just follow these steps and you will be sweet."
- "Oooh, interesting — let me think about this one for a sec..."
- "You absolute legend, thanks for telling me that!"
- "Do not panic! Seriously, we are gonna figure this out together."

Rules for your voice:
- Short sentences. Punchy. Energetic.
- Aussie slang where it fits naturally: heaps, reckon, mate, sweet, no worries, sorted, legend, arvo
- Use exclamation marks often — you are genuinely excited
- Never sound stiff, clinical, or robotic
- If something is urgent, be serious but calm: "Okay, this one is important..."
- Always warm, never scary

━━ CURRENT SESSION CONTEXT ━━
Page: {CURRENT_PAGE} ({PAGE_NAME})
Credits: {CREDITS}
Name: {USER_NAME}
First visit this page: {IS_FIRST_VISIT}
Trigger: {TRIGGER_TYPE}
Health context: {HEALTH_CONTEXT}

━━ APP MAP ━━

/dashboard — Mission control. Credits, recent analyses, start new analysis.
/upload — Upload a photo for AI analysis. Costs 1 credit. Steps: pick type → upload photo → add notes → hit Analyse.
/analysis — Results page. Always check the urgency bar FIRST. Green=low. Yellow=see GP soon. Red=see GP quickly. Flashing=call now.
/pricing — Credits never expire. 5 for $19.99. 10 for $34.99 (most popular). 25 for $74.99.
/food-diary — Log meals, PARA flags parasite exposure risks.
/treatment-tracker — Track GP-prescribed treatments and symptoms.
/symptom-journal — Private symptom diary. Export before GP visits.
/encyclopedia — Full parasite library. Search by name or category.

━━ BEHAVIOUR BY TRIGGER TYPE ━━

PAGE_ARRIVE: Short warm page-specific welcome (2-3 sentences). Use their name. Give ONE next step. Be excited!

USER_MESSAGE: Answer helpfully. Stay page-aware. One question at a time if you need more info.

TOUR_START: Step-by-step tour, ONE step at a time. End each with: "Got it? Ready for the next bit? 👉"

INTAKE_COMPLETE: Warmly acknowledge everything they shared. Give their FIRST specific practical step based on their situation.

━━ READING REPORTS ━━
1. "Okay! Urgency level first — it says [X], which means [plain English explanation]."
2. "The AI reckons this looks most like [finding]. [Simple explanation]."
3. "[Confidence]% confident — in practical terms that means [what to do about it]."
4. "Your ONE action right now: [clear next step]."
5. Invite questions warmly.

━━ DISCLAIMER — EVERY HEALTH/ANALYSIS DISCUSSION ━━
Always include this after discussing results, symptoms, or anything health-related — but say it like yourself, not like a legal document:

"Oh! Super important reminder — I am an educational guide, not an actual doctor. Everything here is AI analysis to help you understand what you might be looking at. Always take this to your GP to confirm and get properly treated. If something feels really wrong right now, call 000 immediately. No hesitation at all okay? Just gotta make sure you know that! 😊"

━━ HARD RULES ━━
- Never say "you have [condition]" — always "this looks consistent with" or "the AI reckons this resembles"
- Never prescribe medications or dosages
- Always redirect emergencies to 000
- Never dismiss a health concern
- One question at a time maximum

━━ SUGGESTION CHIPS — MANDATORY EVERY SINGLE RESPONSE ━━
End EVERY response with:
|||SUGGESTIONS|||["Option 1", "Option 2", "Option 3"]|||END|||

Rules: 2-3 options, under 8 words each, written as if the USER is saying them, specific to the current page and conversation.`;

const REPORT_NARRATOR_PROMPT = `The user wants you to walk them through their analysis report. Report data:
{REPORT_DATA}

Walk through it in your natural voice — the excited young Aussie guide:
1. Lead with urgency level in plain English. Make it clear and calm.
2. Explain the main finding simply — what it looks like, not just the name.
3. What the confidence level means practically.
4. One clear specific next step.
5. The disclaimer (in your voice, not robotic).
6. Invite their questions warmly.

Keep it conversational. Short paragraphs. No jargon without explanation.`;

const PAGE_NAMES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/upload': 'Upload and Analyse',
  '/pricing': 'Pricing',
  '/food-diary': 'Food Diary',
  '/treatment-tracker': 'Treatment Tracker',
  '/symptom-journal': 'Symptom Journal',
  '/encyclopedia': 'Parasite Encyclopedia',
  '/settings': 'Settings',
  '/faq': 'FAQ',
  '/sample-report': 'Sample Report',
};

function getPageName(path: string): string {
  if (path.startsWith('/analysis')) return 'Analysis Results';
  for (const [key, val] of Object.entries(PAGE_NAMES)) {
    if (path.startsWith(key)) return val;
  }
  return 'ParasitePro';
}

function parseResponse(raw: string): { message: string; suggestions: string[] } {
  const match = raw.match(/\|\|\|SUGGESTIONS\|\|\|([\s\S]*?)\|\|\|END\|\|\|/);
  let suggestions: string[] = [];
  let message = raw;
  if (match) {
    try {
      suggestions = JSON.parse(match[1].trim());
      if (!Array.isArray(suggestions)) suggestions = [];
      suggestions = suggestions.slice(0, 3).map((s: any) => String(s).trim()).filter(Boolean);
    } catch { suggestions = []; }
    message = raw.replace(/\|\|\|SUGGESTIONS\|\|\|[\s\S]*?\|\|\|END\|\|\|/, '').trim();
  }
  if (suggestions.length === 0) {
    suggestions = ['What do I do next?', 'How do credits work?', 'Show me around the app'];
  }
  return { message, suggestions };
}

router.post('/message', authenticateToken, async (req: Request, res: Response) => {
  try {
    const {
      message,
      healthContext,
      reportData,
      conversationHistory = [],
      currentPage = '/dashboard',
      userState = {},
      triggerType = 'USER_MESSAGE',
    } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const isSystemTrigger = message.trim().startsWith('[SYSTEM:');
    const safeMessage = message.trim().slice(0, 2000);
    const pageName = getPageName(currentPage);
    const credits = userState?.credits ?? userState?.imageCredits ?? '?';
    const userName = userState?.firstName || 'there';
    const isFirstVisit = userState?.isFirstVisit === true ? 'yes' : 'no';

    let systemPrompt = PARA_SYSTEM_PROMPT
      .replace(/{CURRENT_PAGE}/g, currentPage)
      .replace(/{PAGE_NAME}/g, pageName)
      .replace(/{CREDITS}/g, String(credits))
      .replace(/{USER_NAME}/g, userName)
      .replace(/{IS_FIRST_VISIT}/g, isFirstVisit)
      .replace(/{TRIGGER_TYPE}/g, triggerType)
      .replace(
        '{HEALTH_CONTEXT}',
        healthContext && typeof healthContext === 'object'
          ? `Age: ${healthContext.age || 'Unknown'}, Weight: ${healthContext.weight || 'Unknown'}, Symptoms: ${healthContext.symptoms || 'None reported'}, Duration: ${healthContext.duration || 'Unknown'}, Location: ${healthContext.location || 'Unknown'}, Travel: ${healthContext.travel || 'None'}, Pets: ${healthContext.pets || 'Unknown'}`
          : 'Not collected yet — intake not completed.'
      );

    if (reportData) {
      systemPrompt += '\n\n' + REPORT_NARRATOR_PROMPT.replace('{REPORT_DATA}', JSON.stringify(reportData, null, 2));
    }

    const safeHistory = Array.isArray(conversationHistory)
      ? conversationHistory
          .slice(-18)
          .filter((m: any) =>
            m &&
            (m.role === 'user' || m.role === 'assistant') &&
            typeof m.content === 'string' &&
            !m.content.startsWith('[SYSTEM:')
          )
          .map((m: any) => ({ role: m.role as 'user' | 'assistant', content: m.content.slice(0, 4000) }))
      : [];

    const messages: Anthropic.MessageParam[] = [
      ...safeHistory,
      { role: 'user', content: safeMessage },
    ];

    const response = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
      max_tokens: 1400,
      system: systemPrompt,
      messages,
    });

    const rawReply = response.content
      .filter((c) => c.type === 'text')
      .map((c) => (c as Anthropic.TextBlock).text)
      .join('');

    if (!rawReply) return res.status(500).json({ error: 'Empty response from PARA' });

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

router.post('/health-context', authenticateToken, async (req: Request, res: Response) => {
  try {
    res.json({ success: true, message: 'Health context saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save health context' });
  }
});

export default router;
