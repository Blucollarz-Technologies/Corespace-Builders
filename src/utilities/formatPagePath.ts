import { resolveCorespaceUrl } from './resolveCorespaceUrl'

export const formatPagePath = (
  collection: string,
  doc: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  category?: string,
): string => {
  const { slug, breadcrumbs, parent } = doc

  if (collection === 'pages' && slug === 'home') {
    return '/'
  }

  const nestedSlug = breadcrumbs?.slice(-1)?.[0]?.url

  let prefix = ''
  let slugPath = nestedSlug ?? `/${slug}`

  // Service / project child pages use dedicated singular routes
  const parentSlug =
    typeof parent === 'object' && parent && 'slug' in parent ? parent.slug : undefined
  const isServiceChild =
    parentSlug === 'services' ||
    (Array.isArray(breadcrumbs) &&
      breadcrumbs.length > 1 &&
      breadcrumbs.some((crumb) => crumb?.url === '/services') &&
      nestedSlug?.startsWith('/services/'))
  const isProjectChild =
    parentSlug === 'projects' ||
    (Array.isArray(breadcrumbs) &&
      breadcrumbs.length > 1 &&
      breadcrumbs.some((crumb) => crumb?.url === '/projects') &&
      nestedSlug?.startsWith('/projects/'))

  if (collection === 'pages' && isServiceChild && slug) {
    return `/service/${slug}`
  }

  if (collection === 'pages' && isProjectChild && slug) {
    return `/project/${slug}`
  }

  if (collection) {
    switch (collection) {
      case 'case-studies':
        prefix = '/case-studies'
        break
      case 'pages':
        prefix = ''
        break
      case 'partners':
        prefix = '/partners'
        break
      case 'posts':
        prefix = `/posts/${category}`
        break
      default:
        prefix = `/${collection}`
    }
  }

  return resolveCorespaceUrl(`${prefix}${slugPath}`) || `${prefix}${slugPath}`
}
