'use client'

import type { PostTocItem } from '@root/utilities/extractPostH2Headings'

import React, { useId, useState } from 'react'

import classes from './index.module.scss'

type Props = {
  items: PostTocItem[]
  title?: string | null
}

export const TableOfContents: React.FC<Props> = ({ items, title }) => {
  const [open, setOpen] = useState(true)
  const panelId = useId()

  if (!items.length) {
    return null
  }

  return (
    <nav aria-label="Table of contents" className={classes.toc}>
      <div className={classes.header}>
        <p className={classes.heading}>Table of Contents</p>
        <button
          aria-controls={panelId}
          aria-expanded={open}
          className={classes.toggle}
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <span aria-hidden className={classes.toggleIcon}>
            {open ? '—' : '+'}
          </span>
          <span className="visually-hidden">{open ? 'Collapse' : 'Expand'} table of contents</span>
        </button>
      </div>

      {open && (
        <div className={classes.panel} id={panelId}>
          {title ? (
            <a className={classes.articleLink} href="#blog">
              {title}
            </a>
          ) : null}

          <ol className={classes.list}>
            {items.map((item) => (
              <li className={classes.item} key={item.id}>
                <a className={classes.link} href={`#${item.id}`}>
                  {item.text}
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </nav>
  )
}
