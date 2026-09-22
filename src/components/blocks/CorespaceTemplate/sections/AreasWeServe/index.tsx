'use client'

import type { Media as MediaType } from '@root/payload-types'

import { Media } from '@components/Media/index'
import React from 'react'

import { AreasWeServeMapVisual } from './MapVisual'
import classes from './index.module.scss'

export type ServiceArea = {
  id?: null | string
  subtitle: string
  title: string
}

export type CorespaceAreasWeServeProps = {
  areas?: ServiceArea[] | null
  blockType?: 'corespaceAreasWeServe'
  eyebrow?: null | string
  heading?: null | string
  id?: null | string
  mapImage?: MediaType | null | string
}

const PinIcon: React.FC = () => (
  <svg aria-hidden className={classes.pinIcon} fill="none" viewBox="0 0 24 24">
    <path
      d="M12 21s7-4.6 7-10a7 7 0 1 0-14 0c0 5.4 7 10 7 10Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
    <circle cx="12" cy="11" fill="currentColor" r="2.2" />
  </svg>
)

export const CorespaceAreasWeServe: React.FC<CorespaceAreasWeServeProps> = ({
  areas,
  eyebrow,
  heading,
  mapImage,
}) => {
  const hasAreas = Array.isArray(areas) && areas.length > 0
  const hasMapImage = Boolean(mapImage && typeof mapImage !== 'string')

  if (!heading && !hasAreas) {
    return null
  }

  return (
    <div className={classes.areasWeServe}>
      <div className={classes.header}>
        {eyebrow && (
          <p className={classes.eyebrow}>
            <span className={classes.eyebrowDash} aria-hidden>
              —
            </span>
            {eyebrow}
            <span className={classes.eyebrowDash} aria-hidden>
              —
            </span>
          </p>
        )}
        {heading && <h2 className={classes.heading}>{heading}</h2>}
      </div>

      <div className={classes.mapFrame}>
        {hasMapImage ? (
          <Media className={classes.mapImage} fill resource={mapImage as MediaType} />
        ) : (
          <AreasWeServeMapVisual />
        )}
      </div>

      {hasAreas && (
        <ul className={classes.grid}>
          {areas!.map((area, index) => (
            <li className={classes.card} key={area.id ?? `${area.title}-${index}`}>
              <div className={classes.iconWrap}>
                <PinIcon />
              </div>
              <h3 className={classes.cardTitle}>{area.title}</h3>
              <p className={classes.cardSubtitle}>{area.subtitle}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
