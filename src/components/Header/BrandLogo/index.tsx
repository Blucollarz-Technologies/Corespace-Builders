'use client'

import type { Media as MediaType } from '@root/payload-types'

import { Media } from '@components/Media/index'
import Link from 'next/link'
import React from 'react'

import classes from './index.module.scss'

export type BrandLogoProps = {
  brandName?: null | string
  className?: string
  logo?: MediaType | null | string
  showBrandName?: boolean | null
}

function DefaultMark() {
  return (
    <svg
      aria-hidden
      className={classes.mark}
      fill="none"
      height="28"
      viewBox="0 0 32 28"
      width="32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 2L4 24H12L16 16L20 24H28L16 2Z"
        fill="currentColor"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M10 24C12.5 21.5 19.5 21.5 22 24"
        stroke="var(--brand-terracotta, #b8663b)"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  )
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  brandName,
  className,
  logo,
  showBrandName = false,
}) => {
  const name = brandName || 'Corespace Builders'
  const hasUploadedLogo = Boolean(logo && typeof logo !== 'string')

  return (
    <Link
      aria-label={name}
      className={[classes.brand, className].filter(Boolean).join(' ')}
      href="/"
      prefetch={false}
    >
      {hasUploadedLogo ? (
        <span className={classes.logoImage}>
          <Media resource={logo as MediaType} />
        </span>
      ) : (
        <DefaultMark />
      )}
      {showBrandName === true && !hasUploadedLogo && (
        <span className={classes.brandName}>
          <span className={classes.brandNamePrimary}>
            {name.split(' ')[0] || 'Corespace'}
          </span>
          <span className={classes.brandNameSecondary}>
            {name.split(' ').slice(1).join(' ') || 'Builders'}
          </span>
        </span>
      )}
    </Link>
  )
}
