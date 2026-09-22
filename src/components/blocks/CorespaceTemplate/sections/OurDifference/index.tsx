'use client'

import React from 'react'

import classes from './index.module.scss'

export type DifferenceItem = {
  id?: null | string
  label: string
  spanFull?: boolean | null
}

export type CorespaceOurDifferenceProps = {
  blockType?: 'corespaceOurDifference'
  eyebrow?: null | string
  footerNote?: null | string
  heading?: null | string
  id?: null | string
  items?: DifferenceItem[] | null
}

export const CorespaceOurDifference: React.FC<CorespaceOurDifferenceProps> = ({
  eyebrow,
  footerNote,
  heading,
  items,
}) => {
  const differenceItems = items?.filter((item) => Boolean(item.label)) ?? []
  const hasItems = differenceItems.length > 0

  if (!heading && !hasItems) {
    return null
  }

  return (
    <div className={classes.ourDifference}>
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

      {hasItems && (
        <ul className={classes.grid}>
          {differenceItems.map((item, index) => (
            <li
              className={classes.card}
              data-span-full={item.spanFull ? 'true' : undefined}
              key={item.id ?? `${item.label}-${index}`}
            >
              <p className={classes.cardLabel}>{item.label}</p>
            </li>
          ))}
        </ul>
      )}

      {footerNote && <p className={classes.footerNote}>{footerNote}</p>}
    </div>
  )
}
