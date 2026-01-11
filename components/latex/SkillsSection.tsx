'use client'

import React from 'react'
import type { ResumeSection, SkillGroup } from '../../types/latex'

interface SkillsSectionProps {
  section: ResumeSection
  className?: string
}

export function SkillsSection({ section, className = '' }: SkillsSectionProps) {
  const skillGroups = section.items.filter(
    (item): item is SkillGroup => item.type === 'skill-group'
  )

  return (
    <section className={`mb-8 ${className}`}>
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-4">
        {section.title}
        <span className="flex-1 h-px bg-gray-700" />
      </h2>

      {skillGroups.map((group, index) => (
        <p key={index} className="mb-2 text-gray-300">
          <span className="font-semibold text-gray-200">{group.category}:</span>{' '}
          {group.skills.join(', ')}
        </p>
      ))}
    </section>
  )
}

export default SkillsSection
