'use client'

import type { MainMenu, TopBar as TopBarType } from '@root/payload-types'

import { TopBar } from '@components/TopBar'
import { UniversalTruth } from '@components/UniversalTruth/index'
import { useModal } from '@faceless-ui/modal'
import { useScrollInfo } from '@faceless-ui/scroll-info'
import * as React from 'react'

import { DesktopNav } from './DesktopNav/index'
import classes from './index.module.scss'
import { MobileNav, modalSlug as mobileNavModalSlug } from './MobileNav/index'

export const Header: React.FC<
  {
    topBar?: TopBarType
  } & MainMenu
> = ({
  brandName,
  enableWhatsApp,
  logo,
  menuCta,
  tabs,
  topBar,
  whatsappUrl,
}) => {
  const { isModalOpen } = useModal()
  const isMobileNavOpen = isModalOpen(mobileNavModalSlug)
  const { y } = useScrollInfo()

  React.useEffect(() => {
    if (!topBar?.enableTopBar) {
      document.documentElement.style.setProperty('--top-bar-height', '0px')
    } else {
      document.documentElement.style.setProperty('--top-bar-height', y > 30 ? '0px' : '3rem')
    }
  }, [topBar?.enableTopBar, y])

  return (
    <div className={classes.wrapper} data-theme="dark">
      {topBar?.enableTopBar && (
        <div className={classes.topBar} id="topBar">
          <TopBar {...topBar} />
        </div>
      )}
      <header
        className={[classes.header, isMobileNavOpen && classes.mobileNavOpen]
          .filter(Boolean)
          .join(' ')}
      >
        <DesktopNav
          brandName={brandName}
          enableWhatsApp={enableWhatsApp}
          logo={logo}
          menuCta={menuCta}
          showBrandName={true}
          tabs={tabs}
          whatsappUrl={whatsappUrl}
        />
        <MobileNav
          brandName={brandName}
          enableWhatsApp={enableWhatsApp}
          logo={logo}
          menuCta={menuCta}
          showBrandName={true}
          tabs={tabs}
          whatsappUrl={whatsappUrl}
        />
        <React.Suspense>
          <UniversalTruth />
        </React.Suspense>
      </header>
    </div>
  )
}
