import type { Post } from '@root/payload-types'

import { resolveHeadingAnchor, stripLeadingHeadingNumber } from '@root/utilities/headingAnchor'

export type PostTocItem = {
  id: string
  text: string
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

const pushHeading = (rawText: string, out: PostTocItem[]) => {
  const { id, text } = resolveHeadingAnchor(rawText)
  if (!text) {
    return
  }

  out.push({
    id,
    // Keep browser list numbers only — strip "1." from heading text.
    text: stripLeadingHeadingNumber(text),
  })
}

const walkLexicalForH2 = (node: unknown, out: PostTocItem[]) => {
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

const extractMarkdownH2 = (markdown: string, out: PostTocItem[]) => {
  const matches = markdown.matchAll(/^##\s+(.+)$/gm)
  for (const match of matches) {
    pushHeading(match[1] || '', out)
  }
}

/**
 * Collect H2 headings from post content blocks for an auto Table of Contents.
 * Flat list (original style) — supports Lexical `blogContent` and Markdown `blogMarkdown`.
 */
export const extractPostH2Headings = (
  content: Post['content'] | null | undefined,
): PostTocItem[] => {
  if (!content?.length) {
    return []
  }

  const items: PostTocItem[] = []

  for (const block of content) {
    if (!block || typeof block !== 'object') {
      continue
    }

    if (block.blockType === 'blogContent') {
      walkLexicalForH2(block.blogContentFields?.richText, items)
    }

    if (block.blockType === 'blogMarkdown') {
      const markdown = block.blogMarkdownFields?.markdown
      if (typeof markdown === 'string') {
        extractMarkdownH2(markdown, items)
      }
    }
  }

  return items
}

/** Longer articles only — short posts stay clean without a TOC. */
export const MIN_TOC_HEADINGS = 3

export const countPostTocItems = (items: PostTocItem[]): number => items.length
