import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string;
}

export default function SEO({ title, description, canonical, keywords }: SEOProps) {
  const fullTitle = title ? `${title} | ParasitePro` : 'ParasitePro — AI Parasite Identification';
  const defaultDesc = 'AI-powered parasite identification for Australians. Upload a photo, get a clinical assessment in seconds.';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
    </Helmet>
  );
}
