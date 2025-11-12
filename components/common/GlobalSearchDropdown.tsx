'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { useGlobalSearch } from '@/utils/useGlobalSearch'
import { SearchResultCard } from './SearchResultCard'
import { SearchTypeFilters } from './SearchTypeFilters'
import { RecentSearches } from './RecentSearches'
import {
  SearchIcon as MagnifyingGlassIcon,
  XIcon as XMarkIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline'

interface GlobalSearchDropdownProps {
  className?: string
}

export const GlobalSearchDropdown: React.FC<GlobalSearchDropdownProps> = ({
  className = '',
}) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const {
    results,
    isLoading,
    isIndexLoaded,
    error,
    search,
    clear,
    typeFilter,
    setFilter,
    recentSearches,
    clearRecent,
  } = useGlobalSearch()

  // Perform search when query changes
  useEffect(() => {
    if (query.trim()) {
      search(query, typeFilter)
    } else {
      clear()
    }
  }, [query, typeFilter, search, clear])

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [results])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command/Ctrl + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        inputRef.current?.blur()
        setQuery('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Keyboard navigation within results
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!results || results.length === 0) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
          break
        case 'Enter':
          e.preventDefault()
          if (results[selectedIndex]) {
            router.push(results[selectedIndex].url)
            setIsOpen(false)
            setQuery('')
          }
          break
      }
    },
    [results, selectedIndex, router]
  )

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && results.length > 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [selectedIndex, results.length])

  const handleResultClick = () => {
    setIsOpen(false)
    setQuery('')
    clear()
  }

  const handleRecentSearchClick = (searchQuery: string) => {
    setQuery(searchQuery)
    search(searchQuery, typeFilter)
  }

  const showRecentSearches = !query.trim() && recentSearches.length > 0 && isFocused
  const showResults = query.trim() && results.length > 0
  const showNoResults = query.trim() && !isLoading && results.length === 0

  return (
    <Popover className={`relative ${className}`}>
      {({ open }) => {
        // Sync internal state with Popover state
        useEffect(() => {
          setIsOpen(open)
          if (open) {
            inputRef.current?.focus()
          }
        }, [open])

        return (
          <>
            <Popover.Button
              as="div"
              className="relative flex items-center w-full cursor-pointer"
            >
              <div className="relative flex items-center w-full">
                <MagnifyingGlassIcon className="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                  placeholder="Search articles, projects, photos..."
                  className="w-full pl-10 pr-20 py-2.5 rounded-lg bg-gray-800/60 border border-gray-700 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                />
                <div className="absolute right-3 flex items-center gap-2">
                  {query && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setQuery('')
                        clear()
                      }}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                  <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-gray-400 bg-gray-900/60 border border-gray-700 rounded">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              </div>
            </Popover.Button>

            <Transition
              show={showResults || showRecentSearches || showNoResults || isLoading}
              enter="transition duration-200 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-150 ease-in"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Popover.Panel className="absolute top-full left-0 right-0 mt-2 z-50">
                <div className="bg-background border border-gray-700 rounded-lg shadow-2xl backdrop-blur-md max-h-[600px] overflow-hidden flex flex-col">
                  {/* Type Filters */}
                  {(showResults || showNoResults) && (
                    <div className="px-4 py-3 border-b border-gray-700">
                      <SearchTypeFilters
                        activeFilter={typeFilter}
                        onFilterChange={setFilter}
                        results={results}
                      />
                    </div>
                  )}

                  {/* Results Container */}
                  <div className="overflow-y-auto max-h-[500px] px-4 py-4">
                    {/* Loading State */}
                    {isLoading && query.trim() && (
                      <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
                          <p className="text-sm text-gray-400">
                            {isIndexLoaded ? 'Searching...' : 'Loading search index...'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Error State */}
                    {error && (
                      <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <ExclamationCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    )}

                    {/* Recent Searches */}
                    {showRecentSearches && !isLoading && (
                      <RecentSearches
                        searches={recentSearches}
                        onSearchClick={handleRecentSearchClick}
                        onClear={clearRecent}
                      />
                    )}

                    {/* Search Results */}
                    {showResults && !isLoading && (
                      <div ref={resultsRef} className="space-y-3">
                        {results.map((result, index) => (
                          <SearchResultCard
                            key={result.id}
                            result={result}
                            searchQuery={query}
                            isSelected={index === selectedIndex}
                            onClick={handleResultClick}
                          />
                        ))}
                      </div>
                    )}

                    {/* No Results */}
                    {showNoResults && (
                      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <MagnifyingGlassIcon className="w-12 h-12 text-gray-600 mb-3" />
                        <h3 className="text-lg font-medium text-gray-300 mb-1">
                          No results found
                        </h3>
                        <p className="text-sm text-gray-500">
                          Try adjusting your search or filters
                        </p>
                        {typeFilter !== 'all' && (
                          <button
                            onClick={() => setFilter('all')}
                            className="mt-4 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
                          >
                            Search all content types
                          </button>
                        )}
                      </div>
                    )}

                    {/* Empty State (no query) - Don't show anything */}
                    {!query.trim() && recentSearches.length === 0 && null}
                  </div>

                  {/* Footer Info */}
                  {results.length > 0 && (
                    <div className="px-4 py-2 border-t border-gray-700 bg-gray-900/40">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {results.length} result{results.length !== 1 ? 's' : ''}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="hidden sm:inline">
                            <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded">↑↓</kbd>{' '}
                            navigate
                          </span>
                          <span className="hidden sm:inline">
                            <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded">↵</kbd>{' '}
                            select
                          </span>
                          <span>
                            <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded">esc</kbd>{' '}
                            close
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )
      }}
    </Popover>
  )
}
