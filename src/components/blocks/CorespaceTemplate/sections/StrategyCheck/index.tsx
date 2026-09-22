'use client'

import React from 'react'

import classes from './index.module.scss'

type ListItem = {
  id?: null | string
  text: string
}

type StrategyCard = {
  idealFor?: ListItem[] | null
  label?: null | string
  priorities?: ListItem[] | null
  title?: null | string
}

type HybridCard = {
  closingNote?: null | string
  intro?: null | string
  items?: ListItem[] | null
  label?: null | string
  title?: null | string
}

export type CorespaceStrategyCheckProps = {
  blockType?: 'corespaceStrategyCheck'
  eyebrow?: null | string
  heading?: null | string
  hybridCard?: HybridCard | null
  id?: null | string
  investmentCard?: StrategyCard | null
  lifestyleCard?: StrategyCard | null
  subheading?: null | string
}

const BulletList: React.FC<{
  items?: ListItem[] | null
  light?: boolean
}> = ({ items, light }) => {
  const listItems = items?.filter((item) => Boolean(item.text)) ?? []

  if (!listItems.length) {
    return null
  }

  return (
    <ul className={light ? classes.listLight : classes.list}>
      {listItems.map((item, index) => (
        <li key={item.id ?? `${item.text}-${index}`}>
          <span aria-hidden className={light ? classes.bulletLight : classes.bullet} />
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  )
}

const StrategyCardContent: React.FC<{ card?: StrategyCard | null }> = ({ card }) => {
  if (!card?.title) {
    return null
  }

  const idealForItems = card.idealFor?.filter((item) => Boolean(item.text)) ?? []
  const priorityItems = card.priorities?.filter((item) => Boolean(item.text)) ?? []

  return (
    <>
      {card.label && <p className={classes.cardLabel}>{card.label}</p>}
      <h3 className={classes.cardTitle}>{card.title}</h3>

      {idealForItems.length > 0 && (
        <div className={classes.section}>
          <p className={classes.sectionLabel}>Ideal for:</p>
          <BulletList items={idealForItems} />
        </div>
      )}

      {priorityItems.length > 0 && (
        <div className={classes.section}>
          <p className={classes.sectionLabelStrong}>Priorities:</p>
          <BulletList items={priorityItems} />
        </div>
      )}
    </>
  )
}

export const CorespaceStrategyCheck: React.FC<CorespaceStrategyCheckProps> = ({
  eyebrow,
  heading,
  hybridCard,
  investmentCard,
  lifestyleCard,
  subheading,
}) => {
  const hasLifestyle = Boolean(lifestyleCard?.title)
  const hasInvestment = Boolean(investmentCard?.title)
  const hasHybrid = Boolean(hybridCard?.title)
  const hybridItems = hybridCard?.items?.filter((item) => Boolean(item.text)) ?? []

  if (!heading && !hasLifestyle && !hasInvestment && !hasHybrid) {
    return null
  }

  return (
    <div className={classes.strategyCheck}>
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

      <div className={classes.grid}>
        {hasLifestyle && (
          <article className={classes.lightCard}>
            <StrategyCardContent card={lifestyleCard} />
          </article>
        )}

        {hasInvestment && (
          <article className={classes.lightCard}>
            <StrategyCardContent card={investmentCard} />
          </article>
        )}

        {hasHybrid && (
          <article className={classes.darkCard}>
            {hybridCard?.label && <p className={classes.cardLabelLight}>{hybridCard.label}</p>}
            <h3 className={classes.cardTitleLight}>{hybridCard?.title}</h3>

            {hybridCard?.intro && <p className={classes.hybridIntro}>{hybridCard.intro}</p>}

            {hybridItems.length > 0 && <BulletList items={hybridItems} light />}

            {hybridCard?.closingNote && (
              <p className={classes.hybridClosing}>{hybridCard.closingNote}</p>
            )}
          </article>
        )}
      </div>
    </div>
  )
}
