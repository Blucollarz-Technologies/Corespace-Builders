import type { Block } from 'payload'

export const CorespaceQuickAnswerSection: Block = {
  slug: 'corespaceQuickAnswer',
  interfaceName: 'CorespaceQuickAnswerSection',
  labels: {
    plural: 'Quick Answer Sections',
    singular: 'Quick Answer',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Quick Answer for Home Builders',
      label: 'Heading',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      defaultValue:
        "If you're planning construction in Karnataka—especially in Coorg—you need more than a contractor. Most construction projects fail not because of execution—but because they start without proper planning.",
      label: 'Intro text',
      required: true,
    },
    {
      name: 'cards',
      type: 'array',
      labels: {
        plural: 'Cards',
        singular: 'Card',
      },
      admin: {
        initCollapsed: true,
      },
      minRows: 1,
      maxRows: 6,
      defaultValue: [
        {
          icon: 'check',
          title: 'Planning',
          checkmarks: [
            { text: 'Requirement understanding before commitment' },
            { text: 'Feasibility and scope clarity upfront' },
            { text: 'Land and project constraints reviewed early' },
          ],
        },
        {
          icon: 'design',
          title: 'Design',
          checkmarks: [
            { text: 'Terrain-aligned layouts for the site' },
            { text: 'Design decisions matched to project purpose' },
            { text: 'Plans built for how the land behaves' },
          ],
        },
        {
          icon: 'plus',
          title: 'Cost Clarity',
          checkmarks: [
            { text: 'Realistic budgets set before execution' },
            { text: 'Cost visibility before construction starts' },
            { text: 'Fewer surprises after work begins' },
          ],
        },
      ],
      fields: [
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'check',
          options: [
            { label: 'Checkmark', value: 'check' },
            { label: 'Design / window', value: 'design' },
            { label: 'Plus', value: 'plus' },
            { label: 'Terrain / mountains', value: 'terrain' },
            { label: 'Cost', value: 'cost' },
            { label: 'House', value: 'house' },
          ],
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Optional short line above the checkmarks.',
          },
        },
        {
          name: 'checkmarks',
          type: 'array',
          labels: {
            plural: 'Checkmarks',
            singular: 'Checkmark',
          },
          admin: {
            initCollapsed: true,
          },
          minRows: 0,
          maxRows: 8,
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
