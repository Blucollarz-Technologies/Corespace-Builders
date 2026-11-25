import React from 'react'

/** Live GTM container — override with NEXT_PUBLIC_GTM_MEASUREMENT_ID if needed. */
export const GTM_ID =
  process.env.NEXT_PUBLIC_GTM_MEASUREMENT_ID?.trim() || 'GTM-M54MD6F2'

/**
 * Official GTM <head> install.
 *
 * Loaded from `/gtm-bootstrap.js` (not inline) so Next.js App Router does not
 * serialize a second, escaped copy of the snippet into RSC flight data.
 * Tag Assistant treats that duplicate as "installed incorrectly".
 *
 * Do NOT also install a separate Google Ads / GA4 gtag.js snippet on the page
 * when GTM is present. Configure AW-… / G-… tags inside the GTM container.
 */
export const GoogleTagManagerHead: React.FC = () => {
  if (!GTM_ID) {
    return null
  }

  // External bootstrap keeps the official snippet unmodified in page source.
  // ID is fixed in public/gtm-bootstrap.js to match production GTM-M54MD6F2.
  return (
    <>
      {/* Consent Mode defaults — before GTM bootstrap */}
      <script src="/gtm-consent-defaults.js" />
      {/* Google Tag Manager */}
      <script src="/gtm-bootstrap.js" />
      {/* End Google Tag Manager */}
    </>
  )
}

/**
 * Official GTM <noscript> — must be as high as possible in <body>.
 */
export const GoogleTagManagerNoScript: React.FC = () => {
  if (!GTM_ID) {
    return null
  }

  return (
    <>
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
          title="Google Tag Manager"
        />
      </noscript>
      {/* End Google Tag Manager (noscript) */}
    </>
  )
}

/** @deprecated Prefer GoogleTagManagerHead + GoogleTagManagerNoScript */
export const GoogleTagManager: React.FC = () => (
  <>
    <GoogleTagManagerHead />
    <GoogleTagManagerNoScript />
  </>
)
