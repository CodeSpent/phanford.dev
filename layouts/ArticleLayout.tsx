import React, { ReactNode } from 'react'
import Head from 'next/head'
import Navbar from '../components/common/navbars/Navbar'
import Footer from '../components/common/navbars/Footer'
import { DataSourceType, getDataSource } from '../constants/data-sources'

type Props = {
  children?: ReactNode
  title?: string
  dataSource?: DataSourceType
}

const ArticleLayout = ({ children, title, dataSource = 'blog' }: Props) => {
  const ds = getDataSource(dataSource)
  const pageTitle = title || `${ds.name} | Patrick Hanford`
  return (
    <div className="relative mx-auto max-w-lg lg:max-w-7xl">
      <Head>
        <title>{pageTitle}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <header>
        <Navbar />
      </header>

      <div className="px-4 pb-4">{children}</div>

      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default ArticleLayout
