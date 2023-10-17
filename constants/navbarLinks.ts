export interface INavbarLink {
  title: string
  href: string
}

export const links: INavbarLink[] = [
  { title: 'Home', href: '/' },
  { title: 'Blog', href: '/blog' },
  { title: 'Resume', href: '/resume' },
]
