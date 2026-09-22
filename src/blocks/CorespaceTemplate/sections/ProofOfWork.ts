import type { Block } from 'payload'

export const CorespaceProofOfWorkSection: Block = {
  slug: 'corespaceProofOfWork',
  interfaceName: 'CorespaceProofOfWorkSection',
  labels: {
    plural: 'Proof of Work Sections',
    singular: 'Proof of Work',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'PROOF OF WORK',
      label: 'Eyebrow label',
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Featured Projects',
      label: 'Heading',
      required: true,
    },
    {
      name: 'projects',
      type: 'array',
      labels: {
        plural: 'Projects',
        singular: 'Project',
      },
      admin: {
        initCollapsed: true,
      },
      minRows: 1,
      defaultValue: [
        {
          category: 'VILLA DEVELOPMENT',
          title: 'Premium Villa, Coorg',
          location: 'Coorg, Kodagu',
        },
        {
          category: 'RESIDENTIAL HOME',
          title: 'Private Residence, Madikeri',
          location: 'Madikeri, Kodagu',
        },
        {
          category: 'HOMESTAY DEVELOPMENT',
          title: 'Homestay Project, Coorg',
          location: 'Coorg, Kodagu',
        },
        {
          category: 'RENOVATION',
          title: 'Renovation & Upgrade',
          location: 'Madikeri, Kodagu',
        },
      ],
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Project image',
        },
        {
          name: 'category',
          type: 'text',
          label: 'Category label',
          required: true,
          admin: {
            description: 'e.g. VILLA DEVELOPMENT',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'location',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g. Coorg, Kodagu',
          },
        },
      ],
    },
  ],
}
