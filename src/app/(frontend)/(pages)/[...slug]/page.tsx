import type { Media } from '@root/payload-types'
import type { Metadata } from 'next'

import { Hero } from '@components/Hero/index'
import { PayloadRedirects } from '@components/PayloadRedirects'
import { RefreshRouteOnSave } from '@components/RefreshRouterOnSave'
import { RenderBlocks } from '@components/RenderBlocks/index'
import {
  fetchPage,
  fetchPages,
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
import { resolveCorespaceUrl } from '@root/utilities/resolveCorespaceUrl'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

const pageCacheKey = (slug: string | string[]) => {
  const segments = Array.isArray(slug) ? slug : slug ? [slug] : ['home']
  return segments.join('/') || 'home'
}

const getPage = async (slug, draft?) => {
  if (draft) {
    return fetchPage(slug)
  }

  const key = pageCacheKey(slug)
  return unstable_cache(fetchPage, [`page-${key}`], {
    tags: [`page_${key}`, 'pages'],
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
    const cards = await getServiceCards(draft)
    nextLayout = injectServiceCardsIntoLayout(nextLayout, cards)
  }

  if (layoutNeedsProjectCards(nextLayout)) {
    const cards = await getProjectCards(draft)
    nextLayout = injectProjectCardsIntoLayout(nextLayout, cards)
  }

  return nextLayout
}

const Page = async ({
  params,
}: {
  params: Promise<{
    slug: any
  }>
}) => {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params
  const url = '/' + (Array.isArray(slug) ? slug.join('/') : slug)
  const canonicalUrl = resolveCorespaceUrl(url) || url

  // Legacy / duplicate paths → single public canonical
  if (canonicalUrl !== url) {
    redirect(canonicalUrl)
  }

  const page = await getPage(slug, draft)

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const layout = await enrichLayout(page.layout, draft)

  return (
    <React.Fragment>
      <PayloadRedirects disableNotFound url={canonicalUrl} />
      <RefreshRouteOnSave />
      <Hero firstContentBlock={layout[0]} page={page} />
      <RenderBlocks blocks={layout} hero={page.hero} />
    </React.Fragment>
  )
}

export default Page

export async function generateStaticParams() {
  const getPages = unstable_cache(fetchPages, ['pages'])
  const pages = await getPages()

  return pages
    .map(({ breadcrumbs }) => {
      const raw = breadcrumbs?.[breadcrumbs.length - 1]?.url || ''
      // Service / project children use dedicated /service/* and /project/* routes
      if (raw.startsWith('/services/') || raw.startsWith('/projects/')) {
        return null
      }
      const canonical = resolveCorespaceUrl(raw) || raw
      // Homepage is served at `/` via (pages)/page.tsx — do not emit /home
      if (!canonical || canonical === '/') {
        return null
      }
      return {
        slug: canonical.replace(/^\/|\/$/g, '').split('/'),
      }
    })
    .filter(Boolean)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: any
  }>
}): Promise<Metadata> {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const page = await getPage(slug, draft)

  let ogImage: Media | null = null

  if (page && page.meta?.image && typeof page.meta.image !== 'string') {
    ogImage = page.meta.image
  }

  const noIndexMeta = page?.noindex ? { robots: 'noindex' } : {}
  const rawPath = Array.isArray(slug) && slug.length ? `/${slug.join('/')}` : '/'
  const canonicalPath = resolveCorespaceUrl(rawPath) || rawPath

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
      title: page?.meta?.title || page?.title || 'Corespace Builders',
      url: canonicalPath,
    }),
    title: page?.meta?.title || page?.title || 'Corespace Builders',
    ...noIndexMeta,
  }
}
