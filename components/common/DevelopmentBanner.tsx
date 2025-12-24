'use client'

import React from 'react'

export default function DevelopmentBanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-amber-500/95 px-4 py-3 text-center backdrop-blur-sm">
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
