import React from 'react'
import { formatTag } from '../../utils/formatTag'

type TagProps = {
  children: React.ReactNode
  variant?: 'default' | 'compact'
  className?: string
}

export default function Tag({ children, variant = 'default', className = '' }: TagProps) {
  const baseClasses = "font-medium rounded-md transition-colors"
  
  const variantClasses = {
    default: "px-3 py-1.5 text-sm bg-gray-800/60 text-gray-300 hover:bg-gray-700/60",
    compact: "px-2 py-1 text-xs bg-gray-800/60 text-gray-300 hover:bg-gray-700/60"
  }
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}

type TagListProps = {
  tags: string[]
  variant?: 'default' | 'compact'
  maxVisible?: number
  className?: string
}

export function TagList({ tags, variant = 'default', maxVisible, className = '' }: TagListProps) {
  if (!Array.isArray(tags) || tags.length === 0) {
    return null
  }

  const visibleTags = maxVisible ? tags.slice(0, maxVisible) : tags
  const remainingCount = maxVisible && tags.length > maxVisible ? tags.length - maxVisible : 0

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {visibleTags.map((tag, index) => (
        <Tag key={index} variant={variant}>
          {formatTag(tag)}
        </Tag>
      ))}
      {remainingCount > 0 && (
        <span className={`${variant === 'compact' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'} font-medium rounded-md bg-gray-800/60 text-gray-400`}>
          +{remainingCount}
        </span>
      )}
    </div>
  )
}