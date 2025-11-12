import { Metadata } from 'next'
import { allProjects } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import ProjectClient from './project-client'
import { fetchGitHubData } from '@/lib/github-api'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return allProjects.map((project) => ({
    slug: project.slugAsParams,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = allProjects.find((proj) => proj.slugAsParams === slug)

  if (!project) {
    return {}
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://phanford.dev'
  const projectUrl = `${baseUrl}/projects/${project.slugAsParams}`

  // Use project icon or fallback
  const imageUrl = project.icon
    ? `${baseUrl}${project.icon}`
    : `${baseUrl}/og-image.png`

  return {
    title: `${project.title} | Patrick Hanford`,
    description: project.description || `${project.title} - ${project.shortDescription}`,
    openGraph: {
      title: project.title,
      description: project.description || project.shortDescription,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      type: 'website',
      url: projectUrl,
      siteName: 'Patrick Hanford',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description || project.shortDescription,
      images: [imageUrl],
    },
    authors: [{ name: 'Patrick Hanford' }],
    keywords: [...(project.technologies || []), ...(project.languages || []), project.category],
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = allProjects.find((proj) => proj.slugAsParams === slug)

  if (!project) {
    notFound()
  }

  // Fetch GitHub data if repository URL is provided
  let githubData: Awaited<ReturnType<typeof fetchGitHubData>> | null = null
  if (project.githubRepo) {
    try {
      githubData = await fetchGitHubData(project.githubRepo)
    } catch (error) {
      console.error(`Failed to fetch GitHub data for ${project.title}:`, error)
      // Continue rendering without GitHub data
    }
  }

  // Calculate next project (loop back to beginning at end)
  const currentIndex = allProjects.findIndex((proj) => proj.slugAsParams === slug)
  const nextProject = currentIndex < allProjects.length - 1
    ? allProjects[currentIndex + 1]
    : allProjects[0] // Loop back to first project

  return (
    <ProjectClient
      project={project}
      slug={slug}
      githubData={githubData}
      nextProject={nextProject}
    />
  )
}
