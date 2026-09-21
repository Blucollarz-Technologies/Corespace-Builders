'use client'

import type { MainMenu, Media as MediaType } from '@root/payload-types'

import { CMSLink } from '@components/CMSLink/index'
import { Gutter } from '@components/Gutter/index'
import { RichText } from '@components/RichText/index'
import { ArrowIcon } from '@root/icons/ArrowIcon/index'
import * as React from 'react'

import { resolveWhatsAppUrl } from '@root/utilities/whatsapp'

import { BrandLogo } from '../BrandLogo/index'
import classes from './index.module.scss'

type DesktopNavType = {
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

export const DesktopNav: React.FC<DesktopNavType> = ({
  brandName,
  enableWhatsApp,
  logo,
  menuCta,
  showBrandName,
  tabs,
  whatsappUrl,
}) => {
  const [activeTab, setActiveTab] = React.useState<number | undefined>()
  const [activeDropdown, setActiveDropdown] = React.useState(false)
  const [backgroundStyles, setBackgroundStyles] = React.useState<{ height: string }>({
    height: '0px',
  })
  const [underlineStyles, setUnderlineStyles] = React.useState<React.CSSProperties>({})
  const [activeDropdownItem, setActiveDropdownItem] = React.useState<number | undefined>()

  const menuItemRefs = [] as (HTMLButtonElement | null)[]
  const dropdownMenuRefs = [] as (HTMLDivElement | null)[]
  const hoverTimeout = React.useRef<null | number>(null)

  const handleHoverEnter = (index: number) => {
    setActiveTab(index)
    setActiveDropdown(true)

    const hoveredMenuItem = menuItemRefs[index]
    const hoveredDropdownMenu = dropdownMenuRefs[index]
    const nextHeight = hoveredDropdownMenu?.clientHeight || 0

    if (hoveredMenuItem) {
      setUnderlineStyles({
        left: hoveredMenuItem.offsetLeft,
        width: `${hoveredMenuItem.clientWidth}px`,
      })
    }

    if (nextHeight === 0) {
      setBackgroundStyles({ height: '0px' })
      setActiveDropdown(false)
    } else {
      setBackgroundStyles({
        height: `${nextHeight}px`,
      })
    }

    setActiveDropdownItem(undefined)
  }

  const handleMouseEnter = (index: number) => {
    if (!activeDropdown) {
      hoverTimeout.current = window.setTimeout(() => {
        handleHoverEnter(index)
      }, 200)
    } else {
      handleHoverEnter(index)
    }
  }

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current)
      hoverTimeout.current = null
    }
  }

  const resetHoverStyles = () => {
    setActiveDropdown(false)
    setActiveTab(undefined)
    setBackgroundStyles({ height: '0px' })
  }

  const resolvedWhatsAppUrl = resolveWhatsAppUrl(whatsappUrl)
  const showWhatsApp = enableWhatsApp !== false && Boolean(resolvedWhatsAppUrl)

  return (
    <div className={classes.desktopNav}>
      <Gutter
        className={[classes.desktopNavInner, activeDropdown && classes.active]
          .filter(Boolean)
          .join(' ')}
      >
        <div className={classes.bar}>
          <BrandLogo
            brandName={brandName}
            logo={logo as MediaType | null | string | undefined}
            showBrandName={showBrandName}
          />

          <nav className={classes.tabs} onMouseLeave={resetHoverStyles}>
            {(tabs || []).map((tab, tabIndex) => {
              const { enableDirectLink = false, enableDropdown = false } = tab

              return (
                <div
                  key={tabIndex}
                  onMouseEnter={() => handleMouseEnter(tabIndex)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={classes.tab}
                    ref={(ref) => {
                      menuItemRefs[tabIndex] = ref
                    }}
                    type="button"
                  >
                    {enableDirectLink ? (
                      <CMSLink className={classes.directLink} {...tab.link} label={tab.label}>
                        {tab.link?.newTab && tab.link.type === 'custom' && (
                          <ArrowIcon className={classes.tabArrow} />
                        )}
                      </CMSLink>
                    ) : (
                      tab.label
                    )}
                  </button>

                  {enableDropdown && (
                    <div
                      className={[
                        'grid',
                        classes.dropdown,
                        tabIndex === activeTab && classes.activeTab,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={resetHoverStyles}
                      ref={(ref) => {
                        dropdownMenuRefs[tabIndex] = ref
                      }}
                    >
                      <div className={[classes.description, 'cols-4'].join(' ')}>
                        {tab.description}
                        {tab.descriptionLinks && (
                          <div className={classes.descriptionLinks}>
                            {tab.descriptionLinks.map((link, linkIndex) => (
                              <CMSLink
                                className={classes.descriptionLink}
                                key={linkIndex}
                                {...link.link}
                              >
                                <ArrowIcon className={classes.linkArrow} />
                              </CMSLink>
                            ))}
                          </div>
                        )}
                      </div>
                      {tab.navItems?.map((item, index) => {
                        const isActive = activeDropdownItem === index
                        let columnSpan = 12 / (tab.navItems?.length || 1)
                        const containsFeatured = tab.navItems?.some(
                          (navItem) => navItem.style === 'featured',
                        )
                        const showUnderline = isActive && item.style === 'default'

                        if (containsFeatured) {
                          columnSpan = item.style === 'featured' ? 6 : 3
                        }

                        return (
                          <div
                            className={[
                              `cols-${columnSpan}`,
                              classes.dropdownItem,
                              showUnderline && classes.showUnderline,
                            ].join(' ')}
                            key={index}
                            onMouseEnter={() => setActiveDropdownItem(index)}
                          >
                            {item.style === 'default' && item.defaultLink && (
                              <CMSLink
                                className={classes.defaultLink}
                                {...item.defaultLink.link}
                                label=""
                              >
                                <div className={classes.defaultLinkLabel}>
                                  {item.defaultLink.link.label}
                                </div>
                                <div className={classes.defaultLinkDescription}>
                                  {item.defaultLink.description}
                                  <ArrowIcon size="medium" />
                                </div>
                              </CMSLink>
                            )}
                            {item.style === 'list' && item.listLinks && (
                              <div className={classes.linkList}>
                                <div className={classes.listLabel}>{item.listLinks.tag}</div>
                                {item.listLinks.links?.map((link, linkIndex) => (
                                  <CMSLink
                                    className={classes.link}
                                    key={linkIndex}
                                    {...link.link}
                                  >
                                    {link.link?.newTab && link.link?.type === 'custom' && (
                                      <ArrowIcon className={classes.linkArrow} />
                                    )}
                                  </CMSLink>
                                ))}
                              </div>
                            )}
                            {item.style === 'featured' && item.featuredLink && (
                              <div className={classes.featuredLink}>
                                <div className={classes.listLabel}>{item.featuredLink.tag}</div>
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
                                      <ArrowIcon className={classes.linkArrow} />
                                    </CMSLink>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
            <div
              aria-hidden="true"
              className={classes.underline}
              style={{ ...underlineStyles, opacity: activeDropdown || activeTab !== undefined ? 1 : 0 }}
            >
              <div className={classes.underlineFill} />
            </div>
          </nav>

          <div className={classes.actions}>
            {menuCta?.label && <CMSLink {...menuCta} className={classes.cta} />}
            {showWhatsApp && (
              <a
                aria-label="Chat on WhatsApp"
                className={classes.whatsapp}
                href={resolvedWhatsAppUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <WhatsAppIcon />
              </a>
            )}
          </div>
        </div>
        <div className={classes.background} style={backgroundStyles} />
      </Gutter>
    </div>
  )
}
