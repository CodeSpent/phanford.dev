'use client'

import React from 'react'
import { SidebarModule } from '../content/SidebarModule'
import {
  ServerIcon,
  StarIcon,
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChatAltIcon,
  ChevronUpIcon
} from '@heroicons/react/outline'

interface ProjectStat {
  label: string
  value: number | string
  icon?: string // Icon identifier: 'server', 'star', 'github', 'chevron-up', 'users', 'document', 'chat', 'chart'
  iconColor?: string // Tailwind color class like 'text-blue-400', 'text-green-400'
  link?: string // Optional URL to make the stat clickable
}

interface ProjectStatsModuleProps {
  stats: ProjectStat[]
  lastUpdated?: string // ISO date string
  className?: string
}

// Icon mapping with default colors
const iconMap: Record<string, { icon: React.ComponentType<any>, defaultColor: string }> = {
  'server': { icon: ServerIcon, defaultColor: 'text-blue-400' },
  'star': { icon: StarIcon, defaultColor: 'text-yellow-400' },
  'github': { icon: StarIcon, defaultColor: 'text-gray-300' },
  'chevron-up': { icon: ChevronUpIcon, defaultColor: 'text-green-400' },
  'users': { icon: UserGroupIcon, defaultColor: 'text-purple-400' },
  'document': { icon: DocumentTextIcon, defaultColor: 'text-orange-400' },
  'chat': { icon: ChatAltIcon, defaultColor: 'text-indigo-400' },
  'chart': { icon: ChartBarIcon, defaultColor: 'text-emerald-400' },
}

/**
 * ProjectStatsModule Component
 *
 * Displays custom project statistics in a clean grid format with color-coded icons.
 * Shows metrics like server count, votes, organizations, stories, etc.
 * Includes a "Last Updated" timestamp at the bottom.
 * Designed to give stats prominence and breathing room.
 */
export const ProjectStatsModule: React.FC<ProjectStatsModuleProps> = ({
  stats,
  lastUpdated,
  className = '',
}) => {
  if (!stats || stats.length === 0) return null

  // Determine grid columns based on stat count
  const gridCols = stats.length === 1 ? 'grid-cols-1' :
                   stats.length === 2 ? 'grid-cols-2' :
                   'grid-cols-2 lg:grid-cols-3'

  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <SidebarModule title="Stats" className={className}>
      <div className={`grid ${gridCols} gap-4`}>
        {stats.map((stat, index) => {
          const iconConfig = stat.icon ? iconMap[stat.icon] : null
          const IconComponent = iconConfig?.icon
          const iconColor = stat.iconColor || iconConfig?.defaultColor || 'text-gray-400'

          const content = (
            <>
              <div className="flex items-center justify-center mb-1">
                <div className="text-xl font-semibold text-white leading-tight">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </div>
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide leading-tight text-center">
                {stat.label}
              </div>
            </>
          )

          if (stat.link) {
            return (
              <a
                key={index}
                href={stat.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer group"
              >
                {content}
              </a>
            )
          }

          return (
            <div key={index} className="flex flex-col items-center px-3 py-2">
              {content}
            </div>
          )
        })}
      </div>

      {formattedDate && (
        <div className="mt-3 pt-3 border-t border-gray-800 flex justify-end">
          <span className="text-xs text-gray-500">
            Updated <span className="text-gray-400">{formattedDate}</span>
          </span>
        </div>
      )}
    </SidebarModule>
  )
}
