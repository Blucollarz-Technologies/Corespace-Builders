import { resolveCorespaceUrl } from './resolveCorespaceUrl'
import { resolveWhatsAppUrl } from './whatsapp'

const WHATSAPP_HINT = /whatsapp|wa\.me|api\.whatsapp\.com/i
/** Broken path left when wa.me was stripped to pathname only */
const STRIPPED_WA_PATH = /^\/\d{10,15}(\?|$)/

/**
 * Final public href for CMS links / buttons.
 * - Keeps WhatsApp absolute
 * - Repairs already-broken /9190… paths
 * - Canonicalizes internal Corespace routes
 */
export function finalizePublicHref(href?: null | string, label?: null | string): string {
  if (!href) {
    return ''
  }

  const trimmed = href.trim()
  const looksLikeWhatsApp =
    WHATSAPP_HINT.test(trimmed) ||
    WHATSAPP_HINT.test(label ?? '') ||
    STRIPPED_WA_PATH.test(trimmed)

  if (looksLikeWhatsApp) {
    if (STRIPPED_WA_PATH.test(trimmed)) {
      return resolveWhatsAppUrl(`https://wa.me${trimmed}`)
    }
    return resolveWhatsAppUrl(trimmed)
  }

  return resolveCorespaceUrl(trimmed) || trimmed
}
