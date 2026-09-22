'use client'

import React from 'react'

import classes from './index.module.scss'

export type AudiencePill = {
  id?: null | string
  label: string
}

export type CorespaceWhoThisIsForProps = {
  audiences?: AudiencePill[] | null
  blockType?: 'corespaceWhoThisIsFor'
  description?: null | string
  eyebrow?: null | string
  heading?: null | string
  id?: null | string
}

export const CorespaceWhoThisIsFor: React.FC<CorespaceWhoThisIsForProps> = ({
  audiences,
  description,
  eyebrow,
  heading,
}) => {
  const hasAudiences = Array.isArray(audiences) && audiences.length > 0

  if (!heading) {
    return null
  }

  return (
    <div className={classes.whoThisIsFor}>
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
        <h2 className={classes.heading}>{heading}</h2>
        {description && <p className={classes.description}>{description}</p>}
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
