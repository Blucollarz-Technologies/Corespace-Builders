import type { Post } from '@root/payload-types'

import {
  hasLeadingHeadingNumber,
  resolveHeadingAnchor,
  stripLeadingHeadingNumber,
} from '@root/utilities/headingAnchor'

export type PostTocItem = {
  id: string
  text: string
}

const FAQ_HEADING_RE = /^(frequently\s+asked\s+questions?|faqs?)$/i
const CONCLUSION_HEADING_RE = /^conclusion\b/i

const getLexicalText = (node: unknown): string => {
  if (node == null) {
    return ''
  }

  if (typeof node === 'string') {
    return node
  }

  if (Array.isArray(node)) {
    return node.map(getLexicalText).join('')
  }

  if (typeof node !== 'object') {
    return ''
  }

  const value = node as Record<string, unknown>

  if (typeof value.text === 'string') {
    return value.text
  }

  if (Array.isArray(value.children)) {
    return value.children.map(getLexicalText).join('')
  }

  return ''
}

const isFaqSectionHeading = (text: string): boolean => FAQ_HEADING_RE.test(text.trim())

const isConclusionHeading = (text: string): boolean => CONCLUSION_HEADING_RE.test(text.trim())

/** Individual FAQ items are usually written as questions (often numbered). */
const isFaqQuestionHeading = (text: string): boolean => {
  const trimmed = text.trim()
  if (!trimmed) {
    return false
  }

  if (trimmed.endsWith('?')) {
    return true
  }

  // "1. Can I buy…" without a trailing ? still belongs under FAQ.
  return hasLeadingHeadingNumber(trimmed) && /\b(can|what|is|should|does|do|how|why|when|where)\b/i.test(trimmed)
}

const pushHeading = (rawText: string, out: Array<{ id: string; text: string; raw: string }>) => {
  const { id, text } = resolveHeadingAnchor(rawText)
  if (!text) {
    return
  }

  out.push({
    id,
    raw: text,
    text: stripLeadingHeadingNumber(text),
  })
}

const walkLexicalForH2 = (node: unknown, out: Array<{ id: string; text: string; raw: string }>) => {
  if (!node || typeof node !== 'object') {
    return
  }

  if (Array.isArray(node)) {
    node.forEach((child) => walkLexicalForH2(child, out))
    return
  }

  const value = node as Record<string, unknown>

  if (value.type === 'heading' && value.tag === 'h2') {
    pushHeading(getLexicalText(value), out)
    return
  }

  if (value.root) {
    walkLexicalForH2(value.root, out)
  }

  if (Array.isArray(value.children)) {
    walkLexicalForH2(value.children, out)
  }
}

const extractMarkdownH2 = (markdown: string, out: Array<{ id: string; text: string; raw: string }>) => {
  const matches = markdown.matchAll(/^##\s+(.+)$/gm)
  for (const match of matches) {
    pushHeading(match[1] || '', out)
  }
}

/**
 * Keep TOC to main article sections only:
 * - intro / top-level unnumbered sections
 * - numbered main steps (1., 2., …)
 * - a single "Frequently Asked Questions" entry (not each FAQ question)
 * - conclusion
 *
 * Drops nested subsection H2s under numbered steps and individual FAQ questions.
 */
export const filterMainTocSections = (
  headings: Array<{ id: string; text: string; raw: string }>,
): PostTocItem[] => {
  const items: PostTocItem[] = []
  let afterNumberedSection = false
  let inFaqSection = false
  let faqAdded = false

  for (const heading of headings) {
    const raw = heading.raw.trim()
    const text = heading.text.trim()

    if (isFaqSectionHeading(raw) || isFaqSectionHeading(text)) {
      if (!faqAdded) {
        items.push({
          id: heading.id,
          text: 'Frequently Asked Questions',
        })
        faqAdded = true
      }
      inFaqSection = true
      afterNumberedSection = false
      continue
    }

    if (inFaqSection) {
      if (isFaqQuestionHeading(raw) || isFaqQuestionHeading(text)) {
        continue
      }

      // Left the FAQ block (e.g. Conclusion).
      inFaqSection = false
    }

    if (hasLeadingHeadingNumber(raw)) {
      items.push({ id: heading.id, text })
      afterNumberedSection = true
      continue
    }

    if (isConclusionHeading(raw) || isConclusionHeading(text)) {
      items.push({ id: heading.id, text })
      afterNumberedSection = false
      continue
    }

    // Unnumbered H2s that appear between numbered steps are subsections — skip them.
    if (afterNumberedSection) {
      continue
    }

    items.push({ id: heading.id, text })
  }

  return items
}

/**
 * Collect H2 headings from post content blocks for an auto Table of Contents.
 * Supports Lexical `blogContent` and Markdown `blogMarkdown` blocks.
 */
export const extractPostH2Headings = (
  content: Post['content'] | null | undefined,
): PostTocItem[] => {
  if (!content?.length) {
    return []
  }

  const flat: Array<{ id: string; text: string; raw: string }> = []

  for (const block of content) {
    if (!block || typeof block !== 'object') {
      continue
    }

    if (block.blockType === 'blogContent') {
      walkLexicalForH2(block.blogContentFields?.richText, flat)
    }

    if (block.blockType === 'blogMarkdown') {
      const markdown = block.blogMarkdownFields?.markdown
      if (typeof markdown === 'string') {
        extractMarkdownH2(markdown, flat)
      }
    }
  }

  return filterMainTocSections(flat)
}

/** Longer articles only — short posts stay clean without a TOC. */
export const MIN_TOC_HEADINGS = 3

export const countPostTocItems = (items: PostTocItem[]): number => items.length
