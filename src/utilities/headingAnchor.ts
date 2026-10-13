import slugify from '@root/utilities/slugify'

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
