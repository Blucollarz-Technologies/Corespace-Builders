import config from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'

import type {
  Budget,
  CaseStudy,
  Category,
  Footer,
  Form,
  GetStarted,
  Industry,
  MainMenu,
  Page,
  Partner,
  PartnerProgram,
  Post,
  Region,
  Specialty,
  TopBar,
} from '../../payload-types'

export const fetchGlobals = async (): Promise<{
  footer: Footer
  mainMenu: MainMenu
  topBar: TopBar
}> => {
  const payload = await getPayload({ config })
  const mainMenu = await payload.findGlobal({
    slug: 'main-menu',
    depth: 2,
  })
  const footer = await payload.findGlobal({
    slug: 'footer',
    depth: 1,
  })
  const topBar = await payload.findGlobal({
    slug: 'topBar',
    depth: 1,
  })

  return {
    footer,
    mainMenu,
    topBar,
  }
}

export const fetchPage = async (incomingSlugSegments: string[]): Promise<null | Page> => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config })
  const slugSegments = incomingSlugSegments || ['home']
  const slug = slugSegments.at(-1)

  const data = await payload.find({
    collection: 'pages',
    depth: 2,
    draft,
    limit: 1,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft
          ? []
          : [
              {
                _status: {
                  equals: 'published',
                },
              },
            ]),
      ],
    },
  })

  const pagePath = `/${slugSegments.join('/')}`

  const page = data.docs.find(({ breadcrumbs }: Page) => {
    if (!breadcrumbs) {
      return false
    }
    const { url } = breadcrumbs[breadcrumbs.length - 1]
    return url === pagePath
  })

  if (page) {
    return page
  }

  return null
}

export const fetchPages = async (): Promise<Partial<Page>[]> => {
  const payload = await getPayload({ config })
  const data = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 300,
    select: {
      breadcrumbs: true,
    },
    where: {
      and: [
        {
          slug: {
            not_equals: 'cloud',
          },
        },
        {
          _status: {
            equals: 'published',
          },
        },
      ],
    },
  })

  return data.docs
}

export const fetchPosts = async (): Promise<Partial<Post>[]> => {
  const payload = await getPayload({ config })
  const data = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 300,
    select: {
      slug: true,
      category: true,
    },
  })

  return data.docs
}

export const fetchBlogPosts = async (): Promise<Partial<Post>[]> => {
  const currentDate = new Date()
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 300,
    select: {
      slug: true,
      authors: true,
      image: true,
      publishedOn: true,
      title: true,
    },
    sort: '-publishedOn',
    where: {
      and: [
        { publishedOn: { less_than_equal: currentDate } },
        { _status: { equals: 'published' } },
      ],
    },
  })
  return data.docs
}

export const fetchArchive = async (slug: string, draft?: boolean): Promise<Partial<Category>> => {
  const payload = await getPayload({ config })
  const currentDate = new Date()

  const data = await payload.find({
    collection: 'categories',
    depth: 2,
    draft,
    joins: {
      posts: {
        sort: '-publishedOn',
        where: {
          and: [
            { publishedOn: { less_than_equal: currentDate } },
            { _status: { equals: 'published' } },
          ],
        },
      },
    },
    limit: 1,
    select: {
      name: true,
      slug: true,
      description: true,
      headline: true,
      posts: true,
    },
    where: {
      and: [{ slug: { equals: slug } }],
    },
  })
  return data.docs[0]
}

export const fetchArchives = async (slug?: string): Promise<Partial<Category>[]> => {
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'categories',
    depth: 0,
    select: {
      name: true,
      slug: true,
    },
    sort: 'name',
    ...(slug && {
      where: {
        slug: {
          not_equals: slug,
        },
      },
    }),
  })

  return data.docs
}

export const fetchBlogPost = async (slug: string, category): Promise<Partial<Post>> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'posts',
    depth: 2,
    draft,
    limit: 1,
    overrideAccess: draft,
    select: {
      authors: true,
      authorType: true,
      category: true,
      content: true,
      excerpt: true,
      featuredMedia: true,
      guestAuthor: true,
      guestSocials: true,
      image: true,
      meta: true,
      publishedOn: true,
      relatedPosts: true,
      title: true,
      updatedAt: true,
      videoUrl: true,
    },
    where: {
      and: [
        { slug: { equals: slug } },
        { 'category.slug': { equals: category } },
        ...(draft
          ? []
          : [
              {
                _status: {
                  equals: 'published',
                },
              },
            ]),
      ],
    },
  })

  return data.docs[0]
}

export const fetchCaseStudies = async (): Promise<Partial<CaseStudy>[]> => {
  const payload = await getPayload({ config })
  const data = await payload.find({
    collection: 'case-studies',
    depth: 0,
    limit: 300,
    select: {
      slug: true,
    },
  })

  return data.docs
}

export const fetchCaseStudy = async (slug: string): Promise<CaseStudy> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'case-studies',
    depth: 1,
    draft,
    limit: 1,
    where: {
      and: [
        { slug: { equals: slug } },
        ...(draft
          ? []
          : [
              {
                _status: {
                  equals: 'published',
                },
              },
            ]),
      ],
    },
  })

  return data.docs[0]
}

export const fetchPartners = async (): Promise<Partner[]> => {
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'partners',
    depth: 2,
    limit: 300,
    overrideAccess: false, // Respect field-level access control (excludes email and hubspotID)
    sort: 'slug',
    where: {
      AND: [{ agency_status: { equals: 'active' } }, { _status: { equals: 'published' } }],
    },
  })

  return data.docs
}

export const fetchPartner = async (slug: string): Promise<Partial<Partner>> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'partners',
    depth: 2,
    draft,
    limit: 1,
    populate: {
      'case-studies': {
        slug: true,
        featuredImage: true,
        meta: {
          description: true,
        },
        title: true,
      },
    },
    select: {
      name: true,
      budgets: true,
      city: true,
      content: {
        bannerImage: true,
        caseStudy: true,
        contributions: true,
        idealProject: true,
        overview: true,
        projects: true,
        services: true,
      },
      featured: true,
      industries: true,
      regions: true,
      social: true,
      specialties: true,
      topContributor: true,
      website: true,
    },
    where: {
      and: [
        { slug: { equals: slug } },
        ...(draft
          ? []
          : [
              {
                _status: {
                  equals: 'published',
                },
              },
            ]),
      ],
    },
  })

  return data.docs[0]
}

export const fetchPartnerProgram = async (): Promise<Partial<PartnerProgram>> => {
  const payload = await getPayload({ config })
  const data = await payload.findGlobal({
    slug: 'partner-program',
    depth: 2,
  })

  return data
}

export const fetchFilters = async (): Promise<{
  budgets: Budget[]
  industries: Industry[]
  regions: Region[]
  specialties: Specialty[]
}> => {
  const payload = await getPayload({ config })

  const industries = await payload.find({
    collection: 'industries',
    limit: 100,
  })

  const specialties = await payload.find({
    collection: 'specialties',
    limit: 100,
  })

  const regions = await payload.find({
    collection: 'regions',
    limit: 100,
  })

  const budgets = await payload.find({
    collection: 'budgets',
    limit: 100,
  })

  return {
    budgets: budgets.docs,
    industries: industries.docs,
    regions: regions.docs,
    specialties: specialties.docs,
  }
}

export const fetchGetStarted = async (): Promise<GetStarted> => {
  const payload = await getPayload({ config })
  const data = await payload.findGlobal({
    slug: 'get-started',
    depth: 1,
  })

  return data
}

export const fetchForm = async (name: string): Promise<Form> => {
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'forms',
    depth: 1,
    limit: 1,
    where: {
      title: {
        equals: name,
      },
    },
  })

  return data.docs[0]
}

export const fetchCostEstimateForm = async (): Promise<Form | null> => {
  const payload = await getPayload({ config })
  const mainMenu = await payload.findGlobal({
    slug: 'main-menu',
    depth: 2,
  })

  const menuForm = (mainMenu as { costEstimateForm?: Form | string | null }).costEstimateForm

  if (menuForm && typeof menuForm !== 'string') {
    return menuForm
  }

  const contactPage = await payload.find({
    collection: 'pages',
    depth: 3,
    limit: 1,
    where: {
      slug: {
        equals: 'contact',
      },
    },
  })

  const layout = contactPage.docs[0]?.layout

  if (Array.isArray(layout)) {
    for (const block of layout) {
      const sections = block.blockType === 'corespaceTemplate'
        ? block.corespaceTemplateFields?.sections
        : null

      if (!Array.isArray(sections)) {
        continue
      }

      for (const section of sections) {
        if (
          section.blockType === 'corespaceStepForm' &&
          section.form &&
          typeof section.form !== 'string'
        ) {
          return section.form
        }
      }
    }
  }

  const forms = await payload.find({
    collection: 'forms',
    depth: 1,
    limit: 1,
    sort: 'createdAt',
  })

  return forms.docs[0] ?? null
}

/**
 * Published child pages of a parent page (by parent slug).
 */
const fetchChildPagesOf = async (parentSlug: string): Promise<Page[]> => {
  const payload = await getPayload({ config })

  const parentResult = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 1,
    where: {
      and: [
        {
          slug: {
            equals: parentSlug,
          },
        },
        {
          _status: {
            equals: 'published',
          },
        },
      ],
    },
  })

  const parent = parentResult.docs[0]
  if (!parent) {
    return []
  }

  const children = await payload.find({
    collection: 'pages',
    depth: 2,
    limit: 200,
    pagination: false,
    sort: 'createdAt',
    where: {
      and: [
        {
          parent: {
            equals: parent.id,
          },
        },
        {
          _status: {
            equals: 'published',
          },
        },
      ],
    },
  })

  return children.docs
}

/**
 * Single child page by slug — must belong under the given parent slug.
 */
const fetchChildPageOf = async (
  slug: string,
  parentSlug: string,
): Promise<null | Page> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'pages',
    depth: 2,
    draft,
    limit: 1,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft
          ? []
          : [
              {
                _status: {
                  equals: 'published',
                },
              },
            ]),
      ],
    },
  })

  const page = data.docs[0]
  if (!page) {
    return null
  }

  const parent = page.parent
  if (typeof parent === 'object' && parent && parent.slug === parentSlug) {
    return page
  }

  const crumbs = page.breadcrumbs || []
  const underParent =
    crumbs.length > 1 &&
    crumbs.some(
      (crumb) =>
        crumb.url === `/${parentSlug}` ||
        crumb.url === `/${parentSlug.replace(/s$/, '')}`,
    )

  if (underParent) {
    return page
  }

  if (typeof parent === 'string') {
    const parentDoc = await payload.findByID({
      id: parent,
      collection: 'pages',
      depth: 0,
      draft,
    })

    if (parentDoc?.slug === parentSlug) {
      return page
    }
  }

  return null
}

/**
 * Published child pages of the Services parent page (slug: `services`).
 * Used to auto-populate the Corespace Services section.
 */
export const fetchServicePages = async (): Promise<Page[]> => {
  return fetchChildPagesOf('services')
}

/**
 * Single service page by slug — must be a published child of Services.
 */
export const fetchServicePage = async (slug: string): Promise<null | Page> => {
  return fetchChildPageOf(slug, 'services')
}

/**
 * Published child pages of the Projects parent page (slug: `projects`).
 * Used to auto-populate the Corespace Projects section.
 */
export const fetchProjectPages = async (): Promise<Page[]> => {
  return fetchChildPagesOf('projects')
}

/**
 * Single project page by slug — must be a published child of Projects.
 */
export const fetchProjectPage = async (slug: string): Promise<null | Page> => {
  return fetchChildPageOf(slug, 'projects')
}
