'use client'

import { CMSLink, type LinkType, type Reference } from '@components/CMSLink/index'
import React from 'react'

import classes from './index.module.scss'

type LinkGroup = {
  label?: null | string
  newTab?: boolean | null
  reference?: null | Reference
  type?: LinkType
  url?: null | string
}

export type StartHereStep = {
  id?: null | string
  label: string
}

export type CorespaceStartHereProps = {
  blockType?: 'corespaceStartHere'
  cta?: LinkGroup | null
  eyebrow?: null | string
  heading?: null | string
  id?: null | string
  steps?: StartHereStep[] | null
  subheading?: null | string
}

export const CorespaceStartHere: React.FC<CorespaceStartHereProps> = ({
  cta,
  eyebrow,
  heading,
  steps,
  subheading,
}) => {
  const stepItems = steps?.filter((step) => Boolean(step.label)) ?? []
  const hasCta = Boolean(cta?.label)

  if (!heading && stepItems.length === 0) {
    return null
  }

  return (
    <div className={classes.startHere}>
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
        {subheading && <p className={classes.subheading}>{subheading}</p>}
      </div>

      {stepItems.length > 0 && (
        <ol className={classes.steps} aria-label="Getting started steps">
          {stepItems.map((step, index) => (
            <li className={classes.stepItem} key={step.id ?? `${step.label}-${index}`}>
              <article className={classes.stepCard}>
                <span className={classes.stepNumber} aria-hidden>{index + 1}</span>
                <p className={classes.stepLabel}>{step.label}</p>
              </article>
              {index < stepItems.length - 1 && (
                <span aria-hidden className={classes.arrow}>→</span>
              )}
            </li>
          ))}
        </ol>
      )}

      {hasCta && (
        <div className={classes.actions}>
          <CMSLink
            {...cta}
            appearance="primary"
            className={classes.cta}
            label={cta?.label}
          />
        </div>
      )}
    </div>
  )
}
