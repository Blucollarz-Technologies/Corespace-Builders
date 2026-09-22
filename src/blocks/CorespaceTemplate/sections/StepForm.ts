import type { Block } from 'payload'

import { WHATSAPP_LINK } from '@root/utilities/whatsapp'

export const CorespaceStepFormSection: Block = {
  slug: 'corespaceStepForm',
  interfaceName: 'CorespaceStepFormSection',
  labels: {
    plural: 'Step Form Sections',
    singular: 'Step Form',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'TELL US ABOUT YOUR PROJECT',
      label: 'Eyebrow label',
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Get Your Project Plan & Cost Direction',
      label: 'Heading',
      required: true,
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      label: 'Form',
      admin: {
        description:
          'Select fields become wizard steps. Trailing text, email, textarea, and checkbox fields are grouped as Contact Details on the final step.',
      },
    },
    {
      name: 'whatsappUrl',
      type: 'text',
      defaultValue: WHATSAPP_LINK,
      label: 'WhatsApp URL (secondary CTA on final step)',
      admin: {
        description: 'Full WhatsApp link with optional pre-filled message.',
      },
    },
    {
      type: 'collapsible',
      label: 'Sidebar (left panel)',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'sidebarTitle',
          type: 'text',
          defaultValue: 'Why Share This?',
          label: 'Sidebar title',
        },
        {
          name: 'sidebarBody',
          type: 'textarea',
          defaultValue:
            'This short form helps us understand your project early — so we can guide you with clearer planning, design, and cost direction.',
          label: 'Sidebar body',
        },
        {
          name: 'sidebarPoints',
          type: 'array',
          labels: {
            plural: 'Sidebar points',
            singular: 'Point',
          },
          defaultValue: [
            { text: 'Takes under 2 minutes' },
            { text: 'No payment or commitment required' },
            { text: 'A team member reviews every enquiry personally' },
            { text: 'Prefer to talk? WhatsApp us anytime' },
          ],
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
