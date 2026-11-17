import { monthNamesAbbr } from '@root/utilities/format-date-time'

/** Compact article card date, e.g. "Jun 2026". */
export const formatArticleCardDate = (date: Date | string | null | undefined): string => {
  if (!date) {
    return ''
  }

  try {
    const value = new Date(date)
    if (Number.isNaN(value.getTime())) {
      return ''
    }
    return `${monthNamesAbbr[value.getMonth()]} ${value.getFullYear()}`
  } catch {
    return ''
  }
}
