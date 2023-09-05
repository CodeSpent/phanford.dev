import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from "@heroicons/react/solid";
import { useContext } from "react";
import {
  ArticleListContext,
  useArticleListContext,
  useArticleSearchContext
} from "../../constants/article-list-context/article-list-context";
import ReactPaginate from "react-paginate";
import { ArticleSearchContext } from "../../constants/article-search-context/article-search-context";
import { useRouter } from "next/router";

export default function ArticlePaginator() {
  const { numberOfPages, pageIndex, setCurrentPageIndex } =
   useArticleListContext()
  const { searchValue, filterValue } = useArticleSearchContext();

  const router = useRouter();

  return (
    <>
      <ReactPaginate
        breakLabel="..."
        /*
         * `-left-16` subtracts 4rem (width of next button)
         * so we can use `auto` margins, since `auto` margins
         * will use the starting (left) edge of an element.
         *
         * This allows the right edge align with the boundary of
         * the container. This MUST be changed as a utility if
         * the buttons or container change.
         *
         * */
        nextClassName="ml-auto -left-16 relative"
        nextLabel={
          <div className="-mt-px ml-auto flex w-0 flex-1 cursor-pointer text-gray-500 hover:text-white">
            <div
              className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium"
            >
              Next
              <ArrowNarrowRightIcon
                className="ml-3 h-5 w-5"
                aria-hidden="true"
              />
            </div>
          </div>
        }
        previousClassName="mr-auto"
        previousLabel={
          <div className="-mt-px mr-auto flex w-0 flex-1 cursor-pointer text-gray-500 hover:text-white">
            <div
              className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium"
            >
              <ArrowNarrowLeftIcon
                className="mr-3 h-5 w-5 text-gray-300"
                aria-hidden="true"
              />
              Previous
            </div>
          </div>
        }
        disabledClassName="text-gray-400"
        breakClassName="break-me"
        containerClassName="flex items-center px-4 sm:px-0 lg:max-w-7xl"
        pageClassName="md:-mt-px md:flex inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-md font-medium text-gray-500 hover:text-white cursor-pointer"
        pageCount={numberOfPages}
        marginPagesDisplayed={0}
        forcePage={pageIndex}
        pageRangeDisplayed={7}
        hrefBuilder={(pageIndex) => {
          if (pageIndex === 1) {
            return `${"/blog"}`;
          }
          return `/blog?page=${pageIndex}`;
        }}
        onPageChange={({ selected }) => {
          if (filterValue.length || searchValue) {
            setCurrentPageIndex(selected);
            return;
          }

          /*
           * ReactPaginate 0 indexes pages while we
           * index pages at 1 for `currentPageIndex`.
           * */
          const newPageIndex = selected;
          router.push(`blog?page=${newPageIndex + 1}`);
        }}
      />
    </>
  );
}
