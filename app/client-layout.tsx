'use client'

import React, { Fragment, useEffect } from 'react'
import Particles from 'react-tsparticles'
import { Transition } from '@headlessui/react'
import {
  useSiteSettings,
} from 'constants/site-settings-context/site-settings-context'
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcuts'
import ContextMenuContainer from '../page-components/context-menu-container'
import {
  useContextMenuState,
} from '../components/context-menu/context-menu-context'
import DevelopmentBanner from '../components/common/DevelopmentBanner'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { particlesHidden, animationEnabled } =
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

        {children}

        <DevelopmentBanner />
      </div>
    </>
  )
}