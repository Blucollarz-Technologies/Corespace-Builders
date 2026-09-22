import type { Block } from 'payload'

export const CorespaceFormSuccessSection: Block = {
  slug: 'corespaceFormSuccess',
  interfaceName: 'CorespaceFormSuccessSection',
  labels: {
    plural: 'Form Success Sections',
    singular: 'Form Success',
  },
  fields: [
    {
      name: 'heading',
      type: 'textarea',
      defaultValue: 'Thank You for Reaching Out',
      label: 'Heading',
      required: true,
    },
    {
      name: 'intro',
      type: 'textarea',
      defaultValue:
        'Your enquiry has been successfully received. We appreciate your interest in Corespace Builders and look forward to learning more about your project.',
      label: 'Intro paragraph',
      required: true,
    },
    {
      name: 'listIntro',
      type: 'text',
      defaultValue: "Whether you're planning:",
      label: 'List intro',
    },
    {
      name: 'tags',
      type: 'array',
      labels: {
        plural: 'Project type tags',
        singular: 'Tag',
      },
      admin: {
        initCollapsed: true,
      },
      defaultValue: [
        { label: 'A Home', value: 'home' },
        { label: 'A Villa', value: 'villa' },
        { label: 'A Homestay', value: 'homestay' },
        { label: 'A Renovation', value: 'renovation' },
        { label: 'An Interior Project', value: 'interior' },
      ],
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          admin: {
            description:
              'Must match the Contact form select option value (e.g. home, villa, homestay).',
          },
          label: 'Form option value',
          required: false,
        },
      ],
    },
    {
      name: 'closing',
      type: 'textarea',
      defaultValue:
        "Our team will review the information you've shared and get back to you shortly.",
      label: 'Closing paragraph',
    },
    {
      name: 'successBadge',
      type: 'text',
      defaultValue: 'Form Submitted Successfully',
      label: 'Success badge label',
    },
  ],
}
