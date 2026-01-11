import React, { useEffect, useRef, useState } from 'react'
import { useDataItemListContext } from 'constants/data-item-context/data-item-context'
import ArticleCard from 'components/blog/ArticleCard'
import PhotoCard from 'components/blog/PhotoCard'
import DocumentCard from 'components/blog/DocumentCard'
import ProjectCard from 'components/blog/ProjectCard'
import { DataSourceType } from 'constants/data-sources'

type Props = {
  dataSource?: DataSourceType
  onItemClick?: (item: any) => void
}

export default function DataItemList({ dataSource = 'blog', onItemClick }: Props) {
  const { itemsToDisplay } = useDataItemListContext()
  const masonryRef = useRef<HTMLDivElement>(null)
  const masonryInstance = useRef<any>(null)
  const [columnWidth, setColumnWidth] = useState(400)
  const gutter = 16

  // Calculate responsive column width based on container size
  useEffect(() => {
    if (typeof window === 'undefined' || dataSource !== 'photography') return

    const calculateColumnWidth = () => {
      const containerWidth = masonryRef.current?.parentElement?.clientWidth || 1200

      // Determine column count based on width
      let columns = 1
      if (containerWidth >= 1024) columns = 3
      else if (containerWidth >= 768) columns = 2

      // Calculate column width to fill available space
      const totalGutters = (columns - 1) * gutter
      const width = Math.floor((containerWidth - totalGutters) / columns)
      setColumnWidth(width)
    }

    calculateColumnWidth()
    window.addEventListener('resize', calculateColumnWidth)
    return () => window.removeEventListener('resize', calculateColumnWidth)
  }, [dataSource])

  // Initialize Masonry for photos
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    if (dataSource === 'photography' && masonryRef.current && itemsToDisplay.length > 0) {
      // Dynamically import Masonry to avoid SSR issues
      import('masonry-layout').then((MasonryModule) => {
        const Masonry = MasonryModule.default

        // Destroy existing instance
        if (masonryInstance.current) {
          masonryInstance.current.destroy()
        }

        // Initialize new Masonry instance
        if (!masonryRef.current) return
        masonryInstance.current = new Masonry(masonryRef.current, {
          itemSelector: '.masonry-item',
          columnWidth: columnWidth,
          gutter: gutter,
          fitWidth: true
        })

        // Layout after images load
        const images = masonryRef.current!.querySelectorAll('img')
        let loadedImages = 0
        const totalImages = images.length

        if (totalImages === 0) {
          masonryInstance.current.layout()
        } else {
          images.forEach((img) => {
            if (img.complete) {
              loadedImages++
              if (loadedImages === totalImages) {
                masonryInstance.current?.layout()
              }
            } else {
              img.addEventListener('load', () => {
                loadedImages++
                if (loadedImages === totalImages) {
                  masonryInstance.current?.layout()
                }
              })
            }
          })
        }
      }).catch((error) => {
        console.error('Failed to load Masonry:', error)
      })
    }

    // Cleanup
    return () => {
      if (masonryInstance.current) {
        masonryInstance.current.destroy()
        masonryInstance.current = null
      }
    }
  }, [dataSource, itemsToDisplay, columnWidth, gutter])

  // Function to determine mosaic layout classes based on index for non-photo content
  const getMosaicClasses = (index: number) => {
    const patterns = [
      'col-span-1 row-span-1', // Regular card
      'md:col-span-2 row-span-1', // Wide card on medium+ screens
      'col-span-1 md:row-span-2', // Tall card on medium+ screens
      'col-span-1 row-span-1', // Regular card
      'col-span-1 row-span-1', // Regular card
      'md:col-span-2 md:row-span-2', // Large card on medium+ screens
    ]
    return patterns[index % patterns.length]
  }

  // Function to get natural image dimensions for Flexbox mosaic
  const getNaturalImageSize = (slug: string, orientation?: string, index: number = 0) => {
    const isLandscape = orientation === 'landscape'

    // Create variety through multiple factors - guard against undefined slug
    const safeSlug = slug || ''
    const hash = safeSlug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const sizeVariant = hash % 3 // 0, 1, or 2 for size variety
    const positionVariant = index % 4 // Position-based variety

    // Base sizes for natural flow
    const baseSizes = {
      landscape: [
        { width: 400, height: 240 }, // Small landscape (5:3 ratio)
        { width: 500, height: 300 }, // Medium landscape (5:3 ratio)
        { width: 600, height: 360 }  // Large landscape (5:3 ratio)
      ],
      portrait: [
        { width: 280, height: 420 }, // Small portrait (2:3 ratio)
        { width: 320, height: 480 }, // Medium portrait (2:3 ratio)
        { width: 360, height: 540 }  // Large portrait (2:3 ratio)
      ]
    }

    // Add some randomness based on position for more organic feel
    const positionMultipliers = [1.0, 1.2, 0.9, 1.1]
    const multiplier = positionMultipliers[positionVariant]

    const baseSize = isLandscape ? baseSizes.landscape[sizeVariant] : baseSizes.portrait[sizeVariant]

    return {
      width: Math.round(baseSize.width * multiplier),
      height: Math.round(baseSize.height * multiplier)
    }
  }

  // For photos, use Masonry layout
  if (dataSource === 'photography') {
    return (
      <div ref={masonryRef} className="masonry-item__container my-4 min-h-[600px]">
        {Array.isArray(itemsToDisplay) && itemsToDisplay.map((item, index) => {
          const naturalSize = getNaturalImageSize(item.slug || '', (item as any).orientation, index)
          return (
            <div key={index} className="masonry-item">
              <PhotoCard
                slug={item.slug || ''}
                publishedDateTime={item.datetime || ''}
                publishedDate={item.date || ''}
                title={item.title || ''}
                description={item.description || ''}
                tags={item.tags || []}
                imageUrl={(item as any).imageUrl}
                blurDataUrl={(item as any).blurDataUrl}
                location={(item as any).location}
                camera={(item as any).camera}
                lens={(item as any).lens}
                settings={(item as any).settings}
                category={(item as any).category}
                orientation={(item as any).orientation}
                naturalWidth={naturalSize.width}
                naturalHeight={naturalSize.height}
                cardWidth={columnWidth}
                onClick={() => onItemClick?.(item)}
              />
            </div>
          )
        })}
      </div>
    )
  }

  // For non-photo content, keep the grid layout
  return (
    <div className="my-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4 auto-rows-auto min-h-[600px]">
      {Array.isArray(itemsToDisplay) && itemsToDisplay.map((item, index) => {
        const mosaicClasses = getMosaicClasses(index)
        return (
          <div key={index} className={`${mosaicClasses} md:${mosaicClasses}`}>
            {dataSource === 'documents' ? (
              <DocumentCard
                slug={item.slug || ''}
                title={item.title || ''}
                description={item.description || ''}
                date={item.date || ''}
                tags={item.tags || []}
                category={(item as any).category}
                fileType={(item as any).fileType}
                pageCount={(item as any).pageCount || Math.max(1, Math.ceil(((item as any).readingTime || 5) / 2.5))}
              />
            ) : dataSource === 'projects' ? (
              <ProjectCard
                slug={item.slug || ''}
                title={item.title || ''}
                shortDescription={(item as any).shortDescription || item.description || ''}
                category={(item as any).category || 'Software'}
                technologies={(item as any).technologies || []}
                languages={(item as any).languages || []}
                icon={(item as any).icon}
                version={(item as any).version}
                lastUpdated={(item as any).lastUpdated}
              />
            ) : (
              <ArticleCard
                slug={item.slug || ''}
                publishedDateTime={item.datetime || ''}
                publishedDate={item.date || ''}
                title={item.title || ''}
                description={item.description || ''}
                tags={item.tags || []}
                readingTime={(item as any).readingTime}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
