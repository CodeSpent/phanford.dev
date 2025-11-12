import { Metadata } from 'next'
import { allPhotos } from 'contentlayer/generated'
import PhotographyPageClient from './photography-page-client'

export const metadata: Metadata = {
  title: 'Photography | Patrick Hanford',
  description: 'A collection of photography work by Patrick Hanford.',
}

async function getPhotographyData(page: number) {
  const photos = allPhotos || []

  // Extract unique tags from all photos
  const allTags = photos.flatMap(photo => photo.tags || [])
  const uniqueTags = Array.from(new Set(allTags))

  return {
    photos,
    tags: uniqueTags,
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
  const { photos, tags, pageIndex } = await getPhotographyData(page)

  return (
    <PhotographyPageClient
      photos={photos}
      tags={tags}
      pageIndex={pageIndex}
    />
  )
}