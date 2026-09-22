import type { Block } from 'payload'

import link from '@root/fields/link'
import { DEFAULT_WHATSAPP_LINK } from '@root/utilities/whatsapp'

export const CorespaceThankYouClosingSection: Block = {
  slug: 'corespaceThankYouClosing',
  interfaceName: 'CorespaceThankYouClosingSection',
  labels: {
    plural: 'Thank You Closing Sections',
    singular: 'Thank You Closing',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'THANK YOU',
      label: 'Eyebrow label',
    },
    {
      name: 'heading',
      type: 'textarea',
      defaultValue: 'We Look Forward to Discussing Your Project',
      label: 'Heading',
      required: true,
    },
    {
      name: 'intro',
      type: 'textarea',
      defaultValue: 'Every successful project starts with clarity.',
      label: 'Intro line',
    },
    {
      name: 'closing',
      type: 'textarea',
      defaultValue:
        'Thank you once again for contacting Corespace Builders. Our team will connect with you shortly.',
      label: 'Closing paragraph',
    },
    link({
      appearances: false,
      overrides: {
        name: 'whatsappLink',
        label: 'WhatsApp link',
        defaultValue: DEFAULT_WHATSAPP_LINK,
      },
    }),
  ],
}
