import type { Metadata } from 'next'

import { PayloadRedirects } from '@components/PayloadRedirects/index'
import { Post } from '@components/Post/index'
import { RefreshRouteOnSave } from '@components/RefreshRouterOnSave/index'
import { fetchBlogPost, fetchPosts } from '@data'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { getBlogPostPath } from '@root/utilities/postUrls'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import React from 'react'

const getPost = async (slug: string, draft?: boolean) => {
  if (draft) {
    return fetchBlogPost(slug)
  }

  return unstable_cache(() => fetchBlogPost(slug), ['blogPost', slug], {
    tags: [`post_${slug}`, 'posts'],
  })()
}

const BlogPostPage = async ({
  params,
}: {
  params: Promise<{
    slug: string
  }>
}) => {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params
  const url = getBlogPostPath(slug)

  const blogPost = await getPost(slug, draft)

  if (!blogPost) {
    return <PayloadRedirects url={url} />
  }

  return (
    <>
      <PayloadRedirects disableNotFound url={url} />
      <RefreshRouteOnSave />
      <Post {...blogPost} />
    </>
  )
}

export default BlogPostPage

export async function generateStaticParams() {
  const getPosts = unstable_cache(fetchPosts, ['allPosts'])
  const posts = await getPosts()

  return posts
    .map(({ slug }) => {
      if (!slug) {
        return null
      }

      return { slug }
    })
    .filter(Boolean)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string
  }>
}): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params
  const post = await getPost(slug, draft)
  const canonicalPath = getBlogPostPath(slug)

  let ogImage: null | string = null

  if (post) {
    if (post?.meta?.image && typeof post.meta.image !== 'string' && post.meta.image?.url) {
      ogImage = post.meta.image.url
    } else if (
      post.featuredMedia === 'upload' &&
      post.image &&
      typeof post.image !== 'string' &&
      post.image?.url
    ) {
      ogImage = post.image.url
    } else if (post.featuredMedia === 'videoUrl' && post.videoUrl) {
      ogImage = `${process.env.NEXT_PUBLIC_SITE_URL}/api/og?type=blog&title=${post.title}`
    }
  }

  return {
    alternates: {
      canonical: canonicalPath,
    },
    description: post?.meta?.description,
    openGraph: mergeOpenGraph({
      description: post?.meta?.description ?? undefined,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title: post?.meta?.title ?? undefined,
      url: canonicalPath,
    }),
    title: post?.meta?.title ?? post?.title ?? undefined,
  }
}
