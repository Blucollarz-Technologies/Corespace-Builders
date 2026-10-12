import { formatPermalink } from './src/utilities/formatPermalink.js'

export const redirects = async () => {
  const staticRedirects = [
    {
      source: '/roadmap',
      destination: 'https://github.com/payloadcms/payload/discussions/categories/roadmap',
      permanent: true,
    },
    {
      // :slug+ requires a path segment so bare /blog is not redirected to /posts/blog
      source: '/blog/:slug+',
      destination: '/posts/blog/:slug*',
      permanent: true,
    },
    {
      // Homepage CMS slug must not remain a duplicate indexable URL
      source: '/home',
      destination: '/',
      permanent: true,
    },
    {
      source: '/services/:slug',
      destination: '/service/:slug',
      permanent: true,
    },
    {
      source: '/projects/:slug',
      destination: '/project/:slug',
      permanent: true,
    },
    // Short CMS / footer aliases → published service page slugs
    {
      source: '/service/renovation',
      destination: '/service/home-renovation-karnataka',
      permanent: true,
    },
    {
      source: '/service/architecture',
      destination: '/service/architecture-design-karnataka',
      permanent: true,
    },
    {
      source: '/service/interiors',
      destination: '/service/interior-design-services-karnataka',
      permanent: true,
    },
    {
      source: '/service/construction',
      destination: '/service/construction-karnataka',
      permanent: true,
    },
  ]

  const internetExplorerRedirect = {
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
    has: [
      {
        type: 'header',
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    destination: '/ie-incompatible.html',
  }

  const redirects = [...staticRedirects, internetExplorerRedirect]

  return redirects
}
