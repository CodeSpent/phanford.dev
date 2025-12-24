import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { TechStackIcons } from './TechStackIcons'
import { formatRelativeTime } from '../../utils/formatDate'

type Props = {
  slug: string
  title: string
  shortDescription: string
  category: string
  technologies?: string[]
  languages?: string[]
  icon?: string | null
  version?: string
  lastUpdated?: string | Date
}

export default function ProjectCard({
  slug,
  title,
  shortDescription,
  category,
  technologies = [],
  languages = [],
  icon,
  version,
  lastUpdated,
}: Props) {
  const url = slug && slug.startsWith('/') ? `/projects${slug}` : `/projects/${slug || ''}`

  return (
    <Link href={url}>
      <div className="h-full bg-card-background group rounded-xl border border-gray-800/50 transition-all duration-200 hover:border-gray-700 hover:shadow-lg hover:shadow-gray-900/20 cursor-pointer overflow-hidden">
        <div className="p-6 flex flex-col h-full">
          {/* Header with icon, title, and version */}
          <div className="flex items-start gap-4 mb-4">
            {icon && (
              <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-800/50 border border-gray-700/50">
                <Image
                  src={icon}
                  alt={`${title} icon`}
                  width={48}
                  height={48}
                  className="object-contain w-full h-full"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-xl font-bold text-gray-100 group-hover:text-white">
                  {title}
                </h3>
                {version && (
                  <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {version}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 font-medium">{category}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-400 group-hover:text-gray-300 line-clamp-3 leading-relaxed mb-4 flex-grow">
            {shortDescription}
          </p>

          {/* Footer with tech stack icons and last updated */}
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-800/50">
            <TechStackIcons
              technologies={technologies}
              languages={languages}
              maxIcons={3}
            />
            {lastUpdated && (
              <span className="text-xs text-gray-500 whitespace-nowrap">
                Updated {formatRelativeTime(lastUpdated)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
