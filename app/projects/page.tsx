import { Metadata } from 'next'
import { getDataSource } from 'constants/data-sources'
import ProjectsPageClient from './projects-page-client'

export const metadata: Metadata = {
  title: 'Projects | Patrick Hanford',
  description: 'A showcase of my software projects, applications, and open-source contributions.',
}

async function getProjectsData(page: number) {
  const dataSource = getDataSource('projects')
  const projects = dataSource.getItems() || []
  const tags = dataSource.getAvailableTags()

  return {
    projects,
    tags,
    pageIndex: page - 1, // Convert 1-based page to 0-based index
    path: '/projects',
  }
}

type PageProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const { projects, tags, pageIndex } = await getProjectsData(page)

  return (
    <ProjectsPageClient
      projects={projects}
      tags={tags}
      pageIndex={pageIndex}
    />
  )
}
