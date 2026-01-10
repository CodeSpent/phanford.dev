import { Metadata } from 'next'
import { getDataSource } from 'constants/data-sources'
import PhotographyPageClient from './photography-page-client'

export const metadata: Metadata = {
  title: 'Photography | Patrick Hanford',
  description: 'A collection of photography work by Patrick Hanford.',
}

async function getPhotographyData(page: number) {
  const dataSource = getDataSource('photography')
  const items = dataSource.getItems() || []
  const tags = dataSource.getAvailableTags()

  return {
    items,
    tags,
    pageIndex: page - 1, // Convert 1-based page to 0-based index
    path: '/photography',
  }
}

type PageProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function PhotographyPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const { items, tags, pageIndex } = await getPhotographyData(page)

  return (
    <PhotographyPageClient
      items={items}
      tags={tags}
      pageIndex={pageIndex}
    />
  )
}
