'use client'

import type { Form as FormType } from '@root/payload-types'

import { fields as cmsFields } from '@components/CMSForm/fields'
import { RichText } from '@components/RichText/index'
import Form from '@forms/Form/index'
import { useForm, useFormProcessing } from '@forms/Form/context'
import { getCookie } from '@root/utilities/get-cookie'
import {
  buildTrackingSubmissionData,
  FORM_SOURCES,
  mergeSubmissionData,
} from '@root/utilities/formTracking'
import { resolveWhatsAppUrl } from '@root/utilities/whatsapp'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'

import classes from './index.module.scss'
import { SelectCards } from './SelectCards'

type SidebarPoint = {
  id?: null | string
  text: string
}

export type CorespaceStepFormProps = {
  blockType?: 'corespaceStepForm'
  eyebrow?: null | string
  form?: FormType | null | string
  heading?: null | string
  id?: null | string
  sidebarBody?: null | string
  sidebarPoints?: SidebarPoint[] | null
  sidebarTitle?: null | string
  whatsappUrl?: null | string
}

type FormField = NonNullable<FormType['fields']>[number]
type SteppableField = Exclude<FormField, { blockType: 'message' }>

const isSteppableField = (field: FormField): field is SteppableField => {
  return field.blockType !== 'message' && 'name' in field && Boolean(field.name)
}

type WizardStep =
  | {
      fields: SteppableField[]
      kind: 'contact'
      label: string
    }
  | {
      field: SteppableField
      kind: 'single'
      label: string
    }

const isContactDetailsField = (field: SteppableField): boolean => {
  return (
    field.blockType === 'text' ||
    field.blockType === 'email' ||
    field.blockType === 'textarea' ||
    field.blockType === 'checkbox' ||
    field.blockType === 'number'
  )
}

const buildWizardSteps = (fields: SteppableField[]): WizardStep[] => {
  let contactStart = fields.length

  for (let index = fields.length - 1; index >= 0; index -= 1) {
    if (isContactDetailsField(fields[index])) {
      contactStart = index
    } else {
      break
    }
  }

  const steps: WizardStep[] = fields.slice(0, contactStart).map((field) => ({
    field,
    kind: 'single',
    label: field.label || 'Continue',
  }))

  const contactFields = fields.slice(contactStart)

  if (contactFields.length > 0) {
    steps.push({
      fields: contactFields,
      kind: 'contact',
      label: 'Contact Details',
    })
  }

  return steps
}

const STEP_VALIDATION_MESSAGE = 'Please complete all required fields to continue.'

const getStepFieldKey = (field: SteppableField, index: number) => field.id ?? `${field.name}-${index}`

const isFieldValueEmpty = (field: SteppableField, value: unknown): boolean => {
  if (field.blockType === 'checkbox') {
    return !value
  }

  return (
    value === undefined ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  )
}

const buildInitialState = (fields: FormField[]) => {
  const state: Record<
    string,
    { errorMessage: string; initialValue: unknown; valid: boolean; value: unknown }
  > = {}

  fields.forEach((field) => {
    if (!isSteppableField(field)) {
      return
    }

    const defaultValue = 'defaultValue' in field ? field.defaultValue : undefined
    state[field.name] = {
      errorMessage: 'This field is required.',
      initialValue: defaultValue ?? undefined,
      valid: !field.required || defaultValue !== undefined,
      value: defaultValue ?? undefined,
    }
  })

  return state
}

const ContactDetailsStep: React.FC<{
  fields: SteppableField[]
  form: FormType
  isActive: boolean
  isProcessing: boolean
}> = ({ fields, form, isActive, isProcessing }) => {
  return (
    <div
      aria-hidden={!isActive}
      className={classes.stepBody}
      hidden={!isActive}
    >
      <p className={classes.question}>Contact Details</p>
      <div className={classes.contactDetails}>
        {fields.map((field, fieldIndex) => {
          const FieldComponent = cmsFields?.[field.blockType]
          const isCheckbox = field.blockType === 'checkbox'

          return (
            <div
              className={[classes.contactField, isCheckbox ? classes.contactCheckbox : '']
                .filter(Boolean)
                .join(' ')}
              key={getStepFieldKey(field, fieldIndex)}
            >
              {!isCheckbox && 'label' in field && field.label ? (
                <p className={classes.contactFieldLabel}>
                  {field.label}
                  {field.required ? ' *' : ''}
                </p>
              ) : null}
              {FieldComponent ? (
                <div className={classes.contactFieldWrap}>
                  <FieldComponent
                    form={form}
                    path={field.name}
                    {...field}
                    disabled={isProcessing}
                    label={isCheckbox ? field.label : null}
                  />
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const StepField: React.FC<{
  field: SteppableField
  form: FormType
  isActive: boolean
  isProcessing: boolean
}> = ({ field, form, isActive, isProcessing }) => {
  const FieldComponent = cmsFields?.[field.blockType]
  const useSelectCards = field.blockType === 'select'

  return (
    <div
      aria-hidden={!isActive}
      className={classes.stepBody}
      hidden={!isActive}
    >
      {useSelectCards ? (
        <SelectCards
          label={field.label}
          name={field.name}
          options={field.options}
          path={field.name}
          required={field.required}
        />
      ) : (
        <>
          {'label' in field && field.label && <p className={classes.question}>{field.label}</p>}
          {FieldComponent ? (
            <div className={classes.fieldWrap}>
              <FieldComponent
                form={form}
                path={field.name}
                {...field}
                disabled={isProcessing}
                label={null}
              />
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}

const StepNavigator: React.FC<{
  form: FormType
  steps: WizardStep[]
  whatsappUrl?: null | string
}> = ({ form, steps, whatsappUrl }) => {
  const [stepIndex, setStepIndex] = useState(0)
  const [stepError, setStepError] = useState<string | null>(null)
  const { dispatchFields, getField, handleSubmit } = useForm()
  const isProcessing = useFormProcessing()

  const totalSteps = steps.length
  const currentStep = steps[stepIndex]
  const isLastStep = stepIndex === totalSteps - 1
  const progress = totalSteps > 0 ? ((stepIndex + 1) / totalSteps) * 100 : 0
  const currentLabel = currentStep?.label || 'Continue'
  const showWhatsApp = isLastStep && Boolean(whatsappUrl)

  const validateCurrentStep = useCallback(() => {
    if (!currentStep) {
      return true
    }

    const fieldsToValidate =
      currentStep.kind === 'contact' ? currentStep.fields : [currentStep.field]

    let hasError = false

    for (const field of fieldsToValidate) {
      const fieldState = getField(field.name)
      const value = fieldState?.value
      const empty = isFieldValueEmpty(field, value)

      if (field.required && empty) {
        hasError = true
        dispatchFields({
          type: 'UPDATE',
          payload: {
            errorMessage: STEP_VALIDATION_MESSAGE,
            path: field.name,
            valid: false,
            value: value ?? (field.blockType === 'checkbox' ? false : ''),
          },
        })
      }
    }

    if (hasError) {
      setStepError(STEP_VALIDATION_MESSAGE)
      return false
    }

    setStepError(null)
    return true
  }, [currentStep, dispatchFields, getField])

  const goNext = useCallback(() => {
    if (!validateCurrentStep()) {
      return
    }

    if (isLastStep) {
      if (typeof handleSubmit === 'function') {
        void handleSubmit({
          preventDefault() {},
          stopPropagation() {},
        } as React.ChangeEvent<HTMLFormElement>)
      }
      return
    }

    setStepIndex((index) => Math.min(index + 1, totalSteps - 1))
  }, [handleSubmit, isLastStep, totalSteps, validateCurrentStep])

  const goBack = useCallback(() => {
    setStepError(null)
    setStepIndex((index) => Math.max(index - 1, 0))
  }, [])

  if (!currentStep) {
    return null
  }

  return (
    <div className={classes.panel}>
      <div className={classes.stepMeta}>
        <p className={classes.stepCount}>
          Step <strong>{stepIndex + 1}</strong> of {totalSteps}
        </p>
        <p className={classes.stepHint}>{currentLabel}</p>
      </div>

      <div className={classes.progressTrack} aria-hidden>
        <div className={classes.progressFill} style={{ width: `${progress}%` }} />
      </div>

      {/* Keep every step mounted so values survive step changes */}
      {steps.map((step, index) => {
        if (step.kind === 'contact') {
          return (
            <ContactDetailsStep
              fields={step.fields}
              form={form}
              isActive={index === stepIndex}
              isProcessing={isProcessing}
              key="contact-details"
            />
          )
        }

        return (
          <StepField
            field={step.field}
            form={form}
            isActive={index === stepIndex}
            isProcessing={isProcessing}
            key={getStepFieldKey(step.field, index)}
          />
        )
      })}

      {stepError ? (
        <p className={classes.stepValidation} role="alert">
          {stepError}
        </p>
      ) : null}

      <div className={classes.nav}>
        {stepIndex > 0 ? (
          <button className={classes.backButton} onClick={goBack} type="button">
            Back
          </button>
        ) : (
          <span />
        )}
        <div className={classes.navActions}>
          {showWhatsApp ? (
            <a
              className={classes.whatsappButton}
              href={whatsappUrl || undefined}
              rel="noopener noreferrer"
              target="_blank"
            >
              Chat on WhatsApp
            </a>
          ) : null}
          <button
            className={classes.nextButton}
            disabled={isProcessing}
            onClick={goNext}
            type="button"
          >
            {isProcessing
              ? 'Submitting...'
              : isLastStep
                ? form.submitButtonLabel || 'Submit'
                : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

export type StepFormWizardProps = {
  form: FormType
  formSource?: string
  onSubmitted?: () => void
  steps?: WizardStep[]
  variant?: 'modal' | 'page'
  whatsappUrl?: null | string
}

export const StepFormWizard: React.FC<StepFormWizardProps> = ({
  form,
  formSource = FORM_SOURCES.CONTACT,
  onSubmitted,
  steps: stepsFromProps,
  variant = 'page',
  whatsappUrl,
}) => {
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initialState = useMemo(() => buildInitialState(form.fields ?? []), [form.fields])
  const formFields = useMemo(
    () => (form.fields || []).filter(isSteppableField),
    [form.fields],
  )
  const steps = stepsFromProps ?? buildWizardSteps(formFields)
  const resolvedWhatsAppUrl = resolveWhatsAppUrl(whatsappUrl)

  const onSubmit = useCallback(
    async ({ data }: { data: Record<string, unknown> }) => {
      const trackingFields = buildTrackingSubmissionData({
        formSource,
        pathname,
        search: searchParams?.toString(),
      })
      const dataToSend = mergeSubmissionData(data, trackingFields)

      const hubspotCookie = getCookie('hubspotutk')
      const pageUri = `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}`
      const slugParts = pathname?.split('/')
      const pageName = slugParts?.at(-1) === '' ? 'Home' : slugParts?.at(-1)

      const req = await fetch('/api/form-submissions', {
        body: JSON.stringify({
          form: form.id,
          hubspotCookie,
          pageName,
          pageUri,
          submissionData: dataToSend,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!req.ok) {
        const body = await req.json().catch(() => ({}))
        for (const error of body?.errors || []) {
          toast.error(error.message)
        }
        throw new Error('Form submission failed')
      }

      setHasSubmitted(true)
      toast.success('Form submitted successfully!')
      onSubmitted?.()

      if (form.confirmationType === 'redirect' && form.redirect?.url) {
        const url = form.redirect.url
        const redirectUrl = new URL(url, process.env.NEXT_PUBLIC_SITE_URL)
        const firstSelect = form.fields?.find(
          (field) => field.blockType === 'select' && 'name' in field,
        )

        if (firstSelect && 'name' in firstSelect) {
          const submittedValue = data[firstSelect.name]

          if (submittedValue) {
            redirectUrl.searchParams.set('project', String(submittedValue))
          }
        }

        if (url.startsWith('/') || redirectUrl.origin === process.env.NEXT_PUBLIC_SITE_URL) {
          router.push(`${redirectUrl.pathname}${redirectUrl.search}`)
        } else {
          window.location.assign(redirectUrl.href)
        }
      }
    },
    [
      form.confirmationType,
      form.fields,
      form.id,
      form.redirect?.url,
      formSource,
      onSubmitted,
      pathname,
      router,
      searchParams,
    ],
  )

  if (hasSubmitted && form.confirmationType === 'message') {
    return (
      <div className={classes.confirmation}>
        <RichText content={form.confirmationMessage} />
      </div>
    )
  }

  if (hasSubmitted) {
    return (
      <div className={classes.confirmation}>
        <p>Thank you — we received your enquiry.</p>
      </div>
    )
  }

  return (
    <Form formId={form.id} initialState={initialState} onSubmit={onSubmit}>
      <div className={variant === 'modal' ? classes.modalWizard : undefined}>
        <StepNavigator form={form} steps={steps} whatsappUrl={resolvedWhatsAppUrl} />
      </div>
    </Form>
  )
}

const StepFormInner: React.FC<{
  form: FormType
  formSource?: string
  steps: WizardStep[]
  whatsappUrl?: null | string
}> = ({ form, formSource, steps, whatsappUrl }) => {
  return (
    <StepFormWizard
      form={form}
      formSource={formSource}
      steps={steps}
      variant="page"
      whatsappUrl={whatsappUrl}
    />
  )
}

export const CorespaceStepForm: React.FC<CorespaceStepFormProps> = ({
  eyebrow,
  form,
  heading,
  sidebarBody,
  sidebarPoints,
  sidebarTitle,
  whatsappUrl,
}) => {
  const pathname = usePathname()
  const resolvedWhatsAppUrl = resolveWhatsAppUrl(whatsappUrl)
  if (!form || typeof form === 'string') {
    return (
      <div className={classes.stepForm}>
        <div className={classes.header}>
          {eyebrow && <p className={classes.eyebrow}>{eyebrow}</p>}
          {heading && <h2 className={classes.heading}>{heading}</h2>}
        </div>
        <p className={classes.empty}>Select a form in the CMS to display this step form.</p>
      </div>
    )
  }

  const formFields = (form.fields || []).filter(isSteppableField)
  const steps = buildWizardSteps(formFields)
  const formSource = pathname === '/contact' ? FORM_SOURCES.CONTACT : FORM_SOURCES.PAGE

  if (!formFields.length) {
    return (
      <div className={classes.stepForm}>
        <div className={classes.header}>
          {eyebrow && <p className={classes.eyebrow}>{eyebrow}</p>}
          {heading && <h2 className={classes.heading}>{heading}</h2>}
        </div>
        <p className={classes.empty}>This form has no fields yet. Add fields in Forms.</p>
      </div>
    )
  }

  return (
    <div className={classes.stepForm}>
      <div className={classes.header}>
        {eyebrow && (
          <p className={classes.eyebrow}>
            <span className={classes.eyebrowDash} aria-hidden>
              —
            </span>
            {eyebrow}
            <span className={classes.eyebrowDash} aria-hidden>
              —
            </span>
          </p>
        )}
        {heading && <h2 className={classes.heading}>{heading}</h2>}
      </div>

      <div className={classes.card}>
        <aside className={classes.sidebar}>
          {sidebarTitle && <h3 className={classes.sidebarTitle}>{sidebarTitle}</h3>}
          {sidebarBody && <p className={classes.sidebarBody}>{sidebarBody}</p>}
          {sidebarPoints?.length ? (
            <ul className={classes.sidebarList}>
              {sidebarPoints.map((point, index) => (
                <li key={point.id ?? `${point.text}-${index}`}>{point.text}</li>
              ))}
            </ul>
          ) : null}
        </aside>

        <div className={classes.formSide}>
          <StepFormInner
            form={form}
            formSource={formSource}
            steps={steps}
            whatsappUrl={resolvedWhatsAppUrl}
          />
        </div>
      </div>
    </div>
  )
}
