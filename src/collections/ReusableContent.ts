import type { CollectionConfig } from 'payload'

import { Banner } from '@root/blocks/Banner'
import { revalidateTag } from 'next/cache'

import { isAdmin } from '../access/isAdmin'

export const ReusableContent: CollectionConfig = {
  slug: 'reusable-content',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: () => true,
    readVersions: isAdmin,
    update: isAdmin,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'layout',
      type: 'blocks',
      blockReferences: [
        Banner,
        'blogContent',
        'blogMarkdown',
        'callout',
        'cta',
        'cardGrid',
        'caseStudyCards',
        'caseStudiesHighlight',
        'caseStudyParallax',
        'code',
        'codeFeature',
        'comparisonTable',
        'content',
        'contentGrid',
        'corespaceTemplate',
        'exampleTabs',
        'form',
        'hoverCards',
        'hoverHighlights',
        'linkGrid',
        'logoGrid',
        'mediaBlock',
        'mediaContent',
        'mediaContentAccordion',
        'pricing',
        'slider',
        'statement',
        'steps',
        'stickyHighlights',
      ],
      blocks: [],
      required: true,
    },
  ],
  hooks: {
    afterChange: [
      () => {
        revalidateTag('posts')
      },
    ],
  },
  labels: {
    plural: 'Reusable Contents',
    singular: 'Reusable Content',
  },
}
