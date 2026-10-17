import type { Metadata } from 'next'

import { GoogleAnalytics } from '@components/Analytics/GoogleAnalytics/index'
import {
  GoogleTagManagerHead,
  GoogleTagManagerNoScript,
} from '@components/Analytics/GoogleTagManager/index'
import { PrivacyBanner } from '@components/PrivacyBanner/index'
import { Providers } from '@providers/index'
import { PrivacyProvider } from '@root/providers/Privacy/index'
import { brandMetadata, BRAND_NAME } from '@root/utilities/brand'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { GeistMono } from 'geist/font/mono'
import React from 'react'

import { inter } from './fonts'
import '../../css/app.scss'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager — as high as possible in <head> */}
        <GoogleTagManagerHead />
        <link href={process.env.NEXT_PUBLIC_SITE_URL} rel="dns-prefetch" />
        <link href="https://www.googletagmanager.com" rel="preconnect" />
        <link href="https://www.google-analytics.com" rel="preconnect" />
      </head>
      <body
        className={[GeistMono.variable, inter.variable].join(' ')}
        suppressHydrationWarning
      >
        {/* Google Tag Manager (noscript) — immediately after <body> */}
        <GoogleTagManagerNoScript />
        <PrivacyProvider>
          <GoogleAnalytics />
          <Providers>
            {children}
            <PrivacyBanner />
          </Providers>
        </PrivacyProvider>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  ...brandMetadata,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://corespacebuilders.vercel.app'),
  openGraph: mergeOpenGraph(),
  title: {
    default: BRAND_NAME,
    template: `%s | ${BRAND_NAME}`,
  },
  twitter: {
    card: 'summary_large_image',
    description:
      'Corespace Builders plans and builds homes, villas, and homestays in Coorg — with clear cost, design, and execution before construction begins.',
    title: BRAND_NAME,
  },
}
