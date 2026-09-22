import type { Block } from 'payload'

export const CorespaceWhoThisIsForSection: Block = {
  slug: 'corespaceWhoThisIsFor',
  interfaceName: 'CorespaceWhoThisIsForSection',
  labels: {
    plural: 'Who This Is For Sections',
    singular: 'Who This Is For',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'WHO THIS IS FOR',
      label: 'Eyebrow label',
    },
    {
      name: 'heading',
      type: 'textarea',
      defaultValue: 'Built for people building the right way',
      label: 'Heading',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue:
        'Especially useful for people planning projects remotely from Bangalore or outside Karnataka.',
      label: 'Description',
    },
    {
      name: 'audiences',
      type: 'array',
      labels: {
        plural: 'Audience pills',
        singular: 'Audience',
      },
      admin: {
        initCollapsed: true,
      },
      minRows: 1,
      maxRows: 8,
      defaultValue: [
        { label: 'Home Builders' },
        { label: 'Villa Buyers' },
        { label: 'Homestay Investors' },
        { label: 'Property Owners' },
        { label: 'Renovation Projects' },
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
