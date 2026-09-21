'use client'

import React from 'react'

import classes from './index.module.scss'
import { quickAnswerIcons, type QuickAnswerIconKey } from './icons'

export type QuickAnswerCheckmark = {
  id?: null | string
  text: string
}

export type QuickAnswerCard = {
  checkmarks?: QuickAnswerCheckmark[] | null
  description?: null | string
  icon?: QuickAnswerIconKey | null
  id?: null | string
  title: string
}

export type CorespaceQuickAnswerProps = {
  blockType?: 'corespaceQuickAnswer'
  body?: null | string
  cards?: QuickAnswerCard[] | null
  heading?: null | string
  id?: null | string
}

const ListCheckIcon: React.FC = () => (
  <svg
    aria-hidden
    className={classes.listCheck}
    fill="none"
    height="14"
    viewBox="0 0 14 14"
    width="14"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.5 7.25L5.5 10.25L11.5 3.75"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
)

export const CorespaceQuickAnswer: React.FC<CorespaceQuickAnswerProps> = ({
  body,
  cards,
  heading,
}) => {
  const cardItems =
    cards?.filter(
      (card) =>
        Boolean(card.title) ||
        Boolean(card.description) ||
        (Array.isArray(card.checkmarks) && card.checkmarks.length > 0),
    ) ?? []
  const hasCards = cardItems.length > 0

  if (!heading && !body && !hasCards) {
    return null
  }

  return (
    <div className={classes.quickAnswer}>
      <div className={classes.header}>
        {heading && <h2 className={classes.heading}>{heading}</h2>}
        {body && <p className={classes.body}>{body}</p>}
      </div>

      {hasCards && (
        <ul className={classes.grid}>
          {cardItems.map((card, index) => {
            const iconKey = (card.icon || 'check') as QuickAnswerIconKey
            const Icon = quickAnswerIcons[iconKey] || quickAnswerIcons.check
            const checkmarkItems =
              card.checkmarks?.filter((item) => Boolean(item.text)) ?? []
            const hasCheckmarks = checkmarkItems.length > 0

            return (
              <li className={classes.card} key={card.id ?? `${card.title}-${index}`}>
                <div className={classes.iconWrap}>
                  <Icon className={classes.icon} />
                </div>
                <h3 className={classes.cardTitle}>{card.title}</h3>
                {card.description && <p className={classes.cardDescription}>{card.description}</p>}
                {hasCheckmarks && (
                  <ul className={classes.checkmarks}>
                    {checkmarkItems.map((item, checkIndex) => (
                      <li
                        className={classes.checkmark}
                        key={item.id ?? `${item.text}-${checkIndex}`}
                      >
                        <ListCheckIcon />
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
  )
}
