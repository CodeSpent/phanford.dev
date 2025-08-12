import React, { ReactNode } from 'react'
import Footer from '../components/common/navbars/Footer'
import Navbar from '../components/common/navbars/Navbar'
import MetaTags from '../components/seo/MetaTags'

type Props = {
  children?: ReactNode
  title?: string
  description?: string
}

const DefaultLayout = ({ 
  children, 
  title = 'Patrick Hanford | Software Engineer',
  description = 'Full-stack software engineer specializing in web development, mobile applications, and DevOps. Experienced in React, Next.js, Python, and cloud technologies.'
}: Props) => (
  <>
    <MetaTags
      contentType="page"
      title={title.replace(' | Patrick Hanford', '').replace('Patrick Hanford | ', '')}
      description={description}
      url={typeof window !== 'undefined' ? window.location.href : 'https://phanford.dev'}
    />
    <div className="relative mx-auto max-w-lg lg:max-w-7xl">
      <header>
        <Navbar />
      </header>
      {children}
      <Footer />
    </div>
  </>
)

export default DefaultLayout
