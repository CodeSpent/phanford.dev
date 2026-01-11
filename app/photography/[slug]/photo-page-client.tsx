'use client'

import {
  CalendarIcon,
  LocationMarkerIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CameraIcon,
  InformationCircleIcon,
  XIcon,
  CheckIcon,
  LinkIcon,
} from '@heroicons/react/solid'
import { DataSourceType, getDataSource } from 'constants/data-sources'
import Button from '../../../components/common/Button'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Props = {
  photo: any
  slug: string
  dataSource?: DataSourceType
  prevSlug?: string
  nextSlug?: string
  currentIndex?: number
  totalPhotos?: number
}

export default function PhotoPageClient({
  photo,
  dataSource = 'photography',
  prevSlug,
  nextSlug,
  currentIndex,
  totalPhotos,
}: Props) {
  const ds = getDataSource(dataSource)
  const router = useRouter()
  const [showInfo, setShowInfo] = useState(true)
  const [showSharePopover, setShowSharePopover] = useState(false)
  const [copied, setCopied] = useState(false)
  const shareButtonRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      switch (e.key) {
        case 'ArrowLeft':
          if (prevSlug) router.push(`/photography/${prevSlug}`)
          break
        case 'ArrowRight':
          if (nextSlug) router.push(`/photography/${nextSlug}`)
          break
        case 'Escape':
          router.push('/photography')
          break
        case 'i':
          setShowInfo((prev) => !prev)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [prevSlug, nextSlug, router])

  // Click outside to close share popover
  useEffect(() => {
    if (!showSharePopover) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        shareButtonRef.current &&
        !shareButtonRef.current.contains(e.target as Node)
      ) {
        setShowSharePopover(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showSharePopover])

  const handleCopyLink = async () => {
    try {
      const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://phanford.dev'}/photography/${photo.slugAsParams}`
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setShowSharePopover(false)
      }, 1500)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const toggleInfo = () => setShowInfo((prev) => !prev)

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between">
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

        <div className="flex items-center gap-2">
          {/* Info toggle button */}
          <button
            onClick={toggleInfo}
            className={`p-3 rounded-full transition-all ${
              showInfo
                ? 'bg-white/20 text-white'
                : 'bg-black/50 hover:bg-black/70 text-white'
            }`}
            aria-label={showInfo ? 'Hide photo info' : 'Show photo info'}
          >
            <InformationCircleIcon className="h-5 w-5" />
          </button>

          {/* Close button */}
          <Button
            as="link"
            href={`/${ds.id}`}
            variant="icon-minimal"
            className="p-3"
            icon={<XIcon className="h-5 w-5" />}
          >
            <span className="sr-only">Back to photography</span>
          </Button>
        </div>
      </div>

      {/* Photo counter */}
      {totalPhotos && totalPhotos > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 text-white text-sm bg-black/50 px-3 py-1.5 rounded-full">
          {(currentIndex ?? 0) + 1} / {totalPhotos}
        </div>
      )}

      {/* Previous photo navigation */}
      {prevSlug && (
        <Link
          href={`/photography/${prevSlug}`}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all duration-200 group"
          aria-label="Previous photo"
        >
          <ChevronLeftIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </Link>
      )}

      {/* Next photo navigation */}
      {nextSlug && (
        <Link
          href={`/photography/${nextSlug}`}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all duration-200 group"
          aria-label="Next photo"
        >
          <ChevronRightIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </Link>
      )}

      {/* Photo - click to toggle info */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={toggleInfo}
        role="button"
        tabIndex={0}
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

      {/* Info Panel - conditionally rendered */}
      {showInfo && (
        <div
          className="absolute bottom-0 left-0 right-0 z-30 bg-black/90 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="p-6 md:p-8 max-w-4xl mx-auto">
          {/* Title row with share button */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {photo.title}
              </h1>

              <div className="flex flex-wrap gap-3 text-sm text-gray-300">
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

            {/* Share button with popover */}
            <div className="relative flex-shrink-0">
              <button
                ref={shareButtonRef}
                onClick={() => setShowSharePopover(!showSharePopover)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                aria-label="Share photo"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
              </button>

              {/* Share popover */}
              {showSharePopover && (
                <div
                  ref={popoverRef}
                  className="absolute bottom-full right-0 mb-2 z-50"
                >
                  <div className="absolute -bottom-1 right-4 w-2 h-2 bg-gray-900 rotate-45 border-r border-b border-gray-700/50" />
                  <div className="bg-gray-900 border border-gray-700/50 rounded-lg shadow-xl p-2 min-w-[140px]">
                    <button
                      onClick={handleCopyLink}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                    >
                      {copied ? (
                        <>
                          <CheckIcon className="h-4 w-4 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <LinkIcon className="h-4 w-4" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {photo.description && (
            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">
              {photo.description}
            </p>
          )}

          {/* Technical details */}
          {(photo.camera || photo.lens || photo.settings) && (
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Technical Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-300">
                {photo.camera && (
                  <div className="flex items-center gap-2">
                    <CameraIcon className="h-4 w-4 text-gray-500" />
                    <span>{photo.camera}</span>
                  </div>
                )}
                {photo.lens && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{photo.lens}</span>
                  </div>
                )}
                {photo.settings && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{photo.settings}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  )
}
