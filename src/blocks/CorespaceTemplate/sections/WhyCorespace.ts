import type { Block } from 'payload'

export const CorespaceWhyCorespaceSection: Block = {
  slug: 'corespaceWhyCorespace',
  interfaceName: 'CorespaceWhyCorespaceSection',
  labels: {
    plural: 'Why Corespace Sections',
    singular: 'Why Corespace',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'WHY CORESPACE',
      label: 'Eyebrow label',
    },
    {
      name: 'heading',
      type: 'textarea',
      defaultValue: 'Why Property Owners Choose Corespace Builders',
      label: 'Heading',
      required: true,
    },
    {
      name: 'features',
      type: 'array',
      labels: {
        plural: 'Features',
        singular: 'Feature',
      },
      admin: {
        initCollapsed: true,
      },
      minRows: 1,
      maxRows: 6,
      defaultValue: [
        {
          icon: 'check',
          title: 'Planning Before Execution',
          description: 'Avoid expensive mistakes before construction begins.',
        },
        {
          icon: 'cost',
          title: 'Cost Awareness',
          description: 'Make informed decisions with better budget visibility.',
        },
        {
          icon: 'design',
          title: 'Design Alignment',
          description: 'Ensure design and execution work together.',
        },
        {
          icon: 'coorg',
          title: 'Coorg Understanding',
          description: 'Planning suited for terrain and climate conditions.',
        },
        {
          icon: 'structured',
          title: 'Structured Approach',
          description: 'Reduce uncertainty throughout the project lifecycle.',
        },
      ],
      fields: [
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'check',
          options: [
            { label: 'Checkmark', value: 'check' },
            { label: 'Cost', value: 'cost' },
            { label: 'Design', value: 'design' },
            { label: 'Coorg / Home', value: 'coorg' },
            { label: 'Structured', value: 'structured' },
          ],
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}
