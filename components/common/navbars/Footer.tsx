import React from 'react'
import SocialLinks from '../../SocialLinks'

export default function Footer() {
  return (
    <footer className="">
      <div className="mx-auto max-w-7xl overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
        <div className="mt-8 flex justify-center space-x-6">
          <SocialLinks />
        </div>

        <p className="mt-8 text-center text-base text-gray-400">
          &copy; {new Date().getFullYear()} Patrick Hanford | CodeSpent, LLC.
          All rights reserved.
        </p>
      </div>
    </footer>
  )
}
