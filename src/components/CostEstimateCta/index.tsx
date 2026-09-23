'use client'

import { CMSLink, type LinkType, type Reference } from '@components/CMSLink/index'
import { useCostEstimateForm } from '@root/providers/CostEstimateForm/index'
import { FORM_SOURCES, type FormSource } from '@root/utilities/formTracking'
import React from 'react'

export type CostEstimateCtaLink = {
  label?: null | string
  newTab?: boolean | null
  reference?: null | Reference
  type?: LinkType
  url?: null | string
}

type CostEstimateCtaProps = {
  appearance?: 'default' | 'primary' | 'secondary'
  className?: string
  formSource?: FormSource | string
  link?: CostEstimateCtaLink | null
}

export const CostEstimateCta: React.FC<CostEstimateCtaProps> = ({
  appearance = 'primary',
  className,
  formSource = FORM_SOURCES.PAGE,
  link,
}) => {
  const { form, openCostEstimateForm } = useCostEstimateForm()

  if (!link?.label) {
    return null
  }

  if (form) {
    return (
      <button
        className={className}
        onClick={() => openCostEstimateForm(formSource)}
        type="button"
      >
        {link.label}
      </button>
    )
  }

  return (
    <CMSLink
      {...link}
      appearance={appearance}
      className={className}
      label={link.label}
    />
  )
}
