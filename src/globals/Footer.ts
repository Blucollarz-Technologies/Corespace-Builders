import type { GlobalConfig } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import { isAdmin } from '../access/isAdmin'
import link from '../fields/link'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      name: 'brandName',
      type: 'text',
      defaultValue: 'Corespace',
      label: 'Brand name (white)',
    },
    {
      name: 'brandAccent',
      type: 'text',
      defaultValue: 'Builders',
      label: 'Brand accent (terracotta)',
    },
    {
      name: 'tagline',
      type: 'textarea',
      defaultValue:
        'Planning-first construction, architecture, interiors, renovation, and development — with a strong focus on Coorg (Kodagu).',
      label: 'Tagline',
    },
    {
      name: 'columns',
      type: 'array',
      labels: {
        plural: 'Columns',
        singular: 'Column',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'navItems',
          type: 'array',
          fields: [
            link({
              appearances: false,
            }),
          ],
        },
      ],
      maxRows: 4,
      minRows: 1,
      defaultValue: [
        {
          label: 'SERVICES',
          navItems: [
            { link: { type: 'custom', label: 'Construction', url: '/service/construction' } },
            { link: { type: 'custom', label: 'Architecture', url: '/service/architecture' } },
            { link: { type: 'custom', label: 'Interiors', url: '/service/interiors' } },
            { link: { type: 'custom', label: 'Renovation', url: '/service/renovation' } },
          ],
        },
        {
          label: 'PROJECTS',
          navItems: [
            { link: { type: 'custom', label: 'Portfolio', url: '/projects' } },
            { link: { type: 'custom', label: 'Homestay & Villa', url: '/projects/homestay-villa' } },
            {
              link: {
                type: 'custom',
                label: 'Coorg Construction',
                url: '/service/corespace-construction-services-coorg',
              },
            },
          ],
        },
        {
          label: 'RESOURCES',
          navItems: [
            { link: { type: 'custom', label: 'Cost Guide', url: '/resources/cost-guide' } },
            { link: { type: 'custom', label: 'Blog', url: '/blog' } },
          ],
        },
        {
          label: 'COMPANY',
          navItems: [
            { link: { type: 'custom', label: 'About', url: '/about' } },
            { link: { type: 'custom', label: 'Contact', url: '/contact' } },
            { link: { type: 'custom', label: 'Thank You', url: '/thank-you' } },
            { link: { type: 'custom', label: 'Privacy', url: '/privacy' } },
            { link: { type: 'custom', label: 'Terms', url: '/terms' } },
          ],
        },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      defaultValue: '© 2026 Corespace Builders. All rights reserved.',
      label: 'Copyright',
    },
  ],
  hooks: {
    afterChange: [
      () => {
        revalidateTag('globals')
        revalidateTag('footer')
        revalidatePath('/', 'layout')
      },
    ],
  },
}
