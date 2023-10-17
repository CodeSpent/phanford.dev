import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { links } from 'constants/navbarLinks'

export default function Navbar() {
  return (
    <Popover className="relative z-40">
      <div className="flex items-center justify-between space-x-10 py-6 sm:px-6 md:justify-start">
        <div className="flex justify-start">
          <Link href="/">
            <div className="flex items-center">
              <img
                className="h-10 w-auto rounded-full sm:h-10"
                src="https://github.com/codespent.png"
                alt="Patrick Hanford profile photo."
              />
              <div className={'mx-2 flex flex-col'}>
                <h1 className="text-2xl text-white">Patrick Hanford</h1>
                <p className={'text-xs italic text-white'}>
                  <span className="font-semibold">Software Engineer</span> building tools for the
                  web.
                </p>
              </div>
            </div>
          </Link>
        </div>
        <div className="-my-2 -mr-2 md:hidden">
          <Popover.Button
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400
          hover:bg-gradient-to-r hover:from-yellow-500 hover:to-orange-500 hover:text-white"
          >
            <span className="sr-only">Open menu</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </Popover.Button>
        </div>
        <Popover.Group
          as="nav"
          className="ml-auto hidden space-x-4 md:flex"
          style={{ marginLeft: 'auto' }}
        >
          {links.map(link => (
            <Link href={link.href} className="text-base font-medium text-white hover:text-gray-700">
              {link.title}
            </Link>
          ))}
        </Popover.Group>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="fixed inset-x-0 top-0 h-screen origin-top-right transform bg-midnight-blue p-2
          transition md:hidden"
        >
          <div className="divide-y-2 divide-gray-50 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="px-5 pb-6 pt-5">
              <div className="flex items-center justify-between">
                <div className="flex justify-start">
                  <a className="flex items-center" href="#">
                    <img
                      className="h-10 w-auto rounded-full sm:h-10"
                      src="https://github.com/codespent.png"
                      alt="Patrick Hanford profile photo."
                    />
                    <div className={'mx-2 flex flex-col'}>
                      <h1 className="text-2xl text-white">Patrick Hanford</h1>
                      <p className={'text-xs italic text-white'}>
                        <span className="font-semibold">Software Engineer</span> building tools for
                        the web.
                      </p>
                    </div>
                  </a>
                </div>

                <div className="-mr-2">
                  <Popover.Button
                    className="inline-flex items-center justify-center rounded-md p-2 text-white
                  hover:bg-gradient-to-r hover:from-yellow-500 hover:to-orange-500 hover:text-white"
                  >
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid grid-cols-1 gap-7">
                  <div className="px-5 py-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      {links.map(link => (
                        <Link
                          href={link.href}
                          className="text-base font-medium text-white hover:text-gray-700"
                        >
                          {link.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
