'use client'

import type { Media as MediaType } from '@root/payload-types'

import { CostEstimateCta } from '@components/CostEstimateCta/index'
import { CMSLink } from '@components/CMSLink/index'
import { Media } from '@components/Media/index'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import classes from './index.module.scss'

type LinkGroup = {
  label?: null | string
  newTab?: boolean | null
  reference?: any
  type?: 'custom' | 'reference' | null
  url?: null | string
}

export type ChildPageCarouselItem = {
  description: string
  id?: null | string
  image?: MediaType | null | string
  link?: LinkGroup | null
  title: string
}

export type ChildPageCarouselProps = {
  ariaLabel: string
  cta?: LinkGroup | null
  heading?: null | string
  items?: ChildPageCarouselItem[] | null
  navLabel: string
}

export const ChildPageCarousel: React.FC<ChildPageCarouselProps> = ({
  ariaLabel,
  cta,
  heading,
  items,
  navLabel,
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
  }, [items?.length, updateNav])

  const scrollByCard = useCallback((direction: -1 | 1) => {
    const track = trackRef.current
    if (!track) {
      return
    }

    const card = track.querySelector<HTMLElement>(`.${classes.card}`)
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || '0') || 20
    const amount = (card?.offsetWidth || track.clientWidth * 0.8) + gap

    track.scrollBy({
      behavior: 'smooth',
      left: direction * amount,
    })
  }, [])

  if (!items?.length && !heading) {
    return null
  }

  const showCta = Boolean(cta?.label)
  const showNav = Boolean(items && items.length > 1)

  return (
    <div className={classes.section}>
      <div className={classes.header}>
        <div className={classes.headerCopy}>
          {heading && <h2 className={classes.heading}>{heading}</h2>}
        </div>

        <div className={classes.headerActions}>
          {showCta && <CostEstimateCta className={classes.headerCta} link={cta} />}
          {showNav && (
            <div className={classes.nav}>
              <button
                aria-label={`Previous ${navLabel}`}
                className={classes.navButton}
                disabled={!canPrev}
                onClick={() => scrollByCard(-1)}
                type="button"
              >
                <span aria-hidden>←</span>
              </button>
              <button
                aria-label={`Next ${navLabel}`}
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
      </div>

      {items?.length ? (
        <div className={classes.carousel}>
          <ul aria-label={ariaLabel} className={classes.track} ref={trackRef}>
            {items.map((item, index) => {
              const hasImage = Boolean(item.image && typeof item.image !== 'string')
              const number = String(index + 1).padStart(2, '0')
              const showLink = Boolean(item.link?.label || item.link?.url || item.link?.reference)

              return (
                <li className={classes.card} key={item.id ?? `${item.title}-${index}`}>
                  <div className={classes.media}>
                    {hasImage ? (
                      <Media className={classes.image} fill resource={item.image as MediaType} />
                    ) : (
                      <div aria-hidden className={classes.imagePlaceholder} />
                    )}
                    <span aria-hidden className={classes.badge}>
                      {number}
                    </span>
                  </div>

                  <div className={classes.body}>
                    <h3 className={classes.title}>{item.title}</h3>
                    <p className={classes.description}>{item.description}</p>
                    {showLink && (
                      <CMSLink
                        {...item.link}
                        className={classes.learnMore}
                        label={item.link?.label || 'Learn more'}
                      />
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
