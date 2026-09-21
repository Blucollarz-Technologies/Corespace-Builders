'use client'

import React from 'react'

import classes from './index.module.scss'

export type CorePrincipleItem = {
  id?: null | string
  label: string
}

export type CorespaceCorePrinciplesProps = {
  blockType?: 'corespaceCorePrinciples'
  eyebrow?: null | string
  heading?: null | string
  id?: null | string
  principles?: CorePrincipleItem[] | null
  subheading?: null | string
}

const formatStepNumber = (index: number) => String(index + 1).padStart(2, '0')

export const CorespaceCorePrinciples: React.FC<CorespaceCorePrinciplesProps> = ({
  eyebrow,
  heading,
  principles,
  subheading,
}) => {
  const principleItems = principles?.filter((item) => Boolean(item.label)) ?? []

  if (!heading && principleItems.length === 0) {
    return null
  }

  return (
    <div className={classes.corePrinciples}>
      <div className={classes.shell}>
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
          {subheading && <p className={classes.subheading}>{subheading}</p>}
        </div>

        {principleItems.length > 0 && (
          <ol className={classes.grid}>
            {principleItems.map((principle, index) => (
              <li className={classes.card} key={principle.id ?? `${principle.label}-${index}`}>
                <span className={classes.number} aria-hidden>{formatStepNumber(index)}</span>
                <p className={classes.label}>{principle.label}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
