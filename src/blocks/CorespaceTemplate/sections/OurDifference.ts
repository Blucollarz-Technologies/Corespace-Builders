import type { Block } from 'payload'

export const CorespaceOurDifferenceSection: Block = {
  slug: 'corespaceOurDifference',
  interfaceName: 'CorespaceOurDifferenceSection',
  labels: {
    plural: 'Our Difference Sections',
    singular: 'Our Difference',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'OUR DIFFERENCE',
      label: 'Eyebrow label',
    },
    {
      name: 'heading',
      type: 'textarea',
      defaultValue: 'What Makes Our Approach Different',
      label: 'Heading',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      labels: {
        plural: 'Difference cards',
        singular: 'Difference card',
      },
      admin: {
        initCollapsed: true,
      },
      minRows: 1,
      maxRows: 8,
      defaultValue: [
        { label: 'Planning-first approach' },
        { label: 'Cost clarity before starting' },
        { label: 'Design aligned with purpose' },
        { label: 'Structured execution' },
        { label: 'Transparent communication', spanFull: true },
      ],
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'spanFull',
          type: 'checkbox',
          defaultValue: false,
          label: 'Span full width',
          admin: {
            description: 'Use for the bottom card that spans both columns on desktop.',
          },
        },
      ],
    },
    {
      name: 'footerNote',
      type: 'textarea',
      defaultValue: 'Especially important for Coorg projects where mistakes can become expensive.',
      label: 'Footer note',
    },
  ],
}
