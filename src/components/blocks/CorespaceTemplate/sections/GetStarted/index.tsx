'use client'

import { CostEstimateCta } from '@components/CostEstimateCta/index'
import { CMSLink } from '@components/CMSLink/index'
import { FORM_SOURCES } from '@root/utilities/formTracking'
import { DEFAULT_WHATSAPP_LINK, resolveWhatsAppUrl } from '@root/utilities/whatsapp'
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

const isWhatsAppUrl = (url?: null | string): boolean => {
  const value = url?.toLowerCase() ?? ''
  return value.includes('wa.me') || value.includes('whatsapp')
}

const isWhatsAppCta = (link?: LinkGroup | null): boolean => {
  const label = link?.label?.toLowerCase() ?? ''
  return label.includes('whatsapp') || isWhatsAppUrl(link?.url)
}

/** Force a real WhatsApp deep link — CMS often stores /contact by mistake. */
const toWhatsAppLink = (link?: LinkGroup | null, label = 'Chat on WhatsApp'): LinkGroup => ({
  ...DEFAULT_WHATSAPP_LINK,
  ...link,
  label: link?.label || label,
  newTab: true,
  reference: undefined,
  type: 'custom',
  url: resolveWhatsAppUrl(isWhatsAppUrl(link?.url) ? link?.url : undefined),
})

/** Blocks that should open WhatsApp instead of the cost-estimate form. */
const isWhatsAppOnlyBlock = (heading?: null | string, eyebrow?: null | string): boolean => {
  const headingText = heading ?? ''
  const eyebrowText = eyebrow ?? ''
  return (
    /not sure where to start/i.test(headingText) ||
    /what makes these projects successful/i.test(headingText) ||
    /our philosophy/i.test(eyebrowText)
  )
}

export const CorespaceGetStarted: React.FC<CorespaceGetStartedProps> = ({
  eyebrow,
  heading,
  primaryCta,
  secondaryCta,
  subheading,
  tags,
}) => {
  const whatsappFromCms = isWhatsAppCta(primaryCta)
    ? primaryCta
    : isWhatsAppCta(secondaryCta)
      ? secondaryCta
      : null

  // These sections: Chat on WhatsApp only (not Contact / cost-estimate form).
  const useWhatsAppOnly = isWhatsAppOnlyBlock(heading, eyebrow)

  const preferredCta = primaryCta?.label ? primaryCta : secondaryCta

  const cta = useWhatsAppOnly
    ? toWhatsAppLink(whatsappFromCms, 'Chat on WhatsApp')
    : isWhatsAppCta(preferredCta)
      ? toWhatsAppLink(preferredCta)
      : preferredCta

  const usePrimaryStyle = useWhatsAppOnly || Boolean(primaryCta?.label)
  const hasCta = Boolean(cta?.label)
  const hasTags = Array.isArray(tags) && tags.length > 0
  const openEstimateModal = hasCta && !isWhatsAppCta(cta) && !useWhatsAppOnly

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

        {hasCta && (
          <div className={classes.actions}>
            {openEstimateModal ? (
              <CostEstimateCta
                appearance={usePrimaryStyle ? 'primary' : 'secondary'}
                className={usePrimaryStyle ? classes.primaryCta : classes.secondaryCta}
                formSource={FORM_SOURCES.COST_ESTIMATE}
                link={cta}
              />
            ) : (
              <CMSLink
                {...cta}
                appearance={usePrimaryStyle ? 'primary' : 'secondary'}
                className={usePrimaryStyle ? classes.primaryCta : classes.secondaryCta}
                label={cta?.label}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
