import Head from 'next/head'
import { Article, Photo, Doc } from 'contentlayer/generated'

interface BaseMetaProps {
  title: string
  description: string
  url?: string
  siteName?: string
  author?: string
  type?: 'website' | 'article' | 'profile'
  image?: string
  imageAlt?: string
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  locale?: string
  twitterHandle?: string
}

interface ArticleMetaProps extends BaseMetaProps {
  contentType: 'article'
  content: Article
}

interface PhotoMetaProps extends BaseMetaProps {
  contentType: 'photo'
  content: Photo
}

interface DocumentMetaProps extends BaseMetaProps {
  contentType: 'document'
  content: Doc
}

interface PageMetaProps extends BaseMetaProps {
  contentType: 'page'
  content?: never
}

type MetaTagsProps = ArticleMetaProps | PhotoMetaProps | DocumentMetaProps | PageMetaProps

const DEFAULT_SITE_NAME = 'Patrick Hanford'
const DEFAULT_AUTHOR = 'Patrick Hanford'
const DEFAULT_TWITTER_HANDLE = '@phanford'
const DEFAULT_LOCALE = 'en_US'
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://phanford.dev'

export default function MetaTags({
  title,
  description,
  url,
  siteName = DEFAULT_SITE_NAME,
  author = DEFAULT_AUTHOR,
  type = 'website',
  image,
  imageAlt,
  publishedTime,
  modifiedTime,
  tags = [],
  locale = DEFAULT_LOCALE,
  twitterHandle = DEFAULT_TWITTER_HANDLE,
  contentType,
  content,
}: MetaTagsProps) {
  // Generate dynamic content based on content type
  const generateDynamicMeta = () => {
    let dynamicTitle = title
    let dynamicDescription = description
    let dynamicImage = image
    let dynamicImageAlt = imageAlt
    let dynamicPublishedTime = publishedTime
    let dynamicModifiedTime = modifiedTime
    let dynamicTags = tags
    let dynamicType = type

    switch (contentType) {
      case 'article':
        if (content) {
          dynamicTitle = content.title
          dynamicDescription = content.description || content.excerpt || description
          dynamicPublishedTime = content.published || content.date
          dynamicModifiedTime = content.date
          dynamicTags = content.tags || []
          dynamicType = 'article'
          
          // Try to extract first image from content for social sharing
          if (!dynamicImage && content.body?.raw) {
            const imageMatch = content.body.raw.match(/!\[([^\]]*)\]\(([^)]+)\)/)
            if (imageMatch) {
              dynamicImage = `${BASE_URL}/articles/${content.slugAsParams}/${imageMatch[2]}`
              dynamicImageAlt = imageMatch[1] || content.title
            }
          }
        }
        break

      case 'photo':
        if (content) {
          dynamicTitle = content.title
          dynamicDescription = content.description || `Photography by ${author}${content.location ? ` taken in ${content.location}` : ''}`
          dynamicImage = content.imageUrl?.startsWith('http') ? content.imageUrl : `${BASE_URL}${content.imageUrl}`
          dynamicImageAlt = content.title
          dynamicPublishedTime = content.date
          dynamicModifiedTime = content.date
          dynamicTags = content.tags || []
          dynamicType = 'article'
        }
        break

      case 'document':
        if (content) {
          dynamicTitle = content.title
          dynamicDescription = content.description || `${content.fileType?.toUpperCase() || 'Document'} by ${author}`
          dynamicPublishedTime = content.date
          dynamicModifiedTime = content.date
          dynamicTags = content.tags || []
          dynamicType = 'article'
        }
        break

      case 'page':
        // For general pages, use provided meta or defaults
        dynamicType = 'website'
        break
    }

    return {
      title: dynamicTitle,
      description: dynamicDescription,
      image: dynamicImage,
      imageAlt: dynamicImageAlt,
      publishedTime: dynamicPublishedTime,
      modifiedTime: dynamicModifiedTime,
      tags: dynamicTags,
      type: dynamicType,
    }
  }

  const meta = generateDynamicMeta()
  const fullUrl = url || (typeof window !== 'undefined' ? window.location.href : BASE_URL)
  const fullTitle = `${meta.title} | ${siteName}`

  const generateStructuredData = () => {
    const baseStructuredData: any = {
      '@context': 'https://schema.org',
      '@type': contentType === 'article' ? 'Article' : contentType === 'photo' ? 'Photograph' : 'WebPage',
      headline: meta.title,
      description: meta.description,
      url: fullUrl,
      author: {
        '@type': 'Person',
        name: author,
      },
    }

    if (meta.image) {
      baseStructuredData.image = meta.image
    }

    if (meta.publishedTime) {
      baseStructuredData.datePublished = meta.publishedTime
    }

    if (meta.modifiedTime) {
      baseStructuredData.dateModified = meta.modifiedTime
    }

    if (contentType === 'photo' && content) {
      return {
        ...baseStructuredData,
        '@type': 'Photograph',
        contentLocation: content.location,
        exifData: {
          camera: content.camera,
          lens: content.lens,
          settings: content.settings,
        },
      }
    }

    if (contentType === 'article' && content) {
      return {
        ...baseStructuredData,
        '@type': 'Article',
        wordCount: content.body?.raw?.split(/\s+/).length || 0,
        timeRequired: `PT${content.readingTime || 5}M`,
        keywords: meta.tags.join(', '),
      }
    }

    return baseStructuredData
  }

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={meta.description} />
      <meta name="author" content={author} />
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      
      {/* Keywords */}
      {meta.tags.length > 0 && (
        <meta name="keywords" content={meta.tags.join(', ')} />
      )}

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:type" content={meta.type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {meta.image && (
        <>
          <meta property="og:image" content={meta.image} />
          <meta property="og:image:alt" content={meta.imageAlt || meta.title} />
          <meta property="og:image:width" content={contentType === 'photo' && content?.naturalWidth ? content.naturalWidth.toString() : "1200"} />
          <meta property="og:image:height" content={contentType === 'photo' && content?.naturalHeight ? content.naturalHeight.toString() : "630"} />
        </>
      )}

      {meta.publishedTime && (
        <meta property="article:published_time" content={meta.publishedTime} />
      )}

      {meta.modifiedTime && (
        <meta property="article:modified_time" content={meta.modifiedTime} />
      )}

      {meta.tags.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={meta.image ? "summary_large_image" : "summary"} />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={meta.description} />
      
      {meta.image && (
        <meta name="twitter:image" content={meta.image} />
      )}

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={fullUrl} />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData()),
        }}
      />
    </Head>
  )
}