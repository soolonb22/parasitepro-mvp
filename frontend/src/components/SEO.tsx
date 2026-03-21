import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
  keywords?: string;
  schema?: Record<string, unknown> | Record<string, unknown>[];
  ogType?: 'website' | 'article';
}

const SITE_NAME = 'Parasite ID Pro';
const BASE_URL = 'https://notworms.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;
const DEFAULT_KEYWORDS =
  'parasite identification Australia, worms in stool, parasite symptoms, gut health, AI health education, Queensland parasites, post-travel gut symptoms, tapeworm, pinworm, roundworm, hookworm';

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical = '/',
  ogImage = DEFAULT_OG_IMAGE,
  noIndex = false,
  keywords,
  schema,
  ogType = 'website',
}) => {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  const canonicalUrl = canonical.startsWith('http')
    ? canonical
    : `${BASE_URL}${canonical.startsWith('/') ? canonical : `/${canonical}`}`;

  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`;
  const fullKeywords = keywords ? `${keywords}, ${DEFAULT_KEYWORDS}` : DEFAULT_KEYWORDS;
  const schemaString = schema
    ? JSON.stringify(Array.isArray(schema) ? schema : [schema])
    : null;

  return (
    <Helmet>
      <html lang="en-AU" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={fullKeywords} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
      )}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${SITE_NAME} — ${description.slice(0, 80)}`} />
      <meta property="og:locale" content="en_AU" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      {schemaString && (
        <script type="application/ld+json">{schemaString}</script>
      )}
    </Helmet>
  );
};

export default SEO;
