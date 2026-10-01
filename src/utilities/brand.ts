import type { Metadata } from 'next'

export const BRAND_NAME = 'Corespace Builders'

export const BRAND_FAVICON_SVG = '/images/favicon.svg'
export const BRAND_FAVICON_LIGHT_SVG = '/images/favicon-light.svg'
export const BRAND_MANIFEST = '/site.webmanifest'

export const brandIcons: NonNullable<Metadata['icons']> = {
  apple: [{ type: 'image/svg+xml', url: BRAND_FAVICON_LIGHT_SVG }],
  icon: [{ type: 'image/svg+xml', url: BRAND_FAVICON_SVG }],
  shortcut: [BRAND_FAVICON_SVG],
}

export const brandMetadata: Pick<Metadata, 'icons' | 'manifest'> = {
  icons: brandIcons,
  manifest: BRAND_MANIFEST,
}
