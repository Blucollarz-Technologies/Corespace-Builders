'use client'

import type { Media as MediaType } from '@root/payload-types'

import { Media } from '@components/Media/index'
import React from 'react'

import classes from './index.module.scss'

export type OwnerTag = {
  id?: null | string
  label: string
}

export type CorespaceOwnersProps = {
  blockType?: 'corespaceOwners'
  bottomDescription?: null | string
  bottomTags?: OwnerTag[] | null
  eyebrow?: null | string
  heading?: null | string
  id?: null | string
  image?: MediaType | null | string
  topDescription?: null | string
  topTags?: OwnerTag[] | null
}

export const CorespaceOwners: React.FC<CorespaceOwnersProps> = ({
  bottomDescription,
  bottomTags,
  eyebrow,
  heading,
  image,
  topDescription,
  topTags,
}) => {
  const topTagItems = topTags?.filter((item) => Boolean(item.label)) ?? []
  const bottomTagItems = bottomTags?.filter((item) => Boolean(item.label)) ?? []

  if (!heading) {
    return null
  }

  return (
    <div className={classes.owners}>
      <div className={classes.copy}>
        {eyebrow && (
          <p className={classes.eyebrow}>
            <span className={classes.eyebrowDash} aria-hidden>
              —
            </span>
            {eyebrow}
          </p>
        )}

        <h2 className={classes.heading}>{heading}</h2>

        {topDescription && <p className={classes.description}>{topDescription}</p>}

        {topTagItems.length > 0 && (
          <ul className={classes.pills}>
            {topTagItems.map((tag, index) => (
              <li className={classes.pill} key={tag.id ?? `${tag.label}-${index}`}>
                {tag.label}
              </li>
            ))}
          </ul>
        )}

        {bottomDescription && <p className={classes.description}>{bottomDescription}</p>}

        {bottomTagItems.length > 0 && (
          <ul className={classes.pills}>
            {bottomTagItems.map((tag, index) => (
              <li className={classes.pill} key={tag.id ?? `${tag.label}-${index}`}>
                {tag.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={classes.media}>
        {image && typeof image !== 'string' && (
          <div className={classes.imageFrame}>
            <Media className={classes.image} resource={image} />
          </div>
        )}
      </div>
    </div>
  )
}
