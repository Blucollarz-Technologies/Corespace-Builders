import type { Block } from 'payload'

import link from '@root/fields/link'

export const CorespaceStartHereSection: Block = {
  slug: 'corespaceStartHere',
  interfaceName: 'CorespaceStartHereSection',
  labels: {
    plural: 'Start Here Sections',
    singular: 'Start Here',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'NEW HERE?',
      label: 'Eyebrow label',
    },
    {
      name: 'heading',
      type: 'textarea',
      defaultValue: 'Start Here for First-Time Builders',
      label: 'Heading',
      required: true,
    },
    {
      name: 'subheading',
      type: 'text',
      defaultValue: "Many visitors don't know where to begin.",
      label: 'Subheading',
    },
    {
      name: 'steps',
      type: 'array',
      labels: {
        plural: 'Steps',
        singular: 'Step',
      },
      admin: {
        initCollapsed: true,
      },
      minRows: 1,
      maxRows: 8,
      defaultValue: [
        { label: 'Understand Construction Cost' },
        { label: 'Plan Architecture' },
        { label: 'Plan Interiors' },
        { label: 'Understand Execution' },
        { label: 'Build With Confidence' },
      ],
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
    link({
      appearances: false,
      overrides: {
        name: 'cta',
        label: 'CTA button',
        defaultValue: {
          type: 'custom',
          label: 'View Planning Guides',
          url: '/blog',
        },
      },
    }),
  ],
}
