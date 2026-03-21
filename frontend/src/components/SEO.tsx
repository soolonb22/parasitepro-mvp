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
  home: {
    title: 'AI Parasite Education for Australians | notworms.com',
    description: 'Wondering what that is in your stool or on your skin? Upload a photo and get a structured educational report powered by AI — so you can walk into your GP visit informed. First analysis free.',
    canonical: '/',
    keywords: 'parasite education Australia, what are worms in stool, gut health report, free parasite analysis',
  },
  pricing: {
    title: 'Plans & Pricing — Parasite Educational Reports from $3',
    description: 'Get structured AI-assisted parasite educational reports starting from $3 per analysis. First report free. Use code BETA3FREE for 3 free analyses during our beta.',
    canonical: '/pricing',
    keywords: 'parasite analysis price, health education report cost, beta free analysis, BETA3FREE',
  },
  dashboard: {
    title: 'Your Dashboard — Parasite ID Pro',
    description: 'View your past reports and analysis history.',
    canonical: '/dashboard',
    noIndex: true,
  },
  upload: {
    title: 'Upload Your Image — Start Your Educational Report',
    description: 'Upload a photo of your sample and receive an AI-generated structured educational report within seconds.',
    canonical: '/upload',
    noIndex: true,
  },
  results: {
    title: 'Your Educational Report — Parasite ID Pro',
    description: 'Your AI-generated parasite educational report is ready. Review the findings and share with your healthcare provider.',
    canonical: '/results',
    noIndex: true,
  },
  sampleReport: {
    title: 'Sample Educational Report — See What You Get | Parasite ID Pro',
    description: 'See exactly what a Parasite ID Pro educational report looks like before you commit. Real format, real structure — no diagnostic claims, just clear information to take to your GP.',
    canonical: '/sample-report',
    keywords: 'sample parasite report, example AI health report, what does the report look like',
  },
  encyclopedia: {
    title: 'Australian Parasite Encyclopedia — Identify Common Species',
    description: 'Browse our illustrated guide to parasites common in Australia and Queensland. Learn about roundworm, hookworm, tapeworm, Giardia, pinworm, and more — written in plain English.',
    canonical: '/encyclopedia',
    keywords: 'parasite encyclopedia Australia, common Australian parasites, roundworm hookworm tapeworm guide',
  },
  faq: {
    title: 'Frequently Asked Questions — Parasite ID Pro',
    description: 'Answers to the most common questions about our AI-assisted parasite education reports, pricing, privacy, and how the service works.',
    canonical: '/faq',
  },
  blog: {
    title: 'Parasite Education Blog — Gut Health Tips for Australians',
    description: 'Practical articles about parasite awareness, gut health, post-travel symptoms, and keeping your family safe. Written for everyday Australians.',
    canonical: '/blog',
    ogType: 'website',
  },
  contact: {
    title: 'Contact Us — Parasite ID Pro',
    description: "Get in touch with the Parasite ID Pro team. We're based in Mackay, Queensland and here to help with any questions about your account or our educational reports.",
    canonical: '/contact',
  },
  disclaimer: {
    title: 'Medical Disclaimer — Parasite ID Pro',
    description: 'Parasite ID Pro provides AI-assisted educational reports only. We do not provide medical diagnoses. Read our full disclaimer before using the service.',
    canonical: '/disclaimer',
  },
  privacy: {
    title: 'Privacy Policy — Parasite ID Pro',
    description: 'How Parasite ID Pro collects, stores, and protects your personal information in accordance with the Australian Privacy Act 1988.',
    canonical: '/privacy',
  },
  travelRiskMap: {
    title: 'Parasite Travel Risk Map — Know Before You Go | Parasite ID Pro',
    description: 'Explore parasite risk by country and region before you travel. Understand which parasites are common in Southeast Asia, the Pacific, and beyond.',
    canonical: '/travel-risk-map',
    keywords: 'travel parasite risk, post-travel gut symptoms, Southeast Asia parasites, returning traveller health Australia',
  },
  symptomJournal: {
    title: 'Symptom Journal — Track Your Gut Health | Parasite ID Pro',
    description: 'Log and track gut and skin symptoms over time. Build a clear record to share with your doctor at your next appointment.',
    canonical: '/symptom-journal',
    noIndex: true,
  },
  login: {
    title: 'Log In — Parasite ID Pro',
    description: 'Log in to your Parasite ID Pro account to view your educational reports and analysis history.',
    canonical: '/login',
    noIndex: true,
  },
  signup: {
    title: 'Create Your Free Account — Parasite ID Pro',
    description: 'Sign up free and get your first AI-assisted parasite educational report at no cost. No credit card required.',
    canonical: '/signup',
    keywords: 'free parasite report, sign up notworms.com, create account parasite ID pro',
  },
  seoParasiteSymptoms: {
    title: 'Parasite Symptoms in Humans — Australia Guide | Parasite ID Pro',
    description: 'Recognise the signs of a parasitic infection — fatigue, bloating, itching, and more. Australian-focused plain-English guide to parasite symptoms, and when to see a GP.',
    canonical: '/parasite-symptoms-australia',
    keywords: 'parasite symptoms humans, signs of parasitic infection, bloating fatigue parasites, gut symptoms Australia',
  },
  seoTapeworm: {
    title: 'Tapeworm Identification Australia — What to Look For | Parasite ID Pro',
    description: 'What does a tapeworm look like in stool? Learn to recognise tapeworm segments, understand how infections occur, and find out when to see a doctor in Australia.',
    canonical: '/tapeworm-identification-australia',
    keywords: 'tapeworm in stool Australia, tapeworm segments, what does tapeworm look like',
  },
  seoPinworm: {
    title: 'Pinworm (Threadworm) in Children — Australia Guide | Parasite ID Pro',
    description: 'Pinworm (threadworm) is extremely common in Australian school-age children. Learn to recognise it, understand the lifecycle, and know when to seek treatment.',
    canonical: '/pinworm-threadworm-australia',
    keywords: 'pinworm Australia, threadworm children, itchy bottom children, school worms Australia',
  },
  seoDogWorms: {
    title: "Dog Worms & Human Risk — Can You Catch Them? | Parasite ID Pro",
    description: 'Can you catch worms from your dog? Learn which parasites can pass between pets and people in Australia, and what signs to watch for in your household.',
    canonical: '/dog-worms-human-risk-australia',
    keywords: 'dog worms humans Australia, zoonotic parasites pets, can I catch worms from my dog',
  },
  seoWormInStool: {
    title: 'Worm in Stool — What It Means & What to Do | Parasite ID Pro',
    description: "Found something unusual in your stool? Learn what common worm species look like in faeces, how to describe them to a doctor, and next steps for Australians.",
    canonical: '/worm-in-stool-australia',
    keywords: 'worm in stool Australia, worm in poop, found worm in toilet, what is in my stool',
  },
  seoNaturalParasiteCleanse: {
    title: "Natural Parasite Cleanse — What Works & What Doesn't | Parasite ID Pro",
    description: "Searching for a natural parasite cleanse? We break down what the evidence actually says — and why getting a proper GP assessment first is the smartest step for Australians.",
    canonical: '/natural-parasite-cleanse-australia',
    keywords: 'natural parasite cleanse Australia, herbal parasite treatment, anti-parasite diet',
  },
};
