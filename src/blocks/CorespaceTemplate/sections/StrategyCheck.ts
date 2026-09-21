import type { Block } from 'payload'

const listItemFields = [
  {
    name: 'text',
    type: 'text' as const,
    required: true,
  },
]

export const CorespaceStrategyCheckSection: Block = {
  slug: 'corespaceStrategyCheck',
  interfaceName: 'CorespaceStrategyCheckSection',
  labels: {
    plural: 'Strategy Check Sections',
    singular: 'Strategy Check',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'STRATEGY CHECK',
      label: 'Eyebrow label',
    },
    {
      name: 'heading',
      type: 'textarea',
      defaultValue: 'Lifestyle Project or Investment Project?',
      label: 'Heading',
      required: true,
    },
    {
      name: 'subheading',
      type: 'text',
      defaultValue: 'Before planning development, define your objective.',
      label: 'Subheading',
    },
    {
      name: 'lifestyleCard',
      type: 'group',
      label: 'Lifestyle card',
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'LIFESTYLE-FOCUSED',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Lifestyle-Focused Development',
          required: true,
        },
        {
          name: 'idealFor',
          type: 'array',
          labels: {
            plural: 'Ideal for items',
            singular: 'Ideal for item',
          },
          admin: {
            initCollapsed: true,
          },
          defaultValue: [
            { text: 'Personal retreat' },
            { text: 'Family vacation home' },
            { text: 'Weekend villa' },
            { text: 'Retirement property' },
          ],
          fields: listItemFields,
        },
        {
          name: 'priorities',
          type: 'array',
          labels: {
            plural: 'Priority items',
            singular: 'Priority item',
          },
          admin: {
            initCollapsed: true,
          },
          defaultValue: [
            { text: 'Comfort' },
            { text: 'Privacy' },
            { text: 'Lifestyle' },
            { text: 'Long-term usability' },
          ],
          fields: listItemFields,
        },
      ],
    },
    {
      name: 'investmentCard',
      type: 'group',
      label: 'Investment card',
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'INVESTMENT-FOCUSED',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Investment-Focused Development',
          required: true,
        },
        {
          name: 'idealFor',
          type: 'array',
          labels: {
            plural: 'Ideal for items',
            singular: 'Ideal for item',
          },
          admin: {
            initCollapsed: true,
          },
          defaultValue: [
            { text: 'Homestay business' },
            { text: 'Hospitality operations' },
            { text: 'Rental income' },
            { text: 'Asset appreciation' },
          ],
          fields: listItemFields,
        },
        {
          name: 'priorities',
          type: 'array',
          labels: {
            plural: 'Priority items',
            singular: 'Priority item',
          },
          admin: {
            initCollapsed: true,
          },
          defaultValue: [
            { text: 'Guest experience' },
            { text: 'Occupancy potential' },
            { text: 'Revenue opportunities' },
            { text: 'Operational efficiency' },
          ],
          fields: listItemFields,
        },
      ],
    },
    {
      name: 'hybridCard',
      type: 'group',
      label: 'Hybrid card',
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'HYBRID',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Hybrid Development',
          required: true,
        },
        {
          name: 'intro',
          type: 'text',
          defaultValue: 'Many Coorg projects combine both:',
          label: 'Intro text',
        },
        {
          name: 'items',
          type: 'array',
          labels: {
            plural: 'Hybrid points',
            singular: 'Hybrid point',
          },
          admin: {
            initCollapsed: true,
          },
          defaultValue: [{ text: 'Personal use' }, { text: 'Rental income' }],
          fields: listItemFields,
        },
        {
          name: 'closingNote',
          type: 'textarea',
          defaultValue: 'The development strategy should be planned accordingly.',
          label: 'Closing note',
        },
      ],
    },
  ],
}
