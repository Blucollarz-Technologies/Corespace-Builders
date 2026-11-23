import type { Category, Media, Page, Post } from '@root/payload-types'

import { getPayload } from 'payload'
import config from '@payload-config'
import { getPostCardDescription } from '@root/utilities/getPostCardDescription'
import { getBlogPostPath } from '@root/utilities/postUrls'
import { lexicalToPlaintext } from '@root/utilities/lexicalToPlaintext'
import { unstable_cache } from 'next/cache'

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
export const REQUIRED_LATEST_POST_SLUGS = [
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

const layoutHasLatestArticles = (layout: NonNullable<Page['layout']>): boolean =>
  layout.some((block) => {
    if (!block || typeof block !== 'object') {
      return false
    }

    if (isLatestArticlesSection(block)) {
      return true
    }

    if (block.blockType !== 'corespaceTemplate') {
      return false
    }

    return Boolean(block.corespaceTemplateFields?.sections?.some(isLatestArticlesSection))
  })

const replaceLatestArticleItems = (
  layout: NonNullable<Page['layout']>,
  requiredItems: GalleryItem[],
): Page['layout'] =>
  layout.map((block) => {
    if (!block || typeof block !== 'object') {
      return block
    }

    if (isLatestArticlesSection(block)) {
      return {
        ...block,
        items: requiredItems,
      }
    }

    if (block.blockType !== 'corespaceTemplate') {
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

          return {
            ...section,
            items: requiredItems,
          }
        }),
      },
    }
  }) as Page['layout']

const loadRequiredLatestArticleItems = async (): Promise<GalleryItem[]> => {
  const payload = await getPayload({ config })
  const currentDate = new Date()

  let requiredPosts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: REQUIRED_LATEST_POST_SLUGS.length,
    overrideAccess: true,
    pagination: false,
    where: {
      and: [
        { slug: { in: [...REQUIRED_LATEST_POST_SLUGS] } },
        { _status: { equals: 'published' } },
        { publishedOn: { less_than_equal: currentDate } },
      ],
    },
  })

  if (!requiredPosts.docs.length) {
    requiredPosts = await payload.find({
      collection: 'posts',
      depth: 1,
      limit: REQUIRED_LATEST_POST_SLUGS.length,
      overrideAccess: true,
      pagination: false,
      where: {
        slug: { in: [...REQUIRED_LATEST_POST_SLUGS] },
      },
    })
  }

  // Last resort: fetch each slug individually (matches how /blog/[slug] resolves).
  if (requiredPosts.docs.length < REQUIRED_LATEST_POST_SLUGS.length) {
    const found = new Map<string, Post>()
    for (const post of requiredPosts.docs) {
      if (post.slug) {
        found.set(post.slug, post as Post)
      }
    }

    for (const slug of REQUIRED_LATEST_POST_SLUGS) {
      if (found.has(slug)) {
        continue
      }

      const single = await payload.find({
        collection: 'posts',
        depth: 1,
        limit: 1,
        overrideAccess: true,
        pagination: false,
        where: { slug: { equals: slug } },
      })

      if (single.docs[0]?.slug) {
        found.set(single.docs[0].slug, single.docs[0] as Post)
      }
    }

    return REQUIRED_LATEST_POST_SLUGS.map((slug) => found.get(slug))
      .filter(Boolean)
      .map((post) => toGalleryItemFromPost(post as Post))
  }

  const requiredBySlug = new Map<string, Post>()
  for (const post of requiredPosts.docs) {
    if (post.slug) {
      requiredBySlug.set(post.slug, post as Post)
    }
  }

  return REQUIRED_LATEST_POST_SLUGS.map((slug) => requiredBySlug.get(slug))
    .filter(Boolean)
    .map((post) => toGalleryItemFromPost(post as Post))
}

/** Cache only the post cards — never the full page layout object. */
const getRequiredLatestArticleItems = unstable_cache(
  loadRequiredLatestArticleItems,
  ['required-latest-article-items-v1'],
  {
    tags: ['posts', 'page_blog', 'pages'],
  },
)

/**
 * Latest Articles on /blog shows these real blog posts only (title, image, /blog/{slug}).
 * Always applies against the current layout (do not cache the enriched layout).
 */
export const enrichLatestArticlesInLayout = async (
  layout: Page['layout'] | null | undefined,
): Promise<Page['layout'] | null | undefined> => {
  if (!layout?.length || !layoutHasLatestArticles(layout)) {
    return layout
  }

  const requiredItems = await getRequiredLatestArticleItems()
  if (!requiredItems.length) {
    return layout
  }

  return replaceLatestArticleItems(layout, requiredItems)
}
