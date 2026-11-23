type DataLayerItem = Record<string, unknown> | unknown[]

declare global {
  interface Window {
    dataLayer?: DataLayerItem[]
  }
}

export function gtag(...args: unknown[]): void {
  if (typeof window === 'undefined') {
    return
  }
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(args)
}

/** Sync cookie banner choice with Google Consent Mode (tags in GTM respect this). */
export function setGtmConsent(granted: boolean): void {
  gtag('consent', 'update', {
    ad_personalization: granted ? 'granted' : 'denied',
    ad_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
  })
}

export function pushDataLayer(payload: Record<string, unknown>): void {
  if (typeof window === 'undefined') {
    return
  }
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(payload)
}

/** Next.js client navigations — create a GTM Custom Event trigger on `virtual_page_view`. */
export function trackVirtualPageView(path: string): void {
  const pageLocation =
    typeof window !== 'undefined' ? `${window.location.origin}${path}` : path

  pushDataLayer({
    event: 'virtual_page_view',
    page_location: pageLocation,
    page_path: path,
    page_title: typeof document !== 'undefined' ? document.title : undefined,
  })
}

/** Wire a GA4 Event tag in GTM to Custom Event `generate_lead`. */
export function trackFormSubmit(params: {
  formId: string
  formName?: string
  source?: string
}): void {
  pushDataLayer({
    event: 'generate_lead',
    form_id: params.formId,
    form_name: params.formName,
    form_source: params.source,
  })
}

/** Wire a GA4 Event tag in GTM to Custom Event `whatsapp_click`. */
export function trackWhatsAppClick(params?: { label?: string; url?: string }): void {
  pushDataLayer({
    event: 'whatsapp_click',
    link_text: params?.label,
    link_url: params?.url,
  })
}