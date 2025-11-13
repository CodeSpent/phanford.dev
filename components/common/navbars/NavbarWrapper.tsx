import { allArticles, allProjects, allPhotos } from 'contentlayer/generated'
import StickyNavbar from './StickyNavbar'
import { BadgeVariant } from '../NavBadge'

export interface BadgeData {
  Articles?: {
    count: number
    variant: BadgeVariant
    show: boolean
  }
  Projects?: {
    count: number
    variant: BadgeVariant
    show: boolean
  }
  Photography?: {
    count: number
    variant: BadgeVariant
    show: boolean
  }
}

/**
 * Server component that calculates badge data and passes to StickyNavbar
 */
export default function NavbarWrapper() {
  // Calculate badge data on the server
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const recentArticles = allArticles.filter(
    article => article.date && new Date(article.date) > thirtyDaysAgo
  ).length

  const activeProjects = allProjects.filter(
    project => project.status === 'active' || project.status === 'in-development'
  ).length

  const totalPhotos = allPhotos.length

  const badgeData: BadgeData = {
    Articles: {
      count: recentArticles,
      variant: 'new',
      show: recentArticles > 0,
    },
    Projects: {
      count: activeProjects,
      variant: 'active',
      show: activeProjects > 0,
    },
    Photography: {
      count: totalPhotos,
      variant: 'info',
      show: totalPhotos > 0,
    },
  }

  return <StickyNavbar badgeData={badgeData} />
}
