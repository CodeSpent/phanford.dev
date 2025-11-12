'use client'

import React from 'react'
import { ContentType, SearchResult } from '@/utils/useGlobalSearch'
import {
  ViewGridIcon as Squares2X2Icon,
  NewspaperIcon,
  CodeIcon as CodeBracketIcon,
  PhotographIcon as PhotoIcon,
  DocumentTextIcon,
} from '@heroicons/react/outline'

interface SearchTypeFiltersProps {
  activeFilter: ContentType
  onFilterChange: (filter: ContentType) => void
  results: SearchResult[]
  className?: string
}

interface FilterOption {
  type: ContentType
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const filterOptions: FilterOption[] = [
  { type: 'all', label: 'All', icon: Squares2X2Icon },
  { type: 'article', label: 'Articles', icon: NewspaperIcon },
  { type: 'project', label: 'Projects', icon: CodeBracketIcon },
  { type: 'photo', label: 'Photos', icon: PhotoIcon },
  { type: 'document', label: 'Documents', icon: DocumentTextIcon },
]

// Count results by type
function getResultCounts(results: SearchResult[]): Record<ContentType, number> {
  const counts: Record<ContentType, number> = {
    all: results.length,
    article: 0,
    project: 0,
    photo: 0,
    document: 0,
  }

  results.forEach((result) => {
    counts[result.type]++
  })

  return counts
}

export const SearchTypeFilters: React.FC<SearchTypeFiltersProps> = ({
  activeFilter,
  onFilterChange,
  results,
  className = '',
}) => {
  const counts = getResultCounts(results)

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Mobile: Compact dropdown */}
      <div className="md:hidden w-full">
        <select
          value={activeFilter}
          onChange={(e) => onFilterChange(e.target.value as ContentType)}
          className="w-full px-3 py-2 rounded-lg bg-card-background border border-gray-700 text-gray-300 text-sm focus:outline-none focus:border-accent transition-colors"
        >
          {filterOptions.map((option) => {
            const Icon = option.icon
            const count = counts[option.type]
            return (
              <option key={option.type} value={option.type}>
                {option.label} ({count})
              </option>
            )
          })}
        </select>
      </div>

      {/* Desktop: Button group */}
      <div className="hidden md:flex items-center gap-2 flex-wrap">
        {filterOptions.map((option) => {
          const Icon = option.icon
          const count = counts[option.type]
          const isActive = activeFilter === option.type

          return (
            <button
              key={option.type}
              onClick={() => onFilterChange(option.type)}
              disabled={count === 0 && option.type !== 'all'}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${
                  isActive
                    ? 'bg-accent text-white shadow-md'
                    : count > 0
                    ? 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 hover:text-white'
                    : 'bg-gray-800/30 text-gray-600 cursor-not-allowed'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{option.label}</span>
              <span
                className={`
                  ml-0.5 px-1.5 py-0.5 rounded text-xs
                  ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : count > 0
                      ? 'bg-gray-700/80 text-gray-400'
                      : 'bg-gray-800/50 text-gray-600'
                  }
                `}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
