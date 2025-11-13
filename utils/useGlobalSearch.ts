'use client'

import lunr from 'lunr'
import { useEffect, useState, useCallback, useRef } from 'react'
import { allArticles, allProjects, allPhotos, allDocs } from 'contentlayer/generated'

export type ContentType = 'article' | 'project' | 'photo' | 'document' | 'all'

export interface SearchResult {
  id: string
  type: 'article' | 'project' | 'photo' | 'document'
  title: string
  description: string
  url: string
  tags?: string[]
  category?: string
  status?: string
  readingTime?: string
  date?: string
  icon?: string
  imageUrl?: string
  [key: string]: any
}

interface SearchState {
  results: SearchResult[]
  isLoading: boolean
  isIndexLoaded: boolean
  error: string | null
}

const RECENT_SEARCHES_KEY = 'global-search-recent'
const MAX_RECENT_SEARCHES = 10
const DEBOUNCE_MS = 300

// Progressive enhancement: client-side filtering before Lunr loads
function getClientSideResults(query: string, typeFilter: ContentType = 'all'): SearchResult[] {
  if (!query) return []

  const lowerQuery = query.toLowerCase()
  const allContent: SearchResult[] = []

  // Transform and filter articles
  if (typeFilter === 'all' || typeFilter === 'article') {
    const articleResults = allArticles
      .filter(article =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.description?.toLowerCase().includes(lowerQuery) ||
        article.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
      .map(article => ({
        id: `article-${article.slug}`,
        type: 'article' as const,
        title: article.title,
        description: article.description || article.excerpt || '',
        url: `/blog/${article.slugAsParams}`,
        tags: article.tags,
        readingTime: article.readingTime ? `${article.readingTime} min read` : undefined,
        date: article.date,
      }))
    allContent.push(...articleResults)
  }

  // Transform and filter projects
  if (typeFilter === 'all' || typeFilter === 'project') {
    const projectResults = allProjects
      .filter(project =>
        project.title.toLowerCase().includes(lowerQuery) ||
        project.shortDescription?.toLowerCase().includes(lowerQuery) ||
        project.description?.toLowerCase().includes(lowerQuery) ||
        project.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        project.technologies?.some(tech => tech.toLowerCase().includes(lowerQuery)) ||
        project.languages?.some(lang => lang.toLowerCase().includes(lowerQuery))
      )
      .map(project => ({
        id: `project-${project.slug}`,
        type: 'project' as const,
        title: project.title,
        description: project.shortDescription || project.description || '',
        url: `/projects/${project.slug}`,
        tags: project.tags,
        category: project.category,
        status: project.status,
        icon: project.icon,
        technologies: project.technologies,
        languages: project.languages,
      }))
    allContent.push(...projectResults)
  }

  // Transform and filter photos
  if (typeFilter === 'all' || typeFilter === 'photo') {
    const photoResults = allPhotos
      .filter(photo =>
        photo.title.toLowerCase().includes(lowerQuery) ||
        photo.description?.toLowerCase().includes(lowerQuery) ||
        photo.location?.toLowerCase().includes(lowerQuery) ||
        photo.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
      .map(photo => ({
        id: `photo-${photo.slug}`,
        type: 'photo' as const,
        title: photo.title,
        description: photo.description || '',
        url: `/photography/${photo.slug}`,
        tags: photo.tags,
        location: photo.location,
        camera: photo.camera,
        imageUrl: photo.imageUrl,
      }))
    allContent.push(...photoResults)
  }

  // Transform and filter documents
  if (typeFilter === 'all' || typeFilter === 'document') {
    const docResults = allDocs
      .filter(doc =>
        doc.title.toLowerCase().includes(lowerQuery) ||
        doc.description?.toLowerCase().includes(lowerQuery) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
      .map(doc => ({
        id: `doc-${doc.slug}`,
        type: 'document' as const,
        title: doc.title,
        description: doc.description || '',
        url: `/documents/${doc.slug}`,
        tags: doc.tags,
        category: doc.category,
        fileType: doc.fileType,
      }))
    allContent.push(...docResults)
  }

  return allContent.slice(0, 20) // Limit to 20 results for performance
}

// Load Lunr index asynchronously
function loadLunrIndex() {
  if (typeof window !== 'undefined') {
    window.__GLOBAL_SEARCH__ = window.__GLOBAL_SEARCH__ || {}
    if (!window.__GLOBAL_SEARCH__?.__loaded) {
      window.__GLOBAL_SEARCH__.__loaded =
        typeof fetch !== 'undefined'
        ? fetch(`/indexes/global-search.json`, {
          credentials: 'same-origin',
        })
          .then(response => {
            if (!response.ok) throw new Error('Failed to load search index')
            return response.json()
          })
          .then(fullIndex => {
            window.__GLOBAL_SEARCH__ = {
              index: lunr.Index.load(fullIndex.index),
              store: fullIndex.store,
              __loaded: window.__GLOBAL_SEARCH__?.__loaded,
            }
            return true
          })
          .catch(error => {
            console.warn('Failed to load search index, falling back to client-side search:', error)
            return false
          })
        : undefined
    }
  }
}

// Get results using Lunr
function getLunrResults(query: string, typeFilter: ContentType = 'all'): SearchResult[] {
  if (!query || !(window as any)?.__GLOBAL_SEARCH__?.index) return []

  const lunrData = (window as any).__GLOBAL_SEARCH__
  const escapedStr = query.replace(/[-/\\^$*+?.()|[\]{}:]/g, '\\$&')

  // Perform both wildcard and exact searches for better results
  const wildcardResults = lunrData.index.search(`*${escapedStr}*`)
  const exactResults = lunrData.index.search(escapedStr)

  // Merge and deduplicate results
  const refs = new Set([
    ...wildcardResults.map(({ ref }: { ref: string }) => ref),
    ...exactResults.map(({ ref }: { ref: string }) => ref),
  ])

  // Map refs to full search results
  const results = Array.from(refs)
    .map(ref => lunrData.store[ref] as SearchResult)
    .filter(result => typeFilter === 'all' || result.type === typeFilter)

  return results
}

// Recent searches management
function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function addRecentSearch(query: string) {
  if (typeof window === 'undefined' || !query.trim()) return
  try {
    const recent = getRecentSearches()
    const updated = [query, ...recent.filter(q => q !== query)].slice(0, MAX_RECENT_SEARCHES)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  } catch {
    // Fail silently
  }
}

function clearRecentSearches() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  } catch {
    // Fail silently
  }
}

export function useGlobalSearch() {
  const [state, setState] = useState<SearchState>({
    results: [],
    isLoading: false,
    isIndexLoaded: false,
    error: null,
  })
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [typeFilter, setTypeFilter] = useState<ContentType>('all')
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Load Lunr index on mount
  useEffect(() => {
    loadLunrIndex()
    setRecentSearches(getRecentSearches())

    // Check if index is loaded
    const checkInterval = setInterval(() => {
      if ((window as any)?.__GLOBAL_SEARCH__?.index) {
        setState(prev => ({ ...prev, isIndexLoaded: true }))
        clearInterval(checkInterval)
      }
    }, 100)

    return () => clearInterval(checkInterval)
  }, [])

  // Search function with debouncing
  const search = useCallback((query: string, filter: ContentType = typeFilter) => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Update loading state immediately
    setState(prev => ({ ...prev, isLoading: true }))

    // Debounce the actual search
    debounceTimerRef.current = setTimeout(() => {
      if (!query.trim()) {
        setState({
          results: [],
          isLoading: false,
          isIndexLoaded: state.isIndexLoaded,
          error: null,
        })
        return
      }

      try {
        let results: SearchResult[]

        // Use Lunr if loaded, otherwise fall back to client-side search
        if (state.isIndexLoaded && (window as any)?.__GLOBAL_SEARCH__?.index) {
          results = getLunrResults(query, filter)
        } else {
          results = getClientSideResults(query, filter)
        }

        setState({
          results,
          isLoading: false,
          isIndexLoaded: state.isIndexLoaded,
          error: null,
        })

        // Add to recent searches
        addRecentSearch(query)
        setRecentSearches(getRecentSearches())
      } catch (error) {
        setState({
          results: [],
          isLoading: false,
          isIndexLoaded: state.isIndexLoaded,
          error: 'Search failed. Please try again.',
        })
      }
    }, DEBOUNCE_MS)
  }, [typeFilter, state.isIndexLoaded])

  // Clear results
  const clear = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    setState({
      results: [],
      isLoading: false,
      isIndexLoaded: state.isIndexLoaded,
      error: null,
    })
  }, [state.isIndexLoaded])

  // Update type filter
  const setFilter = useCallback((filter: ContentType) => {
    setTypeFilter(filter)
  }, [])

  // Clear recent searches
  const clearRecent = useCallback(() => {
    clearRecentSearches()
    setRecentSearches([])
  }, [])

  return {
    results: state.results,
    isLoading: state.isLoading,
    isIndexLoaded: state.isIndexLoaded,
    error: state.error,
    search,
    clear,
    typeFilter,
    setFilter,
    recentSearches,
    clearRecent,
  }
}

// Declare global type
declare global {
  interface Window {
    __GLOBAL_SEARCH__?: {
      index?: lunr.Index
      store?: Record<string, SearchResult>
      __loaded?: Promise<boolean>
    }
  }
}
