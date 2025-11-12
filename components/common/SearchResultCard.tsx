'use client'

import React from 'react'
import Link from 'next/link'
import { SearchResult } from '@/utils/useGlobalSearch'
import { TagList } from './Tag'
import { ProjectStatusBadge } from '../blog/ProjectStatusBadge'
import {
  DocumentTextIcon,
  NewspaperIcon,
  CodeIcon as CodeBracketIcon,
  PhotographIcon as PhotoIcon,
  ClockIcon,
  LocationMarkerIcon as MapPinIcon,
  CameraIcon,
  ChevronRightIcon,
} from '@heroicons/react/outline'

interface SearchResultCardProps {
  result: SearchResult
  searchQuery?: string
  isSelected?: boolean
  onClick?: () => void
}

// Highlight matching terms in text
function highlightText(text: string, query?: string): React.ReactNode {
  if (!query || !text) return text

  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))

  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index} className="bg-yellow-500/20 text-yellow-300 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

// Get icon and color for content type
function getTypeConfig(type: SearchResult['type']) {
  const configs = {
    article: {
      icon: NewspaperIcon,
      label: 'Article',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    project: {
      icon: CodeBracketIcon,
      label: 'Project',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    photo: {
      icon: PhotoIcon,
      label: 'Photo',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
    },
    document: {
      icon: DocumentTextIcon,
      label: 'Document',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
  }

  return configs[type]
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  result,
  searchQuery,
  isSelected = false,
  onClick,
}) => {
  const typeConfig = getTypeConfig(result.type)
  const Icon = typeConfig.icon

  // Truncate description to reasonable length
  const maxDescLength = 150
  const truncatedDesc =
    result.description && result.description.length > maxDescLength
      ? result.description.substring(0, maxDescLength) + '...'
      : result.description

  return (
    <Link href={result.url} onClick={onClick}>
      <div
        className={`
          group relative p-4 rounded-lg border transition-all duration-200 flex gap-4
          ${
            isSelected
              ? 'bg-card-background/80 border-accent/50 shadow-md'
              : 'bg-card-background/40 border-gray-700/50 hover:bg-card-background/60 hover:border-gray-600'
          }
        `}
      >
        {/* Type badge in corner */}
        <div className="absolute top-3 right-3">
          <div
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${typeConfig.bgColor} ${typeConfig.color}`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{typeConfig.label}</span>
          </div>
        </div>

        {/* Left side: Image/Icon */}
        {(result.type === 'photo' && result.imageUrl) || (result.type === 'project' && result.icon) ? (
          <div className="flex-shrink-0">
            {result.type === 'photo' && result.imageUrl && (
              <div className="w-24 h-24 flex items-center justify-center bg-gray-900/40 rounded-md p-1">
                <img
                  src={result.imageUrl}
                  alt={result.title}
                  className="max-w-full max-h-full object-contain rounded"
                />
              </div>
            )}
            {result.type === 'project' && result.icon && (
              <div className="w-12 h-12 flex items-center justify-center">
                <img src={result.icon} alt={result.title} className="w-full h-full rounded" />
              </div>
            )}
          </div>
        ) : null}

        {/* Right side: Content */}
        <div className="flex-1 pr-20 min-w-0">

          {/* Title */}
          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-accent transition-colors">
            {highlightText(result.title, searchQuery)}
          </h3>

          {/* Description */}
          {truncatedDesc && (
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
              {highlightText(truncatedDesc, searchQuery)}
            </p>
          )}

          {/* Type-specific metadata */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
            {/* Article: Reading time */}
            {result.type === 'article' && result.readingTime && (
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                <span>{result.readingTime}</span>
              </div>
            )}

            {/* Project: Status badge */}
            {result.type === 'project' && result.status && (
              <ProjectStatusBadge status={result.status} />
            )}

            {/* Photo: Location and camera */}
            {result.type === 'photo' && (
              <>
                {result.location && (
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{result.location}</span>
                  </div>
                )}
                {result.camera && (
                  <div className="flex items-center gap-1">
                    <CameraIcon className="w-4 h-4" />
                    <span>{result.camera}</span>
                  </div>
                )}
              </>
            )}

            {/* Document: Category */}
            {result.type === 'document' && result.category && (
              <div className="inline-flex px-2 py-1 rounded-md bg-gray-800/60 text-gray-300">
                {result.category}
              </div>
            )}
          </div>

          {/* Tags */}
          {result.tags && result.tags.length > 0 && (
            <TagList tags={result.tags} variant="compact" maxVisible={3} />
          )}

          {/* Project technologies */}
          {result.type === 'project' && result.technologies && result.technologies.length > 0 && (
            <div className="mt-2">
              <TagList tags={result.technologies} variant="compact" maxVisible={4} />
            </div>
          )}
        </div>

        {/* Hover arrow */}
        <div
          className={`absolute right-4 top-1/2 -translate-y-1/2 transition-transform ${
            isSelected ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
          }`}
        >
          <ChevronRightIcon className="w-5 h-5 text-accent" />
        </div>
      </div>
    </Link>
  )
}
