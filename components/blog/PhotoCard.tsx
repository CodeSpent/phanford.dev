import React from 'react'
import Image from 'next/image'
import { formatTag } from '../../utils/formatTag'
import { formatPhotoDate, formatDateTimeAttribute } from '../../utils/formatDate'

type Props = {
  slug: string
  publishedDateTime: string
  publishedDate: string
  title: string
  description: string
  tags: string[]
  imageUrl: string
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
  camera,
  lens,
  settings,
  category,
  orientation,
  naturalWidth = 400,
  naturalHeight = 300,
  onClick,
}: Props) {
  // Masonry layout approach - fixed width with natural height
  const cardWidth = 400 // Fixed width for masonry
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
        <div className="flex gap-2 items-center overflow-hidden">
          {Array.isArray(tags) && tags.map((tag, index) => (
            <span
              key={index}
              className={`inline-block px-3 py-1.5 text-xs font-medium rounded-lg bg-black bg-opacity-60 
              text-gray-300 group-hover:bg-opacity-80 group-hover:text-white transition-all duration-200 flex-shrink-0`}
            >
              {formatTag(tag)}
            </span>
          ))}
        </div>
      </div>

      {(lens || settings || camera) && (
        <div className="absolute bottom-16 left-4 right-4 z-20 hidden group-hover:block">
          <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg p-2 text-xs text-gray-400">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {camera && (
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Camera:</span>
                  <span>{camera}</span>
                </div>
              )}
              {lens && (
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Lens:</span>
                  <span>{lens}</span>
                </div>
              )}
              {settings && (
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Settings:</span>
                  <span>{settings}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="absolute inset-0 hidden group-hover:flex bg-black bg-opacity-70 flex-col justify-start items-center pt-16 px-6 pb-6">
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