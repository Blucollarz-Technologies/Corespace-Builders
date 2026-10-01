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
            url: '/service/construction-karnataka',
          },
        },
        {
          cardLink: {
            type: 'custom',
            label: 'Architecture Design',
            url: '/service/architecture-design-karnataka',
          },
        },
        {
          cardLink: {
            type: 'custom',
            label: 'Interior Design',
            url: '/service/interior-design-services-karnataka',
          },
        },
        {
          cardLink: {
            type: 'custom',
            label: 'Home Renovation',
            url: '/service/home-renovation-karnataka',
          },
        },
        {
          cardLink: {
            type: 'custom',
            label: 'Homestay Development',
            url: '/homestay-and-villa-development',
          },
        },
        {
          cardLink: {
            type: 'custom',
            label: 'Construction Cost Guide',
            url: '/cost-guide',
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
