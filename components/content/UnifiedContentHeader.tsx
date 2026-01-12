'use client'

import React from 'react'
import Image from 'next/image'
import { CalendarIcon, ClockIcon, ExternalLinkIcon, GlobeAltIcon } from '@heroicons/react/solid'
import { TagList } from '../common/Tag'
import { SocialShareModule } from './SocialShareModule'
import { ProjectStatusBadge } from '../blog/ProjectStatusBadge'

export interface ContentLink {
  label: string
  url: string
  icon?: React.ReactNode
}

export interface ScreenshotLink {
  image: string
  url: string
  alt?: string
}

interface UnifiedContentHeaderProps {
  title: string
  description?: string
  tags?: string[]
  date?: string
  readingTime?: number
  showSocialShare?: boolean
  status?: 'active' | 'archived' | 'in-development' | 'planning'
  headerImage?: string
  imagePosition?: 'top' | 'right' | 'background'
  links?: ContentLink[]
  author?: {
    name: string
    avatar?: string
    url?: string
  }
  category?: string
  websiteUrl?: string
  version?: string
  screenshotLink?: ScreenshotLink
  startDate?: string
  endDate?: string
  className?: string
}

/**
 * Enhanced unified header component for all content types
 * Features:
 * - Tags, title with version badge, description, meta info (date/reading time)
 * - Social share buttons (Twitter, LinkedIn, Reddit, HackerNews, Facebook, Email, Copy)
 * - Status badge, category badge
 * - Optional header image (top, right, or background)
 * - External links with custom icons
 * - Author information with avatar
 * - Website URL badge with hostname display
 * - Version badge display (e.g., "v2.1.0")
 */
export const UnifiedContentHeader: React.FC<UnifiedContentHeaderProps> = ({
  title,
  description,
  tags = [],
  date,
  readingTime,
  showSocialShare = true,
  status,
  headerImage,
  imagePosition = 'right',
  links = [],
  author,
  category,
  websiteUrl,
  version,
  screenshotLink,
  startDate,
  endDate,
  className = '',
}) => {
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  const hasImage = !!headerImage
  const isBackgroundImage = imagePosition === 'background'
  const isTopImage = imagePosition === 'top'
  const isRightImage = imagePosition === 'right'
  const hasScreenshotLink = !!screenshotLink

  const headerContent = (
    <>
      {/* Top Section: Tags */}
      {tags.length > 0 && (
        <div className="mb-4">
          <TagList tags={tags} />
        </div>
      )}

      {/* Title, Status & Website URL */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-1">
          {/* Version badge at top */}
          {version && (
            <div className="mb-2">
              <span className="px-2 py-0.5 text-xs font-mono font-semibold bg-green-500/10 text-green-400 border border-green-500/20 rounded">
                v{version}
              </span>
            </div>
          )}
          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-1 pt-3">
            {title}
          </h1>
          {/* URL and Category subtext - subtle */}
          {(websiteUrl || category) && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              {websiteUrl && (
                <>
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                  >
                    <span className="font-medium">{new URL(websiteUrl).hostname}</span>
                    <ExternalLinkIcon className="h-3 w-3" />
                  </a>
                  {category && <span className="w-1 h-1 rounded-full bg-gray-600" />}
                </>
              )}
              {category && <span>{category}</span>}
            </div>
          )}
        </div>
        {status && <ProjectStatusBadge status={status} />}
      </div>

      {/* Description */}
      {description && (
        <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-6 pl-3 border-l-2 border-gray-800">
          {description}
        </p>
      )}

      {/* Meta Row: Author, Date, Reading Time */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {author && (
          <div className="flex items-center gap-2">
            {author.avatar && (
              <Image
                src={author.avatar}
                alt={author.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            {author.url ? (
              <a
                href={author.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {author.name}
              </a>
            ) : (
              <span className="text-sm font-medium text-gray-300">{author.name}</span>
            )}
          </div>
        )}

        {(formattedDate || readingTime) && author && (
          <span className="w-1 h-1 rounded-full bg-gray-600" />
        )}

        {formattedDate && (
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <CalendarIcon className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
        )}

        {readingTime && (
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <ClockIcon className="h-4 w-4" />
            <span>{readingTime} min read</span>
          </div>
        )}
      </div>

      {/* External Links */}
      {links.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600 rounded-lg transition-colors"
            >
              {link.icon}
              <span>{link.label}</span>
              <ExternalLinkIcon className="h-3.5 w-3.5 opacity-50" />
            </a>
          ))}
        </div>
      )}

      {/* Social Share - Hidden for now */}
      {/* {showSocialShare && (
        <div className="pt-4 border-t border-gray-800">
          <SocialShareModule title={title} variant="inline" />
        </div>
      )} */}
    </>
  )

  // Background image variant
  if (isBackgroundImage && hasImage) {
    return (
      <header
        className={`relative bg-card-background backdrop-blur-sm border border-gray-800/50 rounded-xl overflow-hidden ${className}`}>
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src={headerImage}
            alt={title}
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 md:p-8">{headerContent}</div>
      </header>
    )
  }

  // Top image variant
  if (isTopImage && hasImage) {
    return (
      <header
        className={`bg-card-background backdrop-blur-sm border border-gray-800/50 rounded-xl overflow-hidden ${className}`}>
        {/* Top Image */}
        <div className="relative w-full aspect-video bg-gray-900">
          <Image
            src={headerImage}
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">{headerContent}</div>
      </header>
    )
  }

  // Unified layout - consistent for all projects (with or without screenshot)
  return (
    <header className={`bg-card-background backdrop-blur-sm border border-gray-800/50 rounded-xl overflow-hidden ${className}`}>
      <div className="p-6 md:p-8">


        {/* Two-column layout: All content on left, Optional screenshot on right */}
        <div className={hasScreenshotLink ? 'grid md:grid-cols-[1fr_320px] gap-6 md:items-center' : ''}>
          {/* Left: All Content */}
          <div>
            {/* Title with inline version badge */}
            <div className="flex items-start gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {title}
              </h1>
              {version && (
                <span className="mt-1 px-2 py-0.5 text-xs font-mono font-semibold bg-green-500/10 text-green-400 border border-green-500/20 rounded whitespace-nowrap">
                  v{version}
                </span>
              )}
            </div>

            {/* URL and Category subtext */}
            {(websiteUrl || category) && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                {websiteUrl && (
                  <>
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                    >
                      <span className="font-medium">{new URL(websiteUrl).hostname}</span>
                      <ExternalLinkIcon className="h-3 w-3" />
                    </a>
                    {category && <span className="w-1 h-1 rounded-full bg-gray-600" />}
                  </>
                )}
                {category && <span>{category}</span>}
              </div>
            )}

            {/* Description */}
            {description && (
              <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-6 p-3 border-l-2 border-gray-800">
                {description}
              </p>
            )}

            {/* External Links */}
            {links.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600 rounded-lg transition-colors"
                  >
                    {link.icon}
                    <span>{link.label}</span>
                    <ExternalLinkIcon className="h-3.5 w-3.5 opacity-50" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right Screenshot Link (only if screenshotLink exists) */}
          {hasScreenshotLink && (
            <a
              href={screenshotLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition-all"
            >
              <Image
                src={screenshotLink.image}
                alt={screenshotLink.alt || title}
                width={320}
                height={240}
                className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm rounded-md p-1.5">
                <ExternalLinkIcon className="w-4 h-4 text-white drop-shadow-lg" />
              </div>
            </a>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-4">
            <TagList tags={tags} />
          </div>
        )}
      </div>
    </header>
  )
}
