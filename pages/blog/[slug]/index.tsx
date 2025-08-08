import Link from 'next/link'
import ArticleLayout from '../../../layouts/ArticleLayout'
import { CalendarIcon, ClockIcon, ChevronLeftIcon } from '@heroicons/react/solid'
import { allArticles } from 'contentlayer/generated'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { DataSourceType, getDataSource } from 'constants/data-sources'
import { TagList } from '../../../components/common/Tag'
import Button from '../../../components/common/Button'
import TableOfContents from '../../../components/blog/TableOfContents'
import MetaTags from '../../../components/seo/MetaTags'

import Image from 'next/image'
import { MDXComponents } from 'mdx/types'

type Props = {
  article: any
  slug: string
  dataSource?: DataSourceType
}

const ContentItem = ({ article, dataSource = 'blog' }: Props) => {
  const MDXContent = useMDXComponent(article.body.code)

  const ds = getDataSource(dataSource)
  const contentType = ds.id === 'blog' ? 'articles' : ds.id

  const components: MDXComponents = {
    img: props => {
      // Check if this is likely the first/header image by checking if it appears early in content
      const isHeaderImage = article.body.raw && article.body.raw.indexOf(props.src) < 200
      
      if (isHeaderImage) {
        return (
          <div className="header-image -mx-6 lg:-mx-8 mb-8" style={{ marginTop: '-3.75rem' }}>
            <div className="relative">
              <Image
                src={`/${contentType}/${article.slugAsParams}/${props.src}`}
                alt={props.alt as any}
                width={1200}
                height={600}
                className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-t-xl"
                priority
              />
              {/* Dark overlay to reduce brightness */}
              <div className="absolute inset-0 bg-black/60 rounded-t-xl"></div>
            </div>
            {props.alt && (
              <p className="text-sm text-gray-400 text-center mt-3 italic px-6 lg:px-8">
                {props.alt}
              </p>
            )}
          </div>
        )
      }
      
      return (
        <div className="my-8">
          <Image
            src={`/${contentType}/${article.slugAsParams}/${props.src}`}
            alt={props.alt as any}
            width={800}
            height={500}
            className="max-w-full h-auto rounded-lg mx-auto block"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
          {props.alt && (
            <p className="text-sm text-gray-400 text-center mt-2 italic">
              {props.alt}
            </p>
          )}
        </div>
      )
    },
  }

  return (
    <>
      <MetaTags
        contentType="article"
        content={article}
        title={article.title}
        description={article.description || article.excerpt || `Read ${article.title} by Patrick Hanford`}
        url={typeof window !== 'undefined' ? window.location.href : `https://phanford.dev/blog/${article.slugAsParams}`}
      />
      <ArticleLayout dataSource={dataSource}>
        <div className="max-w-7xl mx-auto">
          {/* Navigation */}
          <div className="mb-4">
            <Button
              as="link"
              href={`/${ds.id}`}
              variant="ghost"
              size="sm"
              icon={<ChevronLeftIcon className="h-4 w-4" />}
              iconPosition="left"
            >
              Back to {ds.name}
            </Button>
          </div>

          {/* Optimized Layout for Maximum Reading Space */}
          {/* Compact Header with Title and Meta Info */}
          <header className="mb-6">
            <div className="bg-card-background backdrop-blur-sm border border-gray-800/50 rounded-xl p-4" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)' }}>
              <TagList tags={article.tags || []} className="mb-3" />
              <h1 className="text-xl md:text-2xl lg:text-3xl font-medium text-white leading-tight mb-3">
                {article.title}
              </h1>
              {article.description && (
                <p className="text-base text-gray-400 leading-relaxed mb-4">
                  {article.description}
                </p>
              )}
              
              {/* Meta info row with author byline */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-700/50">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{new Date(article.published || article.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4" />
                    <span>{article.minutesToRead || article.readingTime} min read</span>
                  </div>
                </div>
                
                {/* Share Buttons */}
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-gray-400 font-medium">Share</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
                        const encodedTitle = encodeURIComponent(article.title)
                        const encodedUrl = encodeURIComponent(shareUrl)
                        window.open(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, '_blank')
                      }}
                      className="p-2 hover:text-blue-400"
                      icon={
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      }
                    >
                      Twitter
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
                        const encodedUrl = encodeURIComponent(shareUrl)
                        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank')
                      }}
                      className="p-2 hover:text-blue-600"
                      icon={
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      }
                    >
                      LinkedIn
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        try {
                          const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
                          await navigator.clipboard.writeText(shareUrl)
                        } catch (err) {
                          console.error('Failed to copy link:', err)
                        }
                      }}
                      className="p-2"
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      }
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Layout - Article takes full width with narrow sidebar */}
          <div className="lg:grid lg:grid-cols-[1fr_240px] lg:gap-8">
            {/* Article Content - Full Width for Maximum Reading Space */}
            <div>
              <div className="bg-card-background backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 lg:p-8" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)' }}>
                <article className="article-body prose prose-invert prose-lg max-w-none">
                  <MDXContent components={components} />
                </article>
              </div>

              {/* Article Footer */}
              <footer className="mt-8 pt-6 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Tags:</p>
                    <TagList tags={article.tags || []} variant="compact" />
                  </div>
                  <Button
                    as="link"
                    href={`/${ds.id}`}
                    variant="secondary"
                    size="sm"
                  >
                    More Articles
                  </Button>
                </div>
              </footer>
            </div>

            {/* Narrow Sidebar - Table of Contents */}
            <aside className="hidden lg:block">
              <div className="sticky top-8">
                <TableOfContents />
              </div>
            </aside>
          </div>
        </div>
      </ArticleLayout>
    </>
  )
}

export async function getStaticProps({ params }: any) {
  const isStr = (val: any): val is string => typeof val === 'string'
  const slug = isStr(params.slug) ? params.slug : ''

  const article = allArticles.find(article => article.slugAsParams === slug)
  return {
    props: {
      article,
      slug,
      dataSource: 'blog',
    } as Props,
  }
}

export async function getStaticPaths() {
  const paths = allArticles.map(article => {
    return {
      params: {
        slug: article.slugAsParams,
      },
    }
  })

  return {
    paths,
    fallback: false,
  }
}

export default ContentItem
