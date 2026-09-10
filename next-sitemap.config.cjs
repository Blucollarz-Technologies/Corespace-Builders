const nextDistDir = process.env.VERCEL ? '.next' : 'node_modules/.cache/next'

module.exports = {
  siteUrl:
    process.env.SITEMAP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://corespacebuilders.vercel.app',
  sourceDir: nextDistDir,
  generateRobotsTxt: true,
}
