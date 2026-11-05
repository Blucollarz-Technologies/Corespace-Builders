import type { Post } from '@root/payload-types'

import {
  hasLeadingHeadingNumber,
  resolveHeadingAnchor,
  stripLeadingHeadingNumber,
} from '@root/utilities/headingAnchor'

export type PostTocItem = {
  children?: PostTocItem[]
  id: string
  text: string
}

type FlatTocHeading = {
  id: string
  text: string
  wasNumbered: boolean
}

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

const pushHeading = (rawText: string, out: FlatTocHeading[]) => {
  const { id, text } = resolveHeadingAnchor(rawText)
  if (!text) {
    return
  }

  out.push({
    id,
    text: stripLeadingHeadingNumber(text),
    // Detect numbering on the original heading so TOC can nest steps under a section title.
    wasNumbered: hasLeadingHeadingNumber(text),
  })
}

const walkLexicalForH2 = (node: unknown, out: FlatTocHeading[]) => {
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

const extractMarkdownH2 = (markdown: string, out: FlatTocHeading[]) => {
  const matches = markdown.matchAll(/^##\s+(.+)$/gm)
  for (const match of matches) {
    pushHeading(match[1] || '', out)
  }
}

/**
 * Group numbered H2 steps under the preceding unnumbered section heading.
 *
 * Example:
 *   What Should You Consider When Designing a Home in Coorg?
 *     1. Begin with the Plot…
 *     2. How Coorg's Rainfall…
 *   Frequently Asked Questions
 *   Conclusion
 */
export const groupPostTocItems = (flat: FlatTocHeading[]): PostTocItem[] => {
  const groups: PostTocItem[] = []
  let currentSection: null | PostTocItem = null

  for (const heading of flat) {
    if (heading.wasNumbered) {
      const step = { id: heading.id, text: heading.text }

      if (currentSection) {
        currentSection.children = currentSection.children || []
        currentSection.children.push(step)
      } else {
        // Numbered steps with no section title above — keep as a flat numbered entry.
        groups.push(step)
      }
      continue
    }

    currentSection = { id: heading.id, text: heading.text, children: [] }
    groups.push(currentSection)
  }

  // Drop empty children arrays so leaf sections render cleanly.
  return groups.map((item) => {
    if (!item.children?.length) {
      const { children: _children, ...rest } = item
      return rest
    }
    return item
  })
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

  const flat: FlatTocHeading[] = []

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

  return groupPostTocItems(flat)
}

/** Longer articles only — short posts stay clean without a TOC. */
export const MIN_TOC_HEADINGS = 3

/** Count leaf + section headings for the TOC visibility threshold. */
export const countPostTocItems = (items: PostTocItem[]): number =>
  items.reduce((total, item) => total + 1 + (item.children?.length || 0), 0)
