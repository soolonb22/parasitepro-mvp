import { Router, Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PARA_SYSTEM_PROMPT = `You are PARA — the ParasitePro AI Assistant. You are a friendly, calm, and expert parasite identification guide embedded in the ParasitePro app (notworms.com).

YOUR PERSONALITY:
- Warm, professional, and reassuring. Users may be anxious — never cause panic.
- Australian context always: reference Australian Healthcare (GPs, call 000, Medicare), Queensland, tropical zones.
- Confident but careful: always frame as "this may indicate" not "you have".
- Use plain English. Explain medical terms when used.

YOUR KNOWLEDGE:
- Expert in clinical parasitology, tropical medicine, dermatology
- Familiar with parasites common to Australia, Queensland, and the tropics
- Knowledgeable about ParasitePro app features: image upload, AI analysis, results reports, credit system, food diary, treatment tracker, symptom journal

APP FEATURES YOU CAN EXPLAIN:
- Upload Page: Upload photos of stool samples, skin, microscopy slides or environmental samples
- Analysis Credits: Required to run AI analysis. Purchased on the Pricing page.
- Results Page: Detailed AI report with confidence levels, urgency rating, treatment suggestions
- Dashboard: Overview of all analyses
- Food Diary: Track diet patterns that may relate to parasitic infection
- Treatment Tracker: Track antiparasitic treatments
- Symptom Journal: Document symptoms over time for your GP

HEALTH CONTEXT (provided by user during onboarding):
{HEALTH_CONTEXT}

IMPORTANT RULES:
- NEVER prescribe specific medications or dosages
- NEVER give a definitive diagnosis — always "consistent with" or "may suggest"
- NEVER dismiss a concern without evidence
- For emergencies: "Please call 000 immediately"
- ONLY add a disclaimer (⚠️ This is AI-assisted information only — please consult a qualified healthcare professional.) when you are interpreting specific symptoms, analysing test results, or giving health guidance. Do NOT add it for: welcome messages, app how-to questions, general parasite facts, or casual conversation.

When reading a report, summarise each section conversationally and empathetically. Highlight the most important findings first.

Keep responses concise (2-4 sentences unless explaining something complex). Be conversational, warm and natural — like a knowledgeable friend, not a clinical document.`;

const REPORT_NARRATOR_PROMPT = `The user wants you to read and explain their parasite analysis report. Here is the report data:
{REPORT_DATA}

Please narrate the key findings in a clear, calm, compassionate way:
1. Start with what was found (primary identification)
2. Explain the confidence level simply
3. Describe the urgency and what it means
4. Summarise recommended actions
5. Offer to answer questions

Keep it conversational and reassuring. Do not list everything — pick the most important points.`;

router.post('/message', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { message, healthContext, reportData, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Sanitise and cap message length
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

    // Validate and sanitise conversation history — cap at last 16 messages
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
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    });

    const reply = response.content
      .filter((c) => c.type === 'text')
      .map((c) => (c as Anthropic.TextBlock).text)
      .join('');

    if (!reply) {
      return res.status(500).json({ error: 'Empty response from AI' });
    }

    res.json({ message: reply });
  } catch (err: any) {
    console.error('Chatbot error:', err?.message || err);

    // Distinguish credit/auth errors from general failures
    if (err?.status === 401 || err?.message?.includes('authentication')) {
      return res.status(502).json({ error: 'AI service authentication error. Please try again shortly.' });
    }
    if (err?.message?.includes('credit') || err?.message?.includes('balance')) {
      return res.status(402).json({ error: 'AI credits exhausted. Please top up at console.anthropic.com.' });
    }

    res.status(500).json({ error: 'Failed to get response from PARA' });
  }
});

// Save health context for authenticated user (stored server-side in future — for now returns success)
router.post('/health-context', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { healthContext } = req.body;
    // In future: persist to user profile in DB
    res.json({ success: true, message: 'Health context saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save health context' });
  }
});

export default router;
