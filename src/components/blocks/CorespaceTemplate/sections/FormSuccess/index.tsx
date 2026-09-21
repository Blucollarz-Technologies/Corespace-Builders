'use client'

import { useSearchParams } from 'next/navigation'
import React, { Suspense, useMemo } from 'react'

import classes from './index.module.scss'

export type CorespaceFormSuccessProps = {
  blockType?: 'corespaceFormSuccess'
  closing?: null | string
  heading?: null | string
  id?: null | string
  intro?: null | string
  listIntro?: null | string
  successBadge?: null | string
  tags?: { id?: null | string; label: string; value?: string }[] | null
}

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    aria-hidden
    className={className}
    fill="none"
    height="20"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.5 10.25L8.25 14L15.5 6.75"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
)

const normalizeValue = (value: string) => value.trim().toLowerCase()

const tagMatchesProject = (tag: { label: string; value?: string }, project: string) => {
  const normalizedProject = normalizeValue(project)

  if (tag.value && normalizeValue(tag.value) === normalizedProject) {
    return true
  }

  return normalizeValue(tag.label) === normalizedProject
}

const FormSuccessContent: React.FC<
  CorespaceFormSuccessProps & {
    selectedProject?: null | string
  }
> = ({ closing, heading, intro, listIntro, selectedProject = null, successBadge, tags }) => {
  const hasTags = Array.isArray(tags) && tags.length > 0

  const selectedTag = useMemo(() => {
    if (!selectedProject || !hasTags) {
      return null
    }

    return tags!.find((tag) => tagMatchesProject(tag, selectedProject)) ?? null
  }, [hasTags, selectedProject, tags])

  if (!heading && !intro) {
    return null
  }

  return (
    <div className={classes.formSuccess}>
      <div className={classes.content}>
        <div className={classes.iconWrap}>
          <CheckIcon className={classes.icon} />
        </div>

        {heading && <h2 className={classes.heading}>{heading}</h2>}
        {intro && <p className={classes.intro}>{intro}</p>}

        {(listIntro || hasTags) && (
          <div className={classes.tagsBlock}>
            {listIntro && <p className={classes.listIntro}>{listIntro}</p>}

            {hasTags && (
              <ul className={classes.tags}>
                {tags!.map((tag, index) => {
                  const isSelected = selectedTag
                    ? tagMatchesProject(tag, selectedTag.value || selectedTag.label)
                    : false

                  return (
                    <li
                      aria-current={isSelected ? 'true' : undefined}
                      className={[
                        classes.tag,
                        isSelected ? classes.tagSelected : classes.tagMuted,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      key={tag.id ?? `${tag.label}-${index}`}
                    >
                      {tag.label}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}

        {closing && <p className={classes.closing}>{closing}</p>}

        {successBadge && (
          <div className={classes.badge}>
            <CheckIcon className={classes.badgeIcon} />
            <span>{successBadge}</span>
          </div>
        )}
      </div>
    </div>
  )
}

const FormSuccessWithSearchParams: React.FC<CorespaceFormSuccessProps> = (props) => {
  const searchParams = useSearchParams()
  const selectedProject = searchParams.get('project')

  return <FormSuccessContent {...props} selectedProject={selectedProject} />
}

export const CorespaceFormSuccess: React.FC<CorespaceFormSuccessProps> = (props) => {
  return (
    <Suspense fallback={<FormSuccessContent {...props} selectedProject={null} />}>
      <FormSuccessWithSearchParams {...props} />
    </Suspense>
  )
}
