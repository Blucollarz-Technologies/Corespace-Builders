'use client'

import React from 'react'

import classes from './index.module.scss'
import { whyCorespaceIcons, type WhyCorespaceIconKey } from './icons'

export type WhyCorespaceFeature = {
  description: string
  icon?: WhyCorespaceIconKey | null
  id?: null | string
  title: string
}

export type CorespaceWhyCorespaceProps = {
  blockType?: 'corespaceWhyCorespace'
  eyebrow?: null | string
  features?: WhyCorespaceFeature[] | null
  heading?: null | string
  id?: null | string
}

export const CorespaceWhyCorespace: React.FC<CorespaceWhyCorespaceProps> = ({
  eyebrow,
  features,
  heading,
}) => {
  const hasFeatures = Array.isArray(features) && features.length > 0

  if (!heading && !hasFeatures) {
    return null
  }

  return (
    <div className={classes.whyCorespace}>
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

      {hasFeatures && (
        <ul className={classes.grid}>
          {features!.map((feature, index) => {
            const iconKey = (feature.icon || 'check') as WhyCorespaceIconKey
            const Icon = whyCorespaceIcons[iconKey] || whyCorespaceIcons.check

            return (
              <li className={classes.card} key={feature.id ?? `${feature.title}-${index}`}>
                <div className={classes.iconWrap}>
                  <Icon className={classes.icon} />
                </div>
                <h3 className={classes.cardTitle}>{feature.title}</h3>
                <p className={classes.cardDescription}>{feature.description}</p>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
