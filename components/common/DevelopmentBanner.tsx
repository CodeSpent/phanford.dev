'use client'

import React from 'react'
import { useSiteSettings } from '@/constants/site-settings-context/site-settings-context'

export default function DevelopmentBanner() {
  const { devBannerVisible, hideDevBanner } = useSiteSettings()

  if (!devBannerVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-amber-500/95 px-4 py-3 text-center backdrop-blur-sm">
      <button
        onClick={hideDevBanner}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-black/70 hover:text-black"
        aria-label="Close banner"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <p className="text-sm font-semibold text-black">
        I'm still working on this!
      </p>
      <p className="text-xs text-black/80">
        This portfolio is still under development. You may see inconsistent behaviors or AI-generated content as placeholder. If you notice any issues,{' '}
        <a
          href="https://github.com/codespent/phanford.dev/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-black"
        >
          please report them on GitHub
        </a>
        .
      </p>
    </div>
  )
}
