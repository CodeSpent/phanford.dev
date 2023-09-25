import React, { ReactNode } from 'react'
import Head from 'next/head'
import Navbar from '../components/common/navbars/Navbar'
import Footer from '../components/common/navbars/Footer'

type Props = {
  children?: ReactNode
}

const ArticleLayout = ({ children }: Props) => {
  return (
    <div className="relative mx-auto max-w-lg lg:max-w-7xl">
      <Head>
        <title>Patrick Hanford | Blog</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <header>
        <Navbar />
      </header>

      <div className="p-4">{children}</div>

      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default ArticleLayout
