import React from 'react'
import { CalendarIcon, ClockIcon, LinkIcon } from '@heroicons/react/solid'
import Button from '../common/Button'

type ArticleStatsCardProps = {
  title: string
  readingTime: number
  publishedDate: string
  author?: {
    name: string
    avatar?: string
    bio?: string
  }
  url?: string
  className?: string
}

export default function ArticleStatsCard({
  title,
  readingTime,
  publishedDate,
  author = {
    name: 'Patrick Hanford',
    avatar: '/images/avatar.jpg',
    bio: 'Software Engineer & Technical Writer'
  },
  url,
  className = ''
}: ArticleStatsCardProps) {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(shareUrl)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  }

  return (
    <div className={`bg-gray-900/95 backdrop-blur-sm border border-gray-800/50 rounded-xl p-3 shadow-xl ${className}`}>
      {/* Author Info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          {author.avatar ? (
            <img
              src={author.avatar}
              alt={author.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-base">
              {author.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-white font-medium text-base">{author.name}</h3>
          {author.bio && (
            <p className="text-gray-400 text-xs">{author.bio}</p>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-4 mb-3 pb-3 border-b border-gray-700/50">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <ClockIcon className="h-4 w-4" />
          <span>{readingTime} min read</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <CalendarIcon className="h-4 w-4" />
          <span>{new Date(publishedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(shareLinks.twitter, '_blank')}
          className="p-2 hover:text-blue-400"
          icon={
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          }
        >
          Twitter
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(shareLinks.linkedin, '_blank')}
          className="p-2 hover:text-blue-600"
          icon={
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          }
        >
          LinkedIn
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyLink}
          className="p-2"
          icon={<LinkIcon className="w-5 h-5" />}
        >
          Copy
        </Button>
      </div>
    </div>
  )
}