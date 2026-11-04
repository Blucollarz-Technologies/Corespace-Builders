'use client'

import type { Media as MediaType } from '@root/payload-types'

import { Media } from '@components/Media/index'
import React, { useMemo, useState } from 'react'

import classes from './index.module.scss'

type GalleryCategory =
  | 'architecture'
  | 'construction'
  | 'cost-guide'
  | 'homestay-villa'
  | 'interiors'
  | 'projects'

type GalleryStage = 'before' | 'completed' | 'during'

export type GalleryItem = {
  category: GalleryCategory
  description: string
  id?: null | string
  image?: MediaType | null | string
  location: string
  stage: GalleryStage
}

export type CorespaceProjectGalleryProps = {
  blockType?: 'corespaceProjectGallery'
  eyebrow?: null | string
  heading?: null | string
  id?: null | string
  items?: GalleryItem[] | null
}

const CATEGORY_FILTERS: { label: string; value: 'all' | GalleryCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Construction', value: 'construction' },
  { label: 'Architecture', value: 'architecture' },
  { label: 'Interiors', value: 'interiors' },
  { label: 'Projects', value: 'projects' },
  { label: 'Homestay & Villa', value: 'homestay-villa' },
  { label: 'Cost Guide', value: 'cost-guide' },
]

const STAGE_FILTERS: { label: string; value: 'all' | GalleryStage }[] = [
  { label: 'All Stages', value: 'all' },
  { label: 'Before', value: 'before' },
  { label: 'During', value: 'during' },
  { label: 'Completed', value: 'completed' },
]

const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  architecture: 'Architecture',
  construction: 'Construction',
  'cost-guide': 'Cost Guide',
  'homestay-villa': 'Homestay & Villa',
  interiors: 'Interiors',
  projects: 'Projects',
}

const STAGE_LABELS: Record<GalleryStage, string> = {
  before: 'Before',
  completed: 'Completed',
  during: 'During',
}

export const CorespaceProjectGallery: React.FC<CorespaceProjectGalleryProps> = ({
  eyebrow,
  heading,
  items,
}) => {
  const [category, setCategory] = useState<'all' | GalleryCategory>('all')
  const [stage, setStage] = useState<'all' | GalleryStage>('all')
  const isArticlesGallery = /article/i.test(heading || '') || /latest|article/i.test(eyebrow || '')

  const normalizedItems = useMemo(() => {
    if (!items?.length) {
      return []
    }

    const legacyCategoryMap: Record<string, GalleryCategory> = {
      architecture: 'architecture',
      construction: 'construction',
      'cost-guide': 'cost-guide',
      homes: 'construction',
      'homestay-villa': 'homestay-villa',
      homestays: 'homestay-villa',
      interiors: 'interiors',
      projects: 'projects',
      renovation: 'projects',
      villas: 'homestay-villa',
    }

    return items.map((item) => ({
      ...item,
      category: legacyCategoryMap[item.category] || 'projects',
    }))
  }, [items])

  const filteredItems = useMemo(() => {
    if (!normalizedItems.length) {
      return []
    }

    return normalizedItems.filter((item) => {
      const categoryMatch = category === 'all' || item.category === category
      const stageMatch = stage === 'all' || item.stage === stage
      return categoryMatch && stageMatch
    })
  }, [category, normalizedItems, stage])

  if (!normalizedItems.length) {
    return null
  }

  return (
    <div className={classes.gallery}>
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

      <div className={classes.filters}>
        <div className={classes.filterRow} role="group" aria-label="Filter by category">
          {CATEGORY_FILTERS.map((filter) => (
            <button
              className={[
                classes.filterButton,
                classes.categoryButton,
                category === filter.value ? classes.categoryActive : '',
              ]
                .filter(Boolean)
                .join(' ')}
              key={filter.value}
              onClick={() => setCategory(filter.value)}
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>

        {!isArticlesGallery && (
          <div className={classes.filterRow} role="group" aria-label="Filter by stage">
            {STAGE_FILTERS.map((filter) => (
              <button
                className={[
                  classes.filterButton,
                  classes.stageButton,
                  stage === filter.value ? classes.stageActive : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={filter.value}
                onClick={() => setStage(filter.value)}
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredItems.length === 0 ? (
        <p className={classes.empty}>No projects match these filters.</p>
      ) : (
        <ul className={classes.grid}>
          {filteredItems.map((item, index) => {
            const hasImage = Boolean(item.image && typeof item.image !== 'string')

            return (
              <li className={classes.card} key={item.id ?? `${item.location}-${index}`}>
                <div className={classes.media}>
                  {hasImage ? (
                    <Media className={classes.image} resource={item.image as MediaType} />
                  ) : (
                    <div className={classes.imagePlaceholder} aria-hidden />
                  )}
                  <span className={classes.badge}>{STAGE_LABELS[item.stage]}</span>
                </div>
                <div className={classes.body}>
                  <p className={classes.category}>{CATEGORY_LABELS[item.category]}</p>
                  <h3 className={classes.location}>{item.location}</h3>
                  <p className={classes.description}>{item.description}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
