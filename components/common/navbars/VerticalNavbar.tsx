import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SocialLinks from '../../SocialLinks'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons'
import { Transition } from '@headlessui/react'
import { useRouter } from 'next/router'

export const NavLink = ({ href, children }) => {
  const router = useRouter()
  const isActive = router.pathname === href

  const baseStyle =
    'transition duration-500 text-gray-500 lg:hover:border-b hover:font-md hover:text-white ' +
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

NavLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool,
}

NavLink.defaultProps = {
  isActive: false,
}

const ToggleButton = ({ onClick, isOpen }) => {
  return (
    <div className="flex h-6 w-6 cursor-pointer" onClick={onClick}>
      <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="text-xl text-white" />
    </div>
  )
}

export default function VerticalNavbar() {
  const [isNavVisible, setNavVisible] = useState(false)
  const toggleNav = () => setNavVisible(!isNavVisible)

  return (
    <nav className="sticky z-40 flex w-screen justify-between p-4 lg:fixed lg:right-0 lg:flex-col lg:bg-transparent">
      <div className="fixed right-4 top-4 z-40 lg:hidden">
        <ToggleButton onClick={toggleNav} isOpen={isNavVisible} />
      </div>
      <Transition
        as={React.Fragment}
        enter="transition ease-in-out duration-300 transform"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in-out duration-300 transform"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
        show={isNavVisible}
      >
        <div className="fixed right-0 top-0 z-40 flex h-screen w-screen flex-col bg-card-background bg-opacity-100 p-4 py-4">
          <div className="mt-12 flex flex-grow flex-col items-start justify-start gap-4 overflow-y-auto lg:mt-0">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/resume">Resume</NavLink>
            <NavLink href="/tools">Tools</NavLink>
            <NavLink href="/blog">Blog</NavLink>
          </div>

          <div className="w-full">
            <div className="my-4 flex items-center justify-center text-center">
              <span className="mx-2 w-1/12 border-t border-gray-600"></span>
              <h2 className="text-xs font-thin uppercase">Get in Touch</h2>
              <span className="mx-2 w-1/12 border-t border-gray-600 "></span>
            </div>
            <SocialLinks className="flex justify-center gap-4" />
          </div>
        </div>
      </Transition>

      <div className="hidden pr-24 lg:flex lg:-rotate-90 lg:flex-row-reverse">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/resume">Resume</NavLink>
        <NavLink href="/tools">Tools</NavLink>
        <NavLink href="/blog">Blog</NavLink>
      </div>
    </nav>
  )
}
