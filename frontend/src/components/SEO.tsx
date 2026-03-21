/**
 * SEO.tsx — Per-page meta tag injector for ParasitePro / notworms.com
 *
 * Wraps react-helmet-async. Drop this into src/components/SEO.tsx
 * and replace any existing SEO.jsx with this file.
 *
 * Usage:
 *   <SEO
 *     title="Tapeworm Identification Australia | Parasite ID Pro"
 *     description="Learn to recognise tapeworm segments in stool..."
 *     canonical="/tapeworm-information"
 *     ogImage="/og-tapeworm.png"          // optional — defaults to /og-image.png
 *     noIndex={false}                      // optional — set true on /dashboard, /admin etc
 *     schema={tapewormSchema}              // optional — JSON-LD object or array
 *   />
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  /** Full page title — keep under 60 chars. 
   *  The component appends " | Parasite ID Pro" automatically unless
   *  the title already contains the brand name. */
  title: string;

  /** Meta description — keep 120–160 chars. */
  description: string;

  /** Canonical path (e.g. "/pricing"). 
   *  Full URL is auto-prefixed with https://notworms.com */
  canonical?: string;

  /** Absolute or root-relative OG image path.
   *  Recommended size: 1200×630px. */
  ogImage?: string;

  /** Set true to suppress indexing (admin, dashboard, upload, etc.) */
  noIndex?: boolean;

  /** Additional keywords beyond the site-wide defaults. */
  keywords?: string;

  /** Optional JSON-LD schema object or array.
   *  Rendered as <script type="application/ld+json"> */
  schema?: Record<string, unknown> | Record<string, unknown>[];

  /** OG type — defaults to 'website'. Use 'article' for blog posts. */
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
  // Auto-append brand unless it's already in the title
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  // Build the canonical URL
  const canonicalUrl = canonical.startsWith('http')
    ? canonical
    : `${BASE_URL}${canonical.startsWith('/') ? canonical : `/${canonical}`}`;

  // Build full OG image URL
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`;

  // Merge keywords
  const fullKeywords = keywords ? `${keywords}, ${DEFAULT_KEYWORDS}` : DEFAULT_KEYWORDS;

  // Serialize schema
  const schemaString = schema
    ? JSON.stringify(Array.isArray(schema) ? schema : [schema], null, 0)
    : null;

  return (
    <Helmet>
      {/* ── Primary ───────────────────────────────────── */}
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

      {/* ── Open Graph ────────────────────────────────── */}
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

      {/* ── Twitter / X Card ──────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:image:alt" content={`${SITE_NAME} — AI parasite education`} />

      {/* ── JSON-LD Schema ────────────────────────────── */}
      {schemaString && (
        <script type="application/ld+json">{schemaString}</script>
      )}
    </Helmet>
  );
};

export default SEO;
