/**
 * seoConfig.ts — Centralised meta data for every route on notworms.com
 *
 * Import the config you need and pass props to <SEO />.
 *
 * Example:
 *   import { seoConfig } from '../config/seoConfig';
 *   <SEO {...seoConfig.pricing} />
 *
 * AHPRA / TGA compliance notes woven into every description:
 *   - No "diagnosis", "detect", "clinical-grade" language
 *   - All descriptions frame the product as educational
 *   - "get informed before your GP visit" is the consistent CTA frame
 */

export interface PageSEO {
  title: string;
  description: string;
  canonical: string;
  keywords?: string;
  ogImage?: string;
  noIndex?: boolean;
  ogType?: 'website' | 'article';
}

export const seoConfig: Record<string, PageSEO> = {

  /* ── LANDING PAGE ─────────────────────────────────────────────── */
  home: {
    title: 'AI Parasite Education for Australians | notworms.com',
    description:
      'Wondering what that is in your stool or on your skin? Upload a photo and get a structured educational report powered by AI — so you can walk into your GP visit informed. First analysis free.',
    canonical: '/',
    keywords: 'parasite education Australia, what are worms in stool, gut health report, free parasite analysis',
    ogImage: '/og-image.png',
  },

  /* ── PRICING ──────────────────────────────────────────────────── */
  pricing: {
    title: 'Plans & Pricing — Parasite Educational Reports from $3',
    description:
      'Get structured AI-assisted parasite educational reports starting from $3 per analysis. First report free. Use code BETA3FREE for 3 free analyses during our beta.',
    canonical: '/pricing',
    keywords: 'parasite analysis price, health education report cost, beta free analysis, BETA3FREE',
    ogImage: '/og-pricing.png',
  },

  /* ── DASHBOARD ────────────────────────────────────────────────── */
  dashboard: {
    title: 'Your Dashboard — Parasite ID Pro',
    description: 'View your past reports and analysis history.',
    canonical: '/dashboard',
    noIndex: true,
  },

  /* ── UPLOAD ───────────────────────────────────────────────────── */
  upload: {
    title: 'Upload Your Image — Start Your Educational Report',
    description: 'Upload a photo of your sample and receive an AI-generated structured educational report within seconds.',
    canonical: '/upload',
    noIndex: true,
  },

  /* ── RESULTS ──────────────────────────────────────────────────── */
  results: {
    title: 'Your Educational Report — Parasite ID Pro',
    description: 'Your AI-generated parasite educational report is ready. Review the findings and share with your healthcare provider.',
    canonical: '/results',
    noIndex: true,
  },

  /* ── SAMPLE REPORT ────────────────────────────────────────────── */
  sampleReport: {
    title: 'Sample Educational Report — See What You Get | Parasite ID Pro',
    description:
      'See exactly what a Parasite ID Pro educational report looks like before you commit. Real format, real structure — no diagnostic claims, just clear information to take to your GP.',
    canonical: '/sample-report',
    keywords: 'sample parasite report, example AI health report, what does the report look like',
    ogImage: '/og-sample-report.png',
  },

  /* ── ENCYCLOPEDIA ─────────────────────────────────────────────── */
  encyclopedia: {
    title: 'Australian Parasite Encyclopedia — Identify Common Species',
    description:
      'Browse our illustrated guide to parasites common in Australia and Queensland. Learn about roundworm, hookworm, tapeworm, Giardia, pinworm, and more — written in plain English.',
    canonical: '/encyclopedia',
    keywords: 'parasite encyclopedia Australia, common Australian parasites, roundworm hookworm tapeworm guide, Queensland parasites list',
    ogImage: '/og-encyclopedia.png',
  },

  /* ── FAQ ──────────────────────────────────────────────────────── */
  faq: {
    title: 'Frequently Asked Questions — Parasite ID Pro',
    description:
      'Answers to the most common questions about our AI-assisted parasite education reports, pricing, privacy, and how the service works.',
    canonical: '/faq',
    keywords: 'parasite ID pro FAQ, how does it work, is it a diagnosis, privacy questions',
  },

  /* ── BLOG ─────────────────────────────────────────────────────── */
  blog: {
    title: 'Parasite Education Blog — Gut Health Tips for Australians',
    description:
      'Practical articles about parasite awareness, gut health, post-travel symptoms, and keeping your family safe. Written for everyday Australians.',
    canonical: '/blog',
    keywords: 'parasite blog Australia, gut health tips, post-travel parasite symptoms, family health education',
    ogType: 'website',
  },

  /* ── CONTACT ──────────────────────────────────────────────────── */
  contact: {
    title: 'Contact Us — Parasite ID Pro',
    description:
      'Get in touch with the Parasite ID Pro team. We're based in Mackay, Queensland and here to help with any questions about your account or our educational reports.',
    canonical: '/contact',
    noIndex: false,
  },

  /* ── DISCLAIMER ───────────────────────────────────────────────── */
  disclaimer: {
    title: 'Medical Disclaimer — Parasite ID Pro',
    description:
      'Parasite ID Pro provides AI-assisted educational reports only. We do not provide medical diagnoses. Read our full disclaimer before using the service.',
    canonical: '/disclaimer',
    keywords: 'not a diagnosis, AI health education disclaimer, TGA compliance, not medical advice',
  },

  /* ── PRIVACY ──────────────────────────────────────────────────── */
  privacy: {
    title: 'Privacy Policy — Parasite ID Pro',
    description:
      'How Parasite ID Pro collects, stores, and protects your personal information in accordance with the Australian Privacy Act 1988.',
    canonical: '/privacy',
    noIndex: false,
  },

  /* ── TRAVEL RISK MAP ──────────────────────────────────────────── */
  travelRiskMap: {
    title: 'Parasite Travel Risk Map — Know Before You Go | Parasite ID Pro',
    description:
      'Explore parasite risk by country and region before you travel. Understand which parasites are common in Southeast Asia, the Pacific, and beyond — and what to watch for when you return.',
    canonical: '/travel-risk-map',
    keywords: 'travel parasite risk, post-travel gut symptoms, Southeast Asia parasites, returning traveller health Australia',
    ogImage: '/og-travel-map.png',
  },

  /* ── SYMPTOM JOURNAL ──────────────────────────────────────────── */
  symptomJournal: {
    title: 'Symptom Journal — Track Your Gut Health | Parasite ID Pro',
    description:
      'Log and track gut and skin symptoms over time. Build a clear record to share with your doctor at your next appointment.',
    canonical: '/symptom-journal',
    noIndex: true,
  },

  /* ── FOOD DIARY ───────────────────────────────────────────────── */
  foodDiary: {
    title: 'Food & Travel Diary — Parasite ID Pro',
    description:
      'Record your meals and recent travel to help identify possible parasite exposure events. Share with your GP for context.',
    canonical: '/food-diary',
    noIndex: true,
  },

  /* ── HEALTH FORMS ─────────────────────────────────────────────── */
  healthForms: {
    title: 'Health Forms — Parasite ID Pro',
    description: 'Pre-appointment health forms and checklists to help you prepare for your GP visit.',
    canonical: '/health-forms',
    noIndex: true,
  },

  /* ── TREATMENT TRACKER ────────────────────────────────────────── */
  treatmentTracker: {
    title: 'Treatment Tracker — Parasite ID Pro',
    description: 'Track your treatment progress and symptom changes over time.',
    canonical: '/treatment-tracker',
    noIndex: true,
  },

  /* ── NOTIFICATION SETTINGS ────────────────────────────────────── */
  notificationSettings: {
    title: 'Notification Settings — Parasite ID Pro',
    description: 'Manage your email and in-app notification preferences.',
    canonical: '/notification-settings',
    noIndex: true,
  },

  /* ── LOGIN / SIGNUP ───────────────────────────────────────────── */
  login: {
    title: 'Log In — Parasite ID Pro',
    description: 'Log in to your Parasite ID Pro account to view your educational reports and analysis history.',
    canonical: '/login',
    noIndex: true,
  },

  signup: {
    title: 'Create Your Free Account — Parasite ID Pro',
    description:
      'Sign up free and get your first AI-assisted parasite educational report at no cost. No credit card required.',
    canonical: '/signup',
    keywords: 'free parasite report, sign up notworms.com, create account parasite ID pro',
    noIndex: false,
  },

  forgotPassword: {
    title: 'Reset Your Password — Parasite ID Pro',
    description: 'Reset your Parasite ID Pro account password.',
    canonical: '/forgot-password',
    noIndex: true,
  },

  /* ── ONBOARDING ───────────────────────────────────────────────── */
  onboarding: {
    title: 'Welcome to Parasite ID Pro — Let's Get Started',
    description: 'Tell us a little about yourself so we can personalise your experience.',
    canonical: '/onboarding',
    noIndex: true,
  },

  /* ── ADMIN ────────────────────────────────────────────────────── */
  admin: {
    title: 'Admin Panel — Parasite ID Pro',
    description: 'Internal admin dashboard.',
    canonical: '/admin',
    noIndex: true,
  },

  /* ════════════════════════════════════════════════════════════════
     SEO LANDING PAGES
  ════════════════════════════════════════════════════════════════ */

  seoParasiteSymptoms: {
    title: 'Parasite Symptoms in Humans — Australia Guide | Parasite ID Pro',
    description:
      'Recognise the signs of a parasitic infection — fatigue, bloating, itching, and more. Australian-focused plain-English guide to parasite symptoms, and when to see a GP.',
    canonical: '/parasite-symptoms-australia',
    keywords: 'parasite symptoms humans, signs of parasitic infection, bloating fatigue parasites, gut symptoms Australia',
    ogImage: '/og-symptoms.png',
  },

  seoTapeworm: {
    title: 'Tapeworm Identification Australia — What to Look For | Parasite ID Pro',
    description:
      'What does a tapeworm look like in stool? Learn to recognise tapeworm segments, understand how infections occur, and find out when to see a doctor in Australia.',
    canonical: '/tapeworm-identification-australia',
    keywords: 'tapeworm in stool Australia, tapeworm segments, tapeworm symptoms, what does tapeworm look like',
    ogImage: '/og-tapeworm.png',
  },

  seoPinworm: {
    title: 'Pinworm (Threadworm) in Children — Australia Guide | Parasite ID Pro',
    description:
      'Pinworm (threadworm) is extremely common in Australian school-age children. Learn to recognise it, understand the lifecycle, and know when to seek treatment.',
    canonical: '/pinworm-threadworm-australia',
    keywords: 'pinworm Australia, threadworm children, Enterobius vermicularis, itchy bottom children, school worms Australia',
    ogImage: '/og-pinworm.png',
  },

  seoDogWorms: {
    title: 'Dog Worms & Human Risk — Can You Catch Them? | Parasite ID Pro',
    description:
      'Can you catch worms from your dog? Learn which parasites can pass between pets and people in Australia, and what signs to watch for in your household.',
    canonical: '/dog-worms-human-risk-australia',
    keywords: 'dog worms humans Australia, zoonotic parasites pets, roundworm from dog, can I catch worms from my dog',
    ogImage: '/og-dog-worms.png',
  },

  seoWormInStool: {
    title: 'Worm in Stool — What It Means & What to Do | Parasite ID Pro',
    description:
      'Found something unusual in your stool? Learn what common worm species look like in faeces, how to describe them to a doctor, and next steps for Australians.',
    canonical: '/worm-in-stool-australia',
    keywords: 'worm in stool Australia, worm in poop, found worm in toilet, what is in my stool',
    ogImage: '/og-worm-stool.png',
  },

  seoNaturalParasiteCleanse: {
    title: 'Natural Parasite Cleanse — What Works & What Doesn't | Parasite ID Pro',
    description:
      'Searching for a natural parasite cleanse? We break down what the evidence actually says — and why getting a proper GP assessment first is the smartest step for Australians.',
    canonical: '/natural-parasite-cleanse-australia',
    keywords: 'natural parasite cleanse Australia, herbal parasite treatment, parasite cleanse evidence, anti-parasite diet',
    ogImage: '/og-cleanse.png',
  },

};
