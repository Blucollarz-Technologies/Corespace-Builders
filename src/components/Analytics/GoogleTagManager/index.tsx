import React from 'react'

/** Live GTM container — override with NEXT_PUBLIC_GTM_MEASUREMENT_ID if needed. */
export const GTM_ID =
  process.env.NEXT_PUBLIC_GTM_MEASUREMENT_ID?.trim() || 'GTM-M54MD6F2'

/**
 * Official GTM <head> snippet (unmodified Google bootstrap).
 *
 * Do NOT also install a separate Google Ads / GA4 gtag.js snippet on the page
 * when GTM is present — Tag Assistant flags that as "installed incorrectly".
 * Add AW-… / GA4 tags inside the GTM container instead.
 *
 * Do NOT use next/script here — beforeInteractive wraps code in self.__next_s,
 * which Tag Assistant does not treat as a valid Google tag.
 */
export const GoogleTagManagerHead: React.FC = () => {
  if (!GTM_ID) {
    return null
  }

  // Exact official bootstrap from Google Tag Manager install instructions.
  const snippet = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`

  return (
    <>
      {/* Google Tag Manager */}
      <script dangerouslySetInnerHTML={{ __html: snippet }} />
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
