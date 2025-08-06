import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import {
  useArticleListContext,
  useArticleSearchContext
} from 'constants/article-list-context/article-list-context'
import ReactPaginate from 'react-paginate'
import { useRouter } from 'next/router'
import Button from 'components/common/Button'

export default function ArticlePaginator() {
  const { numberOfPages, pageIndex, setCurrentPageIndex } = useArticleListContext()
  const { searchValue, filterValue } = useArticleSearchContext()

  const router = useRouter()

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPageIndex(selected)
    if (filterValue.length || searchValue) return
    const newPageIndex = selected + 1
    router.push(`/blog?page=${newPageIndex}`)
  }

  return (
    <div className="flex items-center justify-between px-4 py-6 lg:max-w-7xl mx-auto">
      {pageIndex > 0 ? (
        <Button
          variant="secondary"
          size="md"
          icon={faChevronLeft}
          iconPosition="left"
          className="whitespace-nowrap"
          onClick={() => handlePageChange({ selected: pageIndex - 1 })}
        >
          Previous Page
        </Button>
      ) : (
        <div className="w-auto" />
      )}

      <ReactPaginate
        previousLabel={null}
        nextLabel={null}
        breakLabel="..."
        pageCount={numberOfPages}
        forcePage={pageIndex}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
        onPageChange={handlePageChange}
        containerClassName="flex items-center justify-center space-x-4"
        pageClassName="px-3 py-1 text-gray-500 hover:text-gray-700 cursor-pointer rounded-md"
        activeClassName="text-white font-bold"
        breakClassName="px-2 text-gray-500"
      />

      {pageIndex < numberOfPages - 1 ? (
        <Button
          variant="secondary"
          size="md"
          icon={faChevronRight}
          iconPosition="right"
          className="whitespace-nowrap"
          onClick={() => handlePageChange({ selected: pageIndex + 1 })}
        >
          Next Page
        </Button>
      ) : (
        <div className="w-auto" />
      )}
    </div>
  )
}