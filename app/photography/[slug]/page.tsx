import { Metadata } from 'next'
import { allPhotos } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import PhotoPageClient from './photo-page-client'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return allPhotos.map((photo) => ({
    slug: photo.slugAsParams,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const photo = allPhotos.find((photo) => photo.slugAsParams === slug)

  if (!photo) {
    return {}
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://phanford.dev'
  const imageUrl = `${baseUrl}${photo.imageUrl}`

  return {
    title: `${photo.title} | Patrick Hanford`,
    description: photo.description || `Photography by Patrick Hanford${photo.location ? ` taken in ${photo.location}` : ''}`,
    openGraph: {
      title: photo.title,
      description: photo.description || `Photography by Patrick Hanford${photo.location ? ` taken in ${photo.location}` : ''}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 800,
          alt: photo.title,
        },
      ],
      type: 'article',
      publishedTime: photo.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: photo.title,
      description: photo.description || `Photography by Patrick Hanford${photo.location ? ` taken in ${photo.location}` : ''}`,
      images: [imageUrl],
    },
  }
}

export default async function PhotoPage({ params }: Props) {
  const { slug } = await params

  // Sort photos by date descending (matching gallery order)
  const sortedPhotos = [...allPhotos].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const currentIndex = sortedPhotos.findIndex((p) => p.slugAsParams === slug)
  const photo = sortedPhotos[currentIndex]

  if (!photo) {
    notFound()
  }

  // Compute adjacent photo slugs (wrap around)
  const prevPhoto =
    currentIndex > 0
      ? sortedPhotos[currentIndex - 1]
      : sortedPhotos[sortedPhotos.length - 1]
  const nextPhoto =
    currentIndex < sortedPhotos.length - 1
      ? sortedPhotos[currentIndex + 1]
      : sortedPhotos[0]

  return (
    <PhotoPageClient
      photo={photo}
      slug={slug}
      prevSlug={prevPhoto?.slugAsParams}
      nextSlug={nextPhoto?.slugAsParams}
      currentIndex={currentIndex}
      totalPhotos={sortedPhotos.length}
    />
  )
}