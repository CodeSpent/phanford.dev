'use client'

import React from 'react'
import { SidebarModule } from './SidebarModule'
import { CTAButton, CTAButtonConfig } from '../common/CTAButton'

interface CallToAction {
  label: string
  url: string
  variant?: 'primary' | 'secondary'
  icon?: React.ReactNode | string
}

interface PackageInfoModuleProps {
  version?: string
  latestRelease?: {
    version: string
    date: string
    url?: string
  }
  repository?: string
  packageManager?: 'npm' | 'pypi' | 'maven' | 'nuget' | 'cargo' | 'other'
  packageUrl?: string
  downloads?: string
  license?: string
  lastCommit?: {
    date: string
    message?: string
    sha?: string
    url?: string
    author?: string
  }
  ctaButtons?: CallToAction[]
  className?: string
}

/**
 * Package Information Module
 * Displays package metadata like version, releases, downloads, license, and commits
 * Useful for open-source projects, npm packages, Discord bots, etc.
 */
export const PackageInfoModule: React.FC<PackageInfoModuleProps> = ({
  version,
  latestRelease,
  repository,
  packageManager,
  packageUrl,
  downloads,
  license,
  lastCommit,
  ctaButtons = [],
  className = '',
}) => {
  // Don't render if no data is provided
  if (
    !version &&
    !latestRelease &&
    !repository &&
    !packageUrl &&
    !downloads &&
    !license &&
    !lastCommit
  ) {
    return null
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  return (
    <SidebarModule title="Package Info" className={className}>
      <div className="space-y-3 text-sm">
        {/* Current Version */}
        {version && (
          <div className="pl-3">
            <div className="text-xs text-gray-500 mb-1">Current Version</div>
            <div className="font-mono font-semibold text-green-400">v{version}</div>
          </div>
        )}

        {/* Latest Release */}
        {latestRelease && (
          <div className="pl-3">
            <div className="text-xs text-gray-500 mb-1">Latest Release</div>
            {latestRelease.url ? (
              <a
                href={latestRelease.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-blue-400 hover:text-blue-300 transition-colors"
              >
                v{latestRelease.version}
              </a>
            ) : (
              <div className="font-mono text-gray-300">v{latestRelease.version}</div>
            )}
            <div className="text-xs text-gray-500 mt-0.5">
              {formatDate(latestRelease.date)}
            </div>
          </div>
        )}

        {/* Package Manager Link */}
        {packageUrl && packageManager && (
          <div className="pl-3">
            <div className="text-xs text-gray-500 mb-1">Package</div>
            <a
              href={packageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span className="capitalize">{packageManager}</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        )}

        {/* Downloads */}
        {downloads && (
          <div className="pl-3">
            <div className="text-xs text-gray-500 mb-1">Downloads</div>
            <div className="text-gray-300 font-semibold">{downloads}</div>
          </div>
        )}

        {/* License */}
        {license && (
          <div className="pl-3">
            <div className="text-xs text-gray-500 mb-1">License</div>
            <div className="text-gray-300">{license}</div>
          </div>
        )}

        {/* Repository */}
        {repository && (
          <div className="pl-3">
            <div className="text-xs text-gray-500 mb-1">Repository</div>
            <a
              href={repository}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors break-all"
            >
              <span className="text-xs">{repository.replace(/^https?:\/\//, '')}</span>
              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        )}

        {/* Last Commit */}
        {lastCommit && (
          <div className="pl-3">
            <div className="text-xs text-gray-500 mb-1">Last Commit</div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 space-y-2">
              {lastCommit.url ? (
                <a
                  href={lastCommit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  {lastCommit.message && (
                    <div className="text-xs text-gray-300 group-hover:text-blue-400 transition-colors font-medium line-clamp-2 mb-2">
                      {lastCommit.message}
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {lastCommit.author && (
                        <span className="text-xs text-gray-400 truncate">{lastCommit.author}</span>
                      )}
                      {lastCommit.sha && (
                        <code className="text-xs font-mono text-gray-500 group-hover:text-blue-400 transition-colors">
                          {lastCommit.sha.substring(0, 7)}
                        </code>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(lastCommit.date)}
                    </div>
                  </div>
                </a>
              ) : (
                <>
                  {lastCommit.message && (
                    <div className="text-xs text-gray-300 font-medium line-clamp-2 mb-2">
                      {lastCommit.message}
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {lastCommit.author && (
                        <span className="text-xs text-gray-400 truncate">{lastCommit.author}</span>
                      )}
                      {lastCommit.sha && (
                        <code className="text-xs font-mono text-gray-500">
                          {lastCommit.sha.substring(0, 7)}
                        </code>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(lastCommit.date)}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CTA Buttons - Bottom */}
      {ctaButtons.length > 0 && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
          {ctaButtons.map((cta, index) => (
            <CTAButton
              key={index}
              href={cta.url}
              label={cta.label}
              icon={cta.icon}
              variant={cta.variant}
            />
          ))}
        </div>
      )}
    </SidebarModule>
  )
}
