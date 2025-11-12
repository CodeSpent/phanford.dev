import React, { useState } from 'react'
import Image from 'next/image'
import { GitHubRelease, formatRelativeTime } from '@/lib/github-api'

interface ReleasesTimelineProps {
  releases: GitHubRelease[]
  className?: string
  maxVisible?: number
}

/**
 * ReleasesTimeline Component
 *
 * Displays GitHub releases in a timeline format with expand/collapse functionality.
 */
export const ReleasesTimeline: React.FC<ReleasesTimelineProps> = ({
  releases,
  className = '',
  maxVisible = 5,
}) => {
  const [showAll, setShowAll] = useState(false)
  const [expandedReleases, setExpandedReleases] = useState<Set<number>>(new Set())

  const visibleReleases = showAll ? releases : releases.slice(0, maxVisible)
  const hasMore = releases.length > maxVisible

  const toggleRelease = (id: number) => {
    setExpandedReleases(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const truncateBody = (body: string, maxLength: number = 200): { text: string; isTruncated: boolean } => {
    if (body.length <= maxLength) return { text: body, isTruncated: false }
    return { text: body.substring(0, maxLength) + '...', isTruncated: true }
  }

  return (
    <div className={`bg-card-background rounded-lg border border-gray-800/50 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">Releases</h3>

      <div className="space-y-4">
        {visibleReleases.map((release, index) => {
          const isExpanded = expandedReleases.has(release.id)
          const { text: bodyPreview, isTruncated } = truncateBody(release.body)

          return (
            <div key={release.id} className="relative">
              {/* Timeline line */}
              {index !== visibleReleases.length - 1 && (
                <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gray-800/50" />
              )}

              <div className="flex gap-3">
                {/* Timeline dot */}
                <div className="relative flex-shrink-0 mt-1">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      release.isPrerelease
                        ? 'bg-yellow-500/10 border-yellow-500/30'
                        : 'bg-green-500/10 border-green-500/30'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        release.isPrerelease ? 'bg-yellow-400' : 'bg-green-400'
                      }`}
                    />
                  </div>
                </div>

                {/* Release content */}
                <div className="flex-1 min-w-0 pb-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <a
                        href={release.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white font-semibold hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                      >
                        {release.name}
                        <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-700/50 text-gray-300">
                          {release.tagName}
                        </span>
                        {release.isPrerelease && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                            Pre-release
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                        <Image
                          src={release.author.avatar}
                          alt={release.author.username}
                          width={20}
                          height={20}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mb-2">
                    Released {formatRelativeTime(release.publishedAt)}
                  </p>

                  {release.body && (
                    <div>
                      <div
                        className="text-sm text-gray-300 prose prose-sm prose-invert max-w-none"
                        style={{
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word'
                        }}
                      >
                        {isExpanded ? release.body : bodyPreview}
                      </div>
                      {isTruncated && (
                        <button
                          onClick={() => toggleRelease(release.id)}
                          className="text-xs text-blue-400 hover:text-blue-300 mt-2 transition-colors"
                        >
                          {isExpanded ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {hasMore && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Show all {releases.length} releases
        </button>
      )}

      {showAll && hasMore && (
        <button
          onClick={() => setShowAll(false)}
          className="mt-4 text-sm text-gray-400 hover:text-gray-300 transition-colors"
        >
          Show less
        </button>
      )}
    </div>
  )
}
