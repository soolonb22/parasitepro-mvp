/**
 * structuredData.ts — JSON-LD schemas for notworms.com
 *
 * Pass these as the `schema` prop to <SEO schema={schema.softwareApp} />
 *
 * Schemas included:
 *  - softwareApp      → SoftwareApplication (for /pricing, home)
 *  - faqPage          → FAQPage (for /faq — add your Q&As below)
 *  - breadcrumb()     → BreadcrumbList factory (call per page)
 *  - blogPost()       → BlogPosting factory (call per blog post)
 *  - medicalWebPage() → MedicalWebPage factory (for SEO landing pages)
 *
 * NOTE: Google's health-content policies are strict.
 * All copy frames the product as educational, NOT diagnostic.
 * Do NOT add "MedicalCondition" or "Drug" schemas — TGA exposure risk.
 */

const BASE_URL = 'https://notworms.com';

/* ── SOFTWARE APPLICATION ──────────────────────────────────────── */
export const softwareApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Parasite ID Pro',
  alternateName: 'notworms.com',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Web, iOS, Android',
  url: BASE_URL,
  description:
    'AI-powered parasite education platform for Australians. Upload a photo and receive a structured educational report to take to your GP. Not a diagnosis.',
  inLanguage: 'en-AU',
  offers: [
    {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'AUD',
      description: 'First analysis free',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      price: '3.00',
      priceCurrency: 'AUD',
      description: 'Single analysis credit',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      price: '9.00',
      priceCurrency: 'AUD',
      description: '3-credit bundle',
      availability: 'https://schema.org/InStock',
    },
  ],
  provider: {
    '@type': 'Organization',
    name: 'ParasitePro',
    url: BASE_URL,
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '47',
    bestRating: '5',
    worstRating: '1',
  },
};

/* ── FAQ PAGE ──────────────────────────────────────────────────── */
export const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is Parasite ID Pro a medical diagnosis service?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Parasite ID Pro provides AI-generated educational reports only. It does not diagnose any medical condition. Always consult a qualified healthcare professional for diagnosis and treatment.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does an analysis cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your first analysis is completely free. After that, credits start from approximately $3 per analysis. Bundle packs offer better value per report.',
      },
    },
    {
      '@type': 'Question',
      name: 'What types of images can I upload?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can upload photos of stool samples, skin presentations, environmental samples, and microscopy images. For best results, ensure good lighting and a clear, close-up shot.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my data private?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Your images and personal data are handled in accordance with the Australian Privacy Act 1988. We do not sell your data to third parties. See our Privacy Policy for full details.',
      },
    },
    {
      '@type': 'Question',
      name: 'How accurate are the reports?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our AI provides structured educational information based on visual features. Reports include a confidence level and should be treated as a starting point for a GP conversation, not a final answer.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I get a refund?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We offer a 30-day money-back guarantee on all credit purchases if you are not satisfied with the service.',
      },
    },
  ],
};

/* ── BREADCRUMB FACTORY ────────────────────────────────────────── */
interface BreadcrumbItem {
  name: string;
  path: string;
}

export const breadcrumb = (items: BreadcrumbItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: BASE_URL,
    },
    ...items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 2,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  ],
});

/* ── BLOG POST FACTORY ─────────────────────────────────────────── */
interface BlogPostSchema {
  title: string;
  description: string;
  slug: string;
  datePublished: string;       // ISO 8601 e.g. "2025-08-01"
  dateModified?: string;
  imageUrl?: string;
  authorName?: string;
}

export const blogPost = ({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  imageUrl = `${BASE_URL}/og-blog.png`,
  authorName = 'Parasite ID Pro Team',
}: BlogPostSchema) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: title,
  description,
  url: `${BASE_URL}/blog/${slug}`,
  datePublished,
  dateModified: dateModified ?? datePublished,
  image: imageUrl,
  author: {
    '@type': 'Person',
    name: authorName,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Parasite ID Pro',
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/logo.png`,
    },
  },
  inLanguage: 'en-AU',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${BASE_URL}/blog/${slug}`,
  },
});

/* ── MEDICAL / HEALTH WEB PAGE FACTORY ────────────────────────── */
/**
 * Use this for the SEO landing pages (symptoms, tapeworm, pinworm etc).
 * Deliberately typed as HealthTopicContent to avoid diagnostic framing.
 */
interface HealthPageSchema {
  title: string;
  description: string;
  canonical: string;
  lastReviewed?: string;  // ISO 8601
}

export const healthPage = ({
  title,
  description,
  canonical,
  lastReviewed,
}: HealthPageSchema) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: title,
  description,
  url: `${BASE_URL}${canonical}`,
  inLanguage: 'en-AU',
  ...(lastReviewed && { dateModified: lastReviewed }),
  publisher: {
    '@type': 'Organization',
    name: 'Parasite ID Pro',
    url: BASE_URL,
  },
  mainContentOfPage: {
    '@type': 'WebPageElement',
    cssSelector: 'main',
  },
});

/* ── LOCAL BUSINESS (optional — only if you want map pack presence) */
/* Mackay QLD — keep commented unless you want local SEO for the business location */
/*
export const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'ParasitePro',
  url: BASE_URL,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Mackay',
    addressRegion: 'QLD',
    addressCountry: 'AU',
  },
  areaServed: { '@type': 'Country', name: 'Australia' },
};
*/
