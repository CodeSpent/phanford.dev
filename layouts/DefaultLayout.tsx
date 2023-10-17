import React, { ReactNode } from 'react'
import Head from 'next/head'
import Footer from '../components/common/navbars/Footer'
import Navbar from '../components/common/navbars/Navbar'

type Props = {
  children?: ReactNode
  title?: string
}

const DefaultLayout = ({ children, title = 'Patrick Hanford | Software Engineer' }: Props) => (
  <div className="relative mx-auto max-w-lg lg:max-w-7xl">
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <Navbar />
    </header>
    {children}
    <Footer />
  </div>
)

export default DefaultLayout
