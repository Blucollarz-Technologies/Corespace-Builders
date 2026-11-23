'use client'

import { usePrivacy } from '@root/providers/Privacy/index'
import { setGtmConsent, trackVirtualPageView } from '@root/utilities/gtm'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useRef } from 'react'

const GtmPageViewTracker: React.FC = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const skipInitialPageView = useRef(true)

  useEffect(() => {
    const query = searchParams?.toString()
    const path = query ? `${pathname}?${query}` : pathname

    if (skipInitialPageView.current) {
      skipInitialPageView.current = false
      return
    }

    trackVirtualPageView(path)
  }, [pathname, searchParams])

  return null
}

/** Consent sync + SPA page views for GTM / GA4 / Ads inside the container. */
export const GtmRuntime: React.FC = () => {
  const { cookieConsent } = usePrivacy()

  useEffect(() => {
    if (typeof cookieConsent === 'boolean') {
      setGtmConsent(cookieConsent)
    }
  }, [cookieConsent])

  return (
    <Suspense fallback={null}>
      <GtmPageViewTracker />
    </Suspense>
  )
}