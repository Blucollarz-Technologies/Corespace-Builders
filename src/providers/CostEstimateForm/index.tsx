'use client'

import type { Form as FormType } from '@root/payload-types'

import { CostEstimateFormModal } from '@components/CostEstimateFormModal/index'
import { FORM_SOURCES } from '@root/utilities/formTracking'
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

type CostEstimateFormContextValue = {
  form: FormType | null
  openCostEstimateForm: (source?: string) => void
}

const CostEstimateFormContext = createContext<CostEstimateFormContextValue | null>(null)

export const COST_ESTIMATE_MODAL_SLUG = 'cost-estimate-form-modal'

export function CostEstimateFormProvider({
  children,
  form,
}: {
  children: React.ReactNode
  form: FormType | null | string | undefined
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [formSource, setFormSource] = useState<string>(FORM_SOURCES.COST_ESTIMATE)

  const resolvedForm = form && typeof form !== 'string' ? form : null

  const openCostEstimateForm = useCallback((source: string = FORM_SOURCES.COST_ESTIMATE) => {
    if (!resolvedForm) {
      return
    }

    setFormSource(source)
    setIsOpen(true)
  }, [resolvedForm])

  const closeCostEstimateForm = useCallback(() => {
    setIsOpen(false)
  }, [])

  const value = useMemo(
    () => ({
      form: resolvedForm,
      openCostEstimateForm,
    }),
    [openCostEstimateForm, resolvedForm],
  )

  return (
    <CostEstimateFormContext.Provider value={value}>
      {children}
      {resolvedForm ? (
        <CostEstimateFormModal
          form={resolvedForm}
          formSource={formSource}
          isOpen={isOpen}
          onClose={closeCostEstimateForm}
        />
      ) : null}
    </CostEstimateFormContext.Provider>
  )
}

export function useCostEstimateForm(): CostEstimateFormContextValue {
  const context = useContext(CostEstimateFormContext)

  return (
    context ?? {
      form: null,
      openCostEstimateForm: () => {},
    }
  )
}
