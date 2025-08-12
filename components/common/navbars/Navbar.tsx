import { Fragment, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { links } from 'constants/navbarLinks'
import MobileNavPanel from './mobile-nav-panel'
import brandConfig from 'brand.config'
import ComingSoonModal from 'components/modals/ComingSoonModal'

export default function Navbar() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  const handleModalLink = (title: string) => {
    setModalTitle(title)
    setIsModalOpen(true)
  }

  const getLinkClassName = (href: string) => {
    const isActive = router.pathname === href
    const baseClasses = 'text-base hover:text-gray-700'

    if (isActive) {
      return `${baseClasses} font-medium text-gray-200`
    } else {
      return `${baseClasses} font-light text-gray-300`
    }
  }

  return (
    <>
      <ComingSoonModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalTitle} 
      />
      <Popover className="relative z-40">
        <div className="flex items-center justify-between space-x-10 px-4 py-6 md:justify-start">
          <div className="flex justify-start">
            <Link href="/">
              <div className="flex items-center">
                <img
                  className={`h-10 w-auto rounded-full sm:h-10`}
                  src={brandConfig.profileImage}
                  alt={brandConfig.profileAltText}
                />
                <div className={`mx-2 flex flex-col`}>
                  <h1 className={`text-2xl ${brandConfig.primaryTextClass}`}>
                    {brandConfig.profileName}
                  </h1>
                  <p className={`text-xs ${brandConfig.secondaryTextClass}`}>
                    <span className="font-semibold">{brandConfig.jobTitle}</span>{' '}
                    {brandConfig.profileDescription}
                  </p>
                </div>
              </div>
            </Link>
          </div>
          <div className="-my-2 -mr-2 md:hidden">
            <MobileNavPanel />
          </div>
          <Popover.Group
            as="nav"
            className="ml-auto hidden space-x-4 md:flex"
            style={{ marginLeft: 'auto' }}
          >
            {links.map(link => (
              link.isModal ? (
                <button
                  key={link.title}
                  onClick={() => handleModalLink(link.title)}
                  className={`${getLinkClassName('#')} cursor-pointer`}
                >
                  {link.title}
                </button>
              ) : (
                <Link
                  key={link.title}
                  href={link.href}
                  className={getLinkClassName(link.href)}
                >
                  {link.title}
                </Link>
              )
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
            className={`fixed inset-x-0 top-0 h-screen origin-top-right transform ${brandConfig.panelBackgroundClass} p-2 transition md:hidden`}
          >
            <div className={`divide-y-2 ${brandConfig.dividerColorClass} rounded-lg shadow-lg ring-1 ${brandConfig.panelRingClass}`}>
              <div className="px-5 pb-6 pt-5">
                <div className="flex items-center justify-between">
                  <div className="flex justify-start">
                    <a className="flex items-center" href="#">
                      <img
                        className={`h-10 w-auto rounded-full sm:h-10`}
                        src={brandConfig.profileImage}
                        alt={brandConfig.profileAltText}
                      />
                      <div className={`mx-2 flex flex-col`}>
                        <h1 className={`text-2xl ${brandConfig.primaryTextClass}`}>
                          {brandConfig.profileName}
                        </h1>
                        <p className={`text-xs ${brandConfig.secondaryTextClass}`}>
                          <span className="font-thin">{brandConfig.jobTitle}</span>{' '}
                          {brandConfig.profileDescription}
                        </p>
                      </div>
                    </a>
                  </div>

                  <div className="-mr-2">
                    <Popover.Button
                      className={`inline-flex items-center justify-center rounded-md p-2 ${brandConfig.closeButtonClass}`}
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
                          link.isModal ? (
                            <button
                              key={link.title}
                              onClick={() => handleModalLink(link.title)}
                              className={`${getLinkClassName('#')} cursor-pointer`}
                            >
                              {link.title}
                            </button>
                          ) : (
                            <Link
                              key={link.title}
                              href={link.href}
                              className={getLinkClassName(link.href)}
                            >
                              {link.title}
                            </Link>
                          )
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
    </>
  )
}
