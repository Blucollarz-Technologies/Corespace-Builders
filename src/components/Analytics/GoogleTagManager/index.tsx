import React from 'react'

/** Live GTM container — override with NEXT_PUBLIC_GTM_MEASUREMENT_ID if needed. */
export const GTM_ID =
  process.env.NEXT_PUBLIC_GTM_MEASUREMENT_ID?.trim() || 'GTM-M54MD6F2'

/**
 * Official GTM head snippet as a native <script> (not next/script).
 * Tag Assistant flags afterInteractive / altered wrappers as incorrect installs.
 */
export const GoogleTagManagerHead: React.FC = () => {
  if (!GTM_ID) {
    return null
  }

  // Exact Google Tag Manager container snippet (head)
  const snippet = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`

  return (
    <script dangerouslySetInnerHTML={{ __html: snippet }} id="google-tag-manager" />
  )
}

/**
 * Official GTM noscript — immediately after the opening <body> tag.
 */
export const GoogleTagManagerNoScript: React.FC = () => {
  if (!GTM_ID) {
    return null
  }

  return (
    <noscript>
      <iframe
        height="0"
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
        width="0"
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
