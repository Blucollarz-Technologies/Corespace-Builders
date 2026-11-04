/**
 * Normalize CMS slugs for Next.js static paths.
 * Rejects empty values and control/whitespace characters that break Windows mkdir
 * (e.g. category slug "\\tcommercial-construction").
 */
export const sanitizePathSegment = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  // No path separators, reserved Windows chars, or remaining whitespace/control chars
  if (/[\u0000-\u001f\\/<>:"|?*\s]/.test(trimmed)) {
    return null
  }

  return trimmed
}
