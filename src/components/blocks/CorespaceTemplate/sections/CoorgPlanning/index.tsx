'use client'

import React from 'react'

import classes from './index.module.scss'

export type CorespaceCoorgPlanningProps = {
  blockType?: 'corespaceCoorgPlanning'
  closing?: null | string
  eyebrow?: null | string
  heading?: null | string
  id?: null | string
  subheading?: null | string
  tags?: { id?: null | string; label: string }[] | null
}

export const CorespaceCoorgPlanning: React.FC<CorespaceCoorgPlanningProps> = ({
  closing,
  eyebrow,
  heading,
  subheading,
  tags,
}) => {
  const hasTags = Array.isArray(tags) && tags.length > 0

  if (!heading) {
    return null
  }

  return (
    <div className={classes.coorgPlanning}>
      <div className={classes.banner}>
        {eyebrow && (
          <p className={classes.eyebrow}>
            <span className={classes.eyebrowDash} aria-hidden>
              —
            </span>
            {eyebrow}
          </p>
        )}

        <h2 className={classes.heading}>{heading}</h2>
        {subheading && <p className={classes.subheading}>{subheading}</p>}

        {hasTags && (
          <ul className={classes.tags}>
            {tags!.map((tag, index) => (
              <li className={classes.tag} key={tag.id ?? `${tag.label}-${index}`}>
                {tag.label}
              </li>
            ))}
          </ul>
        )}

        {closing && <p className={classes.closing}>{closing}</p>}
      </div>
    </div>
  )
}
