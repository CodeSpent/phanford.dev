'use client'

import React from 'react'
import { ClockIcon, XIcon as XMarkIcon } from '@heroicons/react/outline'

interface RecentSearchesProps {
  searches: string[]
  onSearchClick: (query: string) => void
  onClear: () => void
  className?: string
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({
  searches,
  onSearchClick,
  onClear,
  className = '',
}) => {
  if (searches.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
          <ClockIcon className="w-4 h-4" />
          Recent Searches
        </h3>
        <button
          onClick={onClear}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="space-y-2">
        {searches.map((query, index) => (
          <button
            key={index}
            onClick={() => onSearchClick(query)}
            className="w-full text-left px-4 py-2.5 rounded-lg bg-card-background/40 hover:bg-card-background/60 border border-gray-700/50 hover:border-gray-600 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                {query}
              </span>
              <XMarkIcon className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
