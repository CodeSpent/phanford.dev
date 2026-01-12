/**
 * Centralized Open Graph image resolution utility
 * Provides consistent OG image handling across all content types
 */

export type ContentType = 'article' | 'project' | 'photo' | 'document'

const FALLBACK_IMAGES: Record<ContentType | 'default', string> = {
  article: '/og-blog.svg',
  project: '/og-projects.svg',
  photo: '/og-photography.svg',
  document: '/og-documents.svg',
  default: '/og-default.svg',
}

interface OGImageOptions {
  contentType: ContentType
  /** Explicit header image from frontmatter */
  headerImage?: string | null
  /** Raw MDX content to extract image from */
  mdxContent?: string | null
  /** Project icon path */
  icon?: string | null
  /** Project screenshots array */
  screenshots?: string[] | null
  /** Photo image URL */
  imageUrl?: string | null
  /** Content slug for path construction */
  slug?: string
}

/**
 * Extracts the first markdown image from MDX content
 * Returns relative path if found, null otherwise
 */
function extractImageFromMDX(content: string): string | null {
  // Match markdown image syntax: ![alt](path)
  const imageMatch = content.match(/!\[([^\]]*)\]\(([^)]+)\)/)
  if (imageMatch && imageMatch[2]) {
    return imageMatch[2]
  }
  return null
}

/**
 * Resolves the OG image URL based on content type and available data
 * Uses priority-based fallback chain specific to each content type
 */
export function getOGImageUrl(options: OGImageOptions): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.phanford.dev'
  const { contentType, headerImage, mdxContent, icon, screenshots, imageUrl, slug } = options

  switch (contentType) {
    case 'article': {
      // Priority: headerImage > extracted MDX image > fallback
      if (headerImage) {
        // headerImage can be absolute URL or relative path
        return headerImage.startsWith('http') ? headerImage : `${baseUrl}${headerImage}`
      }
      if (mdxContent) {
        const extracted = extractImageFromMDX(mdxContent)
        if (extracted) {
          // Extracted images are relative to the article directory
          if (extracted.startsWith('http')) {
            return extracted
          }
          return `${baseUrl}/articles/${slug}/${extracted}`
        }
      }
      return `${baseUrl}${FALLBACK_IMAGES.article}`
    }

    case 'project': {
      // Priority: first screenshot > icon > fallback
      if (screenshots && screenshots.length > 0) {
        const screenshot = screenshots[0]
        return screenshot.startsWith('http') ? screenshot : `${baseUrl}${screenshot}`
      }
      if (icon) {
        return icon.startsWith('http') ? icon : `${baseUrl}${icon}`
      }
      return `${baseUrl}${FALLBACK_IMAGES.project}`
    }

    case 'photo': {
      // Priority: imageUrl > fallback
      if (imageUrl) {
        return imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`
      }
      return `${baseUrl}${FALLBACK_IMAGES.photo}`
    }

    case 'document': {
      // Priority: headerImage > extracted MDX image > fallback
      if (headerImage) {
        return headerImage.startsWith('http') ? headerImage : `${baseUrl}${headerImage}`
      }
      if (mdxContent) {
        const extracted = extractImageFromMDX(mdxContent)
        if (extracted) {
          if (extracted.startsWith('http')) {
            return extracted
          }
          return `${baseUrl}/documents/${slug}/${extracted}`
        }
      }
      return `${baseUrl}${FALLBACK_IMAGES.document}`
    }

    default:
      return `${baseUrl}${FALLBACK_IMAGES.default}`
  }
}

/**
 * Get the fallback OG image for a content type
 */
export function getFallbackOGImage(contentType?: ContentType): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.phanford.dev'
  const path = contentType ? FALLBACK_IMAGES[contentType] : FALLBACK_IMAGES.default
  return `${baseUrl}${path}`
}
