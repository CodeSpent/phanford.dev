'use client'

import React from 'react'
import ArticleLayout from '../../../layouts/ArticleLayout'
import { DataSourceType, getDataSource } from 'constants/data-sources'
import { MDXComponents } from 'mdx/types'
import { useMDXComponent } from 'next-contentlayer2/hooks'
import MDXErrorBoundary from '../../../components/common/MDXErrorBoundary'
import ArticleImage from '../../../components/blog/ArticleImage'
import Button from '../../../components/common/Button'
import { TagList } from '../../../components/common/Tag'

// New unified components
import { UnifiedContentHeader } from '../../../components/content/UnifiedContentHeader'
import { ContentDetailLayout } from '../../../components/content/ContentDetailLayout'
import { TableOfContentsModule } from '../../../components/content/TableOfContentsModule'
import { MetaInfoModule } from '../../../components/content/MetaInfoModule'
import { SidebarModule } from '../../../components/content/SidebarModule'
import { DocumentExportModule, getResumeExportFormats } from '../../../components/content/DocumentExportModule'
import { SocialShareModule } from '../../../components/content/SocialShareModule'

// LaTeX rendering
import { LaTeXRenderer } from '../../../components/latex'
import type { ParsedResumeDocument } from '../../../types/latex'

type Props = {
  document: any
  slug: string
  dataSource?: DataSourceType
  prevDoc?: any
  nextDoc?: any
  latexDocument?: ParsedResumeDocument
}

export default function DocumentClient({
  document,
  dataSource = 'documents',
  prevDoc,
  nextDoc,
  latexDocument,
}: Props) {
  const MDXContent = document.body?.code ? useMDXComponent(document.body.code) : null
  const isLatex = !!latexDocument

  const ds = getDataSource(dataSource)
  const contentType = 'documents'

  const components: MDXComponents = {
    img: (props) => {
      const isHeaderImage = document.body?.raw && document.body.raw.indexOf(props.src) < 200

      return (
        <ArticleImage
          src={props.src || ''}
          alt={props.alt}
          contentType={contentType}
          articleSlug={document.slugAsParams}
          isHeaderImage={isHeaderImage}
        />
      )
    },
  }

  return (
    <ArticleLayout dataSource={dataSource}>
      <ContentDetailLayout
        backLink={{
          href: `/${ds.id}`,
          label: `Back to ${ds.name}`,
        }}
        prevLink={
          prevDoc
            ? {
                href: `/${ds.id}/${prevDoc.slugAsParams}`,
                label: `Previous ${ds.itemName}`,
              }
            : undefined
        }
        nextLink={
          nextDoc
            ? {
                href: `/${ds.id}/${nextDoc.slugAsParams}`,
                label: `Next ${ds.itemName}`,
              }
            : undefined
        }
        sidebar={
          <>
            {/* Export Options */}
            <DocumentExportModule
              title={document.title}
              rawMarkdown={document.body?.raw || ''}
              sourceContent={isLatex ? latexDocument?.raw : document.body?.raw}
              sourceExtension={isLatex ? 'tex' : 'mdx'}
              slug={document.slugAsParams}
              isLatex={isLatex}
              exportFormats={document.slugAsParams === 'resume' ? getResumeExportFormats() : undefined}
            />

            {/* Meta Information */}
            <MetaInfoModule
              date={document.date}
              readingTime={document.readingTime}
              category={document.category}
              lastUpdated={document.lastUpdated}
            />

            {/* Table of Contents - at bottom so it can scroll */}
            <TableOfContentsModule />
          </>
        }
      >
        {/* Unified Header */}
        <UnifiedContentHeader
          title={document.title}
          description={document.description}
          tags={document.tags || []}
          date={document.date}
          readingTime={document.readingTime}
          showSocialShare={true}
          className="mb-6"
        />

        {/* Main Content Card */}
        <SidebarModule className="p-6 lg:p-8">
          {isLatex && latexDocument ? (
            // Render LaTeX document
            <article className="article-body prose prose-invert prose-lg max-w-none">
              <LaTeXRenderer document={latexDocument} />
            </article>
          ) : !MDXContent ? (
            // No content available
            <div className="bg-amber-900/20 border-2 border-amber-700/50 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5"
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
                <div>
                  <h3 className="text-amber-400 font-semibold mb-2">Content Unavailable</h3>
                  <p className="text-gray-300 text-sm">
                    The content for "{document.title}" is currently unavailable. This may be due to
                    a processing error during build time.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Render MDX with Error Boundary
            <MDXErrorBoundary
              articleTitle={document.title}
              articleSlug={document.slugAsParams}
              contentType="document"
            >
              <article className="article-body prose prose-invert prose-lg max-w-none">
                <MDXContent components={components} />
              </article>
            </MDXErrorBoundary>
          )}
        </SidebarModule>

        {/* Document Footer */}
        <footer className="pt-6 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-2">Tags:</p>
              <TagList tags={document.tags || []} variant="compact" />
            </div>
            <Button
              as="link"
              href={`/${ds.id}`}
              variant="solid-secondary"
              size="md"
            >
              More Documents
            </Button>
          </div>
        </footer>
      </ContentDetailLayout>
    </ArticleLayout>
  )
}
