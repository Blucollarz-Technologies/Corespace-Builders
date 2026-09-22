import type { Block } from 'payload'

export const CorespaceOwnersSection: Block = {
  slug: 'corespaceOwners',
  interfaceName: 'CorespaceOwnersSection',
  labels: {
    plural: 'Owners Sections',
    singular: 'Owners',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'FOR REMOTE OWNERS',
      label: 'Eyebrow label',
    },
    {
      name: 'heading',
      type: 'textarea',
      defaultValue: 'Planning From Bangalore or Anywhere in Karnataka',
      label: 'Heading',
      required: true,
    },
    {
      name: 'topDescription',
      type: 'textarea',
      defaultValue: 'Many clients are not based in Coorg. Common situations include:',
      label: 'Top description',
    },
    {
      name: 'topTags',
      type: 'array',
      labels: {
        plural: 'Top tags',
        singular: 'Tag',
      },
      admin: {
        initCollapsed: true,
      },
      defaultValue: [
        { label: 'Living in Bangalore' },
        { label: 'Working abroad' },
        { label: 'Managing projects remotely' },
      ],
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'bottomDescription',
      type: 'textarea',
      defaultValue:
        'The biggest challenge is often not construction. It is decision-making. We help bridge that gap through:',
      label: 'Bottom description',
    },
    {
      name: 'bottomTags',
      type: 'array',
      labels: {
        plural: 'Bottom tags',
        singular: 'Tag',
      },
      admin: {
        initCollapsed: true,
      },
      defaultValue: [
        { label: 'Better planning' },
        { label: 'Clear communication' },
        { label: 'Structured coordination' },
      ],
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured image',
    },
  ],
}
