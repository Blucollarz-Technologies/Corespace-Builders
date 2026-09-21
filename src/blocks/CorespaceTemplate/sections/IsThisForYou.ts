import type { Block } from 'payload'

export const CorespaceIsThisForYouSection: Block = {
  slug: 'corespaceIsThisForYou',
  interfaceName: 'CorespaceIsThisForYouSection',
  labels: {
    plural: 'Is This For You Sections',
    singular: 'Is This For You',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'IS THIS FOR YOU',
      label: 'Eyebrow label',
    },
    {
      name: 'heading',
      type: 'textarea',
      defaultValue: 'Who Should Use These Construction Services?',
      label: 'Heading',
      required: true,
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
      maxRows: 10,
      defaultValue: [
        { label: 'Home Builders' },
        { label: 'Villa Buyers' },
        { label: 'Homestay Investors' },
        { label: 'Property Owners' },
        { label: 'NRI Property Owners' },
        { label: 'Bangalore residents planning projects in Coorg' },
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
