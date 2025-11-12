'use client'

import React from 'react'
import DefaultLayout from '../../../layouts/DefaultLayout'
import { EnhancedProjectLayout } from '../../../components/projects/EnhancedProjectLayout'
import { GitHubData } from '@/lib/github-api'
import { Project } from 'contentlayer/generated'

type Props = {
  project: Project
  slug: string
  githubData?: GitHubData | null
  nextProject?: Project | null
}

export default function ProjectClient({ project, githubData, nextProject }: Props) {
  return (
    <DefaultLayout title={`${project.title} | Projects`}>
      <EnhancedProjectLayout
        project={project}
        githubData={githubData}
        nextProject={nextProject}
      />
    </DefaultLayout>
  )
}
