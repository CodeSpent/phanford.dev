import React from 'react'

export interface CTAButtonConfig {
  primaryColor: string // e.g., "#5865F2" for Discord Blurple
  primaryHoverColor: string // e.g., "#4752C4"
  secondaryIconColor: string // e.g., "#5865F2"
  shadowColor: string // e.g., "blue-500/20"
}

// Default Discord branding
export const DEFAULT_CTA_CONFIG: CTAButtonConfig = {
  primaryColor: '#5865F2',
  primaryHoverColor: '#4752C4',
  secondaryIconColor: '#5865F2',
  shadowColor: 'blue-500/20',
}

interface CTAButtonProps {
  href: string
  label: string
  icon?: React.ReactNode | string // ReactNode for SVG, string for image URL
  variant?: 'primary' | 'secondary'
  config?: CTAButtonConfig
  className?: string
  compact?: boolean // For sticky header
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  href,
  label,
  icon,
  variant = 'primary',
  config = DEFAULT_CTA_CONFIG,
  className = '',
  compact = false,
}) => {
  const isPrimary = variant === 'primary'

  const baseClasses = compact
    ? 'flex-shrink-0 inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg transition-all'
    : 'flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition-all'

  const primaryClasses = `text-white shadow-lg shadow-${config.shadowColor}`
  const secondaryClasses = 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600'

  const renderIcon = () => {
    if (!icon) {
      // Default external link icon
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      )
    }

    if (typeof icon === 'string') {
      // Image URL
      return <img src={icon} alt="" className="w-4 h-4" />
    }

    // React node (SVG component)
    return icon
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${isPrimary ? primaryClasses : secondaryClasses} ${className}`}
      style={
        isPrimary
          ? {
              backgroundColor: config.primaryColor,
            }
          : undefined
      }
      onMouseEnter={(e) => {
        if (isPrimary) {
          e.currentTarget.style.backgroundColor = config.primaryHoverColor
        }
      }}
      onMouseLeave={(e) => {
        if (isPrimary) {
          e.currentTarget.style.backgroundColor = config.primaryColor
        }
      }}
    >
      <span
        className={isPrimary ? 'text-white' : ''}
        style={!isPrimary ? { color: config.secondaryIconColor } : undefined}
      >
        {renderIcon()}
      </span>
      <span>{label}</span>
    </a>
  )
}
