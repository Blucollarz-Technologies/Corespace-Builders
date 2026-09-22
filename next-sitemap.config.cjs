const { getNextDistDir } = require('./next-dist-dir.cjs')
const nextDistDir = getNextDistDir()

module.exports = {
  siteUrl:
    process.env.SITEMAP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://corespacebuilders.vercel.app',
  sourceDir: nextDistDir,
  generateRobotsTxt: true,
}
