import type { Block } from 'payload'

import link from '@root/fields/link'

export const CorespaceGetStartedSection: Block = {
  slug: 'corespaceGetStarted',
  interfaceName: 'CorespaceGetStartedSection',
  labels: {
    plural: 'Get Started Sections',
    singular: 'Get Started',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'GET STARTED',
      label: 'Eyebrow label',
    },
    {
      name: 'heading',
      type: 'textarea',
      defaultValue: 'Plan Your Construction Project The Right Way',
      label: 'Heading',
      required: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
      defaultValue: 'Every successful project starts with clarity. Get guidance on:',
      label: 'Subheading',
    },
    {
      name: 'tags',
      type: 'array',
      labels: {
        plural: 'Tags',
        singular: 'Tag',
      },
      admin: {
        initCollapsed: true,
      },
      defaultValue: [
        { label: 'Planning' },
        { label: 'Design' },
        { label: 'Cost' },
        { label: 'Execution' },
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
      type: 'row',
      fields: [
        link({
          appearances: false,
          overrides: {
            name: 'primaryCta',
            label: 'Primary CTA',
            admin: {
              width: '50%',
              description:
                'Optional. Leave empty to hide. e.g. Chat on WhatsApp (Thank You page).',
            },
          },
        }),
        link({
          appearances: false,
          overrides: {
            name: 'secondaryCta',
            label: 'Secondary CTA',
            admin: {
              width: '50%',
              description:
                'Optional. Leave empty to hide. e.g. WhatsApp Us (Home) — clear this on Thank You.',
            },
          },
        }),
      ],
    },
  ],
}
