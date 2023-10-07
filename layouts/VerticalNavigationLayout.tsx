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
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <>
        <VerticalNavbar />
        <>{children}</>
      </>
    </>
  )
}

export default VerticalNavigationLayout
