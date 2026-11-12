import type { Category, Media, Page, Post } from '@root/payload-types'

import { getPayload } from 'payload'
import config from '@payload-config'
import { getPostCardDescription } from '@root/utilities/getPostCardDescription'
import { getBlogPostPath } from '@root/utilities/postUrls'
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

/** Blog posts that must appear in Latest Articles even if missing from CMS cards. */
const REQUIRED_LATEST_POST_SLUGS = [
  'buying-land-in-coorg-for-house-construction',
  'commercial-building-construction-coorg',
  'designing-a-home-in-coorg',
  'house-construction-quality-checklist',
] as const

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

const mapCategory = (
  category: Category | null | string | undefined,
  title = '',
  postSlug = '',
): string => {
  const categorySlug = typeof category === 'object' && category ? category.slug || '' : ''
  const categoryName = typeof category === 'object' && category ? category.name || '' : ''
  const haystack = `${categorySlug} ${categoryName} ${title} ${postSlug}`.toLowerCase()

  if (/cost/.test(haystack)) {
    return 'cost-guide'
  }
  if (/interior/.test(haystack)) {
    return 'interiors'
  }
  if (/architect|home-design|designing a home|sloped land|layout/.test(haystack)) {
    return 'architecture'
  }
  if (/homestay|villa/.test(haystack)) {
    return 'homestay-villa'
  }
  if (/renov|buying.?land|plot|land-buying|land in coorg|residential/.test(haystack)) {
    return 'projects'
  }
  if (/construct|commercial|build|quality checklist/.test(haystack)) {
    return 'construction'
  }

  return 'projects'
}

const toGalleryItemFromPost = (post: Post): GalleryItem => {
  const slug = post.slug?.trim() || ''
  const image =
    post.featuredMedia === 'upload' && post.image && typeof post.image === 'object'
      ? post.image
      : post.thumbnail && typeof post.thumbnail === 'object'
        ? post.thumbnail
        : null

  return {
    category: mapCategory(post.category as Category | null | string | undefined, post.title || '', slug),
    description: getPostCardDescription(post) || 'Read the full planning guide.',
    href: getBlogPostPath(slug),
    id: `required-post-${String(post.id)}`,
    image,
    location: post.title || slug,
    publishedOn: post.publishedOn || null,
    readingTime: estimateReadingTime(post),
    stage: 'completed',
  }
}

/**
 * Keep CMS-curated Latest Articles cards (different service/guide URLs),
 * enrich /blog/{slug} cards with date/read time, and ensure required posts
 * like buying-land are present at the top.
 */
export const enrichLatestArticlesInLayout = async (
  layout: Page['layout'] | null | undefined,
): Promise<Page['layout'] | null | undefined> => {
  if (!layout?.length) {
    return layout
  }

  const needsTouch = layout.some((block) => {
    if (!block || typeof block !== 'object' || block.blockType !== 'corespaceTemplate') {
      return false
    }
    return Boolean(block.corespaceTemplateFields?.sections?.some(isLatestArticlesSection))
  })

  if (!needsTouch) {
    return layout
  }

  const payload = await getPayload({ config })

  const requiredPosts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: REQUIRED_LATEST_POST_SLUGS.length,
    pagination: false,
    where: {
      and: [
        { slug: { in: [...REQUIRED_LATEST_POST_SLUGS] } },
        { _status: { equals: 'published' } },
      ],
    },
  })

  const requiredBySlug = new Map<string, Post>()
  for (const post of requiredPosts.docs) {
    if (post.slug) {
      requiredBySlug.set(post.slug, post as Post)
    }
  }

  const enrichSlugs = new Set<string>()
  for (const block of layout) {
    if (!block || typeof block !== 'object' || block.blockType !== 'corespaceTemplate') {
      continue
    }
    for (const section of block.corespaceTemplateFields?.sections || []) {
      if (!isLatestArticlesSection(section)) {
        continue
      }
      for (const item of (section as { items?: GalleryItem[] | null }).items || []) {
        const slug = item.href ? blogSlugFromHref(item.href) : null
        if (slug) {
          enrichSlugs.add(slug)
        }
      }
    }
  }

  const postsBySlug = new Map<string, Post>(requiredBySlug)

  if (enrichSlugs.size) {
    const missing = [...enrichSlugs].filter((slug) => !postsBySlug.has(slug))
    if (missing.length) {
      const data = await payload.find({
        collection: 'posts',
        depth: 1,
        limit: missing.length,
        pagination: false,
        where: {
          and: [{ slug: { in: missing } }, { _status: { equals: 'published' } }],
        },
      })

      for (const post of data.docs) {
        if (post.slug) {
          postsBySlug.set(post.slug, post as Post)
        }
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

          const existing = [...((section as { items?: GalleryItem[] | null }).items || [])]
          const existingSlugs = new Set(
            existing
              .map((item) => (item.href ? blogSlugFromHref(item.href) : null))
              .filter(Boolean) as string[],
          )

          const requiredItems = REQUIRED_LATEST_POST_SLUGS.map((slug) => requiredBySlug.get(slug))
            .filter(Boolean)
            .filter((post) => post?.slug && !existingSlugs.has(post.slug))
            .map((post) => toGalleryItemFromPost(post as Post))

          const enrichedExisting = existing.map((item) => {
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
          })

          return {
            ...section,
            items: [...requiredItems, ...enrichedExisting],
          }
        }),
      },
    }
  }) as Page['layout']
}
