import React, { Fragment } from 'react'
import { Transition } from '@headlessui/react'
import '../styles/index.css'
import '../global.scss'
import '../shiki.scss'
import {
  SiteSettingsProvider,
} from 'constants/site-settings-context/site-settings-context'
import ContextMenuContainer from '../page-components/context-menu-container'
import {
  ContextMenuProvider,
} from '../components/context-menu/context-menu-context'
import ClientLayout from './client-layout'

export const metadata = {
  title: {
    default: 'Patrick Hanford',
    template: '%s | Patrick Hanford'
  },
  description: 'Personal website and portfolio of Patrick Hanford',
  keywords: ['Patrick Hanford', 'developer', 'portfolio', 'photography'],
  authors: [{ name: 'Patrick Hanford' }],
  creator: 'Patrick Hanford',
  publisher: 'Patrick Hanford',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.phanford.dev'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Patrick Hanford',
    title: 'Patrick Hanford',
    description: 'Personal website and portfolio of Patrick Hanford',
    images: [
      {
        url: '/og-default.svg',
        width: 1200,
        height: 630,
        alt: 'Patrick Hanford',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Patrick Hanford',
    description: 'Personal website and portfolio of Patrick Hanford',
    images: ['/og-default.svg'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'icon', url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <SiteSettingsProvider>
          <ContextMenuProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </ContextMenuProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  )
}