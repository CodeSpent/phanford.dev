'use client'

import React, { ReactNode } from 'react'
import type { ResumeSection, ExperienceEntry } from '../../types/latex'

interface ExperienceSectionProps {
  section: ResumeSection
  className?: string
}

/**
 * Linkify text by converting URLs and domain patterns to clickable links
 */
function linkifyText(text: string): ReactNode {
  // Pattern for URLs and domains in parentheses like (example.com)
  const urlPattern = /(https?:\/\/[^\s]+)|(\([a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}[^\s)]*\))/g

  const parts: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = urlPattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    const matched = match[0]

    if (matched.startsWith('(') && matched.endsWith(')')) {
      // Domain in parentheses like (takepoint.dev)
      const domain = matched.slice(1, -1)
      parts.push(
        <span key={match.index}>
          (
          <a
            href={`https://${domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            {domain}
          </a>
          )
        </span>
      )
    } else {
      // Full URL
      parts.push(
        <a
          key={match.index}
          href={matched}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          {matched}
        </a>
      )
    }

    lastIndex = match.index + matched.length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : text
}

export function ExperienceSection({ section, className = '' }: ExperienceSectionProps) {
  const entries = section.items.filter(
    (item): item is ExperienceEntry => item.type === 'experience'
  )

  return (
    <section className={`mb-8 ${className}`}>
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-4">
        {section.title}
        <span className="flex-1 h-px bg-gray-700" />
      </h2>

      {entries.map((entry, index) => (
        <div key={index} className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
            <h3 className="text-xl font-semibold text-white">
              {linkifyText(entry.company)}
            </h3>
            {entry.dateRange && (
              <span className="text-sm text-gray-400">
                {entry.dateRange}
              </span>
            )}
          </div>

          <p className="text-blue-400 mb-2">
            {entry.title}
            {entry.subtitle && (
              <span className="text-gray-400"> - {entry.subtitle}</span>
            )}
          </p>

          {entry.bullets.length > 0 && (
            <ul className="list-disc pl-5 text-gray-300 space-y-1">
              {entry.bullets.map((bullet, bulletIndex) => (
                <li key={bulletIndex}>{linkifyText(bullet.trim())}</li>
              ))}
            </ul>
          )}

          {entry.technologies && entry.technologies.length > 0 && (
            <p className="text-sm text-gray-400 italic mt-2">
              {entry.technologies.join(', ')}
            </p>
          )}
        </div>
      ))}
    </section>
  )
}

export default ExperienceSection
