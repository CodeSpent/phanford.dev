'use client'

import React, { Component, ReactNode } from 'react'
import Button from './Button'

interface Props {
  children: ReactNode
  articleTitle?: string
  articleSlug?: string
  contentType?: 'article' | 'document'
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

/**
 * Error Boundary for MDX content rendering
 * Catches React errors during MDX compilation and rendering
 * Provides graceful fallback UI and error reporting
 */
export class MDXErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { articleTitle, articleSlug, contentType = 'article' } = this.props

    console.error('MDX Error Boundary caught error:', {
      error,
      errorInfo,
      articleTitle,
      articleSlug,
      contentType,
    })

    // Report to error tracking service (Sentry)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      ;(window as any).Sentry.captureException(error, {
        tags: {
          component: 'mdx-error-boundary',
          contentType,
        },
        extra: {
          articleTitle,
          articleSlug,
          componentStack: errorInfo.componentStack,
        },
      })
    }

    this.setState({ errorInfo })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      const { articleTitle, contentType = 'article' } = this.props
      const { error } = this.state

      return (
        <div className="my-8 bg-red-900/20 border-2 border-red-700/50 rounded-xl p-6 lg:p-8">
          <div className="flex items-start gap-4">
            {/* Error Icon */}
            <div className="flex-shrink-0">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Error Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-red-400 mb-2">
                Content Rendering Error
              </h3>

              <p className="text-gray-300 mb-4">
                We encountered an error while displaying{' '}
                {articleTitle ? (
                  <span className="font-medium text-white">"{articleTitle}"</span>
                ) : (
                  `this ${contentType}`
                )}
                . The content may contain formatting issues or incompatible markup.
              </p>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && error && (
                <details className="mb-4">
                  <summary className="cursor-pointer text-sm text-red-300 hover:text-red-200 font-medium mb-2">
                    Show Error Details (Dev Only)
                  </summary>
                  <pre className="mt-2 p-4 bg-black/50 rounded-lg overflow-auto text-xs text-red-200 border border-red-800/50">
                    {error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="danger"
                  size="md"
                  onClick={this.handleReset}
                >
                  Try Again
                </Button>

                <Button
                  variant="solid-secondary"
                  size="md"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>

                <Button
                  as="link"
                  href={contentType === 'article' ? '/blog' : '/documents'}
                  variant="solid-secondary"
                  size="md"
                >
                  Back to {contentType === 'article' ? 'Articles' : 'Documents'}
                </Button>
              </div>

              {/* Help Text */}
              <p className="mt-4 text-sm text-gray-400">
                If this problem persists, please report it. The error has been automatically
                logged for investigation.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default MDXErrorBoundary
