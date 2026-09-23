'use client'

import type { Form as FormType } from '@root/payload-types'

import { RichText } from '@components/RichText/index'
import Form from '@forms/Form/index'
import { CrosshairIcon } from '@root/icons/CrosshairIcon/index'
import { getCookie } from '@root/utilities/get-cookie'
import {
  buildTrackingSubmissionData,
  FORM_SOURCES,
  mergeSubmissionData,
  type FormSource,
} from '@root/utilities/formTracking'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

import { fields } from './fields'
import classes from './index.module.scss'
import Submit from './Submit/index'

const buildInitialState = (fields) => {
  const state = {}

  fields.forEach((field) => {
    state[field.name] = {
      errorMessage: 'This field is required.',
      initialValue: field.defaultValue ?? undefined,
      valid: !field.required || field.defaultValue !== undefined,
      value: field.defaultValue ?? undefined,
    }
  })

  return state
}

const RenderForm = ({
  form,
  formSource,
  hiddenFields,
}: {
  form: FormType
  formSource: FormSource | string
  hiddenFields: string[]
}) => {
  const {
    id: formID,
    confirmationMessage,
    confirmationType,
    customID,
    redirect: formRedirect,
    submitButtonLabel,
  } = form

  const [isLoading, setIsLoading] = React.useState(false)

  const [hasSubmitted, setHasSubmitted] = React.useState<boolean>()

  const [error, setError] = React.useState<{ message: string; status?: string } | undefined>()

  const initialState = buildInitialState(form.fields ?? [])

  const router = useRouter()

  const pathname = usePathname()
  const searchParams = useSearchParams()

  const onSubmit = React.useCallback(
    ({ data }) => {
      const submitForm = async () => {
        setError(undefined)

        setIsLoading(true)

        const trackingFields = buildTrackingSubmissionData({
          formSource,
          pathname,
          search: searchParams?.toString(),
        })
        const dataToSend = mergeSubmissionData(data, trackingFields)

        try {
          const hubspotCookie = getCookie('hubspotutk')
          const pageUri = `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}`
          const slugParts = pathname?.split('/')
          const pageName = slugParts?.at(-1) === '' ? 'Home' : slugParts?.at(-1)
          const req = await fetch('/api/form-submissions', {
            body: JSON.stringify({
              form: formID,
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
            const { errors } = await req.json()
            for (const error of errors) {
              toast.error(error.message)
            }
            setIsLoading(false)
            return
          }

          setIsLoading(false)
          setHasSubmitted(true)
          toast.success('Form submitted successfully!')

          if (confirmationType === 'redirect' && formRedirect) {
            const { url } = formRedirect

            if (!url) {
              return
            }

            const redirectUrl = new URL(url, process.env.NEXT_PUBLIC_SITE_URL)

            try {
              if (url.startsWith('/') || redirectUrl.origin === process.env.NEXT_PUBLIC_SITE_URL) {
                router.push(redirectUrl.href)
              } else {
                window.location.assign(url)
              }
            } catch (err) {
              console.warn(err) // eslint-disable-line no-console
              toast.error('Something went wrong. Did not redirect.')
            }
          }
        } catch (err) {
          console.warn(err) // eslint-disable-line no-console
          setIsLoading(false)
          toast.error('Something went wrong.')
        }
      }

      void submitForm()
    },
    [router, formID, formRedirect, confirmationType, formSource, pathname, searchParams],
  )

  if (!form?.id) {
    return null
  }

  return (
    <div className={classes.cmsForm}>
      {!isLoading && hasSubmitted && confirmationType === 'message' && (
        <RichText className={classes.confirmationMessage} content={confirmationMessage} />
      )}
      {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
      {!hasSubmitted && (
        <React.Fragment>
          <Form formId={formID} initialState={initialState} onSubmit={onSubmit}>
            <div className={classes.formFieldsWrap}>
              {form.fields?.map((field, index) => {
                const Field: React.FC<any> = fields?.[field.blockType]
                const isLastField = index === (form.fields?.length ?? 0) - 1
                if (Field) {
                  return (
                    <div
                      className={[
                        classes.fieldWrap,
                        field.blockType !== 'message' && hiddenFields.includes(field.name)
                          ? classes.hidden
                          : '',
                        !isLastField ? classes.hideBottomBorder : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      key={index}
                    >
                      <Field
                        form={form}
                        path={'name' in field ? field.name : undefined}
                        {...field}
                        disabled={isLoading}
                      />
                    </div>
                  )
                }
                return null
              })}
              <CrosshairIcon className={[classes.crosshair, classes.crosshairLeft].join(' ')} />
            </div>
            <Submit
              className={[classes.submitButton, classes.hideTopBorder].filter(Boolean).join(' ')}
              disabled={isLoading}
              icon={isLoading ? 'loading' : 'arrow'}
              iconRotation={45}
              iconSize={isLoading ? 'large' : 'medium'}
              id={customID ?? formID}
              label={isLoading ? 'Submitting...' : submitButtonLabel}
            />
          </Form>
        </React.Fragment>
      )}
    </div>
  )
}

export const CMSForm: React.FC<{
  form?: FormType | null | string
  formSource?: FormSource | string
  hiddenFields?: string[]
}> = (props) => {
  const { form, formSource = FORM_SOURCES.CONTACT, hiddenFields } = props

  if (!form || typeof form === 'string') {
    return null
  }

  return <RenderForm form={form} formSource={formSource} hiddenFields={hiddenFields ?? []} />
}
