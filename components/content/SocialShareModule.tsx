'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'

interface SocialShareModuleProps {
  title: string
  description?: string
  url?: string
  className?: string
}

/**
 * Compact share icon button with a popover containing social links,
 * native OS share, and a copy-link field.
 */
export const SocialShareModule: React.FC<SocialShareModuleProps> = ({
  title,
  description,
  url,
  className = '',
}) => {
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [shareUrl, setShareUrl] = useState(url || '')
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!url) {
      setShareUrl(window.location.href)
    }
    setCanNativeShare(typeof navigator !== 'undefined' && !!navigator.share)
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  }, [url])

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title,
        text: description || title,
        url: shareUrl,
      })
    } catch (err) {
      if ((err as DOMException).name !== 'AbortError') {
        console.error('Share failed:', err)
      }
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      inputRef.current?.select()
    }
  }

  const platforms = [
    {
      name: 'Twitter',
      hoverColor: 'hover:text-blue-400',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title} | Patrick Hanford`)}&url=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      hoverColor: 'hover:text-blue-500',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: 'Reddit',
      hoverColor: 'hover:text-orange-500',
      url: `https://www.reddit.com/submit?title=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
        </svg>
      ),
    },
    {
      name: 'Hacker News',
      hoverColor: 'hover:text-orange-600',
      url: `https://news.ycombinator.com/submitlink?t=${encodeURIComponent(title)}&u=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M0 24V0h24v24H0zM6.951 5.896l4.112 7.708v5.064h1.583v-4.972l4.148-7.799h-1.749l-2.457 4.875c-.372.745-.688 1.434-.688 1.434s-.297-.708-.651-1.434L8.831 5.896h-1.88z" />
        </svg>
      ),
    },
  ]

  // Apple share icon (macOS Safari/Chrome)
  const appleShareIcon = (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )

  // Mobile share icon (Android/iOS phone)
  const mobileShareIcon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  )

  return (
    <Popover className={`relative inline-flex ${className}`}>
      {({ open }) => (
        <>
          <Popover.Button
            ref={buttonRef}
            className={`p-1.5 rounded-lg transition-colors outline-none ${
              open ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white'
            }`}
            title="Share"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </Popover.Button>

          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition duration-75 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel className="absolute z-[100] left-1/2 -translate-x-1/2 mt-5 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-xl shadow-black/40 p-3">
              {/* Arrow */}
              <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 border-l border-t border-gray-700 rotate-45" />

              {/* Platform icons row */}
              <div className="relative flex items-center justify-center gap-1 mb-3">
                {platforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={platform.name}
                    className={`p-2 text-gray-400 rounded-lg transition-colors hover:bg-white/5 ${platform.hoverColor}`}
                  >
                    {platform.icon}
                  </a>
                ))}

                {/* Native OS share button */}
                {canNativeShare && (
                  <>
                    <div className="w-px h-5 bg-gray-700 mx-0.5" />
                    <button
                      onClick={handleNativeShare}
                      title={isMobile ? 'Share via device' : 'More sharing options'}
                      className="p-2 text-gray-400 rounded-lg transition-colors hover:bg-white/5 hover:text-white"
                    >
                      {isMobile ? mobileShareIcon : appleShareIcon}
                    </button>
                  </>
                )}
              </div>

              {/* Copy link */}
              <div className="relative flex items-center bg-white/5 border border-gray-700 rounded-lg overflow-hidden">
                <input
                  ref={inputRef}
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-transparent text-xs text-gray-400 px-2.5 py-1.5 outline-none select-all min-w-0 truncate"
                  onFocus={(e) => e.target.select()}
                />
                <button
                  onClick={handleCopyLink}
                  className="px-2.5 py-1.5 text-gray-400 hover:text-white border-l border-gray-700 hover:bg-white/5 transition-colors shrink-0"
                  title="Copy link"
                >
                  {copied ? (
                    <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}
