import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SocialLinks from '../../SocialLinks'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons'
import { Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import { links } from '../../../constants/navbarLinks'
import MobileNavPanel from './mobile-nav-panel'

export const NavLink = ({ href, children }) => {
  const router = useRouter()
  const isActive = router.pathname === href

  const baseStyle =
    'transition duration-500 text-gray-500 hover:font-md hover:text-white ' +
    'lg:hover:rotate-90 px-4 py-2 relative'
  const activeStyle = 'font-bold tracking-wide leading-loose text-white lg:rotate-90'

  const combinedStyle = `${baseStyle} ${isActive ? activeStyle : ''}`

  return (
    <Link href={href} passHref className={combinedStyle}>
      <span className="">
        {children}
        {isActive && (
          <span className="absolute bottom-0 left-0 block h-0.5" style={{ content: '""' }}></span>
        )}
      </span>
    </Link>
  )
}

export default function VerticalNavbar() {
  return (
    <nav
      className="sticky right-0 top-0 z-40 flex w-screen items-center justify-between p-4 lg:fixed
    lg:bg-transparent"
    >
      <MobileNavPanel />

      <div className="ml-auto mr-12 hidden origin-right lg:flex lg:-rotate-90 lg:flex-row-reverse">
        {links.map(link => (
          <NavLink href={link.href}>{link.title}</NavLink>
        ))}
      </div>
    </nav>
  )
}
