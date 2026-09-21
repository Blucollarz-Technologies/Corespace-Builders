import type { Block } from 'payload'

export const CorespaceCoorgPlanningSection: Block = {
  slug: 'corespaceCoorgPlanning',
  interfaceName: 'CorespaceCoorgPlanningSection',
  labels: {
    plural: 'Coorg Planning Sections',
    singular: 'Planning in Coorg',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'COORG PROJECTS',
      label: 'Eyebrow label',
    },
    {
      name: 'heading',
      type: 'textarea',
      defaultValue: 'Planning a Project in Coorg?',
      label: 'Heading',
      required: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
      defaultValue:
        'Building in Coorg (Kodagu) often involves additional considerations such as:',
      label: 'Subheading',
    },
    {
      name: 'tags',
      type: 'array',
      labels: {
        plural: 'Consideration tags',
        singular: 'Tag',
      },
      admin: {
        initCollapsed: true,
      },
      defaultValue: [
        { label: 'Terrain' },
        { label: 'Rainfall' },
        { label: 'Site Access' },
        { label: 'Design Suitability' },
        { label: 'Development Planning' },
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
      name: 'closing',
      type: 'textarea',
      defaultValue: 'The earlier these factors are considered, the better the outcome.',
      label: 'Closing line',
    },
  ],
}
