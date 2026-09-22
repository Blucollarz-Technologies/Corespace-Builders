import type { Block } from 'payload'

export const CorespaceDecisionFrameworkSection: Block = {
  slug: 'corespaceDecisionFramework',
  interfaceName: 'CorespaceDecisionFrameworkSection',
  labels: {
    plural: 'Decision Framework Sections',
    singular: 'Decision Framework',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'DECISION FRAMEWORK',
      label: 'Eyebrow label',
    },
    {
      name: 'heading',
      type: 'textarea',
      defaultValue: 'Before starting your project, ask yourself',
      label: 'Heading',
      required: true,
    },
    {
      name: 'questions',
      type: 'array',
      labels: {
        plural: 'Questions',
        singular: 'Question',
      },
      admin: {
        initCollapsed: true,
      },
      minRows: 1,
      maxRows: 6,
      defaultValue: [
        { text: 'Do I understand total project cost?' },
        { text: 'Is my design aligned with my land?' },
        { text: 'Do I have a clear execution plan?' },
      ],
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'calloutPrefix',
          type: 'text',
          defaultValue: 'If not —',
          label: 'Callout prefix',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'calloutEmphasis',
          type: 'text',
          defaultValue: 'planning should come before construction.',
          label: 'Callout emphasis',
          admin: {
            width: '50%',
            description: 'Shown in bold after the prefix.',
          },
        },
      ],
    },
  ],
}
