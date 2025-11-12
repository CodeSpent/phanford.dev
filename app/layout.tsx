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