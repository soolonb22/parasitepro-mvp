/**
 * Applies Cloudinary auto-optimisation transformations to a URL.
 * Safe to call on non-Cloudinary URLs — returns them unchanged.
 *
 * @param url       Raw Cloudinary URL (or any URL)
 * @param width     Max display width in px (default 800)
 * @param mode      'limit' (default, no upscale) | 'thumb' (fill square, smart crop)
 */
export function optimiseCloudinaryUrl(
  url: string | null | undefined,
  width = 800,
  mode: 'limit' | 'thumb' = 'limit'
): string {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com')) return url;
  if (url.includes('f_auto')) return url;
  const transform = mode === 'thumb'
    ? `f_auto,q_auto,w_${width},h_${width},c_fill,g_auto`
    : `f_auto,q_auto,w_${width},c_limit`;
  return url.replace(/\/upload\//, `/upload/${transform}/`);
}
