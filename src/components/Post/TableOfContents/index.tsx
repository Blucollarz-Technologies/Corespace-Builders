'use client'

import type { PostTocItem } from '@root/utilities/extractPostH2Headings'

import React, { useId, useState } from 'react'

import classes from './index.module.scss'

type Props = {
  items: PostTocItem[]
  title?: string | null
}

export const TableOfContents: React.FC<Props> = ({ items }) => {
  const [open, setOpen] = useState(true)
  const panelId = useId()

  if (!items.length) {
    return null
  }

  const stepCount = items.reduce((total, item) => total + (item.children?.length || 0), 0)

  return (
    <nav aria-label="Table of contents" className={classes.toc}>
      <div className={classes.header}>
        <div className={classes.headerCopy}>
          <p className={classes.eyebrow}>
            <span className={classes.eyebrowDash} aria-hidden>
              —
            </span>
            On this page
          </p>
          <div className={classes.titleRow}>
            <h2 className={classes.heading}>Table of Contents</h2>
            {stepCount > 0 ? (
              <span className={classes.count}>{stepCount} sections</span>
            ) : null}
          </div>
        </div>

        <button
          aria-controls={panelId}
          aria-expanded={open}
          className={classes.toggle}
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? 'Hide' : 'Show'}
        </button>
      </div>

      {open ? (
        <div className={classes.panel} id={panelId}>
          <ul className={classes.sections}>
            {items.map((item) => {
              const hasSteps = Boolean(item.children?.length)

              return (
                <li
                  className={[classes.section, hasSteps ? classes.sectionWithSteps : '']
                    .filter(Boolean)
                    .join(' ')}
                  key={item.id}
                >
                  <a className={classes.sectionLink} href={`#${item.id}`}>
                    <span className={classes.sectionAccent} aria-hidden />
                    <span className={classes.sectionText}>{item.text}</span>
                  </a>

                  {hasSteps ? (
                    <ol className={classes.list}>
                      {item.children!.map((child, index) => (
                        <li className={classes.item} key={child.id}>
                          <a className={classes.link} href={`#${child.id}`}>
                            <span className={classes.number} aria-hidden>
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className={classes.linkText}>{child.text}</span>
                          </a>
                        </li>
                      ))}
                    </ol>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </nav>
  )
}
