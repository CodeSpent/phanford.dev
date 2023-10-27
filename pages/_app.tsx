import React, { Fragment, useEffect, useRef, useState } from 'react'
import { AppProps } from 'next/app'
import Particles from 'react-tsparticles'
import { Transition } from '@headlessui/react'
import '../styles/index.css'
import '../global.scss'
import AnnouncementBanner from '../components/AnnouncementBanner'
import {
  SiteSettingsProvider,
  useSiteSettings,
} from 'constants/site-settings-context/site-settings-context'
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcuts'
import ContextMenuContainer from '../page-components/context-menu-container'
import {
  ContextMenuProvider,
  useContextMenuState,
} from '../components/context-menu/context-menu-context'

function AppContent({ Component, pageProps }) {
  const { particlesHidden, animationEnabled, announcementBannerVisible, closeAnnouncementBanner } =
    useSiteSettings()

  const { toggleContextMenu, isOpen, setCoords, menuDisabled } = useContextMenuState()

  useKeyboardShortcut({
    keySequence: 'Ctrl+k',
    callback: () => {
      setCoords({ x: 0, y: 0 })
      toggleContextMenu()
    },
    enabled: true,
  })

  useEffect(() => {}, [])

  return (
    <>
      {!particlesHidden && (
        <Transition
          show={!particlesHidden}
          as={Fragment}
          enter="transform transition duration-[400ms] ease-in-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transform duration-[200ms] ease-in-out"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Particles
            id="particles"
            options={{
              fpsLimit: 60,
              interactivity: {
                events: {
                  onClick: {
                    enable: false,
                    mode: 'push',
                  },
                  onHover: {
                    enable: false,
                    mode: 'repulse',
                  },
                  resize: true,
                },
                modes: {
                  bubble: {
                    distance: 400,
                    duration: 2,
                    opacity: 0.8,
                    size: 40,
                  },
                  push: {
                    quantity: 4,
                  },
                  repulse: {
                    distance: 200,
                    duration: 0.4,
                  },
                },
              },
              background: {
                color: 'hsl(240 100% 4.3%)',
              },
              particles: {
                color: {
                  value: '#ffffff',
                },
                links: {
                  color: '#ffffff',
                  distance: 150,
                  enable: true,
                  opacity: 0.5,
                  width: 1,
                },
                collisions: {
                  enable: true,
                },
                move: {
                  direction: 'none',
                  enable: animationEnabled,
                  outMode: 'bounce',
                  random: false,
                  speed: 0.5,
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                    area: 800,
                  },
                  value: 80,
                },
                opacity: {
                  value: 0.5,
                },
                shape: {
                  type: 'circle',
                },
                size: {
                  random: false,
                  value: 2,
                },
              },
              detectRetina: true,
            }}
          />
        </Transition>
      )}

      <Transition
        as="div"
        show={announcementBannerVisible}
        enter="transition ease-out duration-500"
        enterFrom="transform opacity-0 bottom-0"
        enterTo="transform opacity-100 scale-100 bottom-0"
        leave="transition ease-in duration-200"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        className="fixed bottom-0 z-50 w-full opacity-80 duration-200 hover:opacity-100"
      >
        <AnnouncementBanner
          color="warning"
          shortMessage="Site incomplete! Bugs ahead."
          longMessage="Woah, you're early. I'm still actively building this site, expect bugs."
          linkText="Report any Bugs or Suggestions on GitHub."
          linkHref="https://github.com/CodeSpent/phanford.dev/issues"
          announcementDate="Aug 21, 2020 at 11:52 am (EST)"
          onClose={closeAnnouncementBanner}
        />
      </Transition>

      <div
        className="h-screen w-screen"
        onContextMenu={e => {
          if (!menuDisabled) {
            setCoords({ y: e.clientY, x: e.clientX })
            toggleContextMenu()
            e.preventDefault()
          }
        }}
      >
        {isOpen && <ContextMenuContainer onOptionSelected={toggleContextMenu} />}

        <Component {...pageProps} />
      </div>
    </>
  )
}
function AppComponent({ Component, pageProps }: AppProps) {
  return (
    <SiteSettingsProvider>
      <ContextMenuProvider>
        <AppContent Component={Component} pageProps={pageProps} />
      </ContextMenuProvider>
    </SiteSettingsProvider>
  )
}

export default AppComponent
