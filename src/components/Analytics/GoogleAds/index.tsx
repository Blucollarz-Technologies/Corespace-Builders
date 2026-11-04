import React from 'react'

/** Google Ads / Google tag ID from Ads setup wizard. */
export const GOOGLE_ADS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() || 'AW-18530648004'

/**
 * Official Google tag (gtag.js) for Google Ads.
 * Must appear in <head> as native scripts so Ads / Tag Assistant can detect it.
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
