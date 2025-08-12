import { Transition } from '@headlessui/react'
import React, { useState } from 'react'
import { links } from '../../../constants/navbarLinks'
import SocialLinks from '../../SocialLinks'
import { NavLink } from './VerticalNavbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'

const ToggleButton = ({ onClick, isOpen }) => {
  return (
    <div className="flex h-6 w-6 cursor-pointer" onClick={onClick}>
      <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="text-xl text-white" />
    </div>
  )
}

const MobileNavPanel = () => {
  const [isOpen, setIsOpen] = useState(false)

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
          className="fixed right-0 top-0 z-40 ml-auto flex h-screen w-screen flex-col bg-card-background
        bg-opacity-100 p-4 py-4"
        >
          <div className="mt-12 flex flex-grow flex-col items-start justify-start gap-4 overflow-y-auto lg:mt-0">
            {links.map(link => (
              <NavLink key={link.title} href={link.href}>
                {link.title}
              </NavLink>
            ))}
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
    </>
  )
}

export default MobileNavPanel
