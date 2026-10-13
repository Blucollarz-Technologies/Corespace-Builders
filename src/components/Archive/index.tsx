import type { Category, Post } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BackgroundScanline } from '@components/BackgroundScanline'
import { BlockWrapper } from '@components/BlockWrapper'
import { ContentMediaCard } from '@components/cards/ContentMediaCard'
import { FeaturedBlogPost } from '@components/FeaturedBlogPost'
import { Gutter } from '@components/Gutter'
import { fetchArchive, fetchArchives } from '@data'
import { getBlogListingPath, getBlogPostPath } from '@root/utilities/postUrls'
import { getPostCardDescription } from '@root/utilities/getPostCardDescription'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import Link from 'next/link'

import classes from './index.module.scss'
import { MobileNav } from './MobileNav'

const categoryHref = (slug: string) => (slug === 'blog' ? getBlogListingPath() : `/posts/${slug}`)

const isPost = (post: string | Post): post is Post => typeof post !== 'string'

const Navigation = ({
  archives,
  category,
  className,
}: {
  archives: Partial<Category>[]
  category: Category['slug']
  className?: string
}) => {
  // Hide tabs when only one real category exists (avoids a redundant single filter)
  if (archives.length <= 1) {
    return null
  }

  return (
    <nav className={className}>
      {archives.map(({ name, slug }) => {
        if (!slug) {
          return null
        }

        return (
          <Link
            className={[classes.tab, slug == category ? classes.active : '']
              .filter(Boolean)
              .join(' ')}
            href={categoryHref(slug)}
            key={slug}
          >
            {name}
          </Link>
        )
      })}
    </nav>
  )
}

const resolveThumbnail = (post: Post, category: string) => {
  if (post.featuredMedia === 'upload') {
    return post.image
  }

  if (post.dynamicThumbnail) {
    return `/api/og?type=${category}&title=${post.title}`
  }

  return post.thumbnail
}

export const Archive: React.FC<{ category: Category['slug'] }> = async ({ category }) => {
  const { isEnabled: draft } = await draftMode()
  const getArchive = draft ? fetchArchive : unstable_cache(fetchArchive, [`${category}-archive`])
  const getArchives = draft
    ? fetchArchives
    : unstable_cache(fetchArchives, [`archives`], {
        tags: ['archives'],
      })

  const archive = await getArchive(category)
  const archives = await getArchives()

  const { description, headline } = archive
  const posts = (archive.posts?.docs || []).filter(isPost)

  const featuredFromCms =
    archive.featuredPost && isPost(archive.featuredPost) ? archive.featuredPost : null
  const featuredPost = featuredFromCms ?? posts[0] ?? null
  const featuredId = featuredPost?.id

  // Latest = published posts by date, excluding the featured pick (no duplicate card)
  const latestPosts = posts.filter((post) => post.id !== featuredId)

  return (
    <>
      <div className={classes.navigation}>
        <span className={classes.breadcrumbsLabel}>Blog</span>
        {archives.length > 1 && (
          <>
            <MobileNav className={classes.mobileNav} currentCategory={archive.name ?? ''}>
              <Navigation archives={archives} category={category} />
            </MobileNav>
            <Navigation archives={archives} category={category} className={classes.desktopNav} />
          </>
        )}
      </div>
      <BlockWrapper padding={{ bottom: 'large', top: 'small' }} settings={{}}>
        <BackgroundGrid zIndex={-1} />
        <Gutter>
          <div className={[classes.hero].filter(Boolean).join(' ')}>
            <div className={[classes.heroContent, 'grid'].filter(Boolean).join(' ')}>
              <h1 className={[classes.title, 'cols-8 cols-m-8'].filter(Boolean).join(' ')}>
                {headline}
              </h1>
              <p
                className={[classes.description, 'cols-4 start-13 start-m-1 cols-m-8']
                  .filter(Boolean)
                  .join(' ')}
              >
                {description}
              </p>
            </div>
          </div>
          {featuredPost && <FeaturedBlogPost {...featuredPost} category={category} />}
          {latestPosts.length > 0 ? (
            <div className={[classes.cardGrid, 'grid'].filter(Boolean).join(' ')}>
              {latestPosts.map((post) => {
                const thumbnailAsset = resolveThumbnail(post, category)
                const cardDescription = getPostCardDescription(post)

                return (
                  <div className={['cols-8 cols-m-8'].filter(Boolean).join(' ')} key={post.id}>
                    <ContentMediaCard
                      authors={post.authors}
                      description={cardDescription || null}
                      href={getBlogPostPath(post.slug || '')}
                      media={thumbnailAsset ?? ''}
                      publishedOn={post.publishedOn}
                      title={post.title}
                    />
                  </div>
                )
              })}
            </div>
          ) : (
            !featuredPost && (
              <div className={classes.noPosts}>
                <h5>No posts to show.</h5>
                <BackgroundScanline />
              </div>
            )
          )}
        </Gutter>
      </BlockWrapper>
    </>
  )
}
