'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface Screenshot {
  url: string
  caption?: string
  alt?: string
}

interface ProjectGalleryProps {
  screenshots: string[] | Screenshot[]
  projectTitle: string
  className?: string
}

/**
 * ProjectGallery Component
 *
 * Displays a grid of project screenshots with lightbox functionality.
 * Supports both simple string arrays of image URLs and full screenshot objects with captions.
 */
export const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  screenshots,
  projectTitle,
  className = '',
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // Normalize screenshots to consistent format
  const normalizedScreenshots: Screenshot[] = screenshots.map(item =>
    typeof item === 'string' ? { url: item, alt: projectTitle } : item
  )

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return

      switch (e.key) {
        case 'Escape':
          setSelectedIndex(null)
          break
        case 'ArrowLeft':
          setSelectedIndex(prev =>
            prev === null || prev === 0 ? normalizedScreenshots.length - 1 : prev - 1
          )
          break
        case 'ArrowRight':
          setSelectedIndex(prev =>
            prev === null || prev === normalizedScreenshots.length - 1 ? 0 : prev + 1
          )
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, normalizedScreenshots.length])

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedIndex])

  const gridCols = normalizedScreenshots.length === 1 ? 'grid-cols-1' :
    normalizedScreenshots.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'

  return (
    <>
      {/* Gallery Grid */}
      <div className={`grid ${gridCols} gap-4 ${className}`}>
        {normalizedScreenshots.map((screenshot, index) => (
          <div
            key={index}
            className="relative aspect-video rounded-lg overflow-hidden bg-gray-800/50 border border-gray-700/50 cursor-pointer group"
            onClick={() => setSelectedIndex(index)}
          >
            <Image
              src={screenshot.url}
              alt={screenshot.alt || `${projectTitle} screenshot ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </div>
            {screenshot.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-sm text-white">{screenshot.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 z-60 p-2 text-white hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation buttons */}
          {normalizedScreenshots.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedIndex(prev =>
                    prev === null || prev === 0 ? normalizedScreenshots.length - 1 : prev - 1
                  )
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-60 p-2 text-white hover:text-gray-300 transition-colors"
                aria-label="Previous"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedIndex(prev =>
                    prev === null || prev === normalizedScreenshots.length - 1 ? 0 : prev + 1
                  )
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-60 p-2 text-white hover:text-gray-300 transition-colors"
                aria-label="Next"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Counter */}
          {normalizedScreenshots.length > 1 && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-60 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              {selectedIndex + 1} / {normalizedScreenshots.length}
            </div>
          )}

          {/* Image container */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={normalizedScreenshots[selectedIndex].url}
              alt={normalizedScreenshots[selectedIndex].alt || `${projectTitle} screenshot`}
              width={1920}
              height={1080}
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain'
              }}
              className="rounded-lg shadow-2xl"
              priority
            />
            {normalizedScreenshots[selectedIndex].caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4 rounded-b-lg">
                <p className="text-white text-center">{normalizedScreenshots[selectedIndex].caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
