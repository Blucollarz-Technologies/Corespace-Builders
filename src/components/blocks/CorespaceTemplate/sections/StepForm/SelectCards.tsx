'use client'

import { useFormField } from '@forms/useFormField/index'
import React, { useCallback } from 'react'

import classes from './index.module.scss'

type Option = {
  label: string
  value: string
}

type SelectCardsProps = {
  label?: null | string
  name?: string
  onSelect?: (value: string) => void
  options?: Option[] | null
  path?: string
  required?: boolean | null
}

export const SelectCards: React.FC<SelectCardsProps> = ({
  label,
  name,
  onSelect,
  options,
  path: pathFromProps,
  required = true,
}) => {
  const path = pathFromProps || name || ''

  const validate = useCallback(
    (value: string) => {
      if (required && !value) {
        return 'Please select an option to continue.'
      }
      return true
    },
    [required],
  )

  const { errorMessage, setValue, showError, value } = useFormField<string>({
    path,
    required: Boolean(required),
    validate,
  })

  return (
    <div className={classes.selectCards}>
      {label && <p className={classes.question}>{label}</p>}
      <div className={classes.optionGrid} role="radiogroup" aria-label={label || 'Options'}>
        {(options || []).map((option) => {
          const selected = value === option.value

          return (
            <button
              aria-checked={selected}
              className={[classes.option, selected ? classes.optionSelected : '']
                .filter(Boolean)
                .join(' ')}
              key={option.value}
              onClick={() => {
                setValue(option.value)
                onSelect?.(option.value)
              }}
              role="radio"
              type="button"
            >
              <span className={classes.radio} aria-hidden>
                {selected ? <span className={classes.radioDot} /> : null}
              </span>
              <span className={classes.optionLabel}>{option.label}</span>
            </button>
          )
        })}
      </div>
      {showError && errorMessage && <p className={classes.fieldError}>{errorMessage}</p>}
    </div>
  )
}
