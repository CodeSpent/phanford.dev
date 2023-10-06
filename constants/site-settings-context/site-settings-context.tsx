import { createContext, useContext, useEffect, useState } from 'react'

const SiteSettingsContext = createContext({
  animationEnabled: true,
  toggleAnimationEnabled: () => {},
  particlesHidden: false,
  toggleParticlesHidden: () => {},
  announcementBannerVisible: true,
  closeAnnouncementBanner: () => {},
  darkModeEnabled: true,
  toggleDarkModeTheme: () => {},
})

export const useSiteSettings = () => {
  return useContext(SiteSettingsContext)
}

export const SiteSettingsProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false)
  const [animationEnabled, setAnimationEnabled] = useState(true)
  const [particlesHidden, setParticlesHidden] = useState(false)
  const [announcementBannerVisible, setAnnouncementBannerVisible] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(true)

  const toggleDarkModeTheme = () => {
    setDarkModeEnabled(prevState => !prevState)
  }
  const closeAnnouncementBanner = () => {
    setAnnouncementBannerVisible(false)
  }
  const toggleAnimationEnabled = () => {
    setAnimationEnabled(prevState => !prevState)
  }
  const toggleParticlesHidden = () => {
    setParticlesHidden(prevState => !prevState)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAnimationEnabled(JSON.parse(localStorage.getItem('animationEnabled')) ?? true)
      setParticlesHidden(JSON.parse(localStorage.getItem('particlesHidden')) ?? false)
      setAnnouncementBannerVisible(
        JSON.parse(localStorage.getItem('announcementBannerVisible')) ?? true
      )
      setInitialized(true)
    }
  }, [])

  useEffect(() => {
    if (initialized) localStorage.setItem('animationEnabled', JSON.stringify(animationEnabled))
  }, [animationEnabled, initialized])

  useEffect(() => {
    if (initialized) localStorage.setItem('particlesHidden', JSON.stringify(particlesHidden))
  }, [particlesHidden, initialized])

  useEffect(() => {
    if (initialized)
      localStorage.setItem('announcementBannerVisible', JSON.stringify(announcementBannerVisible))
  }, [announcementBannerVisible, initialized])

  if (!initialized) return null

  return (
    <SiteSettingsContext.Provider
      value={{
        animationEnabled,
        toggleAnimationEnabled,
        particlesHidden,
        toggleParticlesHidden,
        announcementBannerVisible,
        closeAnnouncementBanner,
        darkModeEnabled,
        toggleDarkModeTheme,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  )
}
