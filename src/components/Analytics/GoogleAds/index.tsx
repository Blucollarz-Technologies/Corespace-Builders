import React from 'react'

/** Google Ads / Google tag ID from Ads setup wizard. */
export const GOOGLE_ADS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() || 'AW-18530648004'

/**
 * Direct Google Ads gtag.js install.
 *
 * Prefer installing AW-… through Google Tag Manager instead of this component.
 * Loading both GTM and this snippet makes Tag Assistant report
 * "A tag on this page is installed incorrectly".
 *
 * Kept for reference / emergency use only — not mounted in root layout.
 */
export const GoogleAdsHead: React.FC = () => {
  if (!GOOGLE_ADS_ID) {
    return null
  }

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');`,
        }}
      />
    </>
  )
}
