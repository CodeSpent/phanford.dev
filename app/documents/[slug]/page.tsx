import { Metadata } from 'next'
import { allDocs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import DocumentClient from './document-client'
import { getLatexDocument, getLatexDocumentIndex } from '../../../utils/latex-loader'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  // Include both MDX docs and LaTeX docs
  const mdxSlugs = allDocs.map((doc) => ({
    slug: doc.slugAsParams,
  }))

  const latexIndex = getLatexDocumentIndex()
  const latexSlugs = latexIndex.map((doc) => ({
    slug: doc.slug,
  }))

  // Combine and deduplicate (LaTeX takes precedence)
  const slugSet = new Set<string>()
  const result: { slug: string }[] = []

  for (const item of latexSlugs) {
    if (!slugSet.has(item.slug)) {
      slugSet.add(item.slug)
      result.push(item)
    }
  }

  for (const item of mdxSlugs) {
    if (!slugSet.has(item.slug)) {
      slugSet.add(item.slug)
      result.push(item)
    }
  }

  return result
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  // Check for LaTeX document first
  const latexDoc = getLatexDocument(slug)
  if (latexDoc) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.phanford.dev'
    const title = latexDoc.metadata.title || latexDoc.metadata.name || 'Resume'
    const description = latexDoc.metadata.description || `Resume for ${latexDoc.metadata.name}`
    const tags = latexDoc.metadata.tags || []

    return {
      title: `${title} | Patrick Hanford`,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        authors: ['Patrick Hanford'],
        tags,
      },
      twitter: {
        card: 'summary',
        title,
        description,
      },
      authors: [{ name: 'Patrick Hanford' }],
      keywords: tags,
    }
  }

  // Fall back to MDX document
  const doc = allDocs.find((doc) => doc.slugAsParams === slug)

  if (!doc) {
    return {}
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.phanford.dev'
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

  // Check for LaTeX document first
  const latexDoc = getLatexDocument(slug)

  // Also try to find MDX document
  const doc = allDocs.find((doc) => doc.slugAsParams === slug)

  // If neither exists, 404
  if (!latexDoc && !doc) {
    notFound()
  }

  // Calculate prev/next documents (from MDX docs only for now)
  const currentIndex = allDocs.findIndex((d) => d.slugAsParams === slug)
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null
  const nextDoc = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null

  // If we have a LaTeX document, pass it along with a compatible document object
  if (latexDoc) {
    // Create a compatible document object for the client using info.json metadata
    const compatDoc = {
      title: latexDoc.metadata.title || latexDoc.metadata.name || 'Resume',
      description: latexDoc.metadata.description || `Resume for ${latexDoc.metadata.name}`,
      slugAsParams: slug,
      tags: latexDoc.metadata.tags || ['resume'],
      category: latexDoc.metadata.category || 'resume',
      date: latexDoc.metadata.date || new Date().toISOString(),
      body: { raw: latexDoc.raw, code: null },
    }

    return (
      <DocumentClient
        document={compatDoc}
        latexDocument={latexDoc}
        slug={slug}
        prevDoc={prevDoc}
        nextDoc={nextDoc}
      />
    )
  }

  return <DocumentClient document={doc} slug={slug} prevDoc={prevDoc} nextDoc={nextDoc} />
}
