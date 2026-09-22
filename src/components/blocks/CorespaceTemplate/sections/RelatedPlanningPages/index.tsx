'use client'

import { CMSLink, type LinkType, type Reference } from '@components/CMSLink/index'
import React from 'react'

import classes from './index.module.scss'

type CardLink = {
  label?: null | string
  newTab?: boolean | null
  reference?: null | Reference
  type?: LinkType
  url?: null | string
}

export type RelatedPlanningItem = {
  cardLink?: CardLink | null
  id?: null | string
}

export type CorespaceRelatedPlanningPagesProps = {
  blockType?: 'corespaceRelatedPlanningPages'
  eyebrow?: null | string
  heading?: null | string
  id?: null | string
  items?: RelatedPlanningItem[] | null
}

export const CorespaceRelatedPlanningPages: React.FC<CorespaceRelatedPlanningPagesProps> = ({
  eyebrow,
  heading,
  items,
}) => {
  const linkItems =
    items?.filter((item) => Boolean(item.cardLink?.label || item.cardLink?.url || item.cardLink?.reference)) ??
    []

  if (!heading && linkItems.length === 0) {
    return null
  }

  return (
    <div className={classes.relatedPlanning}>
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

      {linkItems.length > 0 && (
        <ul className={classes.grid}>
          {linkItems.map((item, index) => {
            const { label, ...linkProps } = item.cardLink ?? {}
            const cardLabel = label || 'Learn more'

            return (
              <li className={classes.cardItem} key={item.id ?? `${cardLabel}-${index}`}>
                <CMSLink {...linkProps} className={classes.card}>
                  <span className={classes.cardLabel}>{cardLabel}</span>
                  <span aria-hidden className={classes.arrow}>→</span>
                </CMSLink>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
