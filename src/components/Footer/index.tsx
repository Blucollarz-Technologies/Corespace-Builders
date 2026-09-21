'use client'

import type { Footer as FooterType } from '@types'

import { CMSLink } from '@components/CMSLink/index'
import { Gutter } from '@components/Gutter/index'
import React from 'react'

import classes from './index.module.scss'

const FALLBACK_COLUMNS: NonNullable<FooterType['columns']> = [
  {
    label: 'SERVICES',
    navItems: [
      { link: { type: 'custom', label: 'Construction', url: '/service/construction' } },
      { link: { type: 'custom', label: 'Architecture', url: '/service/architecture' } },
      { link: { type: 'custom', label: 'Interiors', url: '/service/interiors' } },
      { link: { type: 'custom', label: 'Renovation', url: '/service/renovation' } },
    ],
  },
  {
    label: 'PROJECTS',
    navItems: [
      { link: { type: 'custom', label: 'Portfolio', url: '/projects' } },
      { link: { type: 'custom', label: 'Homestay & Villa', url: '/projects/homestay-villa' } },
      {
        link: {
          type: 'custom',
          label: 'Coorg Construction',
          url: '/service/corespace-construction-services-coorg',
        },
      },
    ],
  },
  {
    label: 'RESOURCES',
    navItems: [
      { link: { type: 'custom', label: 'Cost Guide', url: '/resources/cost-guide' } },
      { link: { type: 'custom', label: 'Blog', url: '/blog' } },
    ],
  },
  {
    label: 'COMPANY',
    navItems: [
      { link: { type: 'custom', label: 'About', url: '/about' } },
      { link: { type: 'custom', label: 'Contact', url: '/contact' } },
      { link: { type: 'custom', label: 'Thank You', url: '/thank-you' } },
      { link: { type: 'custom', label: 'Privacy', url: '/privacy' } },
      { link: { type: 'custom', label: 'Terms', url: '/terms' } },
    ],
  },
]

export const Footer: React.FC<FooterType> = (props) => {
  const brandName = props.brandName || 'Corespace'
  const brandAccent = props.brandAccent || 'Builders'
  const tagline =
    props.tagline ||
    'Planning-first construction, architecture, interiors, renovation, and development — with a strong focus on Coorg (Kodagu).'
  const copyright = props.copyright || '© 2026 Corespace Builders. All rights reserved.'
  const columns = props.columns?.length ? props.columns : FALLBACK_COLUMNS

  return (
    <footer className={classes.footer}>
      <Gutter className={classes.container}>
        <div className={classes.top}>
          <div className={classes.brand}>
            <p className={classes.brandName}>
              {brandName} <span className={classes.brandAccent}>{brandAccent}</span>
            </p>
            {tagline && <p className={classes.tagline}>{tagline}</p>}
          </div>

          <nav className={classes.columns} aria-label="Footer">
            {columns.map((column, columnIndex) => (
              <div className={classes.column} key={column.id ?? `${column.label}-${columnIndex}`}>
                {column.label && <p className={classes.colHeader}>{column.label}</p>}
                <ul className={classes.colItems}>
                  {column.navItems?.map(({ id, link }, linkIndex) => (
                    <li key={id ?? `${column.label}-${linkIndex}-${link?.url ?? link?.label ?? 'link'}`}>
                      <CMSLink className={classes.link} {...link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={classes.bottom}>
          <p className={classes.copyright}>{copyright}</p>
        </div>
      </Gutter>
    </footer>
  )
}
