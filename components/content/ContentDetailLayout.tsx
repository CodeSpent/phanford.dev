import React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import Button from '../common/Button'

interface ContentDetailLayoutProps {
  children: React.ReactNode
  sidebar: React.ReactNode
  backLink?: {
    href: string
    label: string
  }
  prevLink?: {
    href: string
    label: string
  }
  nextLink?: {
    href: string
    label: string
  }
  className?: string
}

/**
 * Unified 3-column modular layout for all content detail pages
 * Features:
 * - 2/3 main content area + 1/3 sidebar
 * - Responsive mobile collapse
 * - Back button and breadcrumb support
 * - Consistent spacing and styling
 */
export const ContentDetailLayout: React.FC<ContentDetailLayoutProps> = ({
  children,
  sidebar,
  backLink,
  prevLink,
  nextLink,
  className = '',
}) => {
  return (
    <div className={`min-h-screen ${className}`}>
      <div className="px-6 mx-auto max-w-7xl py-8">
        {/* Navigation Buttons */}
        {(backLink || prevLink || nextLink) && (
          <div className="mb-6 flex items-center justify-between gap-4">
            {/* Left side - Back button */}
            <div>
              {backLink && (
                <Button
                  as="link"
                  href={backLink.href}
                  variant="solid-secondary"
                  size="md"
                  icon={<ChevronLeftIcon className="h-4 w-4" />}
                  iconPosition="left"
                >
                  {backLink.label}
                </Button>
              )}
            </div>

            {/* Right side - Prev/Next buttons */}
            <div className="flex items-center gap-3">
              {prevLink && (
                <Button
                  as="link"
                  href={prevLink.href}
                  variant="solid-secondary"
                  size="md"
                  icon={<ChevronLeftIcon className="h-4 w-4" />}
                  iconPosition="left"
                >
                  {prevLink.label}
                </Button>
              )}
              {nextLink && (
                <Button
                  as="link"
                  href={nextLink.href}
                  variant="solid-secondary"
                  size="md"
                  icon={<ChevronRightIcon className="h-4 w-4" />}
                  iconPosition="right"
                >
                  {nextLink.label}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Main Grid Layout - 3 columns (2/3 + 1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content (2/3) */}
          <div className="lg:col-span-2 space-y-6">{children}</div>

          {/* Right Column - Sidebar (1/3) */}
          <div className="lg:col-span-1 space-y-6">{sidebar}</div>
        </div>
      </div>
    </div>
  )
}
