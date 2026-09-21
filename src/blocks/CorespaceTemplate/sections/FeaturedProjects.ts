import type { Block } from 'payload'

export const CorespaceFeaturedProjectsSection: Block = {
  slug: 'corespaceFeaturedProjects',
  interfaceName: 'CorespaceFeaturedProjectsSection',
  labels: {
    plural: 'Featured Projects Sections',
    singular: 'Featured Projects',
  },
  fields: [
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'carousel',
      label: 'Layout',
      required: true,
      options: [
        {
          label: 'Carousel (Home)',
          value: 'carousel',
        },
        {
          label: 'Showcase (Projects page)',
          value: 'showcase',
        },
      ],
      admin: {
        description:
          'Use Carousel on the Home page. Use Showcase on the Projects page for alternating case-study cards.',
      },
    },
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'PROOF OF WORK',
      label: 'Eyebrow label',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'showcase',
        description: 'Shown only in Showcase layout.',
      },
    },
    {
      name: 'heading',
      type: 'textarea',
      defaultValue: 'Real projects. Real planning. Real execution.',
      label: 'Heading',
      required: true,
    },
    {
      name: 'projects',
      type: 'array',
      labels: {
        plural: 'Projects',
        singular: 'Project',
      },
      admin: {
        initCollapsed: true,
      },
      minRows: 1,
      defaultValue: [
        {
          categoryBadge: 'RESIDENTIAL HOME',
          title: 'Private Residence',
          location: 'NEAR MADIKERI',
          scope: 'PLANNING + CONSTRUCTION',
          description:
            'Sloped terrain resolved with terrain assessment, layout optimization, and drainage planning.',
        },
        {
          categoryBadge: 'VILLA / SECOND HOME',
          title: 'Premium Villa Development',
          location: 'COORG',
          scope: 'DESIGN + CONSTRUCTION + INTERIORS',
          description:
            'Premium design expectations balanced with cost-aware decisions and integrated interiors.',
        },
        {
          categoryBadge: 'HOMESTAY DEVELOPMENT',
          title: 'Homestay Development',
          location: 'COORG',
          scope: 'PLANNING + DEVELOPMENT',
          description:
            'Guest-experience planning, efficient room layouts, and hospitality-focused design.',
        },
      ],
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Project image',
        },
        {
          name: 'categoryBadge',
          type: 'text',
          label: 'Category badge',
          required: true,
          admin: {
            description: 'e.g. RESIDENTIAL HOME',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'location',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g. NEAR MADIKERI',
          },
        },
        {
          name: 'scope',
          type: 'text',
          admin: {
            description: 'Carousel: shown as SCOPE. Showcase: shown as a tag pill.',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Carousel layout only.',
            condition: (_, __, { blockData }) => blockData?.layout !== 'showcase',
          },
        },
        {
          name: 'challenge',
          type: 'textarea',
          label: 'Challenge',
          admin: {
            condition: (_, __, { blockData }) => blockData?.layout === 'showcase',
          },
        },
        {
          name: 'approach',
          type: 'array',
          labels: {
            plural: 'Approach points',
            singular: 'Approach point',
          },
          admin: {
            initCollapsed: true,
            condition: (_, __, { blockData }) => blockData?.layout === 'showcase',
          },
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'outcome',
          type: 'textarea',
          label: 'Outcome',
          admin: {
            condition: (_, __, { blockData }) => blockData?.layout === 'showcase',
          },
        },
      ],
    },
  ],
}
