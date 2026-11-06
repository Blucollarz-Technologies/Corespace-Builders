import React from 'react'

/** Google Ads / Google tag ID from Ads setup wizard. */
export const GOOGLE_ADS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() || 'AW-18530648004'

/**
 * Direct Google Ads gtag.js install — DISABLED on purpose.
 *
 * This site uses Google Tag Manager (`GTM-M54MD6F2`) as the only page-level
 * Google tag. Loading AW-… via gtag.js alongside GTM makes Tag Assistant report
 * "A tag on this page is installed incorrectly" (Google: use GTM or gtag, not both).
 *
 * Add `AW-18530648004` as a Google Ads tag inside the GTM container, then publish.
 * This component always returns null so a mistaken import cannot break Tag Assistant again.
 */
export const GoogleAdsHead: React.FC = () => {
  void GOOGLE_ADS_ID
  return null
}
