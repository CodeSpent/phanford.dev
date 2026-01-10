import { Metadata } from 'next'
import { getDataSource } from 'constants/data-sources'
import ContentListingPageClient from 'components/content/ContentListingPageClient'

export const metadata: Metadata = {
  title: 'Blog | Patrick Hanford',
  description: 'Articles and thoughts on web development, software engineering, and technology.',
}

async function getBlogData(page: number) {
  const dataSource = getDataSource('blog')
  const items = dataSource.getItems() || []
  const tags = dataSource.getAvailableTags()

  return {
    items,
    tags,
    pageIndex: page - 1, // Convert 1-based page to 0-based index
    path: '/blog',
  }
}

type PageProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const { items, tags, pageIndex } = await getBlogData(page)

  return (
    <ContentListingPageClient
      items={items}
      tags={tags}
      pageIndex={pageIndex}
      dataSourceType="blog"
    />
  )
}
