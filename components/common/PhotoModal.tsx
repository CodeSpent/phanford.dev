import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { XIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import { UnifiedTagList } from './UnifiedTag'
import { formatPhotoDate, formatDateTimeAttribute } from '../../utils/formatDate'
import { Photo } from 'contentlayer/generated'

type Props = {
  isOpen: boolean
  onClose: () => void
  photo: Photo | null
  photos: Photo[]
  onNavigate?: (photo: Photo) => void
}

export default function PhotoModal({ isOpen, onClose, photo, photos, onNavigate }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (photo && photos.length > 0) {
      const index = photos.findIndex(p => p.slug === photo.slug)
      setCurrentIndex(index >= 0 ? index : 0)
    }
  }, [photo, photos])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          navigatePrevious()
          break
        case 'ArrowRight':
          navigateNext()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex, photos.length])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const navigateNext = () => {
    if (photos.length === 0) return
    const nextIndex = (currentIndex + 1) % photos.length
    setCurrentIndex(nextIndex)
    onNavigate?.(photos[nextIndex])
  }

  const navigatePrevious = () => {
    if (photos.length === 0) return
    const prevIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
    onNavigate?.(photos[prevIndex])
  }

  if (!isOpen || !photo || !photo.imageUrl) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-60 p-2 text-white hover:text-gray-300 transition-colors"
        aria-label="Close modal"
      >
        <XIcon className="h-8 w-8" />
      </button>

      {/* Navigation buttons */}
      {photos.length > 1 && (
        <>
          <button
            onClick={navigatePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-60 p-2 text-white hover:text-gray-300 transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeftIcon className="h-8 w-8" />
          </button>
          <button
            onClick={navigateNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-60 p-2 text-white hover:text-gray-300 transition-colors"
            aria-label="Next photo"
          >
            <ChevronRightIcon className="h-8 w-8" />
          </button>
        </>
      )}

      {/* Photo counter */}
      {photos.length > 1 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-60 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
          {currentIndex + 1} / {photos.length}
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col lg:flex-row max-w-7xl max-h-full w-full h-full p-4 gap-4">
        {/* Image container */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <div className="relative max-w-full max-h-full">
            <Image
              src={photo.imageUrl}
              alt={photo.title}
              width={1200}
              height={800}
              placeholder={photo.blurDataUrl ? 'blur' : 'empty'}
              blurDataURL={photo.blurDataUrl}
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain'
              }}
              className="rounded-lg"
              priority
            />
          </div>
        </div>

        {/* Info panel */}
        <div className="lg:w-80 lg:max-h-full lg:overflow-y-auto bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-lg p-6 text-white">
          {/* Date */}
          <div className="mb-4">
            <time 
              dateTime={formatDateTimeAttribute(photo.date)}
              className="text-sm text-gray-400"
            >
              {formatPhotoDate(photo.date)}
            </time>
          </div>

          {/* Title and description */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-3">{photo.title}</h2>
            <p className="text-gray-300 leading-relaxed">{photo.description}</p>
          </div>

          {/* Technical details */}
          {(photo.camera || photo.lens || photo.settings || photo.location) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-200">Details</h3>
              <div className="space-y-3 text-sm">
                {photo.camera && (
                  <div>
                    <span className="text-gray-400 block mb-1">Camera</span>
                    <span className="text-gray-300">{photo.camera}</span>
                  </div>
                )}
                {photo.lens && (
                  <div>
                    <span className="text-gray-400 block mb-1">Lens</span>
                    <span className="text-gray-300">{photo.lens}</span>
                  </div>
                )}
                {photo.settings && (
                  <div>
                    <span className="text-gray-400 block mb-1">Settings</span>
                    <span className="text-gray-300">{photo.settings}</span>
                  </div>
                )}
                {photo.location && (
                  <div>
                    <span className="text-gray-400 block mb-1">Location</span>
                    <span className="text-gray-300">{photo.location}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {photo.tags && photo.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-200">Tags</h3>
              <UnifiedTagList tags={photo.tags} variant="compact" />
            </div>
          )}
        </div>
      </div>

      {/* Background overlay - clicking closes modal */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={onClose}
        aria-label="Close modal"
      />
    </div>
  )
}