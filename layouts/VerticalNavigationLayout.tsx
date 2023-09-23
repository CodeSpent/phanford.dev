import React, { ReactNode } from 'react'
import Head from 'next/head'
import VerticalNavbar from '../components/common/navbars/VerticalNavbar'

type Props = {
  children?: ReactNode
  title?: string
}

const VerticalNavigationLayout = ({
  children,
  title = 'Patrick Hanford | Software Engineer',
}: Props) => {
  return (
    <div className="relative mx-auto">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="flex justify-between">
        <div className="my-auto">{children}</div>
        <VerticalNavbar />
      </div>
    </div>
  )
}

export default VerticalNavigationLayout
