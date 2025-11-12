'use client'

import { useEffect, useState } from 'react'

/**
 * Gets the current domain name from window.location.hostname
 * Returns null during SSR
 */
export function getDomainName(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  return window.location.hostname
}

/**
 * Determines the brand name based on the domain
 * @param domain - The domain name (e.g., "phanford.dev", "www.phanford.dev")
 * @returns The brand name to display
 */
export function getBrandNameForDomain(domain: string | null): string {
  if (!domain) {
    // Default for SSR and unknown domains
    return 'CodeSpent'
  }

  // Remove www. prefix for comparison
  const normalizedDomain = domain.replace(/^www\./, '')

  // Check domain and return appropriate name
  if (normalizedDomain === 'phanford.dev') {
    return 'Patrick Hanford'
  }

  if (normalizedDomain === 'codespent.dev') {
    return 'CodeSpent'
  }

  // Default for localhost and other domains
  return 'CodeSpent'
}

/**
 * React hook to get the domain-based brand name
 * Handles SSR/CSR hydration safely by using useEffect
 * @returns The brand name based on the current domain
 */
export function useDomainBrandName(): string {
  const [brandName, setBrandName] = useState<string>('CodeSpent')

  useEffect(() => {
    const domain = getDomainName()
    const name = getBrandNameForDomain(domain)
    setBrandName(name)
  }, [])

  return brandName
}
