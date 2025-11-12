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
  const photo = allPhotos.find((photo) => photo.slugAsParams === slug)

  if (!photo) {
    notFound()
  }

  return <PhotoPageClient photo={photo} slug={slug} />
}