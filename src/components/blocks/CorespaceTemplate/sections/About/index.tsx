'use client'

import type { Media as MediaType } from '@root/payload-types'

import { CostEstimateCta } from '@components/CostEstimateCta/index'
import { CMSLink, type LinkType, type Reference } from '@components/CMSLink/index'
import { FORM_SOURCES } from '@root/utilities/formTracking'
import { DEFAULT_WHATSAPP_LINK, resolveWhatsAppUrl } from '@root/utilities/whatsapp'
import { Media } from '@components/Media/index'
import React from 'react'

import classes from './index.module.scss'

type LinkGroup = {
  label?: null | string
  newTab?: boolean | null
  reference?: null | Reference
  type?: LinkType
  url?: null | string
}

export type CorespaceAboutProps = {
  blockType?: 'corespaceAbout'
  closing?: null | string
  eyebrow?: null | string
  heading?: null | string
  id?: null | string
  image?: MediaType | null | string
  imageCaption?: null | string
  intro?: null | string
  items?: { id?: null | string; text: string }[] | null
  listIntro?: null | string
  primaryCta?: LinkGroup | null
  secondaryCta?: LinkGroup | null
}

const isWhatsAppUrl = (url?: null | string): boolean => {
  const value = url?.toLowerCase() ?? ''
  return value.includes('wa.me') || value.includes('whatsapp')
}

const isWhatsAppCta = (link?: LinkGroup | null): boolean => {
  const label = link?.label?.toLowerCase() ?? ''
  return label.includes('whatsapp') || isWhatsAppUrl(link?.url)
}

/** Force a real WhatsApp deep link — CMS often stores /contact by mistake. */
const toWhatsAppLink = (link: LinkGroup): LinkGroup => ({
  ...DEFAULT_WHATSAPP_LINK,
  ...link,
  label: link.label || DEFAULT_WHATSAPP_LINK.label,
  newTab: true,
  reference: undefined,
  type: 'custom',
  url: resolveWhatsAppUrl(isWhatsAppUrl(link.url) ? link.url : undefined),
})

export const CorespaceAbout: React.FC<CorespaceAboutProps> = ({
  closing,
  eyebrow,
  heading,
  image,
  imageCaption,
  intro,
  items,
  listIntro,
  primaryCta,
  secondaryCta,
}) => {
  const hasPrimary = Boolean(primaryCta?.label)
  const hasSecondary = Boolean(secondaryCta?.label)
  const hasItems = Array.isArray(items) && items.length > 0
  const secondaryLink =
    hasSecondary && secondaryCta
      ? isWhatsAppCta(secondaryCta)
        ? toWhatsAppLink(secondaryCta)
        : secondaryCta
      : null

  return (
    <div className={classes.about}>
      <div className={classes.copy}>
        {eyebrow && (
          <p className={classes.eyebrow}>
            <span className={classes.eyebrowDash} aria-hidden>
              —
            </span>
            {eyebrow}
          </p>
        )}

        {heading && <h2 className={classes.heading}>{heading}</h2>}

        {intro && <p className={classes.intro}>{intro}</p>}

        {(listIntro || hasItems) && (
          <div className={classes.listBlock}>
            {listIntro && <p className={classes.listIntro}>{listIntro}</p>}
            {hasItems && (
              <ul className={classes.list}>
                {items!.map((item, index) => (
                  <li className={classes.listItem} key={item.id ?? `${item.text}-${index}`}>
                    <span className={classes.listDash} aria-hidden>
                      —
                    </span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {closing && <p className={classes.closing}>{closing}</p>}

        {(hasPrimary || hasSecondary) && (
          <div className={classes.actions}>
            {hasPrimary && (
              <CostEstimateCta
                appearance="primary"
                className={classes.primaryCta}
                formSource={FORM_SOURCES.CONSULTATION_PLAN}
                link={primaryCta}
              />
            )}
            {secondaryLink && (
              <CMSLink
                {...secondaryLink}
                appearance="secondary"
                className={classes.secondaryCta}
                label={secondaryLink.label}
              />
            )}
          </div>
        )}
      </div>

      <div className={classes.media}>
        {image && typeof image !== 'string' && (
          <div className={classes.imageFrame}>
            <Media className={classes.image} resource={image} />
            {imageCaption && (
              <div className={classes.caption}>
                <p>{imageCaption}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
