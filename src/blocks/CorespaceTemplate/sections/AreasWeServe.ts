import type { Block } from 'payload'

export const CorespaceAreasWeServeSection: Block = {
  slug: 'corespaceAreasWeServe',
  interfaceName: 'CorespaceAreasWeServeSection',
  labels: {
    plural: 'Areas We Serve Sections',
    singular: 'Areas We Serve',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'AREAS WE SERVE',
      label: 'Eyebrow label',
    },
    {
      name: 'heading',
      type: 'textarea',
      defaultValue: 'Rooted in Kodagu, reachable from anywhere',
      label: 'Heading',
      required: true,
    },
    {
      name: 'mapImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Map image (optional)',
      admin: {
        description: 'Leave empty to use the built-in illustrated map.',
      },
    },
    {
      name: 'areas',
      type: 'array',
      labels: {
        plural: 'Service areas',
        singular: 'Service area',
      },
      admin: {
        initCollapsed: true,
      },
      minRows: 1,
      maxRows: 8,
      defaultValue: [
        {
          title: 'Coorg (Kodagu)',
          subtitle: 'Primary focus district',
        },
        {
          title: 'Madikeri',
          subtitle: 'Town & surrounds',
        },
        {
          title: 'Virajpet',
          subtitle: 'South Kodagu',
        },
        {
          title: 'Kushalnagar',
          subtitle: 'North Kodagu',
        },
        {
          title: 'Somwarpet',
          subtitle: 'North Kodagu',
        },
        {
          title: 'Bangalore',
          subtitle: 'Remote project owners',
        },
      ],
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'subtitle',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
