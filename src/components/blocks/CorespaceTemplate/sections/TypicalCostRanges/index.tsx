'use client'

import React from 'react'

import classes from './index.module.scss'

type CostListItem = {
  id?: null | string
  text: string
}

export type CostRangeCard = {
  id?: null | string
  items?: CostListItem[] | null
  listLabel?: null | string
  price: string
  priceVariant?: 'accent' | 'default' | null
  title: string
}

export type CorespaceTypicalCostRangesProps = {
  blockType?: 'corespaceTypicalCostRanges'
  cards?: CostRangeCard[] | null
  eyebrow?: null | string
  heading?: null | string
  id?: null | string
}

export const CorespaceTypicalCostRanges: React.FC<CorespaceTypicalCostRangesProps> = ({
  cards,
  eyebrow,
  heading,
}) => {
  const costCards = cards?.filter((card) => Boolean(card.title && card.price)) ?? []

  if (!heading && costCards.length === 0) {
    return null
  }

  return (
    <div className={classes.typicalCostRanges}>
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
        </div>

        {costCards.length > 0 && (
          <ul className={classes.grid}>
            {costCards.map((card, index) => {
              const listItems = card.items?.filter((item) => Boolean(item.text)) ?? []

              return (
                <li className={classes.card} key={card.id ?? `${card.title}-${index}`}>
                  <p className={classes.cardTitle}>{card.title}</p>
                  <p
                    className={classes.price}
                    data-variant={card.priceVariant === 'accent' ? 'accent' : undefined}
                  >
                    {card.price}
                  </p>

                  {card.listLabel && <p className={classes.listLabel}>{card.listLabel}</p>}

                  {listItems.length > 0 && (
                    <ul className={classes.list}>
                      {listItems.map((item, itemIndex) => (
                        <li key={item.id ?? `${item.text}-${itemIndex}`}>
                          <span aria-hidden className={classes.bullet} />
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
