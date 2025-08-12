import Link from 'next/link'
import React from 'react'
import { formatTag } from '../../utils/formatTag'
import { formatDate, formatDateTimeAttribute } from '../../utils/formatDate'

type Props = {
  slug: string
  title: string
  description?: string
  date?: string
  tags?: string[]
  category?: string
  fileType?: string
  pageCount?: number
}

// Document type icons mapping with enhanced colors and styling
const getDocumentIcon = (fileType?: string) => {
  switch (fileType?.toLowerCase()) {
    case 'pdf':
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 group-hover:from-red-500/30 group-hover:to-red-600/30 group-hover:border-red-500/50 transition-all duration-200">
          <svg className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        </div>
      )
    case 'docx':
    case 'doc':
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 group-hover:from-blue-500/30 group-hover:to-blue-600/30 group-hover:border-blue-500/50 transition-all duration-200">
          <svg className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm6 2a1 1 0 01-1-1V3a1 1 0 011 1v2zM7 8a1 1 0 000 2h6a1 1 0 100-2H7zm0 4a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        </div>
      )
    case 'mdx':
    case 'md':
    case 'markdown':
    default:
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 group-hover:from-emerald-500/30 group-hover:to-emerald-600/30 group-hover:border-emerald-500/50 transition-all duration-200">
          <svg className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 3a1 1 0 000 2h.01a1 1 0 100-2H5zm0 3a1 1 0 000 2h6a1 1 0 100-2H5zm0 3a1 1 0 100 2h6a1 1 0 100-2H5z" clipRule="evenodd" />
          </svg>
        </div>
      )
  }
}

const getFileTypeLabel = (fileType?: string) => {
  switch (fileType?.toLowerCase()) {
    case 'pdf':
      return 'PDF'
    case 'docx':
    case 'doc':
      return 'Word'
    case 'mdx':
    case 'md':
    case 'markdown':
      return 'Markdown'
    default:
      return 'Document'
  }
}

export default function DocumentCard({
  slug,
  title,
  description,
  date,
  tags,
  category,
  fileType,
  pageCount,
}: Props) {
  const url = slug && slug.startsWith('/') ? `/documents${slug}` : `/documents/${(slug || '')}`
  
  // Truncate description for more compact cards
  const truncatedDescription = description && description.length > 120 
    ? description.substring(0, 120) + '...' 
    : description || 'Document'

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: window.location.origin + url,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin + url)
    }
  }

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(url, '_blank')
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // For now, just open the document - in a real implementation,
    // you might have direct download links for PDF/DOCX files
    window.open(url, '_blank')
  }

  return (
    <Link href={url}>
      <div
        className={`h-full bg-card-background group rounded-xl border border-gray-800/50 
        transition-all duration-300 hover:border-gray-600 hover:shadow-xl hover:shadow-gray-900/30 
        hover:scale-[1.02] hover:-translate-y-1 flex flex-col cursor-pointer overflow-hidden
        backdrop-blur-sm bg-gradient-to-br from-card-background to-card-background/80`}
      >
        <div className="p-5 flex flex-col h-full">
          {/* Header with file type and tags */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 text-gray-400">
              {getDocumentIcon(fileType)}
              <span className="text-xs font-medium">{getFileTypeLabel(fileType)}</span>
            </div>
            {Array.isArray(tags) && tags.length > 0 && (
              <div className="flex gap-1">
                {tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs font-medium rounded-md bg-gray-800/60 
                    text-gray-300 group-hover:bg-gray-700/60"
                  >
                    {formatTag(tag)}
                  </span>
                ))}
                {tags.length > 2 && (
                  <span className="px-2 py-1 text-xs font-medium rounded-md bg-gray-800/60 
                  text-gray-400">
                    +{tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Title with enhanced typography */}
          <h3 className="text-xl font-bold text-gray-200 group-hover:text-white 
          mb-3 line-clamp-2 leading-tight tracking-tight transition-colors duration-200">
            {title}
          </h3>

          {/* Description with improved spacing */}
          <p className="text-sm text-gray-400 group-hover:text-gray-300 line-clamp-3 leading-relaxed flex-grow mb-4 transition-colors duration-200">
            {truncatedDescription}
          </p>

          {/* Footer with date, page count, and toolbar */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              {date && (
                <time dateTime={formatDateTimeAttribute(date)}>
                  {formatDate(date, { format: 'medium' })}
                </time>
              )}
              {pageCount && date && (
                <span className="text-gray-600">•</span>
              )}
              {pageCount && (
                <span>{pageCount} page{pageCount !== 1 ? 's' : ''}</span>
              )}
            </div>

            {/* Enhanced Toolbar with backdrop blur */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
              <div className="flex items-center gap-1 bg-black/20 backdrop-blur-sm rounded-lg p-1 border border-gray-700/50">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-md hover:bg-white/10 text-gray-400 hover:text-blue-400 transition-all duration-200 hover:scale-110 active:scale-95"
                  title="Share document"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
                <button
                  onClick={handlePrint}
                  className="p-2 rounded-md hover:bg-white/10 text-gray-400 hover:text-emerald-400 transition-all duration-200 hover:scale-110 active:scale-95"
                  title="Print document"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-md hover:bg-white/10 text-gray-400 hover:text-purple-400 transition-all duration-200 hover:scale-110 active:scale-95"
                  title="Download document"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}