import { Metadata } from 'next'
import { getDataSource } from 'constants/data-sources'
import ContentListingPageClient from 'components/content/ContentListingPageClient'

export const metadata: Metadata = {
  title: 'Documents | Patrick Hanford',
  description: 'Documents, guides, and resources by Patrick Hanford.',
}

async function getDocumentsData(page: number) {
  const dataSource = getDataSource('documents')
  const items = dataSource.getItems() || []
  const tags = dataSource.getAvailableTags()

  return {
    items,
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
  const { items, tags, pageIndex } = await getDocumentsData(page)

  return (
    <ContentListingPageClient
      items={items}
      tags={tags}
      pageIndex={pageIndex}
      dataSourceType="documents"
    />
  )
}
