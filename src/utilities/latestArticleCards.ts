import type { Category, Media, Page, Post } from '@root/payload-types'

import { getPayload } from 'payload'
import config from '@payload-config'
import { getPostCardDescription } from '@root/utilities/getPostCardDescription'
import { getBlogPostPath } from '@root/utilities/postUrls'
import { lexicalToPlaintext } from '@root/utilities/lexicalToPlaintext'

export type ArticleGalleryCategory =
  | 'architecture'
  | 'construction'
  | 'cost-guide'
  | 'homestay-villa'
  | 'interiors'
  | 'projects'

export type LatestArticleGalleryItem = {
  category: ArticleGalleryCategory
  description: string
  href: string
  id: string
  image?: Media | null | string
  location: string
  publishedOn?: null | string
  readingTime?: null | number
  stage: 'completed'
}

const mapCategory = (
  category: Category | null | string | undefined,
  title = '',
  postSlug = '',
): ArticleGalleryCategory => {
  const categorySlug = typeof category === 'object' && category ? category.slug || '' : ''
  const categoryName = typeof category === 'object' && category ? category.name || '' : ''
  // Most Corespace posts live under the generic "blog" category, so also use title/slug.
  const haystack = `${categorySlug} ${categoryName} ${title} ${postSlug}`.toLowerCase()

  // Most-specific matches first.
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
  if (/renov|buying.?land|plot|land-buying|land in coorg/.test(haystack)) {
    return 'projects'
  }
  if (/construct|commercial|build|quality checklist/.test(haystack)) {
    return 'construction'
  }

  if (categorySlug && categorySlug !== 'blog') {
    if (categorySlug.includes('architect')) {
      return 'architecture'
    }
    if (categorySlug.includes('interior')) {
      return 'interiors'
    }
    if (categorySlug.includes('cost')) {
      return 'cost-guide'
    }
  }

  return 'construction'
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

export const fetchLatestArticleGalleryItems = async (
  limit = 12,
): Promise<LatestArticleGalleryItem[]> => {
  const payload = await getPayload({ config })
  const currentDate = new Date()

  const data = await payload.find({
    collection: 'posts',
    depth: 1,
    limit,
    sort: '-publishedOn',
    where: {
      and: [
        { publishedOn: { less_than_equal: currentDate } },
        { _status: { equals: 'published' } },
      ],
    },
  })

  return data.docs
    .map((post) => {
      const slug = post.slug?.trim()
      if (!slug) {
        return null
      }

      const image =
        post.featuredMedia === 'upload' && post.image && typeof post.image === 'object'
          ? post.image
          : post.thumbnail && typeof post.thumbnail === 'object'
            ? post.thumbnail
            : null

      return {
        category: mapCategory(
          post.category as Category | null | string | undefined,
          post.title || '',
          slug,
        ),
        description: getPostCardDescription(post) || 'Read the full planning guide.',
        href: getBlogPostPath(slug),
        id: String(post.id),
        image,
        location: post.title || 'Untitled article',
        publishedOn: post.publishedOn || null,
        readingTime: estimateReadingTime(post),
        stage: 'completed' as const,
      }
    })
    .filter(Boolean) as LatestArticleGalleryItem[]
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

/** Replace Latest Articles gallery rows with live published posts (clickable /blog/{slug}). */
export const injectLatestArticlesIntoLayout = async (
  layout: Page['layout'] | null | undefined,
): Promise<Page['layout'] | null | undefined> => {
  if (!layout?.length) {
    return layout
  }

  const needsInject = layout.some((block) => {
    if (!block || typeof block !== 'object' || block.blockType !== 'corespaceTemplate') {
      return false
    }
    return Boolean(block.corespaceTemplateFields?.sections?.some(isLatestArticlesSection))
  })

  if (!needsInject) {
    return layout
  }

  const articles = await fetchLatestArticleGalleryItems(12)
  if (!articles.length) {
    return layout
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

          return {
            ...section,
            items: articles,
          }
        }),
      },
    }
  }) as Page['layout']
}
