import React from 'react'
import { CTAButton } from '../common/CTAButton'

export interface ProjectLink {
  type: 'website' | 'github' | 'invite' | 'docs' | 'demo' | 'npm' | 'other'
  url: string
  label: string
  icon?: string // Optional: URL to custom icon/logo (SVG recommended)
}

interface ProjectLinksProps {
  links?: ProjectLink[]
  className?: string
  primaryOnly?: boolean
}

export const ProjectLinks: React.FC<ProjectLinksProps> = ({ links = [], className = '', primaryOnly = false }) => {
  if (!links || links.length === 0) return null

  const displayLinks = primaryOnly ? links.slice(0, 1) : links

  return (
    <div className={`flex gap-2 ${className}`}>
      {displayLinks.map((link, index) => (
        <CTAButton
          key={index}
          href={link.url}
          label={link.label}
          icon={link.icon}
          variant={index === 0 ? 'primary' : 'secondary'}
        />
      ))}
    </div>
  )
}
