import { Transition } from '@headlessui/react'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { links } from '../../../constants/navbarLinks'
import SocialLinks from '../../SocialLinks'
import NavBadge, { BadgeVariant } from '../NavBadge'
import NavSearch from '../NavSearch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { BadgeData } from './NavbarWrapper'

interface BadgeInfo {
  count?: number
  variant: BadgeVariant
  show: boolean
}

interface MobileNavPanelProps {
  badgeData: BadgeData
}

const ToggleButton = ({ onClick, isOpen }) => {
  return (
    <div className="flex h-6 w-6 cursor-pointer" onClick={onClick}>
      <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="text-xl text-white" />
    </div>
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
      <div className="sticky z-50 ml-auto p-4 lg:hidden">
        <ToggleButton onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
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
          bg-black/95 backdrop-blur-md border-l border-gray-800/80
          p-6 py-4 overflow-y-auto"
        >
          {/* Close button at top */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>

          {/* Search bar */}
          <div className="mb-6">
            <NavSearch
              isExpanded={searchExpanded}
              onToggle={() => setSearchExpanded(!searchExpanded)}
              isCompact={false}
            />
          </div>

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
                    text-lg font-medium
                    transition-all duration-200
                    ${isActive
                      ? 'bg-gray-800/60 text-white border-l-2 border-blue-400'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/40'
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
