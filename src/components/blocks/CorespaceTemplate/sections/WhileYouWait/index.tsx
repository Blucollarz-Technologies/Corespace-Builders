'use client'

import { CMSLink, type LinkType, type Reference } from '@components/CMSLink/index'
import React from 'react'

import classes from './index.module.scss'

type ResourceLink = {
  label?: null | string
  newTab?: boolean | null
  reference?: null | Reference
  type?: LinkType
  url?: null | string
}

type ResourceCard = {
  description: string
  id?: null | string
  resourceLink?: ResourceLink | null
  title: string
}

export type CorespaceWhileYouWaitProps = {
  blockType?: 'corespaceWhileYouWait'
  eyebrow?: null | string
  heading?: null | string
  id?: null | string
  resources?: ResourceCard[] | null
}

export const CorespaceWhileYouWait: React.FC<CorespaceWhileYouWaitProps> = ({
  eyebrow,
  heading,
  resources,
}) => {
  const hasResources = Array.isArray(resources) && resources.length > 0

  if (!heading && !hasResources) {
    return null
  }

  return (
    <div className={classes.whileYouWait}>
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

      {hasResources && (
        <ul className={classes.grid}>
          {resources!.map((resource, index) => {
            const href = resource.resourceLink?.url
            const hasLink = Boolean(href || resource.resourceLink?.reference)

            const cardContent = (
              <>
                <h3 className={classes.cardTitle}>{resource.title}</h3>
                <p className={classes.cardDescription}>{resource.description}</p>
                {hasLink && (
                  <span aria-hidden className={classes.cardArrow}>
                    →
                  </span>
                )}
              </>
            )

            const { label: _linkLabel, ...linkProps } = resource.resourceLink ?? {}

            return (
              <li className={classes.cardItem} key={resource.id ?? `${resource.title}-${index}`}>
                {hasLink ? (
                  <CMSLink {...linkProps} className={classes.card}>
                    {cardContent}
                  </CMSLink>
                ) : (
                  <div className={classes.card}>{cardContent}</div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
