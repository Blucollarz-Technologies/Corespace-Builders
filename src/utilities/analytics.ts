import { pushDataLayer } from './gtm'

const gaMeasurementID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()
const pixelID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID

/** Accept only a real GA4 measurement ID (G-XXXX). Never a URL. */
const isValidGa4Id = (id: string | undefined): id is string =>
  Boolean(id && /^G-[A-Z0-9]+$/i.test(id))

export function analyticsEvent(event: string, value?: Record<string, unknown>): void {
  const Window = window as any // eslint-disable-line @typescript-eslint/no-explicit-any

  // Primary path: GTM listens for custom events on dataLayer.
  pushDataLayer({
    event,
    ...(value && typeof value === 'object' ? value : {}),
  })

  // Optional: forward to gtag when GA4 tag in GTM has created window.gtag.
  if (isValidGa4Id(gaMeasurementID) && typeof Window.gtag === 'function') {
    Window.gtag('event', event, value)
  }

  if (pixelID) {
    void import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        if (event === 'page_view') {
          ReactPixel.pageView()
        } else {
          ReactPixel.track(event, value)
        }
      })
  }
}
