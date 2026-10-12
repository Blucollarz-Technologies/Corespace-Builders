/**
 * Canonical public URLs for Corespace.
 *
 * Accepted routes:
 * - Homepage: `/` (not `/home`)
 * - Services: `/service/{slug}` (not `/services/{slug}`)
 * - Projects: `/project/{slug}` (not `/projects/{slug}`)
 * - Listings stay plural: `/services`, `/projects`
 *
 * External absolute URLs (WhatsApp, mailto, tel, etc.) are left unchanged.
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

const SITE_HOSTS = new Set(
  [
    'localhost',
    'www.corespacebuilders.com',
    'corespacebuilders.com',
    'corespacebuilders.vercel.app',
  ].map((host) => host.toLowerCase()),
)

function getConfiguredSiteHost(): string | null {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITEMAP_URL
  if (!siteUrl) {
    return null
  }

  try {
    return new URL(siteUrl).hostname.toLowerCase()
  } catch {
    return null
  }
}

function isSameSiteHost(hostname: string): boolean {
  const host = hostname.toLowerCase()
  const configured = getConfiguredSiteHost()
  if (configured && host === configured) {
    return true
  }
  return SITE_HOSTS.has(host)
}

function normalizePath(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) {
    return trimmed
  }

  // Keep protocol-relative and special schemes untouched
  if (/^(mailto:|tel:|sms:|javascript:|#)/i.test(trimmed)) {
    return trimmed
  }

  try {
    if (/^https?:\/\//i.test(trimmed)) {
      const parsed = new URL(trimmed)

      // External links (WhatsApp, social, etc.) must stay absolute
      if (!isSameSiteHost(parsed.hostname)) {
        return trimmed
      }

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

  // External / special URLs — do not rewrite
  if (/^(https?:\/\/|mailto:|tel:|sms:)/i.test(path) || path.startsWith('#')) {
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
