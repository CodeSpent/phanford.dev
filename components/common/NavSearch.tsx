'use client'

import { useState, useEffect, useRef } from 'react'
import { SearchIcon, XIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/navigation'

interface NavSearchProps {
  isExpanded: boolean
  onToggle: () => void
  isCompact?: boolean
}

/**
 * NavSearch - Expandable search component for navbar
 *
 * Provides an inline search experience that expands from an icon button
 * Navigates to /blog with search query parameter
 */
export default function NavSearch({
  isExpanded,
  onToggle,
  isCompact = false,
}: NavSearchProps) {
  const [searchValue, setSearchValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to toggle search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onToggle()
      }

      // Escape to close
      if (e.key === 'Escape' && isExpanded) {
        onToggle()
        setSearchValue('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded, onToggle])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      // Navigate to blog with search query
      router.push(`/blog?search=${encodeURIComponent(searchValue.trim())}`)
      onToggle()
      setSearchValue('')
    }
  }

  const handleClear = () => {
    setSearchValue('')
    inputRef.current?.focus()
  }

  return (
    <div className="relative flex items-center">
      {isExpanded ? (
        <form
          onSubmit={handleSubmit}
          className="flex items-center transition-all duration-300 ease-in-out"
        >
          <div
            className={`
              relative flex items-center
              ${isCompact ? 'w-48' : 'w-64'}
              transition-all duration-300
            `}
          >
            <SearchIcon
              className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none"
            />
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search articles..."
              className={`
                w-full
                ${isCompact ? 'h-8 pl-9 pr-8 text-xs' : 'h-10 pl-10 pr-10 text-sm'}
                bg-black/40 backdrop-blur-sm
                border border-gray-700/50
                focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20
                rounded-md
                text-white placeholder-gray-500
                transition-all duration-200
                outline-none
              `}
            />
            {searchValue && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2 text-gray-400 hover:text-white transition-colors"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onToggle}
            className={`
              ml-2
              ${isCompact ? 'w-8 h-8' : 'w-10 h-10'}
              rounded-md
              bg-gray-800/60 hover:bg-gray-800
              border border-gray-700/50 hover:border-gray-600/50
              flex items-center justify-center
              text-gray-400 hover:text-white
              transition-all duration-200
            `}
          >
            <XIcon className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <button
          onClick={onToggle}
          className={`
            transition-all duration-200
            ${isCompact ? 'w-8 h-8' : 'w-10 h-10'}
            rounded-md bg-gray-800/60 hover:bg-gray-800
            border border-gray-700/50 hover:border-gray-600/50
            flex items-center justify-center
            text-gray-400 hover:text-white
            group
          `}
          aria-label="Search"
        >
          <SearchIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
      )}
    </div>
  )
}
