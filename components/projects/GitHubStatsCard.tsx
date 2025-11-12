import React from 'react'
import Link from 'next/link'
import { GitHubRepoStats, formatNumber } from '@/lib/github-api'

interface GitHubStatsCardProps {
  stats: GitHubRepoStats
  repoUrl: string
  className?: string
}

/**
 * GitHubStatsCard Component
 *
 * Displays GitHub repository statistics in a card format.
 * Shows stars, forks, watchers, open issues, and other metadata.
 */
export const GitHubStatsCard: React.FC<GitHubStatsCardProps> = ({
  stats,
  repoUrl,
  className = '',
}) => {
  return (
    <div className={`bg-card-background rounded-lg border border-gray-800/50 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Repository Stats</h3>
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Stars */}
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div>
            <div className="text-2xl font-bold text-white">{formatNumber(stats.stars)}</div>
            <div className="text-xs text-gray-400">Stars</div>
          </div>
        </div>

        {/* Forks */}
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <div>
            <div className="text-2xl font-bold text-white">{formatNumber(stats.forks)}</div>
            <div className="text-xs text-gray-400">Forks</div>
          </div>
        </div>

        {/* Watchers */}
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
          <div>
            <div className="text-2xl font-bold text-white">{formatNumber(stats.watchers)}</div>
            <div className="text-xs text-gray-400">Watchers</div>
          </div>
        </div>

        {/* Open Issues */}
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <div className="text-2xl font-bold text-white">{formatNumber(stats.openIssues)}</div>
            <div className="text-xs text-gray-400">Issues</div>
          </div>
        </div>
      </div>

      {/* Additional info */}
      <div className="mt-4 pt-4 border-t border-gray-800/50 space-y-2 text-sm">
        {stats.language && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Primary Language</span>
            <span className="text-gray-300 font-medium">{stats.language}</span>
          </div>
        )}
        {stats.license && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400">License</span>
            <span className="text-gray-300 font-medium">{stats.license}</span>
          </div>
        )}
        {stats.topics && stats.topics.length > 0 && (
          <div>
            <span className="text-gray-400 block mb-2">Topics</span>
            <div className="flex flex-wrap gap-1">
              {stats.topics.slice(0, 5).map((topic, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-xs rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
