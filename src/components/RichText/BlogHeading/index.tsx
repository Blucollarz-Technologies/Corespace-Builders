'use client'

import type { SerializedHeadingNode, SerializedTextNode } from '@payloadcms/richtext-lexical'

import { resolveHeadingAnchor } from '@root/utilities/headingAnchor'
import React, { useMemo } from 'react'

const getText = (node: unknown): string => {
  if (node == null) {
    return ''
  }
  if (typeof node === 'string') {
    return node
  }
  if (Array.isArray(node)) {
    return node.map(getText).join('')
  }
  if (typeof node !== 'object') {
    return ''
  }
  const value = node as Record<string, unknown>
  if (typeof value.text === 'string') {
    return value.text
  }
  if (Array.isArray(value.children)) {
    return value.children.map(getText).join('')
  }
  return ''
}

/**
 * Blog headings with stable anchor ids (no docs-style chain-link chrome).
 * Ids match `extractPostH2Headings` / TOC links via `resolveHeadingAnchor`.
 */
export const BlogHeading: React.FC<{
  node: SerializedHeadingNode
  nodesToJSX: (args: { nodes: SerializedHeadingNode['children'] }) => React.ReactNode
}> = ({ node: sourceNode, nodesToJSX }) => {
  const node = useMemo(() => {
    const cloned = structuredClone(sourceNode)
    const lastNode = cloned.children?.length ? cloned.children[cloned.children.length - 1] : null
    if (lastNode && lastNode.type === 'text') {
      const textNode = lastNode as SerializedTextNode
      const anchorIndex = textNode.text?.lastIndexOf('#')
      if (anchorIndex !== -1) {
        textNode.text = textNode.text.slice(0, anchorIndex).trim()
      }
    }
    return cloned
  }, [sourceNode])

  const { id } = resolveHeadingAnchor(getText(node))
  const Tag = node.tag.toLowerCase() as keyof React.JSX.IntrinsicElements
  const children = nodesToJSX({ nodes: node.children })

  return React.createElement(Tag, { id }, children)
}
