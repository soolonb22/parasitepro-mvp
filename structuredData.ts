const BASE_URL = 'https://notworms.com';

export const softwareApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Parasite ID Pro',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Web, iOS, Android',
  url: BASE_URL,
  description: 'AI-powered parasite education platform for Australians. Upload a photo and receive a structured educational report to take to your GP. Not a diagnosis.',
  inLanguage: 'en-AU',
  offers: [
    { '@type': 'Offer', price: '0', priceCurrency: 'AUD', description: 'First analysis free' },
    { '@type': 'Offer', price: '3.00', priceCurrency: 'AUD', description: 'Single analysis credit' },
    { '@type': 'Offer', price: '9.00', priceCurrency: 'AUD', description: '3-credit bundle' },
  ],
  provider: { '@type': 'Organization', name: 'ParasitePro', url: BASE_URL },
};

export const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is Parasite ID Pro a medical diagnosis service?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. Parasite ID Pro provides AI-generated educational reports only. It does not diagnose any medical condition. Always consult a qualified healthcare professional for diagnosis and treatment.' },
    },
    {
      '@type': 'Question',
      name: 'How much does an analysis cost?',
      acceptedAnswer: { '@type': 'Answer', text: 'Your first analysis is completely free. After that, credits start from approximately $3 per analysis. Bundle packs offer better value per report.' },
    },
    {
      '@type': 'Question',
      name: 'What types of images can I upload?',
      acceptedAnswer: { '@type': 'Answer', text: 'You can upload photos of stool samples, skin presentations, environmental samples, and microscopy images. For best results, ensure good lighting and a clear, close-up shot.' },
    },
    {
      '@type': 'Question',
      name: 'Is my data private?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Your images and personal data are handled in accordance with the Australian Privacy Act 1988. We do not sell your data to third parties.' },
    },
    {
      '@type': 'Question',
      name: 'Can I get a refund?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. We offer a 30-day money-back guarantee on all credit purchases if you are not satisfied with the service.' },
    },
  ],
};

export const breadcrumb = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    ...items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 2,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  ],
});
