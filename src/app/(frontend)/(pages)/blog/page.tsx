import type { Media } from '@root/payload-types'
import type { Metadata } from 'next'

import { Hero } from '@components/Hero/index'
import { PayloadRedirects } from '@components/PayloadRedirects'
import { RefreshRouteOnSave } from '@components/RefreshRouterOnSave'
import { RenderBlocks } from '@components/RenderBlocks/index'
import { fetchPage } from '@data'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { injectLatestArticlesIntoLayout } from '@root/utilities/latestArticleCards'
import { getBlogListingPath } from '@root/utilities/postUrls'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'

const SLUG = ['blog'] as string[]

const getPage = async (draft?: boolean) => {
  if (draft || process.env.NODE_ENV === 'development') {
    return fetchPage(SLUG)
  }

  return unstable_cache(fetchPage, ['page-blog-v4'], {
    tags: ['page_blog', 'pages', 'posts'],
  })(SLUG)
}

const getLatestArticlesLayout = async (layout: NonNullable<Awaited<ReturnType<typeof getPage>>>['layout'], draft?: boolean) => {
  if (draft || process.env.NODE_ENV === 'development') {
    return injectLatestArticlesIntoLayout(layout)
  }

  return unstable_cache(injectLatestArticlesIntoLayout, ['blog-latest-articles-v1'], {
    tags: ['page_blog', 'pages', 'posts'],
  })(layout)
}

export default async () => {
  const { isEnabled: draft } = await draftMode()
  const page = await getPage(draft)

  if (!page) {
    notFound()
  }

  const layout = (await getLatestArticlesLayout(page.layout, draft)) || page.layout

  return (
    <React.Fragment>
      <PayloadRedirects disableNotFound url={getBlogListingPath()} />
      <RefreshRouteOnSave />
      <Hero firstContentBlock={layout?.[0]} page={page} />
      <RenderBlocks blocks={layout} hero={page.hero} />
    </React.Fragment>
  )
}

export const generateMetadata = async (): Promise<Metadata> => {
  const page = await getPage()

  if (!page) {
    return {
      title: 'Blog',
    }
  }

  let ogImage: Media | null = null
  if (page.meta?.image && typeof page.meta.image !== 'string') {
    ogImage = page.meta.image
  }

  const canonicalPath = getBlogListingPath()

  return {
    alternates: {
      canonical: canonicalPath,
    },
    description: page.meta?.description,
    openGraph: mergeOpenGraph({
      description: page.meta?.description ?? undefined,
      images: ogImage ? [{ url: ogImage.url as string }] : undefined,
      title: page.meta?.title || page.title || 'Blog',
      url: canonicalPath,
    }),
    title: page.meta?.title || page.title || 'Blog',
  }
}
