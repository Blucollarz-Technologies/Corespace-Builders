import type { Block } from 'payload'

const categoryOptions = [
  { label: 'Construction', value: 'construction' },
  { label: 'Architecture', value: 'architecture' },
  { label: 'Interiors', value: 'interiors' },
  { label: 'Projects', value: 'projects' },
  { label: 'Homestay & Villa', value: 'homestay-villa' },
  { label: 'Cost Guide', value: 'cost-guide' },
]

const stageOptions = [
  { label: 'Before', value: 'before' },
  { label: 'During', value: 'during' },
  { label: 'Completed', value: 'completed' },
]

export const CorespaceProjectGallerySection: Block = {
  slug: 'corespaceProjectGallery',
  interfaceName: 'CorespaceProjectGallerySection',
  labels: {
    plural: 'Project Gallery Sections',
    singular: 'Project Gallery',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'GALLERY',
      label: 'Eyebrow label',
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Project Gallery',
      label: 'Heading',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      labels: {
        plural: 'Gallery items',
        singular: 'Gallery item',
      },
      admin: {
        initCollapsed: true,
      },
      minRows: 1,
      defaultValue: [
        {
          category: 'construction',
          stage: 'completed',
          location: 'Madikeri, Kodagu',
          description: 'Completed family residence with efficient layout.',
        },
        {
          category: 'architecture',
          stage: 'during',
          location: 'Coorg, Kodagu',
          description: 'Layout and drawings reviewed on site.',
        },
        {
          category: 'interiors',
          stage: 'completed',
          location: 'Coorg, Kodagu',
          description: 'Warm, natural materials throughout the living space.',
        },
        {
          category: 'projects',
          stage: 'completed',
          location: 'Coorg, Kodagu',
          description: 'Premium villa with landscape integration.',
        },
        {
          category: 'homestay-villa',
          stage: 'during',
          location: 'Coorg, Kodagu',
          description: 'Guest room interiors under development.',
        },
        {
          category: 'cost-guide',
          stage: 'before',
          location: 'Madikeri, Kodagu',
          description: 'Budget ranges clarified before construction begins.',
        },
      ],
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
        },
        {
          name: 'category',
          type: 'select',
          required: true,
          options: categoryOptions,
        },
        {
          name: 'stage',
          type: 'select',
          required: true,
          options: stageOptions,
        },
        {
          name: 'location',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          admin: {
            description:
              'Optional. Makes the card open this path on click (e.g. /blog/my-article). Latest Articles on /blog auto-fills from published posts.',
          },
          label: 'Link URL',
        },
        {
          name: 'publishedOn',
          type: 'date',
          admin: {
            description: 'Optional. Shown on Latest Articles cards (e.g. Jun 2026).',
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
          label: 'Published date',
        },
        {
          name: 'readingTime',
          type: 'number',
          admin: {
            description: 'Optional. Minutes shown on Latest Articles cards (e.g. 6).',
            step: 1,
          },
          label: 'Reading time (minutes)',
          min: 1,
        },
      ],
    },
  ],
}
