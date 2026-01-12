import { Metadata } from 'next'
import { getDataSource } from 'constants/data-sources'
import ContentListingPageClient from 'components/content/ContentListingPageClient'

export const metadata: Metadata = {
  title: 'Projects | Patrick Hanford',
  description: 'A showcase of my software projects, applications, and open-source contributions.',
  openGraph: {
    title: 'Projects | Patrick Hanford',
    description: 'A showcase of my software projects, applications, and open-source contributions.',
    images: [
      {
        url: '/og-projects.svg',
        width: 1200,
        height: 630,
        alt: 'Patrick Hanford Projects',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Patrick Hanford',
    description: 'A showcase of my software projects, applications, and open-source contributions.',
    images: ['/og-projects.svg'],
  },
}

async function getProjectsData(page: number) {
  const dataSource = getDataSource('projects')
  const items = dataSource.getItems() || []
  const tags = dataSource.getAvailableTags()

  return {
    items,
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
  const { items, tags, pageIndex } = await getProjectsData(page)

  return (
    <ContentListingPageClient
      items={items}
      tags={tags}
      pageIndex={pageIndex}
      dataSourceType="projects"
    />
  )
}
