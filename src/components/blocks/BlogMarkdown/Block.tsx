import type { ReusableContent } from '@root/payload-types'

import Table from '@components/MDX/components/Table/index'
import { resolveHeadingAnchor } from '@root/utilities/headingAnchor'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGFM from 'remark-gfm'

const components = {
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = React.Children.toArray(children)
      .map((child) => (typeof child === 'string' || typeof child === 'number' ? String(child) : ''))
      .join('')
    const { id } = resolveHeadingAnchor(text)
    return (
      <h2 {...props} id={id}>
        {children}
      </h2>
    )
  },
  table: Table as any,
}

const remarkPlugins = [remarkGFM]

type Props = Extract<ReusableContent['layout'][0], { blockType: 'blogMarkdown' }>

const BlogMarkdown: React.FC<Props> = ({ blogMarkdownFields: { markdown } }) => {
  return <ReactMarkdown children={markdown} components={components} remarkPlugins={remarkPlugins} />
}

export default BlogMarkdown
