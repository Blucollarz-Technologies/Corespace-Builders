'use client'

import React from 'react'

import classes from './index.module.scss'

type ProjectTypeRow = {
  costEmphasis?: 'default' | 'italic' | null
  costRange: string
  id?: null | string
  projectType: string
}

export type CorespaceProjectTypeProps = {
  blockType?: 'corespaceProjectType'
  costColumnLabel?: null | string
  eyebrow?: null | string
  heading?: null | string
  id?: null | string
  note?: null | string
  projectColumnLabel?: null | string
  rows?: ProjectTypeRow[] | null
}

export const CorespaceProjectType: React.FC<CorespaceProjectTypeProps> = ({
  costColumnLabel = 'ESTIMATED COST RANGE',
  eyebrow,
  heading,
  note,
  projectColumnLabel = 'PROJECT TYPE',
  rows,
}) => {
  const tableRows =
    rows?.filter((row) => Boolean(row.projectType && row.costRange)) ?? []

  if (!heading && tableRows.length === 0) {
    return null
  }

  return (
    <div className={classes.projectType}>
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
      </div>

      {tableRows.length > 0 && (
        <div className={classes.tableCard}>
          <table className={classes.table}>
            <thead className={classes.thead}>
              <tr>
                <th className={classes.th} scope="col">
                  {projectColumnLabel}
                </th>
                <th className={`${classes.th} ${classes.thCost}`} scope="col">
                  {costColumnLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, index) => (
                <tr className={classes.tr} key={row.id ?? `${row.projectType}-${index}`}>
                  <td className={`${classes.td} ${classes.tdType}`}>{row.projectType}</td>
                  <td
                    className={[
                      classes.td,
                      classes.tdCost,
                      row.costEmphasis === 'italic' ? classes.tdCostItalic : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {row.costRange}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {note && (
        <p className={classes.note}>
          <span className={classes.noteLabel}>Note: </span>
          {note}
        </p>
      )}
    </div>
  )
}
