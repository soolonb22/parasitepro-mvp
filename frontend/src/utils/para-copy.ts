// para-copy.ts — Single source of truth for all PARA script strings.
// To update PARA's voice, edit this file only. Do not hardcode copy elsewhere.

export const PARA = {

  // ── Upload Page ────────────────────────────────────────────────────────────
  upload: {
    intro:        "Got something that's got you puzzled? Good — that's exactly what I'm here for. Upload your photo and let's take a proper look together.",
    dropLabel:    "Drop your photo here, or click to browse",
    dropSub:      "JPG or PNG · up to 10MB · well-lit close-ups work best",
    enhancing:    "Enhancing your image — sharpening, adjusting contrast, normalising colour. Takes a second.",
    enhancingHead: "Enhancing your image…",
  },

  // ── Onboarding Form ────────────────────────────────────────────────────────
  form: {
    intro:     "Before I take a look, a few quick questions will help me give you a much sharper report. Takes less than a minute — and it genuinely makes a difference.",
    introAlt:  "Before I dig in, a few quick questions will help me give you a sharper report. The more context I have, the better I can do my job — and honestly, this part's pretty fascinating.",
    cta:       "Start deep analysis",
  },

  // ── Analysis Loading ───────────────────────────────────────────────────────
  analysing: {
    head:    "I'm on it!",
    steps: [
      "On it! Enhancing your image for the best possible read…",
      "Examining every pixel — looking for shapes, textures, patterns…",
      "Cross-referencing against known organisms and visual signatures…",
      "Checking geographic context and risk factors…",
      "Putting your report together — nearly there!",
    ],
    sub:     "This usually takes 20–30 seconds. Worth it, I promise.",
    loading: [
      "Uploading to PARA…",
      "I'm examining your image now…",
      "Cross-referencing patterns and organisms…",
      "Pulling your report together…",
    ],
  },

  // ── Results Page ───────────────────────────────────────────────────────────
  results: {
    intro:           "Alright — here's what I found. Your report is below, broken down clearly so you know exactly what I'm seeing and why. Let's go through it together.",
    highConfidence:  "Strong match! The visual patterns here are pretty clear — I'm feeling confident about this one. Here's what the evidence is telling me:",
    modConfidence:   "Reasonable match — the visual evidence points in this direction, though I'd encourage a follow-up with your GP to confirm.",
    lowConfidence:   "Hmm, this one's tricky — the image is making it hard to be certain. I've given you my best assessment below, but I'd really recommend getting a clearer photo if you can. Here's what I can work with:",
    matchLabel:      "Match strength",
    loadingText:     "Fetching your report…",
    notFound:        "Report not found.",
  },

  // ── Urgency Labels ─────────────────────────────────────────────────────────
  urgency: {
    low:       { label: "Low risk",   sublabel: "Monitor at home. No immediate action needed, but keep an eye on it." },
    moderate:  { label: "Moderate",   sublabel: "Worth seeing your GP within the next 1–2 weeks. I've prepared a summary to take with you." },
    high:      { label: "See your GP", sublabel: "Heads up — based on what I'm seeing, I'd encourage you not to wait on this one. Please see a GP or medical professional as soon as you can. I've prepared a summary you can take with you right now." },
    emergency: { label: "Seek care now", sublabel: "Please seek medical care immediately — call 000 or go to your nearest emergency department. Do not wait." },
  },

  // ── GP Report ──────────────────────────────────────────────────────────────
  gp: {
    panelHead:  "Your GP report is ready",
    panelSub:   "This document summarises everything I found in a format your doctor can actually use. Bring it to your next appointment — it gives them a head start.",
    copyToast:  "Report link copied! Share it with your GP or save it for your appointment.",
    subHeader:  "Your GP report — bring this to your next appointment",
    footer:     "PARA has put this together to help you start the conversation with your GP — not to replace their judgement.",
    mhrStep1:   "Save your PDF report",
    mhrStep1Desc: "Hit \"Download PDF for GP\" below — your report will save to your device, ready to show your doctor.",
  },

  // ── Journal Prompt ─────────────────────────────────────────────────────────
  journal: {
    modalHead:  "Want to keep an eye on things?",
    intro:      "Want to track how you're feeling over the next few days? Your symptom journal is a great way to spot patterns — and it gives your GP more to work with. Takes 30 seconds.",
    bullet1:    "Log how you're feeling daily — spot patterns your GP will find useful",
    bullet2:    "Add notes, upload follow-up images, and watch your progress over time",
    bullet3:    "Export a clean report before your next GP visit — they'll thank you for it",
    footer:     "Completely free · Your data stays private · Stop anytime",
    ctaYes:     "Yes — let's track this",
    ctaNo:      "Maybe later",
    ctaInline:  "Start tracking",
    inlineSub:  "Want to track how you're feeling over the next few days? Takes 30 seconds and gives your GP more to work with.",
  },

  // ── Zero Credits ───────────────────────────────────────────────────────────
  zeroCredits: {
    results: {
      hook:      "You've used up your free analysis!",
      sub:       "Ready to keep going? A pack of credits gets you back in action in under a minute — and honestly, now that we've started, you'll want the full picture.",
      proofLabel: "Analysis just completed",
      proofSub:   "Your educational report is ready to review",
    },
    upload: {
      hook:      "You're out of credits!",
      sub:       "You came back — which means the first report was worth it. Top up and let's keep going. You're asking the right questions.",
      proofLabel: "Previous analysis on file",
      proofSub:   "Your report history is saved and waiting",
    },
  },

  // ── Dashboard Empty State ──────────────────────────────────────────────────
  dashboard: {
    emptyHead: "Nothing here yet — but that's about to change!",
    emptySub:  "Upload your first photo and I'll get to work. Your report will be ready in under a minute.",
    emptyCta:  "Upload your first photo",
    welcomeSub: "Here's what I found in your recent analyses",
  },

  // ── Disclaimer (standard — never modify) ──────────────────────────────────
  disclaimer: "⚠️ This is an AI-assisted educational visual assessment only and does not constitute a medical diagnosis. Please consult a qualified healthcare professional for confirmation and treatment. In an emergency, call 000.",
  disclaimerShort: "Educational assessment only · Not a medical diagnosis · Always consult a GP",

} as const;

export default PARA;
