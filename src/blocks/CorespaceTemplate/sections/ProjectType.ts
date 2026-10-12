import type { Block } from 'payload'

export const CorespaceProjectTypeSection: Block = {
  slug: 'corespaceProjectType',
  interfaceName: 'CorespaceProjectTypeSection',
  labels: {
    plural: 'Project Type Sections',
    singular: 'Project Type',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'QUICK ANSWER',
      label: 'Eyebrow label',
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'What Does Construction Cost in Karnataka?',
      label: 'Heading',
      required: true,
    },
    {
      name: 'projectColumnLabel',
      type: 'text',
      defaultValue: 'PROJECT TYPE',
      label: 'Left column header',
    },
    {
      name: 'costColumnLabel',
      type: 'text',
      defaultValue: 'ESTIMATED COST RANGE',
      label: 'Right column header',
    },
    {
      name: 'rows',
      type: 'array',
      labels: {
        plural: 'Rows',
        singular: 'Row',
      },
      admin: {
        initCollapsed: true,
        description: 'Each row is a project type and its estimated cost range.',
      },
      minRows: 1,
      maxRows: 12,
      defaultValue: [
        {
          projectType: 'Home Construction',
          costRange: '₹2,000 – ₹2,800 / sq ft',
        },
        {
          projectType: 'Villa Construction',
          costRange: '₹2,800 – ₹4,500+ / sq ft',
        },
        {
          projectType: 'Homestay Development',
          costRange: 'Project Specific',
          costEmphasis: 'italic',
        },
        {
          projectType: 'Interior Design',
          costRange: '₹1,500 – ₹5,000+ / sq ft',
        },
        {
          projectType: 'Renovation',
          costRange: '₹800 – ₹3,500+ / sq ft',
        },
      ],
      fields: [
        {
          name: 'projectType',
          type: 'text',
          required: true,
          label: 'Project type',
        },
        {
          name: 'costRange',
          type: 'text',
          required: true,
          label: 'Estimated cost range',
          admin: {
            description: 'e.g. ₹2,000 – ₹2,800 / sq ft or Project Specific',
          },
        },
        {
          name: 'costEmphasis',
          type: 'select',
          defaultValue: 'default',
          label: 'Cost text style',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Italic', value: 'italic' },
          ],
        },
      ],
    },
    {
      name: 'note',
      type: 'textarea',
      defaultValue:
        'Actual cost depends on site condition, design complexity, material selection, and project scope.',
      label: 'Note (below table)',
      admin: {
        description: 'Shown under the table with a bold “Note:” prefix. Leave empty to hide.',
      },
    },
  ],
}
