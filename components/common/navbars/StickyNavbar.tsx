'use client'

import { Fragment, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { links, INavbarLink } from 'constants/navbarLinks'
import MobileNavPanel from './mobile-nav-panel'
import brandConfig from 'brand.config'
import ComingSoonModal from 'components/modals/ComingSoonModal'
import { useDomainBrandName } from '@/lib/domain-utils'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import NavBadge, { BadgeVariant } from '@/components/common/NavBadge'
import { BadgeData } from './NavbarWrapper'
import { GlobalSearchDropdown } from '../GlobalSearchDropdown'


interface BadgeInfo {
  count?: number
  variant: BadgeVariant
  show: boolean
}

interface StickyNavbarProps {
  badgeData: BadgeData
}

export default function StickyNavbar({ badgeData }: StickyNavbarProps) {
  const pathname = usePathname()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const brandName = useDomainBrandName()

  // Scroll trigger for sticky state
  const isScrolled = useScrollTrigger({ threshold: 100 })

  const getBadgeInfo = (linkTitle: string): BadgeInfo | null => {
    if (!badgeData) return null
    const key = linkTitle as keyof typeof badgeData
    if (!(key in badgeData)) return null
    return badgeData[key] || null
  }

  const handleModalLink = (title: string) => {
    setModalTitle(title)
    setIsModalOpen(true)
  }

  const getLinkClassName = (link: INavbarLink) => {
    const isActive = pathname === link.href

    // Base classes with transitions - consistent sizing
    let classes = 'transition-all duration-200 relative text-sm px-3 py-2'

    // All links have same weight, only active is bold
    if (isActive) {
      classes += ' font-medium text-white'
    } else {
      classes += ' font-light text-gray-300 hover:text-white'
    }

    return classes
  }

  return (
    <>
      <ComingSoonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      />

      <div
        className={`
          fixed top-0 left-0 right-0 z-40
          transition-all duration-300 ease-in-out
          ${isScrolled
            ? 'bg-card-background/95 backdrop-blur-md border-b border-gray-800/80'
            : 'bg-transparent'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Desktop Layout: Two rows for better space usage */}
          <div className="hidden md:block">
            {/* Top Row: Logo + Nav Links */}
            <div className="flex items-center justify-between mb-3">
              {/* Logo / Brand */}
              <Link href="/" className="flex items-center group flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src={brandConfig.profileImage}
                  alt={brandConfig.profileAltText}
                />
                <div className="ml-3 flex flex-col">
                  <h1 className={`text-xl ${brandConfig.primaryTextClass} group-hover:text-white transition-colors`}>
                    {brandName}
                  </h1>
                  <p className={`text-xs ${brandConfig.secondaryTextClass}`}>
                    <span className="font-semibold">{brandConfig.jobTitle}</span>
                  </p>
                </div>
              </Link>

              {/* All Navigation Links */}
              <nav className="flex items-center space-x-1">
                {links
                  .filter(link => link.title !== 'Music') // Filter out Music
                  .map((link) => (
                  <div key={link.title}>
                    {link.isModal ? (
                      <button
                        onClick={() => handleModalLink(link.title)}
                        className={`${getLinkClassName(link)} cursor-pointer inline-flex items-center gap-2`}
                      >
                        {/* Removed Music badge */}
                        {link.title}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className={`${getLinkClassName(link)} inline-flex items-center gap-2`}
                      >
                        {link.title}
                        {/* Badge code kept but hidden with false condition */}
                        {false && (() => {
                          const badgeInfo = getBadgeInfo(link.title)
                          if (!badgeInfo || !badgeInfo!.show) return null
                          return (
                            <NavBadge
                              count={badgeInfo!.count}
                              variant={badgeInfo!.variant}
                              animate={true}
                            />
                          )
                        })()}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Bottom Row: Full-width Search */}
            {process.env.NEXT_PUBLIC_ENABLE_GLOBAL_SEARCH && (
              <div className="w-full">
                <GlobalSearchDropdown className="w-full" />
              </div>
            )}
          </div>

          {/* Mobile Layout: Single row */}
          <div className="md:hidden flex items-center gap-4">
            {/* Logo / Brand */}
            <Link href="/" className="flex items-center group flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src={brandConfig.profileImage}
                alt={brandConfig.profileAltText}
              />
            </Link>

            {/* Mobile Menu Button */}
            <div className="ml-auto">
              <MobileNavPanel badgeData={badgeData} />
            </div>
          </div>

        </div>
      </div>

      {/* Spacer to prevent content jump - increased for two-row navbar */}
      <div className={process.env.NEXT_PUBLIC_ENABLE_GLOBAL_SEARCH ? "h-28 md:h-32" : "h-20 md:h-24"} />
    </>
  )
}
