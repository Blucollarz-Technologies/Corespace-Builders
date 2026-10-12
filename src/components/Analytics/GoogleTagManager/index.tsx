import Script from 'next/script'
import React from 'react'

/** Live GTM container — override with NEXT_PUBLIC_GTM_MEASUREMENT_ID if needed. */
export const GTM_ID =
  process.env.NEXT_PUBLIC_GTM_MEASUREMENT_ID?.trim() || 'GTM-M54MD6F2'

/**
 * Head snippet — place as high as possible inside <head>.
 */
export const GoogleTagManagerHead: React.FC = () => {
  if (!GTM_ID) {
    return null
  }

  return (
    <Script
      id="google-tag-manager"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
      }}
    />
  )
}

/**
 * Body noscript — place immediately after the opening <body> tag.
 */
export const GoogleTagManagerNoScript: React.FC = () => {
  if (!GTM_ID) {
    return null
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  )
}

/** @deprecated Prefer GoogleTagManagerHead + GoogleTagManagerNoScript */
export const GoogleTagManager: React.FC = () => (
  <>
    <GoogleTagManagerHead />
    <GoogleTagManagerNoScript />
  </>
)
