import Link from 'next/link'
import React from 'react'
import { formatTag } from '../../utils/formatTag'
import { ProjectStatusBadge } from './ProjectStatusBadge'
import Image from 'next/image'

type Props = {
  slug: string
  title: string
  shortDescription: string
  category: string
  status: string
  technologies?: string[]
  languages?: string[]
  icon?: string | null
}

export default function ProjectCard({
  slug,
  title,
  shortDescription,
  category,
  status,
  technologies = [],
  languages = [],
  icon,
}: Props) {
  const url = slug && slug.startsWith('/') ? `/projects${slug}` : `/projects/${slug || ''}`
  const allTags = [...technologies, ...languages]

  return (
    <Link href={url}>
      <div className="h-full bg-card-background group rounded-xl border border-gray-800/50 transition-all duration-200 hover:border-gray-700 hover:shadow-lg hover:shadow-gray-900/20 cursor-pointer overflow-hidden">
        <div className="p-6">
          {/* Header with icon and title */}
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
              <h3 className="text-xl font-bold text-gray-100 group-hover:text-white mb-1">
                {title}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500 font-medium">{category}</span>
                <ProjectStatusBadge status={status} />
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-400 group-hover:text-gray-300 line-clamp-3 leading-relaxed mb-4">
            {shortDescription}
          </p>

          {/* Tech Stack */}
          {allTags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {allTags.slice(0, 6).map((tag, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-800/60 text-gray-300 border border-gray-700/50"
                >
                  {formatTag(tag)}
                </span>
              ))}
              {allTags.length > 6 && (
                <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-800/60 text-gray-400 border border-gray-700/50">
                  +{allTags.length - 6} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
