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

type Props = {
  article: any
  slug: string
  dataSource?: DataSourceType
  prevArticle?: any
  nextArticle?: any
}

export default function BlogArticleClient({ article, dataSource = 'blog', prevArticle, nextArticle }: Props) {
  const MDXContent = article.body?.code ? useMDXComponent(article.body.code) : null

  const ds = getDataSource(dataSource)
  const contentType = ds.id === 'blog' ? 'articles' : ds.id

  const components: MDXComponents = {
    img: (props) => {
      let isHeaderImage = false

      if (article.headerImage) {
        isHeaderImage = props.src === article.headerImage
      } else {
        isHeaderImage = article.body.raw && article.body.raw.indexOf(props.src) < 200
      }

      return (
        <ArticleImage
          src={props.src || ''}
          alt={props.alt}
          contentType={contentType}
          articleSlug={article.slugAsParams}
          isHeaderImage={isHeaderImage}
          imagePosition={article.imagePosition}
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
          prevArticle
            ? {
                href: `/${ds.id}/${prevArticle.slugAsParams}`,
                label: `Previous ${ds.itemName}`,
              }
            : undefined
        }
        nextLink={
          nextArticle
            ? {
                href: `/${ds.id}/${nextArticle.slugAsParams}`,
                label: `Next ${ds.itemName}`,
              }
            : undefined
        }
        sidebar={
          <>
            {/* Meta Information */}
            <MetaInfoModule
              date={article.date}
              readingTime={article.readingTime}
              category={article.category}
              lastUpdated={article.lastUpdated}
            />

            {/* Table of Contents - at bottom so it can scroll */}
            <TableOfContentsModule />
          </>
        }
      >
        {/* Unified Header */}
        <UnifiedContentHeader
          title={article.title}
          description={article.description}
          tags={article.tags || []}
          date={article.date}
          readingTime={article.readingTime}
          showSocialShare={true}
          className="mb-6"
        />

        {/* Main Content Card */}
        <SidebarModule className="p-6 lg:p-8">
          {!MDXContent ? (
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
                    The content for "{article.title}" is currently unavailable. This may be due to
                    a processing error during build time.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Render MDX with Error Boundary
            <MDXErrorBoundary
              articleTitle={article.title}
              articleSlug={article.slugAsParams}
              contentType="article"
            >
              <article className="article-body prose prose-invert prose-lg max-w-none">
                <MDXContent components={components} />
              </article>
            </MDXErrorBoundary>
          )}
        </SidebarModule>

        {/* Article Footer */}
        <footer className="pt-6 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-2">Tags:</p>
              <TagList tags={article.tags || []} variant="compact" />
            </div>
            <Button
              as="link"
              href={`/${ds.id}`}
              variant="solid-secondary"
              size="md"
            >
              More Articles
            </Button>
          </div>
        </footer>
      </ContentDetailLayout>
    </ArticleLayout>
  )
}
