export const WHATSAPP_PHONE_NUMBER = '919035676667'

export const WHATSAPP_PREFILL_MESSAGE =
  "Hi, I'm interested in discussing a project with Corespace Builders. Please guide me on the next steps."

export const WHATSAPP_LINK =
  'https://wa.me/919035676667?text=Hi%2C%20I%27m%20interested%20in%20discussing%20a%20project%20with%20Corespace%20Builders.%20Please%20guide%20me%20on%20the%20next%20steps.'

export const WHATSAPP_CTA_LABEL = 'Chat with us on WhatsApp'

export const DEFAULT_WHATSAPP_LINK = {
  type: 'custom' as const,
  label: WHATSAPP_CTA_LABEL,
  url: WHATSAPP_LINK,
  newTab: true,
}

export const isPlaceholderWhatsAppUrl = (url?: null | string) =>
  !url || url === 'https://wa.me/' || url.includes('XXXXXXXXXX') || url.includes('919876543210')

export const resolveWhatsAppUrl = (url?: null | string): string => {
  if (!url || isPlaceholderWhatsAppUrl(url)) {
    return WHATSAPP_LINK
  }

  return url
}
