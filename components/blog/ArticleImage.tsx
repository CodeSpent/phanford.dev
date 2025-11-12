'use client'

import React, { useState } from 'react'
import Image from 'next/image'

type Props = {
  src: string
  alt?: string
  contentType: string
  articleSlug: string
  isHeaderImage: boolean
  imagePosition?: string
}

/**
 * Custom image component for MDX articles with error handling, parallax effect,
 * gradient overlay, and flexible aspect ratios
 */
export default function ArticleImage({
  src,
  alt,
  contentType,
  articleSlug,
  isHeaderImage,
  imagePosition = 'center'
}: Props) {
  const [imageError, setImageError] = useState(false)

  // Skip rendering header images entirely
  if (isHeaderImage) {
    return null
  }

  // Handle image load errors with fallback UI
  if (imageError) {
    return (
      <div className="my-8">
        <div className="bg-gray-800/50 border-2 border-gray-700/50 rounded-lg p-8 text-center">
          <svg className="w-12 h-12 text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-400 text-sm font-medium mb-1">Image Unavailable</p>
          {alt && (
            <p className="text-gray-500 text-xs">{alt}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="my-8">
      <div className="relative w-full" style={{ maxHeight: '400px' }}>
        <Image
          src={`/${contentType}/${articleSlug}/${src}`}
          alt={alt || ''}
          width={800}
          height={500}
          className="max-w-full h-auto rounded-lg mx-auto block"
          style={{ maxHeight: '400px', objectFit: 'contain' }}
          sizes="(max-width: 768px) 100vw, 800px"
          onError={() => setImageError(true)}
        />
      </div>
      {alt && (
        <p className="text-sm text-gray-400 text-center mt-2 italic">
          {alt}
        </p>
      )}
    </div>
  )
}
