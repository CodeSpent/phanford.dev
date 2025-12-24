import React from 'react'
import { formatTag } from '../../utils/formatTag'

type UnifiedTagProps = {
  tag: string
  variant?: 'default' | 'compact'
  className?: string
}

/**
 * UnifiedTag - Renders a tag as styled text
 */
export function UnifiedTag({ tag, variant = 'default', className = '' }: UnifiedTagProps) {
  const baseClasses = 'font-medium rounded-md transition-colors'

  const variantClasses = {
    default: 'px-3 py-1.5 text-sm bg-gray-800/60 text-gray-300 hover:bg-gray-700/60',
    compact: 'px-2 py-1 text-xs bg-gray-800/60 text-gray-300 hover:bg-gray-700/60',
  }

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {formatTag(tag)}
    </span>
  )
}

type UnifiedTagListProps = {
  tags: string[]
  variant?: 'default' | 'compact'
  maxVisible?: number
  className?: string
}

/**
 * UnifiedTagList - Renders a list of tags with consistent spacing
 */
export function UnifiedTagList({
  tags,
  variant = 'default',
  maxVisible,
  className = '',
}: UnifiedTagListProps) {
  if (!Array.isArray(tags) || tags.length === 0) {
    return null
  }

  const visibleTags = maxVisible ? tags.slice(0, maxVisible) : tags
  const remainingCount = maxVisible && tags.length > maxVisible ? tags.length - maxVisible : 0

  return (
    <div className={`flex items-center flex-wrap gap-2 ${className}`}>
      {visibleTags.map((tag, index) => (
        <UnifiedTag key={index} tag={tag} variant={variant} />
      ))}
      {remainingCount > 0 && (
        <span
          className={`${variant === 'compact' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'} font-medium rounded-md bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 transition-colors`}
        >
          +{remainingCount}
        </span>
      )}
    </div>
  )
}
