import React from 'react'
import { IconType } from 'react-icons'
import {
  SiReact,
  SiNodedotjs,
  SiTypescript,
  SiJavascript,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiNextdotjs,
  SiTailwindcss,
  SiVercel,
  SiPrisma,
  SiDocker,
  SiKubernetes,
  SiPython,
  SiGo,
  SiRust,
  SiVuedotjs,
  SiAngular,
  SiExpress,
  SiNestjs,
  SiGraphql,
  SiMysql,
  SiSqlite,
  SiAmazon,
  SiGooglecloud,
  SiGit,
  SiDiscord,
  SiVite,
} from 'react-icons/si'
import { formatTag } from '../../utils/formatTag'

// Map technology names to their corresponding icons
const techIconMap: Record<string, IconType> = {
  // Frontend
  react: SiReact,
  'react.js': SiReact,
  nextjs: SiNextdotjs,
  'next.js': SiNextdotjs,
  vue: SiVuedotjs,
  'vue.js': SiVuedotjs,
  angular: SiAngular,

  // Backend
  nodejs: SiNodedotjs,
  'node.js': SiNodedotjs,
  node: SiNodedotjs,
  express: SiExpress,
  'express.js': SiExpress,
  nestjs: SiNestjs,
  graphql: SiGraphql,

  // Languages
  typescript: SiTypescript,
  javascript: SiJavascript,
  python: SiPython,
  go: SiGo,
  rust: SiRust,

  // Databases
  mongodb: SiMongodb,
  postgresql: SiPostgresql,
  postgres: SiPostgresql,
  redis: SiRedis,
  mysql: SiMysql,
  sqlite: SiSqlite,

  // Styling
  tailwind: SiTailwindcss,
  'tailwind css': SiTailwindcss,
  tailwindcss: SiTailwindcss,

  // Tools & Platforms
  prisma: SiPrisma,
  vercel: SiVercel,
  docker: SiDocker,
  kubernetes: SiKubernetes,
  aws: SiAmazon,
  gcp: SiGooglecloud,
  'google cloud': SiGooglecloud,
  git: SiGit,
  discord: SiDiscord,
  'discord.js': SiDiscord,
  vite: SiVite,
}

// Get icon component for a technology name (case-insensitive)
function getTechIcon(techName: string): IconType | null {
  const normalizedName = techName.toLowerCase().trim()
  return techIconMap[normalizedName] || null
}

type UnifiedTagProps = {
  tag: string
  variant?: 'default' | 'compact'
  className?: string
}

/**
 * UnifiedTag - Renders a tag as an icon (if tech tag) or styled text (if not)
 * Uses consistent styling across both icon and text representations
 */
export function UnifiedTag({ tag, variant = 'default', className = '' }: UnifiedTagProps) {
  const Icon = getTechIcon(tag)

  // If we have an icon for this tag, render as icon with tooltip
  if (Icon) {
    return (
      <div className={`group/icon relative ${className}`}>
        <Icon className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors" />
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-gray-200 text-xs rounded opacity-0 group-hover/icon:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-gray-700/50 z-10">
          {formatTag(tag)}
        </div>
      </div>
    )
  }

  // Otherwise, render as styled text tag
  const baseClasses = 'font-medium rounded-md transition-colors'

  const variantClasses = {
    default: 'px-3 py-1.5 text-sm bg-gray-800/60 text-gray-300 hover:bg-gray-700/60',
    compact: 'px-2 py-1 text-xs bg-gray-800/60 text-gray-300 hover:bg-gray-700/60',
  }

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {formatTag(tag)}
    </span>
  )
}

type UnifiedTagListProps = {
  tags: string[]
  variant?: 'default' | 'compact'
  maxVisible?: number
  className?: string
}

/**
 * UnifiedTagList - Renders a list of tags with consistent spacing
 * Automatically uses icons for tech tags and text for other tags
 */
export function UnifiedTagList({
  tags,
  variant = 'default',
  maxVisible,
  className = '',
}: UnifiedTagListProps) {
  if (!Array.isArray(tags) || tags.length === 0) {
    return null
  }

  const visibleTags = maxVisible ? tags.slice(0, maxVisible) : tags
  const remainingCount = maxVisible && tags.length > maxVisible ? tags.length - maxVisible : 0

  return (
    <div className={`flex items-center flex-wrap gap-2 ${className}`}>
      {visibleTags.map((tag, index) => (
        <UnifiedTag key={index} tag={tag} variant={variant} />
      ))}
      {remainingCount > 0 && (
        <span
          className={`${variant === 'compact' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'} font-medium rounded-md bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 transition-colors`}
        >
          +{remainingCount}
        </span>
      )}
    </div>
  )
}
