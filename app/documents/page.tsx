import { Metadata } from 'next'
import { getDataSource } from 'constants/data-sources'
import DocumentsPageClient from './documents-page-client'

export const metadata: Metadata = {
  title: 'Documents | Patrick Hanford',
  description: 'Documents, guides, and resources by Patrick Hanford.',
}

async function getDocumentsData(page: number) {
  const dataSource = getDataSource('documents')
  const articles = dataSource.getItems() || []
  const tags = dataSource.getAvailableTags()

  return {
    articles,
    tags,
    pageIndex: page - 1, // Convert 1-based page to 0-based index
    path: '/documents',
  }
}

type PageProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function DocumentsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const { articles, tags, pageIndex } = await getDocumentsData(page)

  return (
    <DocumentsPageClient
      articles={articles}
      tags={tags}
      pageIndex={pageIndex}
    />
  )
}