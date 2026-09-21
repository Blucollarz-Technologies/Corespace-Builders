'use client'

import React from 'react'

import classes from './index.module.scss'

export type AudiencePill = {
  id?: null | string
  label: string
}

export type CorespaceIsThisForYouProps = {
  audiences?: AudiencePill[] | null
  blockType?: 'corespaceIsThisForYou'
  eyebrow?: null | string
  heading?: null | string
  id?: null | string
}

export const CorespaceIsThisForYou: React.FC<CorespaceIsThisForYouProps> = ({
  audiences,
  eyebrow,
  heading,
}) => {
  const hasAudiences = Array.isArray(audiences) && audiences.length > 0

  if (!heading) {
    return null
  }

  return (
    <div className={classes.isThisForYou}>
      <div className={classes.header}>
        {eyebrow && (
          <p className={classes.eyebrow}>
            <span className={classes.eyebrowDash} aria-hidden>
              —
            </span>
            {eyebrow}
          </p>
        )}
        <h2 className={classes.heading}>{heading}</h2>
      </div>

      {hasAudiences && (
        <ul className={classes.pills}>
          {audiences!.map((audience, index) => (
            <li className={classes.pill} key={audience.id ?? `${audience.label}-${index}`}>
              {audience.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
