import Link from 'next/link'
import React from 'react'
import { formatTag } from '../../utils/formatTag'

type Props = {
  slug: string
  publishedDateTime: string
  publishedDate: string
  title: string
  description: string
  tags: string[]
  readingTime?: number
}

export default function ArticleCard({
  slug,
  publishedDateTime,
  publishedDate,
  title,
  description,
  tags,
  readingTime,
}: Props) {
  const url = slug && slug.startsWith('/') ? `/blog${slug}` : `/blog/${(slug || '')}`
  
  // Truncate description for more compact cards
  const truncatedDescription = description.length > 120 
    ? description.substring(0, 120) + '...' 
    : description

  return (
    <Link href={url}>
      <div
        className={`h-full bg-card-background group rounded-xl border border-gray-800/50 
        transition-all duration-200 hover:border-gray-700 hover:shadow-lg hover:shadow-gray-900/20 flex flex-col cursor-pointer`}
      >
        <div className="p-5 flex flex-col h-full">
          {/* Header with tags only */}
          <div className="flex justify-end mb-3">
            {Array.isArray(tags) && tags.length > 0 && (
              <div className="flex gap-1">
                {tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs font-medium rounded-md bg-gray-800/60 
                    text-gray-300 group-hover:bg-gray-700/60"
                  >
                    {formatTag(tag)}
                  </span>
                ))}
                {tags.length > 2 && (
                  <span className="px-2 py-1 text-xs font-medium rounded-md bg-gray-800/60 
                  text-gray-400">
                    +{tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-300 group-hover:text-white 
          mb-2 line-clamp-2 leading-tight">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-400 group-hover:text-gray-300 line-clamp-3 leading-relaxed flex-grow">
            {truncatedDescription}
          </p>

          {/* Footer with reading time and date */}
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mt-3">
            {readingTime && (
              <>
                <span>{readingTime} min read</span>
                <span className="text-gray-600">•</span>
              </>
            )}
            <time dateTime={publishedDate}>
              {publishedDate}
            </time>
          </div>
        </div>
      </div>
    </Link>
  )
}
