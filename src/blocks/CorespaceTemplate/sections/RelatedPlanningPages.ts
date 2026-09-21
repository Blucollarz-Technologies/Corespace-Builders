import type { Block } from 'payload'

import link from '@root/fields/link'

export const CorespaceRelatedPlanningPagesSection: Block = {
  slug: 'corespaceRelatedPlanningPages',
  interfaceName: 'CorespaceRelatedPlanningPagesSection',
  labels: {
    plural: 'Related Planning Pages Sections',
    singular: 'Related Planning Pages',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'KEEP PLANNING',
      label: 'Eyebrow label',
    },
    {
      name: 'heading',
      type: 'textarea',
      defaultValue: 'Related Planning Pages',
      label: 'Heading',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      labels: {
        plural: 'Link cards',
        singular: 'Link card',
      },
      admin: {
        initCollapsed: true,
      },
      minRows: 1,
      maxRows: 12,
      defaultValue: [
        {
          cardLink: {
            type: 'custom',
            label: 'Architecture Design Services',
            url: '/service/architecture',
          },
        },
        {
          cardLink: {
            type: 'custom',
            label: 'Interior Design Services',
            url: '/service/interiors',
          },
        },
        {
          cardLink: {
            type: 'custom',
            label: 'Home Renovation Services',
            url: '/service/renovation',
          },
        },
        {
          cardLink: {
            type: 'custom',
            label: 'Homestay & Villa Development',
            url: '/projects/homestay-villa',
          },
        },
        {
          cardLink: {
            type: 'custom',
            label: 'Construction Cost in Karnataka',
            url: '/resources/cost-guide',
          },
        },
        {
          cardLink: {
            type: 'custom',
            label: 'Project Portfolio',
            url: '/projects',
          },
        },
        {
          cardLink: {
            type: 'custom',
            label: 'About Us',
            url: '/about',
          },
        },
        {
          cardLink: {
            type: 'custom',
            label: 'Contact',
            url: '/contact',
          },
        },
      ],
      fields: [
        link({
          appearances: false,
          overrides: {
            name: 'cardLink',
            label: 'Card link',
            required: true,
          },
        }),
      ],
    },
  ],
}
