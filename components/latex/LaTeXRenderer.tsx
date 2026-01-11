'use client'

import React from 'react'
import type { ParsedResumeDocument, ResumeSection, ResumeSectionItem } from '../../types/latex'
import { ResumeHeader } from './ResumeHeader'
import { SkillsSection } from './SkillsSection'
import { ExperienceSection } from './ExperienceSection'

interface LaTeXRendererProps {
  document: ParsedResumeDocument
  className?: string
}

export function LaTeXRenderer({ document, className = '' }: LaTeXRendererProps) {
  return (
    <div className={`latex-document ${className}`}>
      {/* Header with contact info */}
      <ResumeHeader metadata={document.metadata} />

      {/* Render each section */}
      {document.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  )
}

interface SectionRendererProps {
  section: ResumeSection
}

function SectionRenderer({ section }: SectionRendererProps) {
  switch (section.type) {
    case 'skills':
      return <SkillsSection section={section} />
    case 'experience':
    case 'projects':
      return <ExperienceSection section={section} />
    default:
      return <GenericSection section={section} />
  }
}

interface GenericSectionProps {
  section: ResumeSection
}

function GenericSection({ section }: GenericSectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">
        {section.title}
      </h2>
      <div className="text-gray-300">
        {section.items.map((item, index) => (
          <div key={index} className="mb-4">
            {JSON.stringify(item)}
          </div>
        ))}
      </div>
    </section>
  )
}

export default LaTeXRenderer
