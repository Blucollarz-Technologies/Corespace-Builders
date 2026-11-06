import slugify from '@root/utilities/slugify'

const LEADING_NUMBER_RE = /^\s*\d+\s*[\.\)\:\-–—]\s+/
const LEADING_BARE_NUMBER_RE = /^\s*\d+\s+\S/

/** True when the CMS heading starts with an author-entered list number. */
export const hasLeadingHeadingNumber = (text: string): boolean =>
  LEADING_NUMBER_RE.test(text) || LEADING_BARE_NUMBER_RE.test(text)

/**
 * Remove author-entered list numbers from heading copy so a TOC `<ol>`
 * does not show duplicates like "2. 1. Begin with the Plot…".
 */
export const stripLeadingHeadingNumber = (text: string): string => {
  const cleaned = text
    .replace(LEADING_NUMBER_RE, '')
    .replace(/^\s*\d+\s+/, '')
    .trim()

  return cleaned || text.trim()
}

/**
 * Shared H2 → anchor id logic so TOC links match rendered heading ids.
 * Supports optional `#custom-id` suffix in the heading text.
 */
export const resolveHeadingAnchor = (
  rawText: string,
): {
  id: string
  text: string
} => {
  const trimmed = rawText.replace(/\s+/g, ' ').trim()
  if (!trimmed) {
    return { id: 'section', text: '' }
  }

  const hashIndex = trimmed.lastIndexOf('#')
  if (hashIndex > 0) {
    const text = trimmed.slice(0, hashIndex).trim()
    const custom = trimmed.slice(hashIndex + 1).trim()
    if (text && custom) {
      return { id: slugify(custom) || 'section', text }
    }
  }

  return { id: slugify(trimmed) || 'section', text: trimmed }
}
