'use client'

import { CostEstimateCta } from '@components/CostEstimateCta/index'
import { CMSLink } from '@components/CMSLink/index'
import React from 'react'

import classes from './index.module.scss'

type LinkGroup = {
  label?: null | string
  newTab?: boolean | null
  reference?: any
  type?: 'custom' | 'reference' | null
  url?: null | string
}

export type CorespaceGetStartedProps = {
  blockType?: 'corespaceGetStarted'
  eyebrow?: null | string
  heading?: null | string
  id?: null | string
  primaryCta?: LinkGroup | null
  secondaryCta?: LinkGroup | null
  subheading?: null | string
  tags?: { id?: null | string; label: string }[] | null
}

export const CorespaceGetStarted: React.FC<CorespaceGetStartedProps> = ({
  eyebrow,
  heading,
  primaryCta,
  secondaryCta,
  subheading,
  tags,
}) => {
  const hasPrimary = Boolean(primaryCta?.label)
  const hasSecondary = Boolean(secondaryCta?.label)
  const hasTags = Array.isArray(tags) && tags.length > 0

  return (
    <div className={classes.getStarted}>
      <div className={classes.banner}>
        {eyebrow && (
          <p className={classes.eyebrow}>
            <span className={classes.eyebrowDash} aria-hidden>
              —
            </span>
            {eyebrow}
          </p>
        )}

        {heading && <h2 className={classes.heading}>{heading}</h2>}
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

        {(hasPrimary || hasSecondary) && (
          <div className={classes.actions}>
            {hasPrimary && (
              <CostEstimateCta
                appearance="primary"
                className={classes.primaryCta}
                link={primaryCta}
              />
            )}
            {hasSecondary && (
              <CMSLink
                {...secondaryCta}
                appearance="secondary"
                className={classes.secondaryCta}
                label={secondaryCta?.label}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
