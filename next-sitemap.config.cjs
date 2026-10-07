const { getNextDistDir } = require('./next-dist-dir.cjs')
const nextDistDir = getNextDistDir()

/** Paths that should never appear in the public sitemap. */
const EXCLUDE = [
  // APIs / auth / admin
  '/api/*',
  '/admin',
  '/admin/*',
  '/auth',
  '/auth/*',

  // Assets / icons (not indexable pages)
  '/icon*',
  '/*.svg',
  '/*.ico',
  '/*.png',
  '/*.jpg',
  '/*.jpeg',
  '/*.webp',

  // Internal / Payload leftovers
  '/styleguide',
  '/styleguide/*',
  '/cloud',
  '/cloud/*',
  '/cloud-terms',
  '/gh',
  '/partners',
  '/partners/*',
  '/ie-incompatible.html',

  // Cookie policy — keep page live, but do not push for indexing
  '/cookie',

  // Legacy Payload case-study templates (not Corespace marketing pages)
  '/case-studies',
  '/case-studies/*',

  // Thank-you / success (no SEO value)
  '/thank-you',
  '/thanks-for-subscribing',

  // Canonical duplicates
  '/home',
  '/privacy-policy',
  '/posts/blog', // listing; keep /blog + /posts/blog/*
  '/services/*', // redirect duplicates of /service/*
  '/projects/*', // redirect duplicates of /project/*
]

module.exports = {
  siteUrl:
    process.env.SITEMAP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://www.corespacebuilders.com',
  sourceDir: nextDistDir,
  generateRobotsTxt: true,
  exclude: EXCLUDE,
  changefreq: 'weekly',
  priority: 0.7,
  transform: async (config, path) => {
    // Extra guard for redirect-only / leftover / non-page routes
    if (
      path === '/home' ||
      path === '/privacy-policy' ||
      path === '/posts/blog' ||
      path === '/cookie' ||
      path === '/api/star-count' ||
      path === '/gh' ||
      path === '/cloud-terms' ||
      path === '/thank-you' ||
      path === '/thanks-for-subscribing' ||
      path.startsWith('/api/') ||
      path.startsWith('/admin') ||
      path.startsWith('/auth') ||
      path.startsWith('/styleguide') ||
      path.startsWith('/cloud') ||
      path.startsWith('/services/') ||
      path.startsWith('/projects/') ||
      path.startsWith('/case-studies') ||
      path.startsWith('/icon') ||
      /\.(svg|ico|png|jpe?g|webp|gif|txt|xml|json|map)$/i.test(path)
    ) {
      return null
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: path === '/' ? 1.0 : config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/auth/',
          '/styleguide/',
          '/cloud',
          '/cloud/',
          '/case-studies',
          '/case-studies/',
          '/cookie',
          '/thank-you',
          '/thanks-for-subscribing',
        ],
      },
    ],
    additionalSitemaps: [],
  },
}
