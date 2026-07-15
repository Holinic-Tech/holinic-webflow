/**
 * Route hairqare-CDN image URLs through Cloudflare Image Resizing so a phone
 * downloads an appropriately-sized image instead of the full-resolution original
 * (the single biggest pitch/result load-speed win).
 *
 * Only `assets.hairqare.co` / `pub.hairqare.co` sit on Cloudflare zones with
 * Image Resizing enabled, so only those hosts are rewritten. URLs that ALREADY
 * carry a `/cdn-cgi/image/` transform, off-zone hosts (e.g. Webflow's
 * `*.website-files.com` / `uploads-ssl.webflow.com`), and data/relative URLs are
 * returned unchanged.
 *
 * `format=auto` serves AVIF/WebP (and preserves alpha) when the browser advertises
 * support; `quality=82` is a good size/quality tradeoff. Pass `width` ≈ 2× the CSS
 * display width so retina screens stay crisp while phones avoid multi-MB originals.
 */
const CF_IMAGE_HOSTS = ['assets.hairqare.co', 'pub.hairqare.co']

export function cdnImg(url: string, width: number): string {
  if (!url || url.includes('/cdn-cgi/image/')) return url
  for (const host of CF_IMAGE_HOSTS) {
    const marker = `https://${host}/`
    if (url.startsWith(marker)) {
      const path = url.slice(marker.length)
      return `${marker}cdn-cgi/image/width=${width},quality=82,format=auto/${path}`
    }
  }
  return url
}
