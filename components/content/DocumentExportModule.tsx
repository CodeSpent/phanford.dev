'use client'

import React, { useState, useRef, useCallback } from 'react'
import Button from '../common/Button'
import { exportToPDF, exportToDOCX, exportToMarkdown } from '../../utils/document-export'

interface DocumentExportModuleProps {
  title: string
  rawMarkdown: string
  className?: string
}

type ExportFormat = 'pdf' | 'docx' | 'md'

/**
 * Document export module for sidebar
 * Provides PDF, DOCX, and Markdown export buttons
 */
export const DocumentExportModule: React.FC<DocumentExportModuleProps> = ({
  title,
  rawMarkdown,
  className = '',
}) => {
  const [loading, setLoading] = useState<ExportFormat | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleExport = useCallback(async (format: ExportFormat) => {
    setLoading(format)
    setError(null)

    try {
      if (format === 'md') {
        exportToMarkdown(rawMarkdown, title)
      } else {
        // For PDF and DOCX, we need to get the article body element
        const articleBody = document.querySelector('.article-body')
        if (!articleBody) {
          throw new Error('Article content not found')
        }

        if (format === 'pdf') {
          await exportToPDF(articleBody as HTMLElement, title)
        } else if (format === 'docx') {
          await exportToDOCX(articleBody as HTMLElement, title)
        }
      }
    } catch (err) {
      console.error(`Export to ${format.toUpperCase()} failed:`, err)
      setError(`Failed to export as ${format.toUpperCase()}. Please try again.`)
    } finally {
      setLoading(null)
    }
  }, [title, rawMarkdown])

  return (
    <div
      className={`bg-card-background rounded-lg border border-gray-800/50 p-6 ${className}`}
    >
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
        Export Document
      </h3>

      <div className="flex flex-col gap-2">
        {/* PDF Export */}
        <Button
          variant="solid-secondary"
          size="md"
          onClick={() => handleExport('pdf')}
          disabled={loading !== null}
          className="w-full justify-start"
          icon={
            loading === 'pdf' ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1v5h5v12H6V4h7zm-2.5 9.5v3h1.5v-3h1.5L12 11l-3 2.5h1.5zm-2.5 3h.5v-3H7v1h1v2H6v.5h2v-.5zm7-3v3h1v-3h1v-.5h-1v-.5h-1v.5h-.5v.5h.5z" />
              </svg>
            )
          }
        >
          {loading === 'pdf' ? 'Generating PDF...' : 'Download PDF'}
        </Button>

        {/* DOCX Export */}
        <Button
          variant="solid-secondary"
          size="md"
          onClick={() => handleExport('docx')}
          disabled={loading !== null}
          className="w-full justify-start"
          icon={
            loading === 'docx' ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1v5h5v12H6V4h7zm-4.5 9.5L7 17h1l.75-2.5h1.5L11 17h1l-1.5-3.5L12 10h-1l-.75 2.5h-1.5L8 10H7l1.5 3.5z" />
              </svg>
            )
          }
        >
          {loading === 'docx' ? 'Generating DOCX...' : 'Download Word'}
        </Button>

        {/* Markdown Export */}
        <Button
          variant="solid-secondary"
          size="md"
          onClick={() => handleExport('md')}
          disabled={loading !== null}
          className="w-full justify-start"
          icon={
            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.27 19.385H1.73A1.73 1.73 0 0 1 0 17.655V6.345a1.73 1.73 0 0 1 1.73-1.73h20.54A1.73 1.73 0 0 1 24 6.345v11.31a1.73 1.73 0 0 1-1.73 1.73zM5.769 15.923v-4.5l2.308 2.885 2.307-2.885v4.5h2.308V8.077h-2.308l-2.307 2.885-2.308-2.885H3.461v7.846zM21.232 12h-2.309V8.077h-2.307V12h-2.308l3.462 4.615z" />
            </svg>
          }
        >
          Download Markdown
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-3 p-2 bg-red-900/20 border border-red-700/50 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Help text */}
      <p className="mt-4 text-xs text-gray-500">
        PDF and Word exports capture the rendered document. Markdown downloads the source file.
      </p>
    </div>
  )
}
