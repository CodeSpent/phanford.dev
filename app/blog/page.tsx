import { Metadata } from 'next'
import { getDataSource } from 'constants/data-sources'
import BlogPageClient from './blog-page-client'

export const metadata: Metadata = {
  title: 'Blog | Patrick Hanford',
  description: 'Articles and thoughts on web development, software engineering, and technology.',
}

async function getBlogData(page: number) {
  const dataSource = getDataSource('blog')
  const articles = dataSource.getItems() || []
  const tags = dataSource.getAvailableTags()

  return {
    articles,
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
  const { articles, tags, pageIndex } = await getBlogData(page)

  return (
    <BlogPageClient
      articles={articles}
      tags={tags}
      pageIndex={pageIndex}
    />
  )
}