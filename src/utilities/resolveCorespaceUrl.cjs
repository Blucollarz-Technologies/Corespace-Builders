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

function normalizePath(url) {
  const trimmed = String(url || '').trim()
  if (!trimmed) {
    return trimmed
  }

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

function resolveCorespaceUrl(url) {
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
