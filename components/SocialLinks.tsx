import React from 'react';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { faDev, faGithub, faLinkedinIn, faTwitch } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

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
    name: 'Email',
    href: 'mailto:patrick@phanford.dev',
    icon: (props) => <FontAwesomeIcon icon={faEnvelope} {...props} />,
  },
  {
    name: 'Dev.To',
    href: 'https://dev.to/codespent/',
    icon: (props) => <FontAwesomeIcon icon={faDev} {...props} />,
  },
  {
    name: 'Twitch',
    href: 'https://twitch.tv/codespent/',
    icon: (props: JSX.IntrinsicAttributes & FontAwesomeIconProps) =>
      <FontAwesomeIcon icon={faTwitch} {...props} />

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
          0l3.096-3.097a1 1 0 00-1.414-1.414l-1.09 1.09v-6.74a1 1 0 10-2 0v6.74l-1.09-1.09a1 1 0 10-1.414 1.414zM17 6a1
          1 0 100 2h-4a1 1 0 100-2h4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
]

type SocialLink = {
  name: string;
  href: string;
  icon: (props: JSX.IntrinsicAttributes & FontAwesomeIconProps) => JSX.Element;
};

type SocialLinksProps = {
  //socials: SocialLink[];
};

const SocialLinks: React.FC<SocialLinksProps> = () => {
  return (
    <div className="flex justify-end gap-5">
      {socials.map((item) => (
        <a
          key={item.name}
          href={item.href}
          target="_blank"
          className="text-gray-400 hover:scale-125 hover:text-white"
        >
          <span className="sr-only">{item.name}</span>
          <item.icon className="h-6 w-6" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
