'use client'

import type { Form as FormType } from '@root/payload-types'

import { StepFormWizard } from '@components/blocks/CorespaceTemplate/sections/StepForm/index'
import { CloseIcon } from '@root/icons/CloseIcon/index'
import React, { useEffect } from 'react'

import classes from './index.module.scss'

export type CostEstimateFormModalProps = {
  form: FormType
  formSource: string
  isOpen: boolean
  onClose: () => void
}

export const CostEstimateFormModal: React.FC<CostEstimateFormModalProps> = ({
  form,
  formSource,
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div aria-modal="true" className={classes.overlay} role="dialog">
      <button aria-label="Close form" className={classes.backdrop} onClick={onClose} type="button" />
      <div className={classes.dialog}>
        <div className={classes.header}>
          <div>
            <p className={classes.eyebrow}>Tell us about your project</p>
            <h2 className={classes.heading}>Get Your Project Plan &amp; Cost Direction</h2>
          </div>
          <button aria-label="Close" className={classes.closeButton} onClick={onClose} type="button">
            <CloseIcon size="large" />
          </button>
        </div>

        <div className={classes.body}>
          <StepFormWizard
            form={form}
            formSource={formSource}
            onSubmitted={onClose}
            variant="modal"
          />
        </div>
      </div>
    </div>
  )
}
