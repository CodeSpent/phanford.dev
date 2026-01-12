import { Transition } from '@headlessui/react'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { links } from '../../../constants/navbarLinks'
import SocialLinks from '../../SocialLinks'
import NavBadge, { BadgeVariant } from '../NavBadge'
import NavSearch from '../NavSearch'
import { BadgeData } from './NavbarWrapper'

interface BadgeInfo {
  count?: number
  variant: BadgeVariant
  show: boolean
}

interface MobileNavPanelProps {
  badgeData?: BadgeData
}

interface AnimatedMenuButtonProps {
  isOpen: boolean
  onClick: () => void
}

const AnimatedMenuButton = ({ isOpen, onClick }: AnimatedMenuButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="relative flex h-10 w-10 items-center justify-center rounded-md
                 hover:bg-gray-800/60 transition-colors focus:outline-none"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <div className="flex h-5 w-6 flex-col justify-between">
        {/* Top line */}
        <span
          className={`block h-0.5 w-full !bg-white rounded-full transition-all duration-300 ease-in-out origin-center
            ${isOpen ? 'translate-y-[9px] rotate-45' : 'translate-y-0 rotate-0'}`}
        />
        {/* Middle line */}
        <span
          className={`block h-0.5 w-full !bg-white rounded-full transition-all duration-300 ease-in-out
            ${isOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'}`}
        />
        {/* Bottom line */}
        <span
          className={`block h-0.5 w-full !bg-white rounded-full transition-all duration-300 ease-in-out origin-center
            ${isOpen ? '-translate-y-[9px] -rotate-45' : 'translate-y-0 rotate-0'}`}
        />
      </div>
    </button>
  )
}

const MobileNavPanel = ({ badgeData }: MobileNavPanelProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchExpanded, setSearchExpanded] = useState(false)
  const pathname = usePathname()

  const getBadgeInfo = (linkTitle: string): BadgeInfo | null => {
    if (!badgeData) return null
    const key = linkTitle as keyof typeof badgeData
    if (!(key in badgeData)) return null
    return badgeData[key] || null
  }

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  return (
    <>
      <div className="sticky z-[70] ml-auto lg:hidden">
        <AnimatedMenuButton onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
      </div>
      <Transition
        as={React.Fragment}
        enter="transition ease-in-out duration-300 transform"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in-out duration-300 transform"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
        show={isOpen}
      >
        <div
          className="fixed right-0 top-0 z-40 ml-auto flex h-screen w-screen flex-col
          bg-card-background/80 backdrop-blur-md border-l border-gray-800/80
          p-6 pt-20 overflow-y-auto"
        >
          {/* Search bar */}
          {process.env.NEXT_PUBLIC_ENABLE_GLOBAL_SEARCH && (
            <div className="mb-6">
              <NavSearch
                isExpanded={searchExpanded}
                onToggle={() => setSearchExpanded(!searchExpanded)}
                isCompact={false}
              />
            </div>
          )}

          {/* Navigation links */}
          <nav className="flex flex-grow flex-col gap-3">
            {links.map((link, index) => {
              const isActive = pathname === link.href
              const badgeInfo = getBadgeInfo(link.title)

              return (
                <Link
                  key={link.title}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center justify-between
                    px-4 py-3 rounded-lg
                    text-lg
                    transition-all duration-200
                    ${isActive
                      ? 'text-white font-medium'
                      : 'text-gray-400 font-light hover:text-white'
                    }
                  `}
                  style={{
                    transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                  }}
                >
                  <span>{link.title}</span>
                  {badgeInfo?.show && (
                    <NavBadge
                      count={badgeInfo.count}
                      variant={badgeInfo.variant}
                      animate={true}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Social links at bottom */}
          <div className="w-full mt-auto pt-6 border-t border-gray-800/60">
            <div className="mb-4 flex items-center justify-center text-center">
              <span className="mx-2 w-1/12 border-t border-gray-700"></span>
              <h2 className="text-xs font-thin uppercase text-gray-400">Get in Touch</h2>
              <span className="mx-2 w-1/12 border-t border-gray-700"></span>
            </div>
            <SocialLinks className="flex justify-center gap-4" />
          </div>
        </div>
      </Transition>
    </>
  )
}

export default MobileNavPanel
