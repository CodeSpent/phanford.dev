import React from 'react'
import { CalendarIcon, ClockIcon } from '@heroicons/react/solid'
import { SidebarModule } from './SidebarModule'

interface MetaInfoModuleProps {
  date?: string
  readingTime?: number
  wordCount?: number
  category?: string
  lastUpdated?: string
  className?: string
}

/**
 * Metadata information displayed in sidebar
 * Shows date, reading time, word count, category, etc.
 */
export const MetaInfoModule: React.FC<MetaInfoModuleProps> = ({
  date,
  readingTime,
  wordCount,
  category,
  lastUpdated,
  className = '',
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Don't render if no data
  if (!date && !readingTime && !wordCount && !category && !lastUpdated) {
    return null
  }

  return (
    <SidebarModule title="Information" className={className}>
      <div className="space-y-4">
        {date && (
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>Published</span>
            </div>
            <div className="text-sm text-gray-300">{formatDate(date)}</div>
          </div>
        )}

        {lastUpdated && (
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>Last Updated</span>
            </div>
            <div className="text-sm text-gray-300">{formatDate(lastUpdated)}</div>
          </div>
        )}

        {readingTime && (
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
              <ClockIcon className="h-3.5 w-3.5" />
              <span>Reading Time</span>
            </div>
            <div className="text-sm text-gray-300">{readingTime} min read</div>
          </div>
        )}

        {wordCount && (
          <div>
            <div className="text-xs text-gray-500 mb-1">Word Count</div>
            <div className="text-sm text-gray-300">{wordCount.toLocaleString()} words</div>
          </div>
        )}

        {category && (
          <div>
            <div className="text-xs text-gray-500 mb-1">Category</div>
            <div className="text-sm text-gray-300">{category}</div>
          </div>
        )}
      </div>
    </SidebarModule>
  )
}
