import React from 'react'

interface ConditionalModuleProps {
  /**
   * Data to check for existence - if null, undefined, empty array, or empty object, children won't render
   */
  data: any
  /**
   * Optional custom check function for more complex conditions
   */
  check?: (data: any) => boolean
  /**
   * Optional loading state
   */
  isLoading?: boolean
  /**
   * Optional loading component
   */
  loadingComponent?: React.ReactNode
  /**
   * Optional fallback component when data doesn't exist (defaults to null - no render)
   */
  fallback?: React.ReactNode
  /**
   * Children to render when data exists
   */
  children: React.ReactNode
  /**
   * Optional className for wrapper div (only rendered if children render)
   */
  className?: string
}

/**
 * ConditionalModule Component
 *
 * Smart wrapper that conditionally renders children based on data availability.
 * Supports custom validation logic, loading states, and fallback UI.
 *
 * @example
 * ```tsx
 * <ConditionalModule data={project.screenshots}>
 *   <ProjectGallery screenshots={project.screenshots} />
 * </ConditionalModule>
 * ```
 *
 * @example With custom check
 * ```tsx
 * <ConditionalModule
 *   data={releases}
 *   check={(releases) => releases.length > 0 && !releases[0].isDraft}
 * >
 *   <ReleasesTimeline releases={releases} />
 * </ConditionalModule>
 * ```
 *
 * @example With loading state
 * ```tsx
 * <ConditionalModule
 *   data={githubData}
 *   isLoading={isLoadingGithub}
 *   loadingComponent={<Skeleton />}
 * >
 *   <GitHubStatsCard stats={githubData} />
 * </ConditionalModule>
 * ```
 */
export const ConditionalModule: React.FC<ConditionalModuleProps> = ({
  data,
  check,
  isLoading = false,
  loadingComponent = null,
  fallback = null,
  children,
  className = '',
}) => {
  // Show loading component if in loading state
  if (isLoading) {
    return loadingComponent ? <div className={className}>{loadingComponent}</div> : null
  }

  // Use custom check function if provided
  if (check) {
    return check(data) ? (
      className ? <div className={className}>{children}</div> : <>{children}</>
    ) : fallback ? (
      <div className={className}>{fallback}</div>
    ) : null
  }

  // Default data existence checks
  const dataExists = (() => {
    // Null or undefined
    if (data === null || data === undefined) return false

    // Empty string
    if (typeof data === 'string' && data.trim() === '') return false

    // Empty array
    if (Array.isArray(data) && data.length === 0) return false

    // Empty object (plain objects only)
    if (
      typeof data === 'object' &&
      !Array.isArray(data) &&
      Object.keys(data).length === 0 &&
      data.constructor === Object
    ) return false

    // Boolean false is considered "no data"
    if (typeof data === 'boolean' && data === false) return false

    // Number 0 is considered valid data
    if (typeof data === 'number') return true

    // Everything else is considered valid data
    return true
  })()

  if (!dataExists) {
    return fallback ? <div className={className}>{fallback}</div> : null
  }

  return className ? <div className={className}>{children}</div> : <>{children}</>
}

/**
 * Utility: Multiple ConditionalModules with OR logic
 * Renders children if ANY of the data conditions are met
 */
interface ConditionalModuleOrProps {
  dataChecks: Array<{ data: any; check?: (data: any) => boolean }>
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

export const ConditionalModuleOr: React.FC<ConditionalModuleOrProps> = ({
  dataChecks,
  children,
  fallback = null,
  className = '',
}) => {
  const hasAnyData = dataChecks.some(({ data, check }) => {
    if (check) return check(data)

    // Same default checks as ConditionalModule
    if (data === null || data === undefined) return false
    if (typeof data === 'string' && data.trim() === '') return false
    if (Array.isArray(data) && data.length === 0) return false
    if (typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0) return false
    if (typeof data === 'boolean' && data === false) return false

    return true
  })

  if (!hasAnyData) {
    return fallback ? <div className={className}>{fallback}</div> : null
  }

  return className ? <div className={className}>{children}</div> : <>{children}</>
}
