import type { Metadata } from 'next'

import { CloudFooter } from '@cloud/_components/CloudFooter/index'
import { CloudHeader } from '@cloud/_components/CloudHeader/index'
import { fetchGlobals } from '@data'
import { brandMetadata } from '@root/utilities/brand'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'

import classes from './layout.module.scss'

export const metadata: Metadata = {
  ...brandMetadata,
  title: {
    default: 'Corespace Builders',
    template: '%s | Corespace Builders',
  },
  twitter: {
    card: 'summary_large_image',
    description:
      'Corespace Builders plans and builds homes, villas, and homestays in Coorg — with clear cost, design, and execution before construction begins.',
    title: 'Corespace Builders',
  },
  // TODO: Add cloud graphic
  openGraph: mergeOpenGraph(),
}

export default async (props) => {
  const { children } = props

  const { topBar } = await fetchGlobals()

  return (
    <div className={classes.layout}>
      <CloudHeader topBar={topBar} />
      <div className={classes.container}>{children}</div>
      <CloudFooter />
    </div>
  )
}
