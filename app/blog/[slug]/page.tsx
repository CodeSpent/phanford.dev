import { Metadata } from 'next'
import { allArticles } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import BlogArticleClient from './blog-article-client'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return allArticles.map((article) => ({
    slug: article.slugAsParams,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = allArticles.find((article) => article.slugAsParams === slug)

  if (!article) {
    return {}
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.phanford.dev'
  const articleUrl = `${baseUrl}/blog/${article.slugAsParams}`
  
  // Try to extract first image from content for social sharing
  let imageUrl = `${baseUrl}/og-image.png` // fallback image
  if (article.body?.raw) {
    const imageMatch = article.body.raw.match(/!\[([^\]]*)\]\(([^)]+)\)/)
    if (imageMatch) {
      imageUrl = `${baseUrl}/articles/${article.slugAsParams}/${imageMatch[2]}`
    }
  }

  return {
    title: `${article.title} | Patrick Hanford`,
    description: article.description || article.excerpt || `Read ${article.title} by Patrick Hanford`,
    openGraph: {
      title: article.title,
      description: article.description || article.excerpt || `Read ${article.title} by Patrick Hanford`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: 'article',
      publishedTime: article.published || article.date,
      modifiedTime: article.date,
      authors: ['Patrick Hanford'],
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description || article.excerpt || `Read ${article.title} by Patrick Hanford`,
      images: [imageUrl],
    },
    authors: [{ name: 'Patrick Hanford' }],
    keywords: article.tags,
  }
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const article = allArticles.find((article) => article.slugAsParams === slug)

  if (!article) {
    notFound()
  }

  // Calculate prev/next articles
  const currentIndex = allArticles.findIndex((art) => art.slugAsParams === slug)
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null

  return (
    <BlogArticleClient
      article={article}
      slug={slug}
      prevArticle={prevArticle}
      nextArticle={nextArticle}
    />
  )
}