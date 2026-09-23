'use client'

import { CostEstimateCta } from '@components/CostEstimateCta/index'
import { type LinkType, type Reference } from '@components/CMSLink/index'
import React from 'react'

import classes from './index.module.scss'

type LinkGroup = {
  label?: null | string
  newTab?: boolean | null
  reference?: null | Reference
  type?: LinkType
  url?: null | string
}

export type RenovationCostCard = {
  id?: null | string
  label: string
  price: string
  unit?: null | string
}

export type CorespaceRenovationCostProps = {
  blockType?: 'corespaceRenovationCost'
  costCards?: RenovationCostCard[] | null
  cta?: LinkGroup | null
  disclaimer?: null | string
  heading?: null | string
  id?: null | string
  influencers?: { id?: null | string; label: string }[] | null
  influencersLabel?: null | string
  subheading?: null | string
}

export const CorespaceRenovationCost: React.FC<CorespaceRenovationCostProps> = ({
  costCards,
  cta,
  disclaimer,
  heading,
  influencers,
  influencersLabel,
  subheading,
}) => {
  const cards = costCards?.filter((card) => Boolean(card.label && card.price)) ?? []
  const influencerItems = influencers?.filter((item) => Boolean(item.label)) ?? []
  const hasCta = Boolean(cta?.label)

  if (!heading && cards.length === 0) {
    return null
  }

  return (
    <div className={classes.renovationCost}>
      <div className={classes.shell}>
        <div className={classes.header}>
          {heading && <h2 className={classes.heading}>{heading}</h2>}
          {subheading && <p className={classes.subheading}>{subheading}</p>}
        </div>

        {cards.length > 0 && (
          <ul className={classes.cards}>
            {cards.map((card, index) => (
              <li className={classes.card} key={card.id ?? `${card.label}-${index}`}>
                <p className={classes.cardLabel}>{card.label}</p>
                <p className={classes.priceRow}>
                  <span className={classes.price}>{card.price}</span>
                  {card.unit && <span className={classes.unit}>{card.unit}</span>}
                </p>
              </li>
            ))}
          </ul>
        )}

        {influencerItems.length > 0 && (
          <div className={classes.influencers}>
            {influencersLabel && <p className={classes.influencersLabel}>{influencersLabel}</p>}
            <ul className={classes.pills}>
              {influencerItems.map((item, index) => (
                <li className={classes.pill} key={item.id ?? `${item.label}-${index}`}>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        {disclaimer && <p className={classes.disclaimer}>{disclaimer}</p>}

        {hasCta && (
          <div className={classes.actions}>
            <CostEstimateCta appearance="primary" className={classes.cta} link={cta} />
          </div>
        )}
      </div>
    </div>
  )
}
