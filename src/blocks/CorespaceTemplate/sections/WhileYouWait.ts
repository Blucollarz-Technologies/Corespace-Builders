import type { Block } from 'payload'

import link from '@root/fields/link'

export const CorespaceWhileYouWaitSection: Block = {
  slug: 'corespaceWhileYouWait',
  interfaceName: 'CorespaceWhileYouWaitSection',
  labels: {
    plural: 'While You Wait Sections',
    singular: 'While You Wait',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'WHILE YOU WAIT',
      label: 'Eyebrow label',
    },
    {
      name: 'heading',
      type: 'textarea',
      defaultValue: 'Explore useful resources:',
      label: 'Heading',
      required: true,
    },
    {
      name: 'resources',
      type: 'array',
      labels: {
        plural: 'Resource cards',
        singular: 'Resource card',
      },
      admin: {
        initCollapsed: true,
      },
      minRows: 1,
      maxRows: 8,
      defaultValue: [
        {
          title: 'Construction Services',
          description:
            'Learn how we approach home, villa, and homestay construction projects.',
          resourceLink: {
            type: 'custom',
            label: 'Construction Services',
            url: '/service/construction',
          },
        },
        {
          title: 'Architecture Design',
          description: 'Understand how planning and design impact project outcomes.',
          resourceLink: {
            type: 'custom',
            label: 'Architecture Design',
            url: '/service/architecture',
          },
        },
        {
          title: 'Interior Design',
          description: 'Explore functional and climate-aware interior solutions.',
          resourceLink: {
            type: 'custom',
            label: 'Interior Design',
            url: '/service/interiors',
          },
        },
        {
          title: 'Home Renovation',
          description: 'Learn how renovation can improve property usability and value.',
          resourceLink: {
            type: 'custom',
            label: 'Home Renovation',
            url: '/service/renovation',
          },
        },
        {
          title: 'Homestay & Villa Development',
          description:
            'Understand lifestyle and investment-focused development planning.',
          resourceLink: {
            type: 'custom',
            label: 'Homestay & Villa Development',
            url: '/projects/homestay-villa',
          },
        },
        {
          title: 'Construction Cost Guide',
          description: 'Explore cost ranges and planning considerations.',
          resourceLink: {
            type: 'custom',
            label: 'Construction Cost Guide',
            url: '/resources/cost-guide',
          },
        },
      ],
      fields: [
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
        link({
          appearances: false,
          overrides: {
            name: 'resourceLink',
            label: 'Card link',
          },
        }),
      ],
    },
  ],
}
