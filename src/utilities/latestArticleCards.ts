import type { Media, Page, Post } from '@root/payload-types'

import { getPayload } from 'payload'
import config from '@payload-config'
import { getPostCardDescription } from '@root/utilities/getPostCardDescription'
import { lexicalToPlaintext } from '@root/utilities/lexicalToPlaintext'

type GalleryItem = {
  category?: string
  description?: string
  href?: null | string
  id?: null | string
  image?: Media | null | string
  location?: string
  publishedOn?: null | string
  readingTime?: null | number
  stage?: string
  [key: string]: unknown
}

const isLatestArticlesSection = (section: unknown): boolean => {
  if (!section || typeof section !== 'object') {
    return false
  }

  const value = section as {
    blockType?: string
    eyebrow?: null | string
    heading?: null | string
  }

  if (value.blockType !== 'corespaceProjectGallery') {
    return false
  }

  return /article/i.test(value.heading || '') || /latest|article/i.test(value.eyebrow || '')
}

const blogSlugFromHref = (href: string): null | string => {
  const match = href.trim().match(/^\/blog\/([^/?#]+)\/?$/)
  return match?.[1] || null
}

const estimateReadingTime = (post: Partial<Post>): number => {
  const text = [
    post.title || '',
    getPostCardDescription(post),
    lexicalToPlaintext(post.excerpt),
    typeof post.content === 'object' ? JSON.stringify(post.content) : '',
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(3, Math.min(12, Math.round(words / 200) || 5))
}

/**
 * Keep CMS-curated Latest Articles cards (different service/guide/blog URLs).
 * Only enrich /blog/{slug} cards with published date + reading time.
 * Do NOT replace the gallery with the full posts list.
 */
export const enrichLatestArticlesInLayout = async (
  layout: Page['layout'] | null | undefined,
): Promise<Page['layout'] | null | undefined> => {
  if (!layout?.length) {
    return layout
  }

  const sectionsNeedingEnrich: GalleryItem[][] = []

  for (const block of layout) {
    if (!block || typeof block !== 'object' || block.blockType !== 'corespaceTemplate') {
      continue
    }

    for (const section of block.corespaceTemplateFields?.sections || []) {
      if (!isLatestArticlesSection(section)) {
        continue
      }

      const items = (section as { items?: GalleryItem[] | null }).items
      if (items?.length) {
        sectionsNeedingEnrich.push(items)
      }
    }
  }

  if (!sectionsNeedingEnrich.length) {
    return layout
  }

  const slugs = new Set<string>()
  for (const items of sectionsNeedingEnrich) {
    for (const item of items) {
      const slug = item.href ? blogSlugFromHref(item.href) : null
      if (slug) {
        slugs.add(slug)
      }
    }
  }

  const postsBySlug = new Map<string, Post>()

  if (slugs.size) {
    const payload = await getPayload({ config })
    const data = await payload.find({
      collection: 'posts',
      depth: 1,
      limit: slugs.size,
      pagination: false,
      where: {
        and: [
          { slug: { in: [...slugs] } },
          { _status: { equals: 'published' } },
        ],
      },
    })

    for (const post of data.docs) {
      if (post.slug) {
        postsBySlug.set(post.slug, post as Post)
      }
    }
  }

  return layout.map((block) => {
    if (!block || typeof block !== 'object' || block.blockType !== 'corespaceTemplate') {
      return block
    }

    const sections = block.corespaceTemplateFields?.sections
    if (!sections?.length) {
      return block
    }

    return {
      ...block,
      corespaceTemplateFields: {
        ...block.corespaceTemplateFields,
        sections: sections.map((section) => {
          if (!isLatestArticlesSection(section)) {
            return section
          }

          const items = (section as { items?: GalleryItem[] | null }).items
          if (!items?.length) {
            return section
          }

          return {
            ...section,
            items: items.map((item) => {
              const slug = item.href ? blogSlugFromHref(item.href) : null
              const post = slug ? postsBySlug.get(slug) : null
              if (!post) {
                return item
              }

              return {
                ...item,
                publishedOn: item.publishedOn || post.publishedOn || null,
                readingTime: item.readingTime || estimateReadingTime(post),
              }
            }),
          }
        }),
      },
    }
  }) as Page['layout']
}
