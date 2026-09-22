import type { Block } from 'payload'

import link from '@root/fields/link'

export const CorespaceExploreMoreSection: Block = {
  slug: 'corespaceExploreMore',
  interfaceName: 'CorespaceExploreMoreSection',
  labels: {
    plural: 'Explore More Sections',
    singular: 'Explore More',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'EXPLORE MORE',
      label: 'Eyebrow label',
    },
    {
      name: 'heading',
      type: 'textarea',
      defaultValue: 'Continue planning',
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
      maxRows: 9,
      defaultValue: [
        {
          cardLink: {
            type: 'custom',
            label: 'Construction Services',
            url: '/service/construction',
          },
        },
        {
          cardLink: {
            type: 'custom',
            label: 'Architecture Design',
            url: '/service/architecture',
          },
        },
        {
          cardLink: {
            type: 'custom',
            label: 'Interior Design',
            url: '/service/interiors',
          },
        },
        {
          cardLink: {
            type: 'custom',
            label: 'Home Renovation',
            url: '/service/renovation',
          },
        },
        {
          cardLink: {
            type: 'custom',
            label: 'Homestay Development',
            url: '/projects/homestay-villa',
          },
        },
        {
          cardLink: {
            type: 'custom',
            label: 'Construction Cost Guide',
            url: '/resources/cost-guide',
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
