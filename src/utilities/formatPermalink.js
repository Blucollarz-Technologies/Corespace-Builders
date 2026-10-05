// cannot use ts here, for nodejs sitemap and redirects module
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { resolveCorespaceUrl } = require('./resolveCorespaceUrl.cjs')

export const formatPermalink = (reference) => {
  let permalink = ''

  const { relationTo, value } = reference

  if (typeof value === 'object' && value !== null) {
    const { slug: referenceSlug, breadcrumbs } = value

    // pages could be nested, so use breadcrumbs
    if (relationTo === 'pages') {
      if (referenceSlug === 'home') {
        permalink = '/'
      } else if (breadcrumbs) {
        const { url: lastCrumbURL = '' } = breadcrumbs?.[breadcrumbs.length - 1] || {} // last crumb
        permalink = lastCrumbURL
      } else {
        permalink = `/${referenceSlug}`
      }
    }

    if (relationTo !== 'pages') {
      permalink = `/${relationTo}/${referenceSlug}`

      if (relationTo === 'media') {
        permalink = value.url
      }
    }
  }

  return resolveCorespaceUrl(permalink) || permalink
}
