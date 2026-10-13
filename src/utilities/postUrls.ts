/**
 * Public blog post URLs are always `/blog/{slug}`.
 * Legacy `/posts/{category}/{slug}` paths 301 to this form.
 */
export function getBlogPostPath(slug: string): string {
  return `/blog/${slug}`
}

export function getBlogListingPath(): string {
  return '/blog'
}
