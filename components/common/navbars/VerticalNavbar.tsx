import React from 'react'
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome'
import {
  faGithub,
  faDev,
  faLinkedinIn,
  faTwitch,
} from '@fortawesome/free-brands-svg-icons'
import SocialLinks from "../../SocialLinks";

const socials = [
  {
    name: 'GitHub',
    href: 'https://github.com/codespent/',
    icon: (props) => <FontAwesomeIcon icon={faGithub} {...props} />,
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/phanford/',
    icon: (props) => <FontAwesomeIcon icon={faLinkedinIn} {...props} />,
  },
  {
    name: 'Dev.To',
    href: 'https://dev.to/codespent/',
    icon: (props) => <FontAwesomeIcon icon={faDev} {...props} />,
  },
  {
    name: 'Twitch',
    href: 'https://twitch.tv/codespent/',
    icon: (props: JSX.IntrinsicAttributes & FontAwesomeIconProps) => (
      <FontAwesomeIcon icon={faTwitch} {...props} />
    ),
  },
  {
    name: 'LeetCode',
    href: 'https://leetcode.com/codespent/',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M22 1H2a1 1 0 00-1 1v20a1 1 0 001 1h20a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v20a2 2 0 002 2h20a2
          2 0 002-2V2a2 2 0 00-2-2H2zm7.515 16.777L8.72 15.98a1 1 0 10-1.414 1.414l3.097 3.097a1 1 0 001.414
          0l3.096-3.097a1 1 0 00-1.414-1.414l-1.09 1.09v-6.74a1 1 0 10-2 0v6.74l-1.09-1.09a1 1 0 10-1.414 1.414zM17
          6a1 1 0 100 2h-4a1 1 0 100-2h4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
]

export default function VerticalNavbar() {
  return (
    <nav className="sticky inset-0 flex flex h-screen w-36 flex-col justify-between py-24">
      <div className="flex -rotate-90 flex-row-reverse justify-start gap-4">
        <a href="#" className="rotate-90 border-b text-lg font-bold text-white">
          Home
        </a>

        <a
          href="#"
          className="text-gray-400 transition duration-500 hover:rotate-90 hover:border-b hover:font-semibold
          hover:text-white"
        >
          Resume
        </a>

        <a
          href="#"
          className="text-gray-400 transition duration-500 hover:rotate-90 hover:border-b hover:font-semibold
          hover:text-white"
        >
          Tools
        </a>

        <a
          href="/blog"
          className="text-gray-400 transition duration-500 hover:rotate-90 hover:border-b hover:font-semibold
          hover:text-white"
        >
          Blog
        </a>
      </div>

      <div className="flex rotate-90 justify-end gap-5">
       <SocialLinks />
      </div>
    </nav>
  )
}
