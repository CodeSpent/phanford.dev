'use client'

import { CalendarIcon, LocationMarkerIcon, ChevronLeftIcon, CameraIcon, InformationCircleIcon, XIcon } from '@heroicons/react/solid'
import { DataSourceType, getDataSource } from 'constants/data-sources'
import Button from '../../../components/common/Button'
import { useState } from 'react'
import Image from 'next/image'

type Props = {
  photo: any
  slug: string
  dataSource?: DataSourceType
}

export default function PhotoPageClient({ photo, dataSource = 'photography' }: Props) {
  const ds = getDataSource(dataSource)
  const [showInfo, setShowInfo] = useState(true)
  const [showShareModal, setShowShareModal] = useState(false)

  return (
    <>
      {/* Full viewport container without any layout constraints */}
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
        {/* Navigation overlay */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/70 to-transparent">
          <Button
            as="link"
            href={`/${ds.id}`}
            variant="solid-secondary"
            size="md"
            icon={<ChevronLeftIcon className="h-4 w-4" />}
            iconPosition="left"
          >
            Back to photography
          </Button>
        </div>

        {/* Back to photos X button */}
        <Button
          as="link"
          href={`/${ds.id}`}
          variant="icon-minimal"
          className="absolute top-4 right-4 z-20 p-3"
          icon={<XIcon className="h-5 w-5" />}
        >
          <span className="sr-only">Back to photography</span>
        </Button>

        {/* Main photo display - true full viewport */}
        <div
          className="absolute inset-0 w-full h-full cursor-pointer"
          onClick={() => setShowInfo(!showInfo)}
          aria-label="Toggle photo information"
        >
          <Image
            src={photo.imageUrl}
            alt={photo.title}
            fill
            placeholder={photo.blurDataUrl ? 'blur' : 'empty'}
            blurDataURL={photo.blurDataUrl}
            style={{ objectFit: 'contain' }}
            priority
            sizes="100vw"
          />
        </div>

        {/* Photo information overlay */}
        <div className={`absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black via-black/90 to-transparent transition-transform duration-300 ${
          showInfo ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="p-8 md:p-10 max-w-4xl mx-auto relative">
            {/* Share button */}
            <button
              onClick={() => setShowShareModal(true)}
              className="absolute top-2 right-14 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
              aria-label="Share photo"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>

            {/* Close button */}
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
              aria-label="Close photo information"
            >
              <XIcon className="h-5 w-5" />
            </button>

            {/* Title and basic info */}
            <div className="mb-6">
              <div className="mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{photo.title}</h1>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  {new Date(photo.date).toDateString()}
                </span>

                {photo.location && (
                  <span className="flex items-center gap-1">
                    <LocationMarkerIcon className="h-4 w-4" />
                    {photo.location}
                  </span>
                )}

                {photo.camera && (
                  <span className="flex items-center gap-1">
                    <CameraIcon className="h-4 w-4" />
                    {photo.camera}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {photo.description && (
              <div className="mb-6">
                <p className="text-gray-300 leading-relaxed max-w-2xl">{photo.description}</p>
              </div>
            )}

            {/* Technical details */}
            {(photo.camera || photo.lens || photo.settings) && (
              <div className="border-t border-gray-700 pt-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Camera & Technical Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300">
                  {photo.camera && (
                    <div className="flex items-center gap-2">
                      <CameraIcon className="h-4 w-4 text-gray-400" />
                      <span><strong>Camera:</strong> {photo.camera}</span>
                    </div>
                  )}
                  {photo.lens && (
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      <span><strong>Lens:</strong> {photo.lens}</span>
                    </div>
                  )}
                  {photo.settings && (
                    <div className="flex items-center gap-2 md:col-span-2">
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span><strong>Settings:</strong> {photo.settings}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Hint for info panel when closed - now clickable */}
        {!showInfo && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <Button
              variant="icon-minimal"
              onClick={() => setShowInfo(true)}
              icon={<InformationCircleIcon className="h-4 w-4" />}
              iconPosition="left"
              className="text-sm"
            >
              Tap for details
            </Button>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowShareModal(false)}
            />

            {/* Modal Content */}
            <div className="relative bg-gray-900 rounded-lg p-6 max-w-sm w-full border border-gray-700">
              {/* Close button */}
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Close share modal"
              >
                <XIcon className="h-5 w-5" />
              </button>

              {/* Modal Header */}
              <h3 className="text-lg font-semibold text-white mb-4">Share this Photo</h3>

              {/* Share Options */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://phanford.dev'}/photography/${photo.slugAsParams}`
                    const encodedTitle = encodeURIComponent(`${photo.title} | Patrick Hanford`)
                    const encodedUrl = encodeURIComponent(shareUrl)
                    window.open(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, '_blank')
                    setShowShareModal(false)
                  }}
                  className="w-full flex items-center gap-3 p-3 text-left text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span>Share on Twitter</span>
                </button>

                <button
                  onClick={() => {
                    const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://phanford.dev'}/photography/${photo.slugAsParams}`
                    const encodedUrl = encodeURIComponent(shareUrl)
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank')
                    setShowShareModal(false)
                  }}
                  className="w-full flex items-center gap-3 p-3 text-left text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>Share on LinkedIn</span>
                </button>

                <button
                  onClick={() => {
                    const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://phanford.dev'}/photography/${photo.slugAsParams}`
                    const encodedUrl = encodeURIComponent(shareUrl)
                    const encodedTitle = encodeURIComponent(`${photo.title} | Patrick Hanford`)
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`, '_blank')
                    setShowShareModal(false)
                  }}
                  className="w-full flex items-center gap-3 p-3 text-left text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Share on Facebook</span>
                </button>

                <button
                  onClick={async () => {
                    try {
                      const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://phanford.dev'}/photography/${photo.slugAsParams}`
                      await navigator.clipboard.writeText(shareUrl)
                      setShowShareModal(false)
                      // You could add a toast notification here
                    } catch (err) {
                      console.error('Failed to copy link:', err)
                    }
                  }}
                  className="w-full flex items-center gap-3 p-3 text-left text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
