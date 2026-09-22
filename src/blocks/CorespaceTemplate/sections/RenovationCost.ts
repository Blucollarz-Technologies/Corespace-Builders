import type { Block } from 'payload'

import link from '@root/fields/link'

export const CorespaceRenovationCostSection: Block = {
  slug: 'corespaceRenovationCost',
  interfaceName: 'CorespaceRenovationCostSection',
  labels: {
    plural: 'Renovation Cost Sections',
    singular: 'Renovation Cost',
  },
  fields: [
    {
      name: 'heading',
      type: 'textarea',
      defaultValue: 'How Much Does Home Renovation Cost?',
      label: 'Heading',
      required: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
      defaultValue: 'Renovation cost varies based on property condition and scope.',
      label: 'Subheading',
    },
    {
      name: 'costCards',
      type: 'array',
      labels: {
        plural: 'Cost cards',
        singular: 'Cost card',
      },
      admin: {
        initCollapsed: true,
      },
      minRows: 1,
      maxRows: 4,
      defaultValue: [
        {
          label: 'Minor Renovation',
          price: '₹800–₹1,500',
          unit: '/ sq ft',
        },
        {
          label: 'Major Renovation',
          price: '₹1,500–₹3,500+',
          unit: '/ sq ft',
        },
      ],
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'price',
          type: 'text',
          required: true,
        },
        {
          name: 'unit',
          type: 'text',
          defaultValue: '/ sq ft',
        },
      ],
    },
    {
      name: 'influencersLabel',
      type: 'text',
      defaultValue: 'Cost Influencers:',
      label: 'Influencers label',
    },
    {
      name: 'influencers',
      type: 'array',
      labels: {
        plural: 'Cost influencers',
        singular: 'Cost influencer',
      },
      admin: {
        initCollapsed: true,
      },
      defaultValue: [
        { label: 'Structural repairs' },
        { label: 'Design changes' },
        { label: 'Material upgrades' },
        { label: 'Climate-related improvements' },
        { label: 'Interior requirements' },
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
      name: 'disclaimer',
      type: 'textarea',
      defaultValue:
        'Actual cost depends on the existing condition and renovation objectives.',
      label: 'Disclaimer',
    },
    link({
      appearances: false,
      overrides: {
        name: 'cta',
        label: 'CTA button',
        defaultValue: {
          type: 'custom',
          label: 'Get Your Renovation Cost Estimate',
          url: '/contact',
        },
      },
    }),
  ],
}
