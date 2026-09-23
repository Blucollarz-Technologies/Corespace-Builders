'use client'

import { CostEstimateCta } from '@components/CostEstimateCta/index'
import { CMSLink } from '@components/CMSLink/index'
import React from 'react'

import classes from './index.module.scss'

type LinkGroup = {
  label?: null | string
  newTab?: boolean | null
  reference?: any
  type?: 'custom' | 'reference' | null
  url?: null | string
}

export type CorespaceCostClarityProps = {
  blockType?: 'corespaceCostClarity'
  body?: null | string
  eyebrow?: null | string
  factors?: { id?: null | string; label: string }[] | null
  heading?: null | string
  id?: null | string
  planningNote?: null | string
  priceRange?: null | string
  priceUnit?: null | string
  primaryCta?: LinkGroup | null
  rangeLabel?: null | string
  secondaryCta?: LinkGroup | null
}

const ClockIcon = () => (
  <svg
    aria-hidden
    className={classes.clockIcon}
    fill="none"
    height="18"
    viewBox="0 0 24 24"
    width="18"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M12 8V12.25L14.75 14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
  </svg>
)

export const CorespaceCostClarity: React.FC<CorespaceCostClarityProps> = ({
  body,
  eyebrow,
  factors,
  heading,
  planningNote,
  priceRange,
  priceUnit,
  primaryCta,
  rangeLabel,
  secondaryCta,
}) => {
  const hasPrimary = Boolean(primaryCta?.label)
  const hasSecondary = Boolean(secondaryCta?.label)
  const hasFactors = Array.isArray(factors) && factors.length > 0

  return (
    <div className={classes.costClarity}>
      <div className={classes.shell}>
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
          {body && <p className={classes.body}>{body}</p>}

          {planningNote && (
            <div className={classes.note}>
              <ClockIcon />
              <p>{planningNote}</p>
            </div>
          )}

          {(hasPrimary || hasSecondary) && (
            <div className={classes.actions}>
              {hasPrimary && (
                <CostEstimateCta
                  appearance="primary"
                  className={classes.primaryCta}
                  link={primaryCta}
                />
              )}
              {hasSecondary && (
                <CMSLink
                  {...secondaryCta}
                  className={classes.secondaryCta}
                  label={`${secondaryCta?.label}${secondaryCta?.label?.includes('→') ? '' : ' →'}`}
                />
              )}
            </div>
          )}
        </div>

        <aside className={classes.card}>
          {rangeLabel && <p className={classes.rangeLabel}>{rangeLabel}</p>}
          {priceRange && <p className={classes.price}>{priceRange}</p>}
          {priceUnit && <p className={classes.priceUnit}>{priceUnit}</p>}

          {hasFactors && (
            <>
              <div className={classes.divider} />
              <ul className={classes.factors}>
                {factors!.map((factor, index) => (
                  <li key={factor.id ?? `${factor.label}-${index}`}>
                    <span className={classes.bullet} aria-hidden />
                    <span>{factor.label}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}
