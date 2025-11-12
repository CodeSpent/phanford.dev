'use client'

import { useEffect, useState } from 'react'

export type BadgeVariant = 'new' | 'active' | 'updated' | 'info'

interface NavBadgeProps {
  count?: number
  variant?: BadgeVariant
  animate?: boolean
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  new: 'text-green-400 bg-green-400/10 border-green-500/20 shadow-green-500/10',
  active: 'text-blue-400 bg-blue-400/10 border-blue-500/20 shadow-blue-500/10',
  updated: 'text-yellow-400 bg-yellow-400/10 border-yellow-500/20 shadow-yellow-500/10',
  info: 'text-gray-400 bg-gray-400/10 border-gray-500/20 shadow-gray-500/10',
}

/**
 * NavBadge - Status badge component for navbar links
 *
 * Displays count or indicator badges with color-coded variants and optional animations
 *
 * @example
 * <NavBadge count={12} variant="new" animate />
 * <NavBadge count={3} variant="active" />
 * <NavBadge variant="updated" /> // Shows dot indicator without count
 */
export default function NavBadge({
  count,
  variant = 'info',
  animate = false,
  className = '',
}: NavBadgeProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  // Trigger animation when count changes
  useEffect(() => {
    if (animate && count !== undefined) {
      setIsAnimating(true)
      const timeout = setTimeout(() => setIsAnimating(false), 600)
      return () => clearTimeout(timeout)
    }
  }, [count, animate])

  // Don't render if count is 0
  if (count === 0) {
    return null
  }

  const showCount = count !== undefined && count > 0

  return (
    <span
      className={`
        inline-flex items-center justify-center
        ${showCount
          ? 'min-w-[1.25rem] h-5 px-1.5'
          : 'w-2 h-2'
        }
        rounded-full
        border
        transition-all duration-200
        ${variantStyles[variant]}
        ${isAnimating ? 'animate-pulse scale-110' : ''}
        ${showCount ? 'text-[10px] font-semibold' : ''}
        ${className}
      `}
    >
      {showCount ? (count > 99 ? '99+' : count) : null}
    </span>
  )
}
