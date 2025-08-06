import React, { useEffect, useRef } from 'react'
import { useArticleListContext } from 'constants/article-list-context/article-list-context'
import ArticleCard from 'components/blog/ArticleCard'
import PhotoCard from 'components/blog/PhotoCard'
import { DataSourceType } from 'constants/data-sources'

type Props = {
  dataSource?: DataSourceType
  onPhotoClick?: (photo: any) => void
}

export default function ArticleList({ dataSource = 'blog', onPhotoClick }: Props) {
  const { articlesToDisplay } = useArticleListContext()
  const masonryRef = useRef<HTMLDivElement>(null)
  const masonryInstance = useRef<any>(null)

  // Initialize Masonry for photos
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    if (dataSource === 'photos' && masonryRef.current && articlesToDisplay.length > 0) {
      // Dynamically import Masonry to avoid SSR issues
      import('masonry-layout').then((MasonryModule) => {
        const Masonry = MasonryModule.default

        // Destroy existing instance
        if (masonryInstance.current) {
          masonryInstance.current.destroy()
        }

        // Initialize new Masonry instance
        masonryInstance.current = new Masonry(masonryRef.current, {
          itemSelector: '.masonry-item',
          columnWidth: 400,
          gutter: 16,
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
  }, [dataSource, articlesToDisplay])

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
    
    // Create variety through multiple factors
    const hash = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
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
  if (dataSource === 'photos') {
    return (
      <div ref={masonryRef} className="my-4">
        {Array.isArray(articlesToDisplay) && articlesToDisplay.map((article, index) => {
          const naturalSize = getNaturalImageSize(article.slug, (article as any).orientation, index)
          return (
            <div key={index} className="masonry-item">
              <PhotoCard
                slug={article.slug}
                publishedDateTime={article.datetime}
                publishedDate={article.date}
                title={article.title}
                description={article.description}
                tags={article.tags}
                imageUrl={(article as any).imageUrl}
                location={(article as any).location}
                camera={(article as any).camera}
                lens={(article as any).lens}
                settings={(article as any).settings}
                category={(article as any).category}
                orientation={(article as any).orientation}
                naturalWidth={naturalSize.width}
                naturalHeight={naturalSize.height}
                onClick={() => onPhotoClick?.(article)}
              />
            </div>
          )
        })}
      </div>
    )
  }

  // For non-photo content, keep the grid layout
  return (
    <div className="my-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4 auto-rows-fr">
      {Array.isArray(articlesToDisplay) && articlesToDisplay.map((article, index) => {
        const mosaicClasses = getMosaicClasses(index)
        return (
          <div key={index} className={`${mosaicClasses} md:${mosaicClasses}`}>
            <ArticleCard
              slug={article.slug}
              publishedDateTime={article.datetime}
              publishedDate={article.date}
              title={article.title}
              description={article.description}
              tags={article.tags}
              readingTime={(article as any).readingTime}
            />
          </div>
        )
      })}
    </div>
  )
}
