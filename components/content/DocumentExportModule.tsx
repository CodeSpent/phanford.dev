'use client'

import React, { useState, useCallback } from 'react'
import Button from '../common/Button'
import { exportToPDF, exportToDOCX, exportToMarkdown } from '../../utils/document-export'

export type ExportFormat = 'pdf' | 'docx' | 'md' | 'tex'

export interface ExportFormatConfig {
  url: string
  label?: string
}

export type ExportFormatsMap = Partial<Record<ExportFormat, ExportFormatConfig | string>>

interface DocumentExportModuleProps {
  title: string
  rawMarkdown?: string
  className?: string
  slug?: string
  /** Map of available export formats with their download URLs */
  exportFormats?: ExportFormatsMap
  /** Fallback: generate exports client-side if no URL provided */
  allowClientGeneration?: boolean
}

const LoadingSpinner = () => (
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
)

const formatIcons: Record<ExportFormat, React.ReactNode> = {
  pdf: (
    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1v5h5v12H6V4h7z" />
    </svg>
  ),
  docx: (
    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1v5h5v12H6V4h7z" />
    </svg>
  ),
  md: (
    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22.27 19.385H1.73A1.73 1.73 0 0 1 0 17.655V6.345a1.73 1.73 0 0 1 1.73-1.73h20.54A1.73 1.73 0 0 1 24 6.345v11.31a1.73 1.73 0 0 1-1.73 1.73zM5.769 15.923v-4.5l2.308 2.885 2.307-2.885v4.5h2.308V8.077h-2.308l-2.307 2.885-2.308-2.885H3.461v7.846zM21.232 12h-2.309V8.077h-2.307V12h-2.308l3.462 4.615z" />
    </svg>
  ),
  tex: (
    <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
}

const formatLabels: Record<ExportFormat, string> = {
  pdf: 'PDF',
  docx: 'Word',
  md: 'Markdown',
  tex: 'LaTeX Source',
}

/**
 * GitHub release URL helper for resume
 */
export const getResumeExportFormats = (): ExportFormatsMap => ({
  pdf: {
    url: 'https://github.com/CodeSpent/resume/releases/latest/download/resume.pdf',
    label: 'PDF',
  },
  docx: {
    url: 'https://github.com/CodeSpent/resume/releases/latest/download/resume.docx',
    label: 'Word',
  },
  md: {
    url: 'https://github.com/CodeSpent/resume/releases/latest/download/resume.md',
    label: 'Markdown',
  },
})

/**
 * Document export module for sidebar
 * Supports both pre-generated downloads (via URL) and client-side generation
 */
export const DocumentExportModule: React.FC<DocumentExportModuleProps> = ({
  title,
  rawMarkdown = '',
  className = '',
  slug,
  exportFormats = {},
  allowClientGeneration = true,
}) => {
  const [loading, setLoading] = useState<ExportFormat | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleExport = useCallback(async (format: ExportFormat) => {
    const formatConfig = exportFormats[format]

    // If we have a URL, just open it
    if (formatConfig) {
      const url = typeof formatConfig === 'string' ? formatConfig : formatConfig.url
      window.open(url, '_blank')
      return
    }

    // Otherwise, try client-side generation
    if (!allowClientGeneration) return

    setLoading(format)
    setError(null)

    try {
      if (format === 'md') {
        exportToMarkdown(rawMarkdown, title)
      } else {
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
    } catch (err: any) {
      console.error(`Export to ${format.toUpperCase()} failed:`, err)
      setError(err.message || `Failed to export as ${format.toUpperCase()}. Please try again.`)
    } finally {
      setLoading(null)
    }
  }, [title, rawMarkdown, exportFormats, allowClientGeneration])

  // Determine which formats to show
  const availableFormats = Object.keys(exportFormats) as ExportFormat[]

  // If no export formats provided but client generation allowed, show default options
  const formatsToShow: ExportFormat[] = availableFormats.length > 0
    ? availableFormats
    : allowClientGeneration
      ? ['pdf', 'docx', 'md']
      : []

  if (formatsToShow.length === 0) {
    return null
  }

  return (
    <div className={`bg-card-background rounded-lg border border-gray-800/50 p-6 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
        Export Document
      </h3>

      <div className="flex flex-col gap-2">
        {formatsToShow.map((format) => {
          const config = exportFormats[format]
          const label = config && typeof config !== 'string' && config.label
            ? config.label
            : formatLabels[format]
          const hasUrl = !!config

          return (
            <Button
              key={format}
              variant="solid-secondary"
              size="md"
              onClick={() => handleExport(format)}
              disabled={loading !== null}
              className="w-full justify-start"
              icon={loading === format ? <LoadingSpinner /> : formatIcons[format]}
            >
              {loading === format
                ? `Generating ${label}...`
                : `Download ${label}`}
              {hasUrl && (
                <svg className="w-3 h-3 ml-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              )}
            </Button>
          )
        })}
      </div>

      {error && (
        <div className="mt-3 p-2 bg-red-900/20 border border-red-700/50 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      <p className="mt-4 text-xs text-gray-500">
        {Object.keys(exportFormats).length > 0
          ? 'Downloads are pre-generated from source.'
          : 'Exports are generated from the rendered document.'}
      </p>
    </div>
  )
}
