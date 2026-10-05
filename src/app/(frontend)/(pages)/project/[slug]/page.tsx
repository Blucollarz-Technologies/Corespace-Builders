import type { Media } from '@root/payload-types'
import type { Metadata } from 'next'

import { Hero } from '@components/Hero/index'
import { PayloadRedirects } from '@components/PayloadRedirects'
import { RefreshRouteOnSave } from '@components/RefreshRouterOnSave'
import { RenderBlocks } from '@components/RenderBlocks/index'
import {
  fetchProjectPage,
  fetchProjectPages,
  fetchServicePages,
} from '@data'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import {
  injectProjectCardsIntoLayout,
  layoutNeedsProjectCards,
  mapPageToProjectCard,
} from '@root/utilities/projectCards'
import {
  injectServiceCardsIntoLayout,
  layoutNeedsServiceCards,
  mapPageToServiceCard,
} from '@root/utilities/serviceCards'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import React from 'react'

const getProjectPage = async (slug: string, draft?: boolean) => {
  if (draft) {
    return fetchProjectPage(slug)
  }

  return unstable_cache(fetchProjectPage, [`project-page-${slug}`], {
    tags: [`project_${slug}`, 'project_pages', 'pages'],
  })(slug)
}

const getServiceCards = async (draft?: boolean) => {
  if (draft) {
    const pages = await fetchServicePages()
    return pages.map(mapPageToServiceCard)
  }

  return unstable_cache(
    async () => {
      const pages = await fetchServicePages()
      return pages.map(mapPageToServiceCard)
    },
    ['service-cards-v3'],
    {
      tags: ['service_pages', 'pages'],
    },
  )()
}

const getProjectCards = async (draft?: boolean) => {
  if (draft) {
    const pages = await fetchProjectPages()
    return pages.map(mapPageToProjectCard)
  }

  return unstable_cache(
    async () => {
      const pages = await fetchProjectPages()
      return pages.map(mapPageToProjectCard)
    },
    ['project-cards-v1'],
    {
      tags: ['project_pages', 'pages'],
    },
  )()
}

const enrichLayout = async (layout, draft?: boolean) => {
  let nextLayout = layout

  if (layoutNeedsServiceCards(nextLayout)) {
    nextLayout = injectServiceCardsIntoLayout(nextLayout, await getServiceCards(draft))
  }

  if (layoutNeedsProjectCards(nextLayout)) {
    nextLayout = injectProjectCardsIntoLayout(nextLayout, await getProjectCards(draft))
  }

  return nextLayout
}

const ProjectPage = async ({
  params,
}: {
  params: Promise<{
    slug: string
  }>
}) => {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params
  const url = `/project/${slug}`

  const page = await getProjectPage(slug, draft)

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const layout = await enrichLayout(page.layout, draft)

  return (
    <React.Fragment>
      <PayloadRedirects disableNotFound url={url} />
      <RefreshRouteOnSave />
      <Hero firstContentBlock={layout[0]} page={page} />
      <RenderBlocks blocks={layout} hero={page.hero} />
    </React.Fragment>
  )
}

export default ProjectPage

export async function generateStaticParams() {
  const getPages = unstable_cache(fetchProjectPages, ['project-pages-static'], {
    tags: ['project_pages', 'pages'],
  })
  const pages = await getPages()

  return pages.map(({ slug }) => ({
    slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string
  }>
}): Promise<Metadata> {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const page = await getProjectPage(slug, draft)

  let ogImage: Media | null = null

  if (page && page.meta?.image && typeof page.meta.image !== 'string') {
    ogImage = page.meta.image
  }

  const noIndexMeta = page?.noindex ? { robots: 'noindex' } : {}
  const canonicalPath = `/project/${slug}`

  return {
    alternates: {
      canonical: canonicalPath,
    },
    description: page?.meta?.description,
    openGraph: mergeOpenGraph({
      description: page?.meta?.description ?? undefined,
      images: ogImage
        ? [
            {
              url: ogImage.url as string,
            },
          ]
        : undefined,
      title: page?.meta?.title || page?.title || 'Project',
      url: canonicalPath,
    }),
    title: page?.meta?.title || page?.title || 'Project',
    ...noIndexMeta,
  }
}
