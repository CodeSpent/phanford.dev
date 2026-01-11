import React from 'react'
import Image from 'next/image'
import { UnifiedTagList } from '../common/UnifiedTag'
import { formatPhotoDate, formatDateTimeAttribute } from '../../utils/formatDate'

type Props = {
  slug: string
  publishedDateTime: string
  publishedDate: string
  title: string
  description: string
  tags: string[]
  imageUrl: string
  blurDataUrl?: string
  location?: string
  camera?: string
  lens?: string
  settings?: string
  category?: string
  orientation?: string
  naturalWidth?: number
  naturalHeight?: number
  onClick?: () => void
}

export default function PhotoCard({
  slug,
  publishedDateTime,
  publishedDate,
  title,
  description,
  tags,
  imageUrl,
  blurDataUrl,
  location,
  camera,
  lens,
  settings,
  category,
  orientation,
  naturalWidth = 400,
  naturalHeight = 30,
  onClick,
}: Props) {
  // Masonry layout approach - fixed width with natural height
  const cardWidth = 340 // Fixed width for masonry
  const cardHeight = Math.round((cardWidth * naturalHeight) / naturalWidth)
  
  // Hide description if card width is less than 600px
  const shouldShowDescription = cardWidth >= 600

  return (
    <div
      className={`relative bg-card-background group rounded-lg shadow-md overflow-hidden
      transition duration-300 hover:z-50 hover:scale-105 hover:shadow-lg cursor-pointer mb-4`}
      style={{
        width: `${cardWidth}px`,
        height: `${cardHeight}px`
      }}
      onClick={onClick}
    >
      <Image
        src={imageUrl}
        alt={title}
        width={naturalWidth}
        height={naturalHeight}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        placeholder={blurDataUrl ? 'blur' : 'empty'}
        blurDataURL={blurDataUrl}
        style={{
          objectFit: 'cover',
          width: '100%',
          height: '100%'
        }}
        className="transition-transform duration-300 group-hover:scale-105"
      />

      <div className="absolute top-4 left-4 z-10">
        <p className="text-sm text-white bg-black bg-opacity-60 px-3 py-1.5 rounded-lg">
          <time dateTime={formatDateTimeAttribute(publishedDate)}>{formatPhotoDate(publishedDate)}</time>
        </p>
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-10">
        <UnifiedTagList tags={tags} variant="compact" className="overflow-hidden" />
      </div>

      {(location || lens || settings || camera) && (
        <div className="absolute bottom-0 left-0 right-0 z-30
          translate-y-full md:group-hover:translate-y-0
          transition-transform duration-300 ease-out">
          <div className="bg-gray-900/90 backdrop-blur-md px-4 py-3 text-xs text-gray-300">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {camera && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500">Camera</span>
                  <span>{camera}</span>
                </div>
              )}
              {lens && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500">Lens</span>
                  <span>{lens}</span>
                </div>
              )}
              {settings && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500">Settings</span>
                  <span>{settings}</span>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500">Location</span>
                  <span>{location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="absolute inset-0 z-20 hidden group-hover:flex bg-black bg-opacity-70 flex-col justify-start items-center pt-16 px-6 pb-6">
        <div className="text-left max-w-full w-full space-y-4">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white leading-tight">
              {title}
            </h3>
            {shouldShowDescription && (
              <p className="text-base text-gray-300 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}