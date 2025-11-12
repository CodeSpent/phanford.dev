'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import Button from 'components/common/Button'
import {
  useArticleListContext,
  useArticleSearchContext,
} from 'constants/article-list-context/article-list-context'

export default function PaginationControls() {
  const { numberOfPages, pageIndex, setCurrentPageIndex } = useArticleListContext()
  const { searchValue, filterValue } = useArticleSearchContext()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const changePage = (newPageIndex: number) => {
    // Update context state
    setCurrentPageIndex(newPageIndex)

    // Only update URL if there's no active search/filter
    // (search/filter pagination is handled client-side only)
    if (!searchValue && filterValue.length === 0) {
      const params = new URLSearchParams(searchParams.toString())
      const newPageNumber = newPageIndex + 1 // Convert 0-based to 1-based for URL

      if (newPageNumber === 1) {
        params.delete('page')
      } else {
        params.set('page', newPageNumber.toString())
      }

      const queryString = params.toString()
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname
      router.push(newUrl, { scroll: false })
    }
  }

  const renderPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 7 // Show 7 page numbers max
    const halfRange = Math.floor(maxPagesToShow / 2)

    let startPage = Math.max(0, pageIndex - halfRange)
    let endPage = Math.min(numberOfPages - 1, startPage + maxPagesToShow - 1)

    // Adjust start if we're near the end
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1)
    }

    // Add first page + ellipsis if needed
    if (startPage > 0) {
      pages.push(
        <button
          key={0}
          onClick={() => changePage(0)}
          className="px-3 py-1 text-sm text-gray-400 hover:text-white cursor-pointer rounded-md transition-colors"
        >
          1
        </button>
      )
      if (startPage > 1) {
        pages.push(
          <span key="ellipsis-start" className="px-2 text-gray-500">
            ...
          </span>
        )
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => changePage(i)}
          className={`px-3 py-1 text-sm cursor-pointer rounded-md transition-colors ${
            i === pageIndex
              ? 'bg-blue-600 text-white font-semibold'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          {i + 1}
        </button>
      )
    }

    // Add ellipsis + last page if needed
    if (endPage < numberOfPages - 1) {
      if (endPage < numberOfPages - 2) {
        pages.push(
          <span key="ellipsis-end" className="px-2 text-gray-500">
            ...
          </span>
        )
      }
      pages.push(
        <button
          key={numberOfPages - 1}
          onClick={() => changePage(numberOfPages - 1)}
          className="px-3 py-1 text-sm text-gray-400 hover:text-white cursor-pointer rounded-md transition-colors"
        >
          {numberOfPages}
        </button>
      )
    }

    return pages
  }

  // Don't render if there's only one page or no pages
  if (numberOfPages <= 1) {
    return null
  }

  return (
    <div className="flex items-center justify-between py-6 lg:max-w-7xl mx-auto">
      {/* Previous Button */}
      {pageIndex > 0 ? (
        <Button
          variant="solid-secondary"
          size="md"
          icon={faChevronLeft}
          iconPosition="left"
          className="whitespace-nowrap"
          onClick={() => changePage(pageIndex - 1)}
        >
          Previous Page
        </Button>
      ) : (
        <div className="w-auto" />
      )}

      {/* Page Numbers */}
      <div className="flex items-center justify-center space-x-2">
        {renderPageNumbers()}
      </div>

      {/* Next Button */}
      {pageIndex < numberOfPages - 1 ? (
        <Button
          variant="solid-secondary"
          size="md"
          icon={faChevronRight}
          iconPosition="right"
          className="whitespace-nowrap"
          onClick={() => changePage(pageIndex + 1)}
        >
          Next Page
        </Button>
      ) : (
        <div className="w-auto" />
      )}
    </div>
  )
}
