'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { faSliders } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type MobileFilterContextType = {
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
}

const MobileFilterContext = createContext<MobileFilterContextType | null>(null)

type ProviderProps = {
  children: ReactNode
}

export function MobileFilterProvider({ children }: ProviderProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <MobileFilterContext.Provider value={{ isExpanded, setIsExpanded }}>
      {children}
    </MobileFilterContext.Provider>
  )
}

type ButtonProps = {
  activeFilterCount: number
}

export function MobileFilterButton({ activeFilterCount }: ButtonProps) {
  const context = useContext(MobileFilterContext)
  if (!context) throw new Error('MobileFilterButton must be used within MobileFilterProvider')

  const { isExpanded, setIsExpanded } = context

  return (
    <div className="relative mb-5">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-center rounded-lg bg-gray-900 p-3 text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
        aria-label="Filters"
      >
        <FontAwesomeIcon icon={faSliders} className="h-4 w-4" />
      </button>
      {activeFilterCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-medium text-white">
          {activeFilterCount}
        </span>
      )}
    </div>
  )
}

type ContentProps = {
  children: ReactNode
}

export function MobileFilterContent({ children }: ContentProps) {
  const context = useContext(MobileFilterContext)
  if (!context) throw new Error('MobileFilterContent must be used within MobileFilterProvider')

  const { isExpanded } = context

  if (!isExpanded) return null

  return (
    <div className="space-y-0">
      {children}
    </div>
  )
}
