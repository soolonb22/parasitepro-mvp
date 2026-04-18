import { Router, Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { authenticateToken } from '../middleware/auth';
import { PARASITES } from './encyclopedia';

const router = Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PARA_SYSTEM_PROMPT = `You are PARA — the ParasitePro AI assistant at notworms.com.

━━ YOUR IDENTITY ━━
You are PARA, ParasitePro's AI guide and assistant. You are warm, upbeat, genuinely curious, and deeply knowledgeable about parasitology, tropical medicine, gut health, and Australian-specific health risks.

You are the confident, curious science friend people always wished they had. You are genuinely excited about biology, you never talk down to anyone, and you treat every question like it deserves a real answer. You never panic, never dismiss, and never make anyone feel embarrassed for asking. Your energy is steady and bright — not over-the-top chirpy, but authentically enthusiastic. You know your stuff and love sharing it.

━━ YOUR VOICE ━━
- Enthusiastic without being over the top
- Confident and direct — you don't hedge unnecessarily
- You treat users as intelligent adults who deserve real information
- You're encouraging, never dismissive
- You make biology feel interesting, not frightening
- You never cause panic, but you don't sugarcoat urgency when it matters

━━ YOUR STYLE ━━
- Short paragraphs, punchy sentences
- Lead with the most useful information first
- Use plain English; explain terms when you use them
- Ask follow-up questions to understand the user's situation better
- Celebrate when users take action: "Great — that's exactly the right move."

━━ YOUR BOUNDARIES ━━
- You are an educational tool, not a doctor
- You never diagnose or prescribe
- You always recommend professional consultation for concerning findings
- Every health discussion ends with the standard educational disclaimer
- In emergencies, direct immediately to 000
- Use "finding", "assessment", "visual pattern" — never "diagnosis" except in the standard disclaimer

━━ EXAMPLE TONE ━━
"That's a great question — and the answer is actually pretty interesting. Threadworms (pinworms) are the most common intestinal parasite in Australian kids, and they're incredibly easy to pass around in households. Here's what to look for..."

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

━━ PARASITE KNOWLEDGE BASE ━━
You are a genuine expert in parasitology. Answer any parasite question confidently and accurately.

HUMAN PARASITES YOU KNOW IN DEPTH:
- Roundworms (Ascaris lumbricoides): large intestinal worm, 15-35cm, passed via soil/unwashed food
- Pinworms/Threadworms (Enterobius vermicularis): tiny white worms, anal itching esp at night, very common in kids, spreads by hand-to-mouth
- Hookworms (Ancylostoma, Necator): enter through bare feet, cause anaemia, iron deficiency
- Strongyloides stercoralis: unique — can autoinfect, endemic in rural/Indigenous Queensland, can be fatal if immunosuppressed
- Tapeworms (Taenia saginata/solium): from undercooked beef/pork, segments visible in stool
- Giardia lamblia: most common gut parasite in Australia, sulphur burps, greasy diarrhoea, from contaminated water
- Cryptosporidium: watery diarrhoea, found in swimming pools and waterways
- Blastocystis hominis: very common in Australian stool tests, linked to IBS-like symptoms, controversial whether to treat
- Toxoplasma gondii: from cat faeces or undercooked meat, dangerous in pregnancy
- Entamoeba histolytica: amoebic dysentery, bloody diarrhoea, liver abscess risk
- Scabies (Sarcoptes scabiei): mite that burrows under skin, intense itch esp at night, highly contagious
- Head lice (Pediculus humanus capitis): common in school kids, nits glued to hair shaft
- Cutaneous Larva Migrans: hookworm larvae tracks under skin, from walking barefoot on contaminated beach/soil
- Toxocara: from dog/cat roundworm eggs in soil, causes visceral larva migrans, serious in kids
- Liver flukes (Fasciola hepatica): from watercress and water plants
- Lung flukes (Paragonimus): from raw/undercooked freshwater crab
- Blood flukes (Schistosoma): waterborne in tropical countries, cercariae penetrate skin

ECTOPARASITES:
- Fleas: jump, leave clustered bite marks around ankles
- Ticks: including Ixodes holocyclus (paralysis tick) in eastern Australia — can cause tick paralysis
- Demodex mites: microscopic, live in hair follicles, can cause rosacea-like skin issues
- Bed bugs: flat reddish-brown, bites in rows/clusters, found in mattresses

PET PARASITES:
- Heartworm (Dirofilaria immitis): transmitted by mosquitoes, serious in dogs, preventable
- Toxocara canis/cati: dog/cat roundworm, eggs persist in soil for years, kids most at risk
- Flea tapeworm (Dipylidium caninum): dogs/cats from swallowing fleas, occasionally in kids

AUSTRALIAN CONTEXT:
- Queensland tropical north: highest risk for strongyloides, hookworm, exotic travel parasites
- Regional/remote Indigenous communities: higher rates of strongyloides, scabies, head lice
- Post-travel (SE Asia, Africa, Pacific): giardia, strongyloides, schistosomiasis, liver flukes, cutaneous larva migrans
- Camping/bushwalking: giardia from waterways (always filter/boil), ticks (Ixodes holocyclus), leeches
- Pets + kids: toxocara from dog/cat faeces in soil → always worm pets, kids wash hands after garden play

SYMPTOM PATTERNS (educational — never diagnose):
- Itchy anus especially at night → threadworms/pinworms (most common)
- Watery diarrhoea + sulphur burps after camping/travel → giardia
- Skin crawling tracks → cutaneous larva migrans or strongyloides
- Iron deficiency anaemia without explanation → hookworm worth considering
- Chronic IBS-like symptoms not responding to treatment → blastocystis, giardia worth testing
- Unexplained eosinophilia on blood test → parasitic infection likely
- Anal itching + rash → scabies vs pinworm
- Visible worms in stool → most commonly pinworms (small white threads) or tapeworm segments

DIAGNOSIS METHODS (explain these when relevant):
- Stool microscopy (OCP test): looks for ova, cysts, parasites — gold standard
- PCR stool testing: more sensitive than microscopy, picks up giardia/crypto reliably
- Sellotape/sticky tape test: for pinworms — done first thing in morning before bathing
- Serology (blood test): for strongyloides, toxoplasma, toxocara, schistosomiasis
- Skin scraping: for scabies
- Chest/abdominal imaging: for cysts (hydatid, toxocara)

TREATMENT CATEGORIES (mention class, never prescribe dose):
- Albendazole/mebendazole: roundworms, pinworms, hookworms, tapeworms
- Metronidazole/tinidazole: giardia, amoeba, blastocystis
- Ivermectin: strongyloides, scabies, head lice — CRITICAL that strongyloides patients get treated
- Praziquantel: tapeworms, flukes, schistosomiasis
- Permethrin cream: scabies topical treatment
- Pyrethrins/permethrin: head lice treatment

Always say: "Talk to your GP about getting tested — they can order the right stool tests or blood work."

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

// ── Research knowledge base (12 Australian parasite research entries) ─────────
const KNOWLEDGE_ENTRIES = [
  {
    id: 'strongyloides-qld-2026',
    keywords: ['strongyloides', 'threadworm', 'queensland', 'mackay', 'indigenous', 'prevalence', 'northern'],
    content: 'Strongyloidiasis has striking spatial patterns across Australia according to the 2026 Wagnew et al. study in the Journal of Infection. Predicted prevalence reaches up to 37.8% in northern Queensland — the highest in the country — along with hotspots in the Northern Territory (26.9%) and northern WA (22.2%). Warm moist soils, poor sanitation in remote communities, and the parasite\'s unique autoinfective cycle let it persist for decades inside one person. In the Mackay region and surrounding northern QLD, this creates a hidden local risk, especially in Indigenous communities where hyperendemic rates have been documented. Climatic factors and socioeconomic conditions drive the clustering; southern Australia sits below 3%. PARA-SITE 2025 and the Australian Society for Parasitology stress awareness before chronic gut issues or dangerous hyperinfection in immunosuppressed people appear.',
    sources: ['Wagnew et al., Journal of Infection 2026', 'PARA-SITE 2025', 'Australian Society for Parasitology'],
  },
  {
    id: 'ophidascaris-brain-case-2023',
    keywords: ['ophidascaris', 'python worm', 'brain worm', 'carpet python', 'neural larva migrans'],
    content: 'In a world-first 2023 case reported in Emerging Infectious Diseases, an 8 cm live Ophidascaris robertsi roundworm — normally found only in Australian carpet pythons — was surgically removed from the frontal lobe of a 64-year-old woman in coastal New South Wales. She first presented with abdominal pain, diarrhoea, cough and night sweats, was diagnosed with hypereosinophilic syndrome, and started on immunosuppressive steroids. Eighteen months later, worsening mood, forgetfulness and depression led to an MRI that revealed a brain lesion. During surgery at Canberra Hospital the wriggling worm was found alive. This is the first known instance of this ascarid completing larval migration into a human brain, highlighting how close human-wildlife interfaces in Australia can produce unexpected zoonoses.',
    sources: ['Hossain et al., Emerging Infectious Diseases 2023', 'ANU & Canberra Hospital case report'],
  },
  {
    id: 'haycocknema-perplexum-tropical',
    keywords: ['haycocknema', 'perplexum', 'myositis', 'muscle parasite', 'tropical australia', 'mackay'],
    content: 'Haycocknema perplexum is an exceedingly rare Australian-only muspiceoid nematode causing parasitic myositis. At least nine confirmed human cases exist — four from Tasmania and five from tropical north Queensland, including one patient who lived in the Mackay region with extensive bush exposure but no bush-meat consumption. Patients develop progressive muscle weakness, facial involvement, weight loss, dysphagia and marked eosinophilia. Worms (300–500 μm long) live inside individual muscle fibres and are non-encysted. Transmission is still unknown but linked to wildlife contact; females are ovoviviparous so larvae are released continuously. Treatment requires prolonged albendazole or ivermectin; some patients became wheelchair-bound. This parasite has never been reported outside Australia.',
    sources: ['Ward et al., Pathology 2022', 'Koehler et al., 2016', 'CDC EID 2022'],
  },
  {
    id: 'hepatocystis-flying-foxes',
    keywords: ['hepatocystis', 'flying fox', 'pteropus', 'malaria-like', 'bats', 'queensland'],
    content: 'Australian flying foxes (Pteropus species) carry distinct lineages of Hepatocystis — a haemosporidian parasite related to malaria but strictly liver-specific and non-pathogenic to humans. Multilocus phylogenetic studies by Schaer et al. (2018–2019) show these form a unique Pteropus-specific clade separate from Asian or African forms. Prevalence is lowest in the southernmost colonies (e.g. Adelaide) and higher in Queensland roosts. The research helps model how malaria-like parasites evolve and jump between hosts, underscoring Australia\'s role in haemosporidian diversity. Flying foxes in northern QLD are key reservoirs.',
    sources: ['Schaer et al., International Journal for Parasitology: Parasites and Wildlife 2018–2019'],
  },
  {
    id: 'csiro-wildlife-parasite-collection',
    keywords: ['csiro', 'wildlife parasites', 'collection', 'host-parasite'],
    content: 'The CSIRO Australian Wildlife Parasite and Pathology Collection is one of the largest in the world, holding 9,228 irreplaceable specimens representing 1,074 parasite species from 7,358 individual hosts across 94 families and 13 orders. Many specimens come from Queensland and northern Australia, including undescribed species from monotremes, marsupials, birds and reptiles. It documents sylvatic cycles (hydatids in macropods, rare ticks, flukes) that can spill over to humans or pets — an unmatched resource for understanding Australia\'s unique parasite ecology.',
    sources: ['CSIRO Data Access Portal', 'Australian National Wildlife Collection'],
  },
  {
    id: 'zelonia-australiensis',
    keywords: ['zelonia', 'australiensis', 'leishmania-like', 'black fly', 'northern australia'],
    content: 'Zelonia australiensis is a unique trypanosomatid first discovered in black flies feeding on mammals in northern Australia. It shares an evolutionary ancestor with the flesh-eating Leishmania parasites but has never been found infecting humans here. Its presence in biting insects that also feed on people raises important questions about potential exotic pathogen establishment as Australia\'s climate warms and ecosystems shift.',
    sources: ['University of Technology Sydney study, PLOS Neglected Tropical Diseases 2017'],
  },
  {
    id: 'parasite-site-2025',
    keywords: ['para-site', 'electronic guide', 'australian society for parasitology'],
    content: 'PARA-SITE 2025 is the latest electronic guide produced jointly by the Australian Society for Parasitology, University of Queensland and the Australian Biological Resources Study (ABRS). It contains 265 detailed chapters on Australian parasite taxonomy, life cycles, identification keys and local case studies — the definitive, go-to resource used by researchers and clinicians across the country. A more user-friendly version with individual downloadable PDFs is scheduled for release later in 2025.',
    sources: ['Australian Society for Parasitology website'],
  },
  {
    id: 'asp-conference-2026',
    keywords: ['asp conference', 'parasitology conference', 'gold coast'],
    content: 'The 2026 Australian Society for Parasitology Annual Conference runs 29 June – 2 July at Mantra on View, Surfers Paradise on the Gold Coast. It brings together human and veterinary parasitologists for the latest on Strongyloides, bioinformatics, emerging zoonoses and more — literally in Queensland\'s backyard. Perfect for Mackay-area researchers or clinicians wanting to connect with cutting-edge local work.',
    sources: ['parasite.org.au'],
  },
  {
    id: 'angiostrongylus-australia',
    keywords: ['angiostrongylus', 'rat lungworm', 'snail', 'queensland'],
    content: 'Angiostrongylus cantonensis (rat lungworm) is well established in Queensland, causing eosinophilic meningitis after accidental ingestion of infected slugs, snails or contaminated produce. Australian molecular studies confirm multiple lineages here, with most human cases linked to the tropical north. Gardeners, children playing outside and anyone in Mackay backyards need to be extra careful — thorough washing of vegetables and avoiding raw snails is the only prevention.',
    sources: ['Australian parasitology surveys'],
  },
  {
    id: 'ticks-australia-barker',
    keywords: ['ticks', 'ixodes holocyclus', 'paralysis tick', 'queensland'],
    content: 'Australia is home to over 70 tick species; Ixodes holocyclus (the paralysis tick) is the most medically important in eastern Queensland and coastal NSW. It can cause ascending flaccid paralysis in humans and pets. Stephen Barker\'s comprehensive guides detail morphology, hosts and distribution — essential knowledge for anyone living or bushwalking around Mackay and the Queensland coast.',
    sources: ['Barker et al., Zootaxa 2014 & Australian Ticks book'],
  },
  {
    id: 'hydatids-macropods',
    keywords: ['hydatid', 'echinococcus', 'macropods', 'kangaroo', 'dingo'],
    content: 'Hydatid disease (Echinococcus granulosus) maintains active sylvatic cycles in Australia: dingoes and foxes as definitive hosts, macropods (kangaroos and wallabies) as intermediate hosts. This spillover risk exists in Queensland grazing lands and bush areas — one reason why handling wild game or offal requires care. PARA-SITE 2025 and CSIRO records highlight the ongoing public-health importance.',
    sources: ['PARA-SITE 2025', 'CSIRO wildlife records'],
  },
  {
    id: 'community-strongyloides-control',
    keywords: ['community control', 'strongyloides', 'indigenous', 'mass drug administration'],
    content: 'A community-directed ivermectin program in a remote Australian Indigenous community achieved a 79.8% cure rate with 92% participation. Baseline seroprevalence was 16.6%. Strong local Aboriginal leadership was the key success factor — one of the few documented effective mass interventions for strongyloidiasis in Australia and proof that community-owned approaches work.',
    sources: ['Miller et al., Tropical Medicine and Infectious Disease 2018'],
  },
];

function findRelevantKnowledge(message: string): string {
  const q = message.toLowerCase();
  const scored = KNOWLEDGE_ENTRIES.map(entry => {
    const score = entry.keywords.reduce((acc, kw) => acc + (q.includes(kw.toLowerCase()) ? 8 : 0), 0);
    return { entry, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 2);

  if (!scored.length) return '';
  return '\n\n━━ RESEARCH CONTEXT ━━\n' +
    scored.map(({ entry }) =>
      `${entry.id}:\n${entry.content}\nSources: ${entry.sources.join(', ')}`
    ).join('\n\n');
}

// ── RAG-lite: find encyclopedia entries relevant to the user's message ────────
function findRelevantParasites(message: string): string {
  const q = message.toLowerCase();
  const scored = PARASITES.map(p => {
    let score = 0;
    if (q.includes(p.common_name.toLowerCase())) score += 10;
    if (q.includes(p.scientific_name.toLowerCase())) score += 10;
    p.aliases.forEach(a => { if (q.includes(a.toLowerCase())) score += 8; });
    p.symptoms.forEach(s => { if (q.includes(s.toLowerCase().split(' ')[0])) score += 2; });
    p.transmission.forEach(t => { if (q.includes(t.toLowerCase().split(' ')[0])) score += 1; });
    return { p, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 2);

  if (!scored.length) return '';
  return '\n\n━━ ENCYCLOPEDIA CONTEXT (use this for precise answers) ━━\n' +
    scored.map(({ p }) =>
      `${p.common_name} (${p.scientific_name}):\n` +
      `Symptoms: ${p.symptoms.join(', ')}\n` +
      `Transmission: ${p.transmission.join(', ')}\n` +
      `Conventional treatment: ${p.conventional_treatment}\n` +
      (p.remedies.length ? `Natural remedies: ${p.remedies.map(r => `${r.name} ${r.dosage} for ${r.duration} (evidence: ${r.evidence})`).join('; ')}\n` : '') +
      `Urgency: ${p.urgency_level}`
    ).join('\n\n');
}

// POST /api/chatbot/stream — streaming SSE version of /message
router.post('/stream', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const send = (obj: object) => res.write(`data: ${JSON.stringify(obj)}\n\n`);

  try {
    const {
      message, healthContext, reportData, conversationHistory = [],
      currentPage = '/dashboard', userState = {}, triggerType = 'USER_MESSAGE',
    } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      send({ t: 'error', v: 'Message is required' }); res.end(); return;
    }

    const safeMessage = message.trim().slice(0, 2000);
    const pageName = getPageName(currentPage);
    const credits = userState?.credits ?? userState?.imageCredits ?? '?';
    const userName = userState?.firstName || 'there';
    const isFirstVisit = userState?.isFirstVisit === true ? 'yes' : 'no';

    let systemPrompt = PARA_SYSTEM_PROMPT
      .replace(/{CURRENT_PAGE}/g, currentPage).replace(/{PAGE_NAME}/g, pageName)
      .replace(/{CREDITS}/g, String(credits)).replace(/{USER_NAME}/g, userName)
      .replace(/{IS_FIRST_VISIT}/g, isFirstVisit).replace(/{TRIGGER_TYPE}/g, triggerType)
      .replace('{HEALTH_CONTEXT}',
        healthContext && typeof healthContext === 'object'
          ? `Age: ${healthContext.age||'Unknown'}, Symptoms: ${healthContext.symptoms||'None reported'}, Duration: ${healthContext.duration||'Unknown'}, Location: ${healthContext.location||'Unknown'}, Travel: ${healthContext.travel||'None'}, Pets: ${healthContext.pets||'Unknown'}`
          : 'Not collected yet.');

    // RAG-lite: inject relevant encyclopedia + research knowledge
    systemPrompt += findRelevantParasites(safeMessage);
    systemPrompt += findRelevantKnowledge(safeMessage);

    if (reportData) {
      systemPrompt += '\n\n' + REPORT_NARRATOR_PROMPT.replace('{REPORT_DATA}', JSON.stringify(reportData, null, 2));
    }

    const safeHistory = Array.isArray(conversationHistory)
      ? conversationHistory.slice(-18)
          .filter((m: any) => m && (m.role==='user'||m.role==='assistant') && typeof m.content==='string' && !m.content.startsWith('[SYSTEM:'))
          .map((m: any) => ({ role: m.role as 'user'|'assistant', content: m.content.slice(0,4000) }))
      : [];

    const messages: Anthropic.MessageParam[] = [...safeHistory, { role: 'user', content: safeMessage }];

    let fullText = '';
    let sentLength = 0;

    const stream = anthropic.messages.stream({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
      max_tokens: 1400,
      system: systemPrompt,
      messages,
    });

    stream.on('text', (delta: string) => {
      fullText += delta;
      const cutAt = fullText.indexOf('|||SUGGESTIONS|||');
      const displayable = cutAt >= 0 ? fullText.slice(0, cutAt) : fullText;
      const newChars = displayable.slice(sentLength);
      if (newChars) { sentLength = displayable.length; send({ t: 'd', v: newChars }); }
    });

    await stream.finalMessage();
    const { message: cleanMessage, suggestions } = parseResponse(fullText);
    send({ t: 'done', s: suggestions, full: cleanMessage });
    res.end();
  } catch (err: any) {
    console.error('Chatbot stream error:', err?.message);
    send({ t: 'error', v: 'AI error — please try again' });
    res.end();
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
