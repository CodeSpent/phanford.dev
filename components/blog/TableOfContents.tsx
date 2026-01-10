import React, { useEffect, useState } from 'react'
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/solid'

interface Heading {
  id: string
  text: string
  level: number
  children?: Heading[]
}

interface TableOfContentsProps {
  className?: string
}

export default function TableOfContents({ className = '' }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Extract headings from the article content only
    const headingElements = document.querySelectorAll('.article-body h1, .article-body h2, .article-body h3, .article-body h4, .article-body h5, .article-body h6')
    const flatHeadings: Heading[] = []

    headingElements.forEach((heading, index) => {
      const text = heading.textContent || ''
      const level = parseInt(heading.tagName.charAt(1))
      let id = heading.id

      // Generate ID if it doesn't exist
      if (!id) {
        id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        heading.id = id
      }

      flatHeadings.push({ id, text, level, children: [] })
    })

    // Build hierarchical structure
    const buildHierarchy = (headings: Heading[]): Heading[] => {
      const result: Heading[] = []
      const stack: Heading[] = []

      headings.forEach((heading) => {
        // Remove items from stack that are at same or deeper level
        while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
          stack.pop()
        }

        if (stack.length === 0) {
          // Top level heading
          result.push(heading)
        } else {
          // Child heading
          const parent = stack[stack.length - 1]
          if (!parent.children) parent.children = []
          parent.children.push(heading)
        }

        stack.push(heading)
      })

      return result
    }

    setHeadings(buildHierarchy(flatHeadings))
  }, [])

  const getAllHeadingIds = (headings: Heading[]): string[] => {
    const ids: string[] = []
    const traverse = (items: Heading[]) => {
      items.forEach(item => {
        ids.push(item.id)
        if (item.children && item.children.length > 0) {
          traverse(item.children)
        }
      })
    }
    traverse(headings)
    return ids
  }

  const toggleCollapsed = (id: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const NAVBAR_OFFSET = 100

  useEffect(() => {
    if (headings.length === 0) return

    const allIds = getAllHeadingIds(headings)

    const updateActiveHeading = () => {
      const headingPositions = allIds
        .map(id => {
          const element = document.getElementById(id)
          if (!element) return null
          return {
            id,
            top: element.getBoundingClientRect().top
          }
        })
        .filter((item): item is { id: string; top: number } => item !== null)

      if (headingPositions.length === 0) return

      const scrollBottom = window.scrollY + window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      const isAtBottom = scrollBottom >= docHeight - 50

      if (isAtBottom) {
        setActiveId(headingPositions[headingPositions.length - 1].id)
        return
      }

      let activeHeading = headingPositions[0].id

      for (const heading of headingPositions) {
        if (heading.top <= NAVBAR_OFFSET + 10) {
          activeHeading = heading.id
        } else {
          break
        }
      }

      setActiveId(activeHeading)
    }

    updateActiveHeading()

    window.addEventListener('scroll', updateActiveHeading, { passive: true })

    return () => window.removeEventListener('scroll', updateActiveHeading)
  }, [headings])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - NAVBAR_OFFSET

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const renderHeading = (heading: Heading, depth: number = 0): React.ReactNode => {
    const hasChildren = heading.children && heading.children.length > 0
    const isCollapsed = collapsedSections.has(heading.id)
    const isActive = activeId === heading.id
    
    return (
      <li key={heading.id}>
        <div className="flex items-center">
          {hasChildren && (
            <button
              onClick={() => toggleCollapsed(heading.id)}
              className="flex-shrink-0 p-0.5 mr-1 text-gray-500 hover:text-gray-300 transition-colors duration-150"
              aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
            >
              {isCollapsed ? (
                <ChevronRightIcon className="h-3 w-3" />
              ) : (
                <ChevronDownIcon className="h-3 w-3" />
              )}
            </button>
          )}
          <button
            onClick={() => scrollToHeading(heading.id)}
            className={`
              flex-1 text-left transition-all duration-150 hover:text-white py-1 px-2 rounded text-sm
              ${isActive 
                ? 'text-blue-400 font-medium bg-blue-400/10 border-l-2 border-blue-400' 
                : 'text-gray-400 hover:bg-gray-800/30 hover:text-gray-200'
              }
              ${heading.level === 1 ? 'font-medium' : 'font-normal'}
              ${!hasChildren ? 'ml-3' : ''}
            `}
            style={{ paddingLeft: hasChildren ? '0.5rem' : `${depth * 0.5 + 0.75}rem` }}
          >
            {heading.text}
          </button>
        </div>
        {hasChildren && !isCollapsed && (
          <ul className="ml-2 mt-1 space-y-0.5">
            {heading.children!.map(child => renderHeading(child, depth + 1))}
          </ul>
        )}
      </li>
    )
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <nav className={`${className}`}>
      <div className="relative bg-card-background backdrop-blur-sm border border-gray-800/50 rounded-lg p-3 overflow-hidden" style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)' }}>
        {/* Gradient overlay for opacity effect from top to bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none rounded-lg"></div>
        <div className="relative z-10">
          <h3 className="text-xs font-medium text-gray-300 mb-3 uppercase tracking-wide">
            On This Page
          </h3>
          <ul className="space-y-1 text-sm">
            {headings.map(heading => renderHeading(heading))}
          </ul>
        </div>
      </div>
    </nav>
  )
}