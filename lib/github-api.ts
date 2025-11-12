/**
 * GitHub API Integration
 *
 * Provides typed interfaces and functions for fetching GitHub repository data.
 * Includes error handling and supports both client and server-side fetching.
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface GitHubRepoStats {
  stars: number
  forks: number
  watchers: number
  openIssues: number
  language: string | null
  license: string | null
  topics: string[]
  homepage: string | null
  updatedAt: string
}

export interface GitHubCommit {
  sha: string
  message: string
  author: {
    name: string
    avatar: string
    username: string
  }
  date: string
  url: string
}

export interface GitHubRelease {
  id: number
  tagName: string
  name: string
  body: string
  publishedAt: string
  htmlUrl: string
  isPrerelease: boolean
  isDraft: boolean
  author: {
    username: string
    avatar: string
  }
}

export interface GitHubContributor {
  username: string
  avatar: string
  contributions: number
  profileUrl: string
}

export interface GitHubData {
  stats: GitHubRepoStats | null
  latestCommit: GitHubCommit | null
  releases: GitHubRelease[]
  contributors: GitHubContributor[]
  error: string | null
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Extract owner and repo name from GitHub URL
 * Supports: https://github.com/owner/repo or github.com/owner/repo
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/i)
  if (!match) return null

  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, '') // Remove .git suffix if present
  }
}

/**
 * Format relative time from ISO date string
 */
export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()

  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffSeconds < 60) return `${diffSeconds}s ago`
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffWeeks < 4) return `${diffWeeks}w ago`
  if (diffMonths < 12) return `${diffMonths}mo ago`
  return `${diffYears}y ago`
}

/**
 * Create GitHub API headers with optional auth token
 */
function getGitHubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  }

  // Use environment variable for GitHub token if available (increases rate limit)
  if (typeof process !== 'undefined' && process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`
  }

  return headers
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Fetch repository statistics
 */
export async function fetchRepoStats(owner: string, repo: string): Promise<GitHubRepoStats | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: getGitHubHeaders(),
      next: { revalidate: 3600 } // Cache for 1 hour (Next.js 13+)
    })

    if (!response.ok) {
      console.warn(`GitHub API error for ${owner}/${repo}:`, response.statusText)
      return null
    }

    const data = await response.json()

    return {
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      watchers: data.watchers_count || 0,
      openIssues: data.open_issues_count || 0,
      language: data.language || null,
      license: data.license?.spdx_id || null,
      topics: data.topics || [],
      homepage: data.homepage || null,
      updatedAt: data.updated_at
    }
  } catch (error) {
    console.error(`Error fetching repo stats for ${owner}/${repo}:`, error)
    return null
  }
}

/**
 * Fetch latest commit on default branch (usually main/master)
 */
export async function fetchLatestCommit(owner: string, repo: string, branch: string = 'main'): Promise<GitHubCommit | null> {
  try {
    // First try 'main', fallback to 'master' if it fails
    let response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${branch}`, {
      headers: getGitHubHeaders(),
      next: { revalidate: 300 } // Cache for 5 minutes
    })

    if (!response.ok && branch === 'main') {
      // Try 'master' as fallback
      response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/master`, {
        headers: getGitHubHeaders(),
        next: { revalidate: 300 }
      })
    }

    if (!response.ok) {
      console.warn(`GitHub API error fetching commits for ${owner}/${repo}:`, response.statusText)
      return null
    }

    const data = await response.json()

    return {
      sha: data.sha.substring(0, 7), // Short SHA
      message: data.commit.message.split('\n')[0], // First line only
      author: {
        name: data.commit.author.name,
        avatar: data.author?.avatar_url || `https://github.com/${data.commit.author.name}.png`,
        username: data.author?.login || data.commit.author.name
      },
      date: data.commit.author.date,
      url: data.html_url
    }
  } catch (error) {
    console.error(`Error fetching latest commit for ${owner}/${repo}:`, error)
    return null
  }
}

/**
 * Fetch repository releases
 */
export async function fetchReleases(owner: string, repo: string, limit: number = 10): Promise<GitHubRelease[]> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases?per_page=${limit}`, {
      headers: getGitHubHeaders(),
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      console.warn(`GitHub API error fetching releases for ${owner}/${repo}:`, response.statusText)
      return []
    }

    const data = await response.json()

    return data.map((release: any) => ({
      id: release.id,
      tagName: release.tag_name,
      name: release.name || release.tag_name,
      body: release.body || '',
      publishedAt: release.published_at,
      htmlUrl: release.html_url,
      isPrerelease: release.prerelease,
      isDraft: release.draft,
      author: {
        username: release.author.login,
        avatar: release.author.avatar_url
      }
    }))
  } catch (error) {
    console.error(`Error fetching releases for ${owner}/${repo}:`, error)
    return []
  }
}

/**
 * Fetch repository contributors
 */
export async function fetchContributors(owner: string, repo: string, limit: number = 5): Promise<GitHubContributor[]> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=${limit}`, {
      headers: getGitHubHeaders(),
      next: { revalidate: 86400 } // Cache for 24 hours
    })

    if (!response.ok) {
      console.warn(`GitHub API error fetching contributors for ${owner}/${repo}:`, response.statusText)
      return []
    }

    const data = await response.json()

    return data.map((contributor: any) => ({
      username: contributor.login,
      avatar: contributor.avatar_url,
      contributions: contributor.contributions,
      profileUrl: contributor.html_url
    }))
  } catch (error) {
    console.error(`Error fetching contributors for ${owner}/${repo}:`, error)
    return []
  }
}

/**
 * Fetch all GitHub data for a repository (comprehensive)
 */
export async function fetchGitHubData(githubUrl: string): Promise<GitHubData> {
  const parsed = parseGitHubUrl(githubUrl)

  if (!parsed) {
    return {
      stats: null,
      latestCommit: null,
      releases: [],
      contributors: [],
      error: 'Invalid GitHub URL'
    }
  }

  const { owner, repo } = parsed

  try {
    // Fetch all data in parallel for better performance
    const [stats, latestCommit, releases, contributors] = await Promise.all([
      fetchRepoStats(owner, repo),
      fetchLatestCommit(owner, repo),
      fetchReleases(owner, repo),
      fetchContributors(owner, repo)
    ])

    return {
      stats,
      latestCommit,
      releases,
      contributors,
      error: null
    }
  } catch (error) {
    return {
      stats: null,
      latestCommit: null,
      releases: [],
      contributors: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Format number with K/M suffix for large numbers
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}
