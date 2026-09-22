'use client'

import type { Media as MediaType } from '@root/payload-types'

import { Media } from '@components/Media/index'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import classes from './index.module.scss'

export type ProofOfWorkProject = {
  category: string
  id?: null | string
  image?: MediaType | null | string
  location: string
  title: string
}

export type CorespaceProofOfWorkProps = {
  blockType?: 'corespaceProofOfWork'
  eyebrow?: null | string
  heading?: null | string
  id?: null | string
  projects?: ProofOfWorkProject[] | null
}

export const CorespaceProofOfWork: React.FC<CorespaceProofOfWorkProps> = ({
  eyebrow,
  heading,
  projects,
}) => {
  const trackRef = useRef<HTMLUListElement>(null)
  const [thumbWidth, setThumbWidth] = useState(100)
  const [thumbOffset, setThumbOffset] = useState(0)

  const updateScrollProgress = useCallback(() => {
    const track = trackRef.current
    if (!track) {
      return
    }

    const maxScroll = track.scrollWidth - track.clientWidth

    if (maxScroll <= 0) {
      setThumbWidth(100)
      setThumbOffset(0)
      return
    }

    const visibleRatio = track.clientWidth / track.scrollWidth
    const width = Math.max(visibleRatio * 100, 12)
    const maxOffset = 100 - width
    const offset = (track.scrollLeft / maxScroll) * maxOffset

    setThumbWidth(width)
    setThumbOffset(offset)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) {
      return
    }

    updateScrollProgress()
    track.addEventListener('scroll', updateScrollProgress, { passive: true })
    window.addEventListener('resize', updateScrollProgress)

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateScrollProgress) : null
    resizeObserver?.observe(track)

    return () => {
      track.removeEventListener('scroll', updateScrollProgress)
      window.removeEventListener('resize', updateScrollProgress)
      resizeObserver?.disconnect()
    }
  }, [projects?.length, updateScrollProgress])

  if (!projects?.length) {
    return null
  }

  const showScrollbar = projects.length > 1

  return (
    <div className={classes.proofOfWork}>
      <div className={classes.header}>
        {eyebrow && (
          <p className={classes.eyebrow}>
            <span className={classes.eyebrowDash} aria-hidden>
              —
            </span>
            {eyebrow}
          </p>
        )}
        {heading && <h2 className={classes.heading}>{heading}</h2>}
      </div>

      <div className={classes.carousel}>
        <ul aria-label="Featured projects" className={classes.track} ref={trackRef}>
          {projects.map((project, index) => {
            const hasImage = Boolean(project.image && typeof project.image !== 'string')

            return (
              <li className={classes.card} key={project.id ?? `${project.title}-${index}`}>
                <div className={classes.media}>
                  {hasImage ? (
                    <Media className={classes.image} fill resource={project.image as MediaType} />
                  ) : (
                    <div aria-hidden className={classes.imagePlaceholder} />
                  )}
                </div>

                <div className={classes.body}>
                  {project.category && <p className={classes.category}>{project.category}</p>}
                  <h3 className={classes.title}>{project.title}</h3>
                  {project.location && <p className={classes.location}>{project.location}</p>}
                </div>
              </li>
            )
          })}
        </ul>

        {showScrollbar && (
          <div aria-hidden className={classes.scrollbar}>
            <span
              className={classes.scrollbarThumb}
              style={{
                left: `${thumbOffset}%`,
                width: `${thumbWidth}%`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
