import React, { ReactNode } from 'react'
import VerticalNavbar from '../components/common/navbars/VerticalNavbar'
import MetaTags from '../components/seo/MetaTags'

type Props = {
  children?: ReactNode
  title?: string
  description?: string
}

const VerticalNavigationLayout = ({
  children,
  title = 'Patrick Hanford | Software Engineer',
  description = 'Full-stack software engineer specializing in web development, mobile applications, and DevOps. Experienced in React, Next.js, Python, and cloud technologies.',
}: Props) => {
  return (
    <>
      <MetaTags
        contentType="page"
        title={title.replace(' | Patrick Hanford', '').replace('Patrick Hanford | ', '')}
        description={description}
        url={typeof window !== 'undefined' ? window.location.href : 'https://phanford.dev'}
      />
      <>
        <VerticalNavbar />
        <>{children}</>
      </>
    </>
  )
}

export default VerticalNavigationLayout
