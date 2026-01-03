'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const SiteSettingsContext = createContext({
  animationEnabled: true,
  toggleAnimationEnabled: () => {},
  particlesHidden: false,
  toggleParticlesHidden: () => {},
  darkModeEnabled: true,
  toggleDarkModeTheme: () => {},
  devBannerVisible: true,
  hideDevBanner: () => {},
})

export const useSiteSettings = () => {
  return useContext(SiteSettingsContext)
}

export const SiteSettingsProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false)
  const [animationEnabled, setAnimationEnabled] = useState(true)
  const [particlesHidden, setParticlesHidden] = useState(false)
  const [darkModeEnabled, setDarkModeEnabled] = useState(true)
  const [devBannerVisible, setDevBannerVisible] = useState(true)

  const toggleDarkModeTheme = () => {
    setDarkModeEnabled(prevState => !prevState)
  }
  const toggleAnimationEnabled = () => {
    setAnimationEnabled(prevState => !prevState)
  }
  const toggleParticlesHidden = () => {
    setParticlesHidden(prevState => !prevState)
  }
  const hideDevBanner = () => {
    setDevBannerVisible(false)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAnimationEnabled(JSON.parse(localStorage.getItem('animationEnabled') || 'true'))
      setParticlesHidden(JSON.parse(localStorage.getItem('particlesHidden') || 'false'))
      setDevBannerVisible(JSON.parse(localStorage.getItem('devBannerVisible') || 'true'))
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
    if (initialized) localStorage.setItem('devBannerVisible', JSON.stringify(devBannerVisible))
  }, [devBannerVisible, initialized])

  if (!initialized) return null

  return (
    <SiteSettingsContext.Provider
      value={{
        animationEnabled,
        toggleAnimationEnabled,
        particlesHidden,
        toggleParticlesHidden,
        darkModeEnabled,
        toggleDarkModeTheme,
        devBannerVisible,
        hideDevBanner,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  )
}
