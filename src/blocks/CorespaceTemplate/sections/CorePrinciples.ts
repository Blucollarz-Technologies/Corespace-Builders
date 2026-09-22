import type { Block } from 'payload'

export const CorespaceCorePrinciplesSection: Block = {
  slug: 'corespaceCorePrinciples',
  interfaceName: 'CorespaceCorePrinciplesSection',
  labels: {
    plural: 'Core Principles Sections',
    singular: 'Core Principles',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'HOW WE OPERATE',
      label: 'Eyebrow label',
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Our Core Principles',
      label: 'Heading',
      required: true,
    },
    {
      name: 'subheading',
      type: 'text',
      defaultValue: 'These principles guide every project we undertake.',
      label: 'Subheading',
    },
    {
      name: 'principles',
      type: 'array',
      labels: {
        plural: 'Principles',
        singular: 'Principle',
      },
      admin: {
        initCollapsed: true,
      },
      minRows: 1,
      maxRows: 8,
      defaultValue: [
        { label: 'Clarity Before Commitment' },
        { label: 'Planning Before Construction' },
        { label: 'Design Before Execution' },
        { label: 'Cost Before Assumptions' },
        { label: 'Long-Term Thinking' },
      ],
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
