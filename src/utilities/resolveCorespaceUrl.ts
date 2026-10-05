/**
 * Canonical public URLs for Corespace.
 *
 * Accepted routes:
 * - Homepage: `/` (not `/home`)
 * - Services: `/service/{slug}` (not `/services/{slug}`)
 * - Projects: `/project/{slug}` (not `/projects/{slug}`)
 * - Listings stay plural: `/services`, `/projects`
 */

const CORESPACE_URL_ALIASES: Record<string, string> = {
  '/home': '/',
  '/service/architecture': '/service/architecture-design-karnataka',
  '/service/interiors': '/service/interior-design-services-karnataka',
  '/service/renovation': '/service/home-renovation-karnataka',
  '/service/construction': '/service/construction-karnataka',
  '/projects/homestay-villa': '/homestay-and-villa-development',
  '/resources/cost-guide': '/cost-guide',
}

function normalizePath(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) {
    return trimmed
  }

  // Absolute same-site URLs → path only
  try {
    if (/^https?:\/\//i.test(trimmed)) {
      const parsed = new URL(trimmed)
      return `${parsed.pathname}${parsed.search}${parsed.hash}` || '/'
    }
  } catch {
    // keep original
  }

  return trimmed.length > 1 ? trimmed.replace(/\/$/, '') : trimmed
}

/**
 * Rewrite legacy / duplicate paths to the single public canonical path.
 */
export function resolveCorespaceUrl(url?: null | string): null | string | undefined {
  if (url == null) {
    return url
  }

  const path = normalizePath(url)
  if (!path) {
    return path
  }

  if (CORESPACE_URL_ALIASES[path]) {
    return CORESPACE_URL_ALIASES[path]
  }

  // /services/{slug} → /service/{slug}  (keep /services listing)
  if (path.startsWith('/services/')) {
    return `/service/${path.slice('/services/'.length)}`
  }

  // /projects/{slug} → /project/{slug}  (keep /projects listing)
  if (path.startsWith('/projects/')) {
    return `/project/${path.slice('/projects/'.length)}`
  }

  return path
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
