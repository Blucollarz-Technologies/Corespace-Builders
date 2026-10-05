import type { CollectionConfig } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import { isAdmin } from '../access/isAdmin'
import { publishedOnly } from '../access/publishedOnly'
import { fullTitle } from '../fields/fullTitle'
import { hero } from '../fields/hero'
import { slugField } from '../fields/slug'
import { formatPagePath } from '../utilities/formatPagePath'
import { formatPreviewURL } from '../utilities/formatPreviewURL'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: publishedOnly,
    readVersions: isAdmin,
    update: isAdmin,
  },
  admin: {
    defaultColumns: ['fullTitle', 'slug', 'createdAt', 'updatedAt'],
    livePreview: {
      url: ({ data }) => formatPreviewURL('pages', data),
    },
    preview: (doc) => formatPreviewURL('pages', doc),
    useAsTitle: 'fullTitle',
  },
  defaultPopulate: {
    slug: true,
    breadcrumbs: true,
    title: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    fullTitle,
    {
      name: 'noindex',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
      },
      label: 'No Index',
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blockReferences: [
                'callout',
                'corespaceTemplate',
                'cta',
                'cardGrid',
                'caseStudyCards',
                'caseStudiesHighlight',
                'caseStudyParallax',
                'codeFeature',
                'content',
                'contentGrid',
                'comparisonTable',
                'form',
                'hoverCards',
                'hoverHighlights',
                'linkGrid',
                'logoGrid',
                'mediaBlock',
                'mediaContent',
                'mediaContentAccordion',
                'pricing',
                'reusableContentBlock',
                'slider',
                'statement',
                'steps',
                'stickyHighlights',
                'exampleTabs',
              ],
              blocks: [],
              required: true,
            },
          ],
          label: 'Content',
        },
      ],
    },
    slugField(),
  ],
  hooks: {
    afterChange: [
      ({ doc, previousDoc }) => {
        if (doc._status === 'published' || doc._status !== previousDoc._status) {
          const path = formatPagePath('pages', doc) || '/'
          const tagKey =
            doc.slug === 'home'
              ? 'home'
              : path.replace(/^\/|\/$/g, '') || 'home'

          revalidateTag('pages')
          revalidateTag(`page_${tagKey}`)
          revalidatePath(path)
          console.log(`Revalidated: ${path} (tag: page_${tagKey})`)

          const isServiceChild =
            (typeof doc.parent === 'object' && doc.parent?.slug === 'services') ||
            (Array.isArray(doc.breadcrumbs) &&
              doc.breadcrumbs.length > 1 &&
              doc.breadcrumbs.some((crumb) => crumb?.url === '/services'))

          const isProjectChild =
            (typeof doc.parent === 'object' && doc.parent?.slug === 'projects') ||
            (Array.isArray(doc.breadcrumbs) &&
              doc.breadcrumbs.length > 1 &&
              doc.breadcrumbs.some((crumb) => crumb?.url === '/projects'))

          if (doc.slug === 'services' || isServiceChild) {
            revalidateTag('service_pages')
            if (isServiceChild && doc.slug) {
              revalidateTag(`service_${doc.slug}`)
              revalidatePath(`/service/${doc.slug}`)
            }
          }

          if (doc.slug === 'projects' || isProjectChild) {
            revalidateTag('project_pages')
            if (isProjectChild && doc.slug) {
              revalidateTag(`project_${doc.slug}`)
              revalidatePath(`/project/${doc.slug}`)
            }
          }

          if (doc.slug === 'home' || doc.breadcrumbs?.[0]?.url === '/home') {
            revalidateTag('page_home')
            revalidatePath('/')
            console.log(`Revalidated: /`)
          }
        }
      },
    ],
  },
  versions: {
    drafts: true,
  },
}
