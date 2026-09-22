import type { GlobalConfig } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'
import { WHATSAPP_LINK } from '@root/utilities/whatsapp'

import { isAdmin } from '../access/isAdmin'
import link from '../fields/link'

export const MainMenu: GlobalConfig = {
  slug: 'main-menu',
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Brand / Logo',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Logo image',
          admin: {
            description:
              'Optional. Upload your logo mark or full logo. If empty, a simple brand mark is shown.',
          },
        },
        {
          name: 'brandName',
          type: 'text',
          defaultValue: 'Corespace Builders',
          label: 'Brand name',
          admin: {
            description: 'Shown next to the logo in the navbar.',
          },
        },
        {
          name: 'showBrandName',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show brand name next to logo',
        },
      ],
    },
    {
      name: 'tabs',
      type: 'array',
      admin: {
        components: {
          RowLabel: '@root/globals/CustomRowLabelTabs',
        },
        description:
          'Navbar links. For simple links like Services / Projects, enable Direct Link only.',
      },
      defaultValue: [
        {
          label: 'Services',
          enableDirectLink: true,
          enableDropdown: false,
          link: { type: 'custom', url: '/services' },
        },
        {
          label: 'Projects',
          enableDirectLink: true,
          enableDropdown: false,
          link: { type: 'custom', url: '/projects' },
        },
        {
          label: 'Cost Guide',
          enableDirectLink: true,
          enableDropdown: false,
          link: { type: 'custom', url: '/cost-guide' },
        },
        {
          label: 'Blog',
          enableDirectLink: true,
          enableDropdown: false,
          link: { type: 'custom', url: '/blog' },
        },
        {
          label: 'About',
          enableDirectLink: true,
          enableDropdown: false,
          link: { type: 'custom', url: '/about' },
        },
        {
          label: 'Contact',
          enableDirectLink: true,
          enableDropdown: false,
          link: { type: 'custom', url: '/contact' },
        },
      ],
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'enableDirectLink',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'enableDropdown',
              type: 'checkbox',
            },
          ],
        },
        {
          type: 'collapsible',
          admin: {
            condition: (_, siblingData) => siblingData.enableDirectLink,
          },
          fields: [
            link({
              appearances: false,
              disableLabel: true,
            }),
          ],
          label: 'Direct Link',
        },
        {
          type: 'collapsible',
          admin: {
            condition: (_, siblingData) => siblingData.enableDropdown,
          },
          fields: [
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'descriptionLinks',
              type: 'array',
              fields: [
                link({
                  appearances: false,
                  overrides: {
                    label: false,
                  },
                }),
              ],
            },
            {
              name: 'navItems',
              type: 'array',
              admin: {
                components: {
                  RowLabel: '@root/globals/CustomRowLabelNavItems',
                },
              },
              fields: [
                {
                  name: 'style',
                  type: 'select',
                  defaultValue: 'default',
                  options: [
                    {
                      label: 'Default',
                      value: 'default',
                    },
                    {
                      label: 'Featured',
                      value: 'featured',
                    },
                    {
                      label: 'List',
                      value: 'list',
                    },
                  ],
                },
                {
                  name: 'defaultLink',
                  type: 'group',
                  admin: {
                    condition: (_, siblingData) => siblingData.style === 'default',
                  },
                  fields: [
                    link({
                      appearances: false,
                      overrides: {
                        label: false,
                      },
                    }),
                    {
                      name: 'description',
                      type: 'textarea',
                    },
                  ],
                },
                {
                  name: 'featuredLink',
                  type: 'group',
                  admin: {
                    condition: (_, siblingData) => siblingData.style === 'featured',
                  },
                  fields: [
                    {
                      name: 'tag',
                      type: 'text',
                    },
                    {
                      name: 'label',
                      type: 'richText',
                    },
                    {
                      name: 'links',
                      type: 'array',
                      fields: [
                        link({
                          appearances: false,
                          overrides: {
                            label: false,
                          },
                        }),
                      ],
                    },
                  ],
                },
                {
                  name: 'listLinks',
                  type: 'group',
                  admin: {
                    condition: (_, siblingData) => siblingData.style === 'list',
                  },
                  fields: [
                    {
                      name: 'tag',
                      type: 'text',
                    },
                    {
                      name: 'links',
                      type: 'array',
                      fields: [
                        link({
                          appearances: false,
                          overrides: {
                            label: false,
                          },
                        }),
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          label: 'Dropdown Menu',
        },
      ],
      label: 'Main Menu Items',
    },
    {
      type: 'collapsible',
      label: 'Navbar actions',
      fields: [
        link({
          appearances: false,
          overrides: {
            name: 'menuCta',
            label: 'Primary CTA button',
            admin: {
              description: 'e.g. Get Your Cost Estimate',
            },
          },
        }),
        {
          name: 'enableWhatsApp',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show WhatsApp button',
        },
        {
          name: 'whatsappUrl',
          type: 'text',
          defaultValue: WHATSAPP_LINK,
          label: 'WhatsApp URL',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.enableWhatsApp),
            description: 'Full WhatsApp link with optional pre-filled message.',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      () => {
        revalidateTag('globals')
        revalidateTag('main-menu')
        revalidatePath('/', 'layout')
      },
    ],
  },
}
