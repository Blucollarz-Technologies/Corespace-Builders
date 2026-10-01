/**
 * Short placeholder URLs used in CMS defaults → real published page paths.
 * Fixes 404s when Related Planning / Explore More / footer still use old shorts.
 */
const CORESPACE_URL_ALIASES: Record<string, string> = {
  '/service/architecture': '/service/architecture-design-karnataka',
  '/service/interiors': '/service/interior-design-services-karnataka',
  '/service/renovation': '/service/home-renovation-karnataka',
  '/service/construction': '/service/construction-karnataka',
  '/projects/homestay-villa': '/homestay-and-villa-development',
  '/resources/cost-guide': '/cost-guide',
}

export function resolveCorespaceUrl(url?: null | string): null | string | undefined {
  if (!url) {
    return url
  }

  const trimmed = url.trim()
  const withoutTrailingSlash = trimmed.length > 1 ? trimmed.replace(/\/$/, '') : trimmed

  return CORESPACE_URL_ALIASES[withoutTrailingSlash] ?? trimmed
}

export function withResolvedCorespaceUrl<T extends { url?: null | string }>(
  link: T | null | undefined,
): T | null | undefined {
  if (!link) {
    return link
  }

  if (link.url == null) {
    return link
  }

  return {
    ...link,
    url: resolveCorespaceUrl(link.url),
  }
}
