import { formatPermalink } from './src/utilities/formatPermalink.js'

export const redirects = async () => {
  const staticRedirects = [
    {
      source: '/roadmap',
      destination: 'https://github.com/payloadcms/payload/discussions/categories/roadmap',
      permanent: true,
    },
    {
      // Legacy post URLs → canonical /blog/{slug}
      // Use temporary (307) so browsers do not permanently cache a redirect loop
      // against an older reverse /blog → /posts rule still in local cache.
      source: '/posts/:category/:slug',
      destination: '/blog/:slug',
      permanent: false,
    },
    {
      // Default category archive lives at /blog
      source: '/posts/blog',
      destination: '/blog',
      permanent: false,
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
