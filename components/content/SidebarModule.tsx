import React from 'react'

interface SidebarModuleProps {
  title?: string
  children: React.ReactNode
  className?: string
}

/**
 * Reusable sidebar card component with consistent styling
 * Used across all content detail pages for modular sidebar content
 */
export const SidebarModule: React.FC<SidebarModuleProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <div
      className={`bg-card-background rounded-lg border border-gray-800/50 p-6 ${className}`}
    >
      {title && (
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}
