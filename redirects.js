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
      source: '/services/:slug',
      destination: '/service/:slug',
      permanent: true,
    },
    {
      source: '/projects/:slug',
      destination: '/project/:slug',
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
