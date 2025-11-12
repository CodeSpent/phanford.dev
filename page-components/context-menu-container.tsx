import { useSiteSettings } from 'constants/site-settings-context/site-settings-context'
import ContextMenu from 'components/context-menu/context-menu'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { copyCurrentURLToClipboard } from '../utils/common'
import { IContextMenuSection } from 'components/context-menu/types'
import { useContextMenuState } from '../components/context-menu/context-menu-context'

const ContextMenuContainer = props => {
  {
    const {
      darkModeEnabled,
      animationEnabled,
      toggleAnimationEnabled,
      particlesHidden,
      toggleParticlesHidden,
      toggleDarkModeTheme,
    } = useSiteSettings()

    const pathname = usePathname()

    const { toggleContextMenuIsDisabled, menuDisabled } = useContextMenuState()

    const menuOptions: IContextMenuSection[] = useMemo(() => {
      return [
        {
          label: 'Actions',
          options: [
            {
              label: 'Site Actions',
              options: [
                {
                  label: 'Copy Current URL',
                  description: 'Copy the current URL to your clipboard.',
                  action: async () => {
                    await copyCurrentURLToClipboard(pathname)
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Preferences',
          options: [
            {
              label: 'Appearance',
              options: [
                {
                  label: `Switch Theme: ${darkModeEnabled ? 'Light' : 'Dark'}`,
                  description: 'Change between color themes.',
                  action: toggleDarkModeTheme,
                },
              ],
            },
            {
              label: 'Animations',
              options: [
                {
                  label: animationEnabled ? 'Disable Animations' : 'Enable Animations',
                  description: 'Toggle animations and transitions.',
                  action: toggleAnimationEnabled,
                },
                {
                  label: particlesHidden ? 'Enable Particles' : 'Disable Particles',
                  description: 'Toggle the Particles background.',
                  action: toggleParticlesHidden,
                },
              ],
            },
          ],
        },
        {
          label: 'Settings',
          options: [
            {
              label: 'Debugging',
              options: [
                {
                  label: 'Clear Caches',
                  description: 'Clear cache including what is stored in localStorage.',
                  action: () => typeof window !== 'undefined' && localStorage.clear(),
                },
                {
                  label: menuDisabled ? 'Enable Context Menu' : 'Disable Context Menu',
                  description: 'Toggles this custom right-click menu.',
                  action: () => toggleContextMenuIsDisabled(true),
                },
              ],
            },
          ],
        },
      ]
    }, [
      darkModeEnabled,
      animationEnabled,
      toggleAnimationEnabled,
      particlesHidden,
      toggleParticlesHidden,
      toggleDarkModeTheme,
    ])

    return <ContextMenu {...props} menuOptions={menuOptions} />
  }
}

export default ContextMenuContainer
