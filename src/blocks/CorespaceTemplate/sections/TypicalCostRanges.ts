import type { Block } from 'payload'

export const CorespaceTypicalCostRangesSection: Block = {
  slug: 'corespaceTypicalCostRanges',
  interfaceName: 'CorespaceTypicalCostRangesSection',
  labels: {
    plural: 'Typical Cost Ranges Sections',
    singular: 'Typical Cost Ranges',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'DETAILED BREAKDOWN',
      label: 'Eyebrow label',
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Typical Cost Ranges',
      label: 'Heading',
      required: true,
    },
    {
      name: 'cards',
      type: 'array',
      labels: {
        plural: 'Cost cards',
        singular: 'Cost card',
      },
      admin: {
        initCollapsed: true,
      },
      minRows: 1,
      maxRows: 8,
      defaultValue: [
        {
          title: 'Home Construction Cost',
          price: '₹2,000–₹2,800 / sq ft',
          listLabel: 'Suitable for:',
          items: [
            { text: 'Residential homes' },
            { text: 'Practical layouts' },
            { text: 'Standard finishes' },
          ],
        },
        {
          title: 'Villa Construction Cost',
          price: '₹2,800–₹4,500+ / sq ft',
          listLabel: 'Suitable for:',
          items: [
            { text: 'Luxury villas' },
            { text: 'Premium finishes' },
            { text: 'Experience-focused properties' },
          ],
        },
        {
          title: 'Homestay Development Cost',
          price: 'Project-Specific',
          priceVariant: 'accent',
          listLabel: 'Depends on:',
          items: [
            { text: 'Room count' },
            { text: 'Amenities' },
            { text: 'Guest experience requirements' },
            { text: 'Operational facilities' },
          ],
        },
        {
          title: 'Interior Design Cost',
          price: '₹1,500–₹5,000+ / sq ft',
          listLabel: 'Depends on:',
          items: [
            { text: 'Design level' },
            { text: 'Material selection' },
            { text: 'Furniture requirements' },
          ],
        },
        {
          title: 'Renovation Cost',
          price: '₹800–₹3,500+ / sq ft',
          listLabel: 'Depends on:',
          items: [
            { text: 'Existing property condition' },
            { text: 'Scope of upgrades' },
            { text: 'Structural changes' },
          ],
        },
      ],
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'price',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g. ₹2,000–₹2,800 / sq ft or Project-Specific',
          },
        },
        {
          name: 'priceVariant',
          type: 'select',
          defaultValue: 'default',
          options: [
            { label: 'Default (white)', value: 'default' },
            { label: 'Accent (terracotta)', value: 'accent' },
          ],
          label: 'Price style',
        },
        {
          name: 'listLabel',
          type: 'text',
          defaultValue: 'Suitable for:',
          admin: {
            description: 'e.g. Suitable for: or Depends on:',
          },
        },
        {
          name: 'items',
          type: 'array',
          labels: {
            plural: 'Bullet points',
            singular: 'Bullet point',
          },
          admin: {
            initCollapsed: true,
          },
          minRows: 1,
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
