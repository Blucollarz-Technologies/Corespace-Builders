import type { Metadata } from 'next'

import { GoogleAnalytics } from '@components/Analytics/GoogleAnalytics/index'
import { GoogleTagManager } from '@components/Analytics/GoogleTagManager/index'
import { PrivacyBanner } from '@components/PrivacyBanner/index'
import { Providers } from '@providers/index'
import { PrivacyProvider } from '@root/providers/Privacy/index'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { GeistMono } from 'geist/font/mono'
import React from 'react'

import { fraunces, inter } from './fonts'
import '../../css/app.scss'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <PrivacyProvider>
        <head>
          <link href="/images/favicon.svg" rel="icon" />
          <link href="/images/apple-icon.png" rel="apple-touch-icon" />
          <link href={process.env.NEXT_PUBLIC_SITE_URL} rel="dns-prefetch" />
          <link href="https://www.googletagmanager.com" rel="preconnect" />
          <link href="https://www.google-analytics.com" rel="preconnect" />
          <GoogleAnalytics />
        </head>
        <body className={[GeistMono.variable, inter.variable, fraunces.variable].join(' ')}>
          <GoogleTagManager />
          <Providers>
            {children}
            <PrivacyBanner />
          </Providers>
        </body>
      </PrivacyProvider>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://corespacebuilders.vercel.app'),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    description:
      'Corespace Builders plans and builds homes, villas, and homestays in Coorg — with clear cost, design, and execution before construction begins.',
    title: 'Corespace Builders',
  },
}
