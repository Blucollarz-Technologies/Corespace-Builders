import type { Block } from 'payload'

import link from '@root/fields/link'

export const CorespaceCostClaritySection: Block = {
  slug: 'corespaceCostClarity',
  interfaceName: 'CorespaceCostClaritySection',
  labels: {
    plural: 'Cost Clarity Sections',
    singular: 'Cost Clarity',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'COST CLARITY',
      label: 'Eyebrow label',
    },
    {
      name: 'heading',
      type: 'textarea',
      defaultValue: 'Understand Your Construction Cost Before You Start',
      label: 'Heading',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      defaultValue:
        'Construction cost in Karnataka generally ranges between ₹2,000 to ₹4,500+ per sq ft depending on project type, materials, design complexity, and location.',
      label: 'Body text',
    },
    {
      name: 'planningNote',
      type: 'textarea',
      defaultValue:
        'Planning note: a realistic budget is set before design is finalized — not after construction begins.',
      label: 'Planning note',
    },
    link({
      appearances: false,
      overrides: {
        name: 'primaryCta',
        label: 'Primary CTA',
        admin: {
          description:
            'e.g. Get Your Estimate — opens the cost estimate multi-step form modal when Main Menu form is set.',
        },
      },
    }),
    {
      name: 'rangeLabel',
      type: 'text',
      defaultValue: 'KARNATAKA CONSTRUCTION RANGE',
      label: 'Card label',
    },
    {
      name: 'priceRange',
      type: 'text',
      defaultValue: '₹2,000 – ₹4,500+',
      label: 'Price range',
      required: true,
    },
    {
      name: 'priceUnit',
      type: 'text',
      defaultValue: 'PER SQ FT · PROJECT DEPENDENT',
      label: 'Price unit line',
    },
    {
      name: 'factors',
      type: 'array',
      labels: {
        plural: 'Cost factors',
        singular: 'Factor',
      },
      admin: {
        initCollapsed: true,
      },
      defaultValue: [
        { label: 'Land condition' },
        { label: 'Terrain' },
        { label: 'Accessibility' },
        { label: 'Material transport' },
        { label: 'Project type' },
        { label: 'Design complexity' },
      ],
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
