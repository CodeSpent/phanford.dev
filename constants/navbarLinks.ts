export interface INavbarLink {
  title: string
  href: string
  isModal?: boolean
}

export const links: INavbarLink[] = [
  { title: 'Home', href: '/' },
  { title: 'Articles', href: '/blog' },
  { title: 'Projects', href: '/projects' },
  { title: 'Photography', href: '/photography' },
  { title: 'Music', href: '#', isModal: true },
  { title: 'Resume', href: '/documents/resume' },
]
