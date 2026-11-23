/* Google Consent Mode v2 defaults — must run before gtm-bootstrap.js.
 * Privacy UI updates consent via setGtmConsent() in the React app. */
window.dataLayer = window.dataLayer || []
function gtag() {
  dataLayer.push(arguments)
}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 2000,
})