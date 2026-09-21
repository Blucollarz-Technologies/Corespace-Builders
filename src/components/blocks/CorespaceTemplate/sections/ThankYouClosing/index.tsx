'use client'

import { CMSLink, type LinkType, type Reference } from '@components/CMSLink/index'
import {
  DEFAULT_WHATSAPP_LINK,
  isPlaceholderWhatsAppUrl,
  WHATSAPP_CTA_LABEL,
} from '@root/utilities/whatsapp'
import React from 'react'

import classes from './index.module.scss'

type WhatsAppLink = {
  label?: null | string
  newTab?: boolean | null
  reference?: null | Reference
  type?: LinkType
  url?: null | string
}

export type CorespaceThankYouClosingProps = {
  blockType?: 'corespaceThankYouClosing'
  closing?: null | string
  eyebrow?: null | string
  heading?: null | string
  id?: null | string
  intro?: null | string
  whatsappLink?: WhatsAppLink | null
}

const WhatsAppBubbleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    aria-hidden
    className={className}
    fill="none"
    height="18"
    viewBox="0 0 24 24"
    width="18"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.5 18.5L5 20L6.2 16.8C4.7 15.2 4 13.2 4 11C4 6.58 7.58 3 12 3C16.42 3 20 6.58 20 11C20 15.42 16.42 19 12 19C10.4 19 8.9 18.55 7.6 17.8"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
    <circle cx="9.25" cy="11" fill="currentColor" r="0.75" />
    <circle cx="12" cy="11" fill="currentColor" r="0.75" />
    <circle cx="14.75" cy="11" fill="currentColor" r="0.75" />
  </svg>
)

export const CorespaceThankYouClosing: React.FC<CorespaceThankYouClosingProps> = ({
  closing,
  eyebrow,
  heading,
  intro,
  whatsappLink,
}) => {
  const resolvedWhatsAppLink = {
    ...DEFAULT_WHATSAPP_LINK,
    ...whatsappLink,
    label: whatsappLink?.label || WHATSAPP_CTA_LABEL,
    url: isPlaceholderWhatsAppUrl(whatsappLink?.url) ? DEFAULT_WHATSAPP_LINK.url : whatsappLink?.url,
    type: whatsappLink?.type || 'custom',
    newTab: whatsappLink?.newTab ?? true,
  }

  const hasWhatsApp = Boolean(
    resolvedWhatsAppLink.label && (resolvedWhatsAppLink.url || whatsappLink?.reference),
  )

  if (!heading && !intro && !closing) {
    return null
  }

  return (
    <div className={classes.thankYouClosing}>
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

      <div className={classes.copy}>
        {intro && <p className={classes.intro}>{intro}</p>}
        {closing && <p className={classes.closing}>{closing}</p>}
      </div>

      {hasWhatsApp && (
        <CMSLink
          className={classes.whatsappLink}
          newTab={resolvedWhatsAppLink.newTab}
          type={resolvedWhatsAppLink.type}
          url={resolvedWhatsAppLink.url}
        >
          <WhatsAppBubbleIcon className={classes.whatsappIcon} />
          <span>{resolvedWhatsAppLink.label}</span>
        </CMSLink>
      )}
    </div>
  )
}
