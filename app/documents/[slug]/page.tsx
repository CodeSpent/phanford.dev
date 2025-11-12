import { Metadata } from 'next'
import { allDocs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import DocumentClient from './document-client'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return allDocs.map((doc) => ({
    slug: doc.slugAsParams,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const doc = allDocs.find((doc) => doc.slugAsParams === slug)

  if (!doc) {
    return {}
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://phanford.dev'
  const docUrl = `${baseUrl}/documents/${doc.slugAsParams}`

  // Try to extract first image from content for social sharing
  let imageUrl = `${baseUrl}/og-image.png` // fallback image
  if (doc.body?.raw) {
    const imageMatch = doc.body.raw.match(/!\[([^\]]*)\]\(([^)]+)\)/)
    if (imageMatch) {
      imageUrl = `${baseUrl}/documents/${doc.slugAsParams}/${imageMatch[2]}`
    }
  }

  return {
    title: `${doc.title} | Patrick Hanford`,
    description: doc.description || `${doc.title} by Patrick Hanford`,
    openGraph: {
      title: doc.title,
      description: doc.description || `${doc.title} by Patrick Hanford`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: doc.title,
        },
      ],
      type: 'article',
      publishedTime: doc.date,
      modifiedTime: doc.date,
      authors: ['Patrick Hanford'],
      tags: doc.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: doc.title,
      description: doc.description || `${doc.title} by Patrick Hanford`,
      images: [imageUrl],
    },
    authors: [{ name: 'Patrick Hanford' }],
    keywords: doc.tags,
  }
}

export default async function DocumentPage({ params }: Props) {
  const { slug } = await params
  const doc = allDocs.find((doc) => doc.slugAsParams === slug)

  if (!doc) {
    notFound()
  }

  // Calculate prev/next documents
  const currentIndex = allDocs.findIndex((d) => d.slugAsParams === slug)
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null
  const nextDoc = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null

  return <DocumentClient document={doc} slug={slug} prevDoc={prevDoc} nextDoc={nextDoc} />
}
