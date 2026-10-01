import type { Metadata } from 'next'

import { BRAND_NAME } from '@root/utilities/brand'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import React from 'react'

import { TermsClientPage } from './page_client'

export default () => {
  return <TermsClientPage />
}

export const metadata: Metadata = {
  description: `Terms of Use for ${BRAND_NAME} — website and enquiry terms for construction planning services in Coorg and Karnataka.`,
  openGraph: mergeOpenGraph({
    title: `Terms of Use | ${BRAND_NAME}`,
    url: '/terms',
  }),
  title: `Terms of Use | ${BRAND_NAME}`,
}
