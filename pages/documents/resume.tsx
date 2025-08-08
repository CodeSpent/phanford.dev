import ArticleLayout from '../../layouts/ArticleLayout'
import { allDocs } from 'contentlayer/generated'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { DataSourceType, getDataSource } from 'constants/data-sources'
import { CalendarIcon, DocumentIcon, ChevronLeftIcon } from '@heroicons/react/solid'
import { TagList } from '../../components/common/Tag'
import Button from '../../components/common/Button'
import { formatDate } from '../../utils/formatDate'

type Props = {
  resume: any
  dataSource?: DataSourceType
}

const Resume = ({ resume, dataSource = 'documents' }: Props) => {
  const MDXContent = useMDXComponent(resume.body.code)
  const ds = getDataSource(dataSource)

  return (
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

        {/* Enhanced Header with gradient and better visual hierarchy */}
        <header className="mb-8">
          <div className="bg-gradient-to-br from-card-background via-card-background to-card-background/80 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 lg:p-8 relative overflow-hidden" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)' }}>
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
            
            <div className="relative z-10">
              <TagList tags={resume.tags || []} className="mb-4" />
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4 tracking-tight">
                {resume.title}
              </h1>
              {resume.description && (
                <p className="text-lg text-gray-300 leading-relaxed mb-6 max-w-3xl">
                  {resume.description}
                </p>
              )}
            </div>
            
            {/* Enhanced Meta info row with colored icons */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-700/30 relative z-10">
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30">
                    <CalendarIcon className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-gray-300 font-medium">{formatDate(resume.date, { format: 'medium' })}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30">
                    <DocumentIcon className="h-4 w-4 text-emerald-400" />
                  </div>
                  <span className="text-gray-300 font-medium">{resume.pageCount || 2} page{(resume.pageCount || 2) !== 1 ? 's' : ''}</span>
                </div>
              </div>
              
              {/* Share Buttons */}
              <div className="flex flex-col items-start gap-2">
                <span className="text-xs text-gray-400 font-medium">Share</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
                      const encodedTitle = encodeURIComponent(resume.title)
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

        {/* Enhanced Main Content Layout */}
        <div>
          <div className="bg-gradient-to-br from-card-background via-card-background to-card-background/90 backdrop-blur-sm border border-gray-800/50 rounded-xl p-8 lg:p-12 relative overflow-hidden" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)' }}>
            {/* Subtle content background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-500/3 via-transparent to-gray-500/3 pointer-events-none"></div>
            
            <article className="article-body prose prose-invert prose-lg max-w-none relative z-10">
              <MDXContent />
            </article>
          </div>

          {/* Enhanced Document Footer */}
          <footer className="mt-12 pt-8 border-t border-gradient-to-r from-transparent via-gray-700/50 to-transparent relative">
            <div className="bg-gradient-to-br from-card-background/50 to-card-background/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <p className="text-sm text-gray-400 mb-3 font-medium">Related Topics:</p>
                  <TagList tags={resume.tags || []} variant="compact" />
                </div>
                <div className="flex flex-col items-end gap-3">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Explore More</p>
                  <Button
                    as="link"
                    href={`/${ds.id}`}
                    variant="secondary"
                    size="sm"
                    className="hover:scale-105 transition-transform duration-200"
                  >
                    More {ds.itemNamePlural}
                  </Button>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </ArticleLayout>
  )
}

export async function getStaticProps() {
  const resume = allDocs.find(doc => doc.slugAsParams === 'resume' || doc.category === 'resume')

  return {
    props: {
      resume,
      dataSource: 'documents',
    } as Props,
  }
}

export default Resume
