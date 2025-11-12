import HeroComponent from '../components/hero/Hero'
import VerticalNavbar from '../components/common/navbars/VerticalNavbar'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { Fragment } from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Patrick Hanford | Web, Software, Mobile, DevOps',
  description: 'Full-stack software engineer specializing in web development, mobile applications, and DevOps. Experienced in React, Next.js, Python, and cloud technologies.',
}

export default function HomePage() {
  return (
    <>
      <VerticalNavbar />
      <Fragment>
        <HeroComponent />

        <a className="fixed inset-x-0 bottom-0 mt-20 flex flex-col items-center justify-center p-4">
          <ChevronDownIcon
            className="mr-1 hidden h-8 w-8 animate-bounce text-white group-hover:text-white"
            aria-hidden="true"
          />
        </a>
      </Fragment>
    </>
  )
}