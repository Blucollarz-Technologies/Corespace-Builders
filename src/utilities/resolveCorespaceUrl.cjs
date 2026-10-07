/**
 * CommonJS twin of resolveCorespaceUrl.ts for Node scripts (redirects / permalink).
 */

const CORESPACE_URL_ALIASES = {
  '/home': '/',
  '/service/architecture': '/service/architecture-design-karnataka',
  '/service/interiors': '/service/interior-design-services-karnataka',
  '/service/renovation': '/service/home-renovation-karnataka',
  '/service/construction': '/service/construction-karnataka',
  '/projects/homestay-villa': '/homestay-and-villa-development',
  '/resources/cost-guide': '/cost-guide',
}

const SITE_HOSTS = new Set([
  'localhost',
  'www.corespacebuilders.com',
  'corespacebuilders.com',
  'corespacebuilders.vercel.app',
])

function getConfiguredSiteHost() {
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

function isSameSiteHost(hostname) {
  const host = String(hostname || '').toLowerCase()
  const configured = getConfiguredSiteHost()
  if (configured && host === configured) {
    return true
  }
  return SITE_HOSTS.has(host)
}

function normalizePath(url) {
  const trimmed = String(url || '').trim()
  if (!trimmed) {
    return trimmed
  }

  if (/^(mailto:|tel:|sms:|javascript:|#)/i.test(trimmed)) {
    return trimmed
  }

  try {
    if (/^https?:\/\//i.test(trimmed)) {
      const parsed = new URL(trimmed)

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

function resolveCorespaceUrl(url) {
  if (url == null) {
    return url
  }

  const path = normalizePath(url)
  if (!path) {
    return path
  }

  if (/^(https?:\/\/|mailto:|tel:|sms:)/i.test(path) || path.startsWith('#')) {
    return path
  }

  if (CORESPACE_URL_ALIASES[path]) {
    return CORESPACE_URL_ALIASES[path]
  }

  if (path.startsWith('/services/')) {
    return `/service/${path.slice('/services/'.length)}`
  }

  if (path.startsWith('/projects/')) {
    return `/project/${path.slice('/projects/'.length)}`
  }

  return path
}

module.exports = {
  resolveCorespaceUrl,
}
