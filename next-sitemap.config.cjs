module.exports = {
  siteUrl:
    process.env.SITEMAP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://corespacebuilders.vercel.app',
  sourceDir: 'node_modules/.cache/next',
  generateRobotsTxt: true,
}
