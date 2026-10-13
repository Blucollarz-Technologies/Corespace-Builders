import type { Post as PostType } from '@root/payload-types'

import { BlockWrapper } from '@components/BlockWrapper/index'
import { Breadcrumbs } from '@components/Breadcrumbs/index'
import { Gutter } from '@components/Gutter/index'
import { Media } from '@components/Media/index'
import { RenderBlocks } from '@components/RenderBlocks/index'
import { RichText } from '@components/RichText/index'
import { Video } from '@components/RichText/Video/index'
import { getVideo } from '@root/utilities/get-video'
import { formatDate } from '@utilities/format-date-time'
import React from 'react'

import classes from './index.module.scss'

function getAuthorLabel(props: Partial<PostType>): string {
  if (props.authorType === 'guest' && props.guestAuthor) {
    return props.guestAuthor
  }

  const authors = props.authors
  if (!authors?.length) {
    return 'Corespace Builders Team'
  }

  const names = authors
    .map((author) => {
      if (!author || typeof author === 'string') {
        return null
      }

      const name = [author.firstName, author.lastName].filter(Boolean).join(' ')
      return name || null
    })
    .filter(Boolean)

  return names.length > 0 ? names.join(', ') : 'Corespace Builders Team'
}

function estimateReadTime(props: Partial<PostType>): number {
  const text = JSON.stringify({
    content: props.content,
    excerpt: props.excerpt,
    title: props.title,
  })

  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function getLexicalPlainText(node: unknown): string {
  if (node == null) {
    return ''
  }

  if (typeof node === 'string') {
    return node
  }

  if (Array.isArray(node)) {
    return node.map(getLexicalPlainText).join('')
  }

  if (typeof node !== 'object') {
    return ''
  }

  const value = node as Record<string, unknown>

  if (typeof value.text === 'string') {
    return value.text
  }

  if (value.root) {
    return getLexicalPlainText(value.root)
  }

  if (Array.isArray(value.children)) {
    return value.children.map(getLexicalPlainText).join('')
  }

  return ''
}

/** Skip empty / placeholder excerpts (e.g. lone ".") that leave a large header gap. */
function hasMeaningfulExcerpt(excerpt: PostType['excerpt'] | null | undefined): boolean {
  if (!excerpt) {
    return false
  }

  const text = getLexicalPlainText(excerpt).replace(/\s+/g, ' ').trim()

  // Ignore empty / punctuation-only CMS leftovers (e.g. ".")
  if (!text || text.length < 8 || /^[\s.·•\-–—*…]+$/.test(text)) {
    return false
  }

  return true
}

export const Post: React.FC<Partial<PostType>> = (props) => {
  const {
    category,
    content,
    excerpt,
    featuredMedia,
    image,
    publishedOn,
    relatedPosts,
    title,
    updatedAt,
    videoUrl,
  } = props

  const categoryName = typeof category !== 'string' ? category?.name : 'Blog'
  const categorySlug = typeof category !== 'string' ? category?.slug : 'blog'
  const authorLabel = getAuthorLabel(props)
  const readMinutes = estimateReadTime(props)

  const publishedLabel = publishedOn
    ? formatDate({ date: publishedOn, format: 'shortDateStamp' })
    : null

  const updatedLabel = updatedAt
    ? formatDate({ date: updatedAt, format: 'shortDateStamp' })
    : publishedLabel

  const heroMedia =
    featuredMedia === 'upload'
      ? image && typeof image !== 'string' && (
          <Media className={classes.heroImage} priority resource={image} />
        )
      : videoUrl && <Video {...getVideo(videoUrl)} />

  return (
    <BlockWrapper
      className={classes.post}
      padding={{ bottom: 'small', top: 'hero' }}
      settings={{ background: 'transparent', theme: 'light' }}
      style={{ background: 'var(--brand-ivory, #f8f4ec)' }}
    >
      <Gutter className={classes.gutter}>
        <article className={classes.stack} id="blog">
          <header className={classes.header}>
            <Breadcrumbs
              className={classes.breadcrumbs}
              ellipsis={false}
              items={[
                { label: 'Home', url: '/' },
                { label: categoryName || 'Blog', url: '/blog' },
                { label: title },
              ]}
            />

            {categoryName && <span className={classes.categoryBadge}>{categoryName}</span>}

            {title && <h1 className={classes.title}>{title}</h1>}

            {/* Skip placeholder excerpts (CMS often stores ".") — keeps title → meta tight */}
            {hasMeaningfulExcerpt(excerpt) ? (
              <RichText className={classes.excerpt} content={excerpt!} />
            ) : null}

            <div className={classes.meta}>
              <div className={classes.metaItem}>
                <span aria-hidden className={classes.metaIcon}>
                  ✏️
                </span>
                <div className={classes.metaText}>
                  <span className={classes.metaValue}>{authorLabel}</span>
                  <span className={classes.metaLabel}>Author</span>
                </div>
              </div>

              {publishedLabel && (
                <div className={classes.metaItem}>
                  <span aria-hidden className={classes.metaIcon}>
                    📅
                  </span>
                  <div className={classes.metaText}>
                    <span className={classes.metaValue}>Published {publishedLabel}</span>
                    <span className={classes.metaLabel}>Published</span>
                  </div>
                </div>
              )}

              {updatedLabel && (
                <div className={classes.metaItem}>
                  <span aria-hidden className={classes.metaIcon}>
                    🔄
                  </span>
                  <div className={classes.metaText}>
                    <span className={classes.metaValue}>Updated {updatedLabel}</span>
                    <span className={classes.metaLabel}>Updated</span>
                  </div>
                </div>
              )}

              <div className={classes.metaItem}>
                <span aria-hidden className={classes.metaIcon}>
                  ⏱️
                </span>
                <div className={classes.metaText}>
                  <span className={classes.metaValue}>{readMinutes} min read</span>
                  <span className={classes.metaLabel}>Read time</span>
                </div>
              </div>
            </div>
          </header>

          {heroMedia && <div className={classes.heroImageWrap}>{heroMedia}</div>}

          <div className={classes.blocks}>
            <RenderBlocks
              blocks={[
                ...(content || []),
                {
                  blockName: 'Related Posts',
                  blockType: 'relatedPosts',
                  relatedPosts: relatedPosts || [],
                },
              ]}
              disableGrid
              disableGutter
            />
          </div>
        </article>
      </Gutter>
    </BlockWrapper>
  )
}
