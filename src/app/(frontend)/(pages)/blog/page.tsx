import { Archive } from '@components/Archive'
import { fetchArchive } from '@data'
import { getBlogListingPath } from '@root/utilities/postUrls'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'

const CATEGORY = 'blog'

export default async () => {
  const { isEnabled: draft } = await draftMode()
  const archive = draft
    ? await fetchArchive(CATEGORY, draft)
    : await unstable_cache(fetchArchive, [`${CATEGORY}-archive`])(CATEGORY, draft)

  const posts = archive?.posts?.docs

  if (!archive || !posts) {
    notFound()
  }

  return <Archive category={CATEGORY} />
}

export const generateMetadata = async () => {
  const archive = await fetchArchive(CATEGORY)

  if (!archive) {
    return null
  }

  const { name, description } = archive

  return {
    alternates: {
      canonical: getBlogListingPath(),
    },
    description,
    title: name || 'Blog',
  }
}
