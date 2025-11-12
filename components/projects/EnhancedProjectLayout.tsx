'use client'

import React from 'react'
import Image from 'next/image'
import { useMDXComponent } from 'next-contentlayer2/hooks'
import MDXErrorBoundary from '../common/MDXErrorBoundary'
import ArticleImage from '../blog/ArticleImage'
import { ProjectStatusBadge } from '../blog/ProjectStatusBadge'
import { ProjectLinks, ProjectLink } from '../blog/ProjectLinks'
import { StickyHeaderBar } from './StickyHeaderBar'
import { GitHubStatsCard } from './GitHubStatsCard'
import { ReleasesTimeline } from './ReleasesTimeline'
import { ConditionalModule } from './ConditionalModule'
import { ProjectStatsModule } from './ProjectStatsModule'
import { GitHubData } from '@/lib/github-api'
import { MDXComponents } from 'mdx/types'
import { Project } from 'contentlayer/generated'
import { getTechIcon } from '@/config/tech-stack-icons'

// New unified components
import { UnifiedContentHeader } from '../content/UnifiedContentHeader'
import { ContentDetailLayout } from '../content/ContentDetailLayout'
import { TableOfContentsModule } from '../content/TableOfContentsModule'
import { MetaInfoModule } from '../content/MetaInfoModule'
import { SidebarModule } from '../content/SidebarModule'
import { PackageInfoModule } from '../content/PackageInfoModule'

interface EnhancedProjectLayoutProps {
  project: Project
  githubData?: GitHubData | null
  nextProject?: Project | null
}

/**
 * Enhanced Project Layout - Now using unified components
 * Maintains all project-specific features while using shared UI patterns
 */
export const EnhancedProjectLayout: React.FC<EnhancedProjectLayoutProps> = ({
  project,
  githubData,
  nextProject,
}) => {
  const MDXContent = project.body?.code ? useMDXComponent(project.body.code) : null

  const mdxComponents: MDXComponents = {
    img: (props) => {
      const isHeaderImage = project.headerImage
        ? props.src === project.headerImage
        : project.body?.raw && project.body.raw.indexOf(props.src || '') < 200

      return (
        <ArticleImage
          src={props.src || ''}
          alt={props.alt}
          contentType="projects"
          articleSlug={project.slugAsParams}
          isHeaderImage={isHeaderImage}
          imagePosition={project.imagePosition}
        />
      )
    },
  }

  const allTechnologies = [...(project.technologies || []), ...(project.languages || [])]
  const links = (project.links as ProjectLink[]) || []

  return (
    <>
      {/* Sticky Header Bar - Always visible */}
      <StickyHeaderBar
        title={project.title}
        icon={project.icon}
        status={project.status}
        links={links}
        githubStats={githubData?.stats || null}
        latestCommit={githubData?.latestCommit || null}
        ctaButtonConfig={project.ctaButtonConfig}
      />

      <ContentDetailLayout
        backLink={{
          href: '/projects',
          label: 'Back to Projects',
        }}
        nextLink={
          nextProject
            ? {
                href: `/projects/${nextProject.slugAsParams}`,
                label: 'Next Project',
              }
            : undefined
        }
        sidebar={
          <>
            {/* Package Info Module - Top priority for packages/bots */}
            <PackageInfoModule
              version={project.version}
              latestRelease={
                githubData?.releases && githubData.releases.length > 0
                  ? {
                      version: githubData.releases[0].tag_name,
                      date: githubData.releases[0].published_at,
                      url: githubData.releases[0].html_url,
                    }
                  : undefined
              }
              repository={project.githubRepo}
              lastCommit={
                githubData?.latestCommit
                  ? {
                      date: githubData.latestCommit.commit.author.date,
                      message: githubData.latestCommit.commit.message,
                      sha: githubData.latestCommit.sha,
                      url: githubData.latestCommit.html_url,
                      author: githubData.latestCommit.commit.author.name,
                    }
                  : undefined
              }
              ctaButtons={
                links.length > 0
                  ? links.slice(0, 2).map((link, index) => ({
                      label: link.label,
                      url: link.url,
                      variant: index === 0 ? 'primary' : 'secondary',
                      icon: link.icon ? (
                        <img src={link.icon} alt="" className="w-4 h-4" />
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      ),
                    }))
                  : undefined
              }
            />

            {/* Project Info Module */}
            <SidebarModule title="Project Info">
              <div className="space-y-4">
                <div className="pl-3">
                  <div className="text-xs text-gray-500 mb-1">Status</div>
                  <ProjectStatusBadge status={project.status} />
                </div>

                {project.category && (
                  <div className="pl-3">
                    <div className="text-xs text-gray-500 mb-1">Category</div>
                    <div className="text-sm text-gray-300">{project.category}</div>
                  </div>
                )}

                {project.startDate && (
                  <div className="pl-3">
                    <div className="text-xs text-gray-500 mb-1">Started</div>
                    <div className="text-sm text-gray-300">
                      {new Date(project.startDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </div>
                  </div>
                )}

                {project.lastUpdated && (
                  <div className="pl-3">
                    <div className="text-xs text-gray-500 mb-1">Last Updated</div>
                    <div className="text-sm text-gray-300">
                      {new Date(project.lastUpdated).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                )}
              </div>
            </SidebarModule>

            {/* Project Stats Module - Custom metrics */}
            <ProjectStatsModule
              stats={project.stats || []}
              lastUpdated={project.statsLastUpdated || project.lastUpdated}
            />

            {/* Tech Stack Module */}
            <ConditionalModule data={allTechnologies}>
              <SidebarModule title="Tech Stack">
                <div className="space-y-2">
                  {allTechnologies.map((tech, index) => {
                    const iconConfig = getTechIcon(tech)
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2 pl-3 py-1.5 text-sm"
                      >
                        {iconConfig && (
                          <span className={iconConfig.color || 'text-gray-400'}>
                            {iconConfig.icon}
                          </span>
                        )}
                        <span className="text-gray-300">{tech}</span>
                      </div>
                    )
                  })}
                </div>
              </SidebarModule>
            </ConditionalModule>

            {/* GitHub Stats Card */}
            {githubData?.stats && (
              <GitHubStatsCard
                stats={githubData.stats}
                repoUrl={project.githubRepo || '#'}
              />
            )}

            {/* Releases Timeline */}
            {githubData?.releases && githubData.releases.length > 0 && (
              <ReleasesTimeline releases={githubData.releases} />
            )}

            {/* Highlighted Features */}
            <ConditionalModule data={project.highlightedFeatures}>
              <SidebarModule title="Key Features">
                <ul className="space-y-2">
                  {(project.highlightedFeatures || []).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                      <svg
                        className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </SidebarModule>
            </ConditionalModule>

            {/* Table of Contents - at bottom so it can scroll */}
            <TableOfContentsModule />
          </>
        }
      >
        {/* Unified Header - NEW! */}
        <UnifiedContentHeader
          title={project.title}
          description={project.description}
          tags={project.tags || []}
          date={project.startDate}
          status={project.status}
          version={project.version}
          category={project.category}
          websiteUrl={project.websiteUrl}
          screenshotLink={project.screenshotLink}
          startDate={project.startDate}
          endDate={project.endDate}
          showSocialShare={true}
          className="mb-6"
        />

        {/* Header Image */}
        {project.headerImage && (
          <div className="rounded-lg overflow-hidden border border-gray-800/50">
            <div className="w-full aspect-video bg-gray-900">
              <Image
                src={project.headerImage}
                alt={project.title}
                width={1200}
                height={675}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* MDX Content */}
        {MDXContent && (
          <SidebarModule className="p-8">
            <MDXErrorBoundary>
              <article
                className="article-body prose prose-invert max-w-none
                prose-headings:text-white prose-headings:font-semibold
                prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-gray-400 prose-p:leading-relaxed
                prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-300 prose-strong:font-semibold
                prose-code:text-pink-400 prose-code:bg-gray-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-pre:rounded-lg
                prose-ul:text-gray-400
                prose-ol:text-gray-400
                prose-li:text-gray-400
                prose-img:rounded-lg"
              >
                <MDXContent components={mdxComponents} />
              </article>
            </MDXErrorBoundary>
          </SidebarModule>
        )}

        {/* Video Demo */}
        <ConditionalModule data={project.videoUrl}>
          <SidebarModule className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">Demo Video</h2>
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-900">
              <iframe
                src={project.videoUrl}
                title={`${project.title} demo video`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </SidebarModule>
        </ConditionalModule>
      </ContentDetailLayout>
    </>
  )
}
