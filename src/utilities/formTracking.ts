export const FORM_NOTIFICATION_EMAIL = 'corespacebuilders@gmail.com'

/**
 * SendGrid "from" address. Must be a verified sender/domain in SendGrid.
 * Do not use the Gmail inbox as From — Gmail rejects / drops that via API.
 */
export const FORM_FROM_EMAIL =
  process.env.FORM_FROM_EMAIL || 'noreply@corespacebuilders.com'

/** Default success destination for all master lead-form submissions. */
export const FORM_THANK_YOU_PATH = '/thank-you'

export const FORM_SOURCES = {
  CONSULTATION_PLAN: 'Consultation Plan',
  CONTACT: 'Contact',
  COST_ESTIMATE: 'Cost Estimate',
  PAGE: 'Page',
  POPUP: 'Popup',
} as const

export type FormSource = (typeof FORM_SOURCES)[keyof typeof FORM_SOURCES]

/**
 * Prefer CMS redirect when set; otherwise always land on /thank-you.
 */
export function resolveFormThankYouPath(redirectUrl?: null | string): string {
  const trimmed = redirectUrl?.trim()
  if (!trimmed) {
    return FORM_THANK_YOU_PATH
  }

  try {
    if (trimmed.startsWith('/')) {
      return trimmed.split('?')[0] || FORM_THANK_YOU_PATH
    }

    const parsed = new URL(trimmed, process.env.NEXT_PUBLIC_SITE_URL || 'https://www.corespacebuilders.com')
    return parsed.pathname || FORM_THANK_YOU_PATH
  } catch {
    return FORM_THANK_YOU_PATH
  }
}

export type TrackingField = {
  field: string
  value: string
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

export function getUtmParams(search: string = ''): Record<string, string> {
  if (!search) {
    return {}
  }

  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`)
  const utm: Record<string, string> = {}

  for (const key of UTM_KEYS) {
    const value = params.get(key)
    if (value) {
      utm[key] = value
    }
  }

  return utm
}

export function buildTrackingSubmissionData({
  formSource,
  pathname,
  search,
}: {
  formSource: FormSource | string
  pathname: string
  search?: string
}): TrackingField[] {
  const utm = getUtmParams(search)
  const sourcePage = pathname || '/'

  const fields: TrackingField[] = [
    { field: 'form_source', value: formSource },
    { field: 'source_page', value: sourcePage },
  ]

  for (const [key, value] of Object.entries(utm)) {
    fields.push({ field: key, value })
  }

  return fields
}

export function mergeSubmissionData(
  formData: Record<string, unknown>,
  trackingFields: TrackingField[],
): TrackingField[] {
  const dataToSend: TrackingField[] = Object.entries(formData).map(([name, value]) => ({
    field: name,
    value: value == null ? '' : String(value),
  }))

  const existingFields = new Set(dataToSend.map((entry) => entry.field))

  for (const trackingField of trackingFields) {
    if (!existingFields.has(trackingField.field)) {
      dataToSend.push(trackingField)
    }
  }

  return dataToSend
}
