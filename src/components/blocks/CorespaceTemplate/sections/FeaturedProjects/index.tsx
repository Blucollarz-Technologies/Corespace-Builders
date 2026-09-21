'use client'

import type { Media as MediaType } from '@root/payload-types'

import { Media } from '@components/Media/index'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import classes from './index.module.scss'

export type FeaturedProjectApproach = {
  id?: null | string
  text: string
}

export type FeaturedProject = {
  approach?: FeaturedProjectApproach[] | null
  categoryBadge: string
  challenge?: null | string
  description?: null | string
  id?: null | string
  image?: MediaType | null | string
  location: string
  outcome?: null | string
  scope?: null | string
  title: string
}

export type CorespaceFeaturedProjectsProps = {
  blockType?: 'corespaceFeaturedProjects' | 'corespaceFeaturedProjectsShowcase'
  eyebrow?: null | string
  heading?: null | string
  id?: null | string
  layout?: 'carousel' | 'showcase' | null
  projects?: FeaturedProject[] | null
}

const FeaturedProjectsCarousel: React.FC<CorespaceFeaturedProjectsProps> = ({
  heading,
  projects,
}) => {
  const trackRef = useRef<HTMLUListElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const updateNav = useCallback(() => {
    const track = trackRef.current
    if (!track) {
      setCanPrev(false)
      setCanNext(false)
      return
    }

    const maxScroll = track.scrollWidth - track.clientWidth
    setCanPrev(track.scrollLeft > 4)
    setCanNext(track.scrollLeft < maxScroll - 4)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) {
      return
    }

    updateNav()
    track.addEventListener('scroll', updateNav, { passive: true })
    window.addEventListener('resize', updateNav)

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateNav) : null
    resizeObserver?.observe(track)

    return () => {
      track.removeEventListener('scroll', updateNav)
      window.removeEventListener('resize', updateNav)
      resizeObserver?.disconnect()
    }
  }, [projects?.length, updateNav])

  const scrollByCard = useCallback((direction: -1 | 1) => {
    const track = trackRef.current
    if (!track) {
      return
    }

    const card = track.querySelector<HTMLElement>(`.${classes.carouselCard}`)
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || '0') || 20
    const amount = (card?.offsetWidth || track.clientWidth * 0.8) + gap

    track.scrollBy({
      behavior: 'smooth',
      left: direction * amount,
    })
  }, [])

  if (!projects?.length) {
    return null
  }

  const showNav = projects.length > 1

  return (
    <div className={classes.featured}>
      <div className={classes.header}>
        <div className={classes.headerCopy}>
          {heading && <h2 className={classes.heading}>{heading}</h2>}
        </div>

        {showNav && (
          <div className={classes.nav}>
            <button
              aria-label="Previous project"
              className={classes.navButton}
              disabled={!canPrev}
              onClick={() => scrollByCard(-1)}
              type="button"
            >
              <span aria-hidden>←</span>
            </button>
            <button
              aria-label="Next project"
              className={classes.navButton}
              disabled={!canNext}
              onClick={() => scrollByCard(1)}
              type="button"
            >
              <span aria-hidden>→</span>
            </button>
          </div>
        )}
      </div>

      <div className={classes.carousel}>
        <ul aria-label="Featured projects" className={classes.track} ref={trackRef}>
          {projects.map((project, index) => {
            const hasImage = Boolean(project.image && typeof project.image !== 'string')

            return (
              <li className={classes.carouselCard} key={project.id ?? `${project.title}-${index}`}>
                <div className={classes.media}>
                  {hasImage ? (
                    <Media className={classes.image} fill resource={project.image as MediaType} />
                  ) : (
                    <div aria-hidden className={classes.imagePlaceholder} />
                  )}
                  {project.categoryBadge && (
                    <span className={classes.categoryBadge}>{project.categoryBadge}</span>
                  )}
                </div>

                <div className={classes.body}>
                  <div className={classes.metaRow}>
                    <h3 className={classes.title}>{project.title}</h3>
                    <p className={classes.location}>
                      <span aria-hidden className={classes.locationPin} />
                      {project.location}
                    </p>
                  </div>

                  {project.scope && (
                    <p className={classes.scope}>
                      <span className={classes.scopeLabel}>SCOPE</span>
                      <span aria-hidden className={classes.scopeBullet}>•</span>
                      {project.scope}
                    </p>
                  )}

                  {project.description && <p className={classes.description}>{project.description}</p>}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

const ApproachCheckIcon: React.FC = () => (
  <svg
    aria-hidden
    className={classes.approachCheck}
    fill="none"
    height="14"
    viewBox="0 0 14 14"
    width="14"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.5 7.25L5.5 10.25L11.5 3.75"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
)

const formatTagLabel = (value: string) =>
  value
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())

const hasShowcaseContent = (projects?: FeaturedProject[] | null) =>
  Boolean(
    projects?.some(
      (project) =>
        Boolean(project.challenge) ||
        Boolean(project.outcome) ||
        (Array.isArray(project.approach) && project.approach.some((item) => item.text)),
    ),
  )

const FeaturedProjectsShowcase: React.FC<CorespaceFeaturedProjectsProps> = ({
  eyebrow,
  heading,
  projects,
}) => {
  if (!projects?.length) {
    return null
  }

  const displayEyebrow = eyebrow || 'PROOF OF WORK'

  return (
    <div className={classes.showcase}>
      <div className={classes.showcaseHeader}>
        <p className={classes.eyebrow}>
          <span className={classes.eyebrowDash} aria-hidden>
            —
          </span>
          {displayEyebrow}
        </p>
        {heading && <h2 className={classes.showcaseHeading}>{heading}</h2>}
      </div>

      <ul className={classes.showcaseList}>
        {projects.map((project, index) => {
          const hasImage = Boolean(project.image && typeof project.image !== 'string')
          const approachItems = project.approach?.filter((item) => Boolean(item.text)) ?? []
          const tags = [project.categoryBadge, project.location, project.scope].filter(Boolean)

          return (
            <li
              className={classes.showcaseCard}
              data-reverse={index % 2 === 1 ? 'true' : undefined}
              key={project.id ?? `${project.title}-${index}`}
            >
              <div className={classes.showcaseMedia}>
                {hasImage ? (
                  <Media className={classes.image} fill resource={project.image as MediaType} />
                ) : (
                  <div aria-hidden className={classes.imagePlaceholder} />
                )}
              </div>

              <div className={classes.showcasePanel}>
                {tags.length > 0 && (
                  <ul className={classes.tags}>
                    {tags.map((tag, tagIndex) => (
                      <li
                        className={classes.tag}
                        data-primary={tagIndex === 0 ? 'true' : undefined}
                        key={`${tag}-${tagIndex}`}
                      >
                        {formatTagLabel(tag as string)}
                      </li>
                    ))}
                  </ul>
                )}

                <h3 className={classes.showcaseTitle}>{project.title}</h3>

                {project.challenge && (
                  <div className={classes.block} data-block="challenge">
                    <p className={classes.blockLabel}>Challenge</p>
                    <p className={classes.blockText}>{project.challenge}</p>
                  </div>
                )}

                {approachItems.length > 0 && (
                  <div className={classes.block} data-block="approach">
                    <p className={classes.blockLabel}>Approach</p>
                    <ul className={classes.approachList}>
                      {approachItems.map((item, approachIndex) => (
                        <li key={item.id ?? `${item.text}-${approachIndex}`}>
                          <ApproachCheckIcon />
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.outcome && (
                  <div className={classes.block} data-block="outcome">
                    <p className={classes.blockLabel}>Outcome</p>
                    <p className={classes.blockText}>{project.outcome}</p>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export const CorespaceFeaturedProjects: React.FC<CorespaceFeaturedProjectsProps> = (props) => {
  const { layout, projects } = props
  const showcaseContent = hasShowcaseContent(projects)
  const useShowcase =
    layout === 'showcase' ||
    props.blockType === 'corespaceFeaturedProjectsShowcase' ||
    showcaseContent

  if (useShowcase) {
    return <FeaturedProjectsShowcase {...props} />
  }

  return <FeaturedProjectsCarousel {...props} />
}
