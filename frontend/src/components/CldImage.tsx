// CldImage.tsx — Reusable Cloudinary-optimised image component
// Inserts transforms into the URL path (not query string — Cloudinary requires path transforms)
// Safe on non-Cloudinary URLs: passes through unchanged.

interface CldImageProps {
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  mode?: 'limit' | 'thumb';   // limit = c_limit (no upscale), thumb = c_fill,g_auto (square crop)
  priority?: boolean;          // true = fetchpriority="high" + loading="eager" (LCP images)
  sizes?: string;              // responsive sizes hint for browser
}

function buildSrc(url: string, width: number, mode: 'limit' | 'thumb'): string {
  if (!url || !url.includes('res.cloudinary.com')) return url || '';
  if (url.includes('f_auto')) return url; // already optimised
  const transform = mode === 'thumb'
    ? `f_auto,q_auto,w_${width},h_${width},c_fill,g_auto`
    : `f_auto,q_auto,w_${width},c_limit`;
  return url.replace(/\/upload\//, `/upload/${transform}/`);
}

export default function CldImage({
  src,
  alt,
  width = 800,
  height,
  className,
  style,
  mode = 'limit',
  priority = false,
  sizes,
}: CldImageProps) {
  if (!src) return null;

  const optimisedSrc = buildSrc(src, width, mode);

  return (
    <img
      src={optimisedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
      // @ts-ignore — fetchpriority is valid HTML but not yet in all TS defs
      fetchpriority={priority ? 'high' : 'auto'}
      decoding={priority ? 'sync' : 'async'}
      sizes={sizes}
    />
  );
}
