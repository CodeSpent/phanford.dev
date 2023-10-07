import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { IContextMenuSection } from 'components/context-menu/types'
import { sluggify } from '../../utils/common'

interface Coordinates {
  x: number
  y: number
}

interface ContextMenuContextProps {
  menuOptions: IContextMenuSection[]
  collapsedSectionLabels: string[]
  addCollapsedSectionLabel: (label: string) => void
  removeCollapsedSectionLabel: (label: string) => void
  toggleContextMenu: () => void
  isOpen: boolean
  coords: Coordinates
  setCoords: (coordinates: Coordinates) => void
  menuDisabled: boolean
  toggleContextMenuIsDisabled: (permanent?: boolean) => void
}

const ContextMenuContext = createContext<ContextMenuContextProps | undefined>(undefined)

const ContextMenuProvider: React.FC = ({ children }) => {
  const [initialized, setInitialized] = useState(false)
  const [menuOptions, setMenuOptions] = useState<IContextMenuSection[]>([])
  const [collapsedSectionLabels, setCollapsedSectionLabels] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [contextMenuIsDisabled, setContextMenuIsDisabled] = useState(false)

  const toggleContextMenu = useCallback(() => {
    setIsOpen(prevState => !prevState)
  }, [])

  const toggleContextMenuIsDisabled = useCallback((permanent = false) => {
    setContextMenuIsDisabled(prevState => !prevState)
  }, [])

  const addCollapsedSectionLabel = useCallback((label: string) => {
    const slug = sluggify(label.trim())
    setCollapsedSectionLabels(prev => (prev.includes(slug) ? prev : [...prev, slug]))
  }, [])

  const removeCollapsedSectionLabel = useCallback((label: string) => {
    setCollapsedSectionLabels(prev => {
      const slug = sluggify(label.trim())
      return prev.filter(l => l !== slug)
    })
  }, [])

  useEffect(() => {
    setCollapsedSectionLabels(
      JSON.parse(localStorage.getItem('contextMenuCollapsedSectionLabels')) ?? []
    )
    setContextMenuIsDisabled(JSON.parse(localStorage.getItem('contextMenuDisabled')) ?? false)
    setInitialized(true)
  }, [])

  useEffect(() => {
    localStorage.setItem(
      'contextMenuCollapsedSectionLabels',
      JSON.stringify(collapsedSectionLabels)
    )
  }, [initialized, collapsedSectionLabels])

  useEffect(() => {
    if (localStorage.getItem('contextMenuCollapsedSectionLabels'))
      localStorage.setItem(
        'contextMenuCollapsedSectionLabels',
        JSON.stringify(collapsedSectionLabels)
      )
  }, [collapsedSectionLabels])

  useEffect(() => {
    if (initialized) {
      localStorage.setItem('contextMenuDisabled', JSON.stringify(contextMenuIsDisabled))
    }
  }, [initialized, contextMenuIsDisabled])

  const value = {
    menuOptions,
    collapsedSectionLabels,
    addCollapsedSectionLabel,
    removeCollapsedSectionLabel,
    toggleContextMenu,
    isOpen,
    coords,
    setCoords,
    menuDisabled: contextMenuIsDisabled,
    toggleContextMenuIsDisabled,
  }

  return <ContextMenuContext.Provider value={value}>{children}</ContextMenuContext.Provider>
}

const useContextMenuState = () => {
  const context = useContext(ContextMenuContext)
  if (context === undefined) {
    throw new Error('useContextMenu must be used within a ContextMenuProvider')
  }
  return context
}

export { ContextMenuProvider, useContextMenuState }
