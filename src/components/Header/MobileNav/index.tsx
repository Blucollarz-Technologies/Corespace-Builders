'use client'

import type { MainMenu, Media as MediaType } from '@root/payload-types'
import type { Theme } from '@root/providers/Theme/types'

import { CMSLink } from '@components/CMSLink/index'
import { Gutter } from '@components/Gutter/index'
import { RichText } from '@components/RichText/index'
import { Modal, useModal } from '@faceless-ui/modal'
import { ArrowIcon } from '@root/icons/ArrowIcon/index'
import { useHeaderObserver } from '@root/providers/HeaderIntersectionObserver/index'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import { MenuIcon } from '../../../graphics/MenuIcon/index'
import { resolveWhatsAppUrl } from '@root/utilities/whatsapp'

import { BrandLogo } from '../BrandLogo/index'
import classes from './index.module.scss'

export const modalSlug = 'mobile-nav'
export const subMenuSlug = 'mobile-sub-menu'

type NavItems = {
  brandName?: MainMenu['brandName']
  enableWhatsApp?: MainMenu['enableWhatsApp']
  logo?: MainMenu['logo']
  showBrandName?: MainMenu['showBrandName']
  whatsappUrl?: MainMenu['whatsappUrl']
} & Pick<MainMenu, 'menuCta' | 'tabs'>

function WhatsAppIcon() {
  return (
    <svg aria-hidden fill="currentColor" height="18" viewBox="0 0 24 24" width="18">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

const MobileNavItems = ({
  enableWhatsApp,
  menuCta,
  setActiveTab,
  tabs,
  whatsappUrl,
}: {
  enableWhatsApp?: MainMenu['enableWhatsApp']
  menuCta?: MainMenu['menuCta']
  setActiveTab: (index: number) => void
  tabs?: MainMenu['tabs']
  whatsappUrl?: MainMenu['whatsappUrl']
}) => {
  const { openModal } = useModal()
  const handleOnClick = (index: number) => {
    openModal(subMenuSlug)
    setActiveTab(index)
  }

  const resolvedWhatsAppUrl = resolveWhatsAppUrl(whatsappUrl)
  const showWhatsApp = enableWhatsApp !== false && Boolean(resolvedWhatsAppUrl)

  return (
    <ul className={classes.mobileMenuItems}>
      {(tabs || []).map((tab, index) => {
        const { enableDirectLink, enableDropdown, label, link } = tab

        if (!enableDropdown) {
          return <CMSLink {...link} className={classes.mobileMenuItem} key={index} label={label} />
        }

        if (enableDirectLink) {
          return (
            <button
              className={classes.mobileMenuItem}
              key={index}
              onClick={() => handleOnClick(index)}
              type="button"
            >
              <CMSLink
                className={classes.directLink}
                {...link}
                label={label}
                onClick={(e) => {
                  e.stopPropagation()
                }}
              />
              <ArrowIcon rotation={45} size="medium" />
            </button>
          )
        }

        return (
          <CMSLink
            {...link}
            className={classes.mobileMenuItem}
            key={index}
            label={label}
            onClick={() => handleOnClick(index)}
          >
            <ArrowIcon rotation={45} size="medium" />
          </CMSLink>
        )
      })}

      {(menuCta?.label || showWhatsApp) && (
        <div className={classes.mobileActions}>
          {menuCta?.label && <CMSLink {...menuCta} className={classes.mobileCta} />}
          {showWhatsApp && (
            <a
              aria-label="Chat on WhatsApp"
              className={classes.mobileWhatsapp}
              href={resolvedWhatsAppUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <WhatsAppIcon />
            </a>
          )}
        </div>
      )}
    </ul>
  )
}

const MobileMenuModal: React.FC<
  {
    setActiveTab: (index: number) => void
    theme?: null | Theme
  } & NavItems
> = ({ enableWhatsApp, menuCta, setActiveTab, tabs, theme, whatsappUrl }) => {
  return (
    <Modal className={classes.mobileMenuModal} slug={modalSlug} trapFocus={false}>
      <Gutter className={classes.mobileMenuWrap} dataTheme={`${theme}`} rightGutter={false}>
        <MobileNavItems
          enableWhatsApp={enableWhatsApp}
          menuCta={menuCta}
          setActiveTab={setActiveTab}
          tabs={tabs}
          whatsappUrl={whatsappUrl}
        />
        <div className={classes.modalBlur} />
      </Gutter>
    </Modal>
  )
}

const SubMenuModal: React.FC<
  {
    activeTab: number | undefined
    theme?: null | Theme
  } & NavItems
> = ({ activeTab, tabs, theme }) => {
  const { closeAllModals, closeModal } = useModal()

  return (
    <Modal
      className={[classes.mobileMenuModal, classes.mobileSubMenu].join(' ')}
      onClick={closeAllModals}
      slug={subMenuSlug}
      trapFocus={false}
    >
      <Gutter className={classes.subMenuWrap} dataTheme={`${theme}`}>
        {(tabs || []).map((tab, tabIndex) => {
          if (tabIndex !== activeTab) {
            return null
          }
          return (
            <div className={classes.subMenuItems} key={tabIndex}>
              <button
                className={classes.backButton}
                onClick={(e) => {
                  closeModal(subMenuSlug)
                  e.stopPropagation()
                }}
                type="button"
              >
                <ArrowIcon rotation={225} size="medium" />
                Back
              </button>
              {tab.descriptionLinks && tab.descriptionLinks.length > 0 && (
                <div className={classes.descriptionLinks}>
                  {tab.descriptionLinks.map((link, linkIndex) => (
                    <CMSLink className={classes.descriptionLink} key={linkIndex} {...link.link}>
                      <ArrowIcon className={classes.linkArrow} />
                    </CMSLink>
                  ))}
                </div>
              )}
              {(tab.navItems || []).map((item, index) => {
                return (
                  <div className={classes.linkWrap} key={index}>
                    {item.style === 'default' && item.defaultLink && (
                      <CMSLink className={classes.defaultLink} {...item.defaultLink.link} label="">
                        <div className={classes.listLabelWrap}>
                          <div className={classes.listLabel}>
                            {item.defaultLink.link.label}
                            <ArrowIcon rotation={0} size="medium" />
                          </div>
                          <div className={classes.itemDescription}>
                            {item.defaultLink.description}
                          </div>
                        </div>
                      </CMSLink>
                    )}
                    {item.style === 'list' && item.listLinks && (
                      <div className={classes.linkList}>
                        <div className={classes.tag}>{item.listLinks.tag}</div>
                        <div className={classes.listWrap}>
                          {item.listLinks.links?.map((link, linkIndex) => (
                            <CMSLink className={classes.link} key={linkIndex} {...link.link}>
                              {link.link?.newTab && link.link?.type === 'custom' && (
                                <ArrowIcon className={classes.linkArrow} />
                              )}
                            </CMSLink>
                          ))}
                        </div>
                      </div>
                    )}
                    {item.style === 'featured' && item.featuredLink && (
                      <div className={classes.featuredLink}>
                        <div className={classes.tag}>{item.featuredLink.tag}</div>
                        {item.featuredLink?.label && (
                          <RichText
                            className={classes.featuredLinkLabel}
                            content={item.featuredLink.label}
                          />
                        )}
                        <div className={classes.featuredLinkWrap}>
                          {item.featuredLink.links?.map((link, linkIndex) => (
                            <CMSLink
                              className={classes.featuredLinks}
                              key={linkIndex}
                              {...link.link}
                            >
                              <ArrowIcon />
                            </CMSLink>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
        <div className={classes.modalBlur} />
      </Gutter>
    </Modal>
  )
}

export const MobileNav: React.FC<NavItems> = (props) => {
  const { brandName, logo, showBrandName } = props
  const { closeAllModals, isModalOpen, openModal } = useModal()
  const { headerTheme } = useHeaderObserver()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = React.useState<number | undefined>()

  const isMenuOpen = isModalOpen(modalSlug)

  React.useEffect(() => {
    closeAllModals()
  }, [pathname, closeAllModals])

  const toggleModal = React.useCallback(() => {
    if (isMenuOpen) {
      closeAllModals()
    } else {
      openModal(modalSlug)
    }
  }, [isMenuOpen, closeAllModals, openModal])

  return (
    <div className={classes.mobileNav}>
      <div className={classes.menuBar}>
        <Gutter>
          <div className={classes.menuBarContainer}>
            <BrandLogo
              brandName={brandName}
              logo={logo as MediaType | null | string | undefined}
              showBrandName={showBrandName}
            />
            <div
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              className={[classes.modalToggler, isMenuOpen ? classes.hamburgerOpen : '']
                .filter(Boolean)
                .join(' ')}
              onClick={toggleModal}
              role="button"
              tabIndex={0}
            >
              <MenuIcon />
            </div>
          </div>
        </Gutter>
      </div>
      <MobileMenuModal {...props} setActiveTab={setActiveTab} theme={headerTheme} />
      <SubMenuModal {...props} activeTab={activeTab} theme={headerTheme} />
    </div>
  )
}
