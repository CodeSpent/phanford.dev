export interface INavbarLink {
  title: string
  href: string
  isModal?: boolean
}

export const links: INavbarLink[] = [
  { title: 'Home', href: '/' },
  { title: 'Articles', href: '/blog' },
  { title: 'Photography', href: '/photos' },
  { title: 'Documents', href: '/documents' },
  { title: 'Music', href: '#', isModal: true },
  { title: 'Resume', href: '/documents/resume' },
]
