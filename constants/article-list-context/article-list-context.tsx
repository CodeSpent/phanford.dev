import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useLunr } from '../../utils/useLunr'
import { ListViewArticles } from '../../utils/fs/api'
import {
  getCurrentListViewPageArticles,
  getInitialListViewPageArticles,
  getNumberOfPages,
  getSortedListViewArticles,
  useArticleTagsFromNodes,
} from '../../utils/blog'
import { ComboBoxOption } from '../../components/common/Input'
import { filter } from 'react-children-utilities'
import { Article } from '../../contentlayer.config'

export enum ArticleSortOptionValue {
  TIME_ASCENDING = 'time_asc',
  TIME_DESCENDING = 'time_desc',
  DATE_ASCENDING = 'date_asc',
  DATE_DESCENDING = 'date_desc',
  RELEVANCE = 'relevance',
}

export type ArticleSortOption = {
  label: string
  value: ArticleSortOptionValue
}

export const sortOptions: ArticleSortOption[] = [
  { label: 'Relevance', value: ArticleSortOptionValue.RELEVANCE },
  { label: 'Date ↑', value: ArticleSortOptionValue.DATE_ASCENDING },
  { label: 'Date ↓', value: ArticleSortOptionValue.DATE_DESCENDING },
  { label: 'Time to Read ↑', value: ArticleSortOptionValue.TIME_ASCENDING },
  { label: 'Time to Read ↓', value: ArticleSortOptionValue.TIME_DESCENDING },
]

export const paginationOptions: ComboBoxOption[] = [
  { label: '6', value: '6' },
  { label: '9', value: '9' },
  { label: '18', value: '18' },
  { label: '36', value: '36' },
]

interface ArticleListContextProps {
  pageIndex: number
  articles: ListViewArticles
}

interface ArticleSearchContextValue {
  searchValue: string
  setSearchValue: (value: string) => void
  filterValue: string[]
  setFilterValue: (value: string[]) => void
  lunrResultSlugs: string[]
}

const ArticleSearchContext = createContext<
  ArticleSearchContextValue | undefined
>(undefined)

export const useArticleSearchContext = () => {
  const context = useContext(ArticleSearchContext)
  if (!context) {
    throw new Error(
      'useArticleSearchContext must be used within an ArticleSearchContextProvider'
    )
  }
  return context
}

export const ArticleSearchContextProvider: React.FC = ({ children }) => {
  const [searchValue, setSearchValue] = useState<string>('')
  const [filterValue, setFilterValue] = useState<string[]>([])

  const { searchUsingLunr: filterUsingLunr, results: lunrFilterIds } = useLunr()
  const { searchUsingLunr, results: lunrSearchIds } = useLunr()

  useEffect(() => {
    if (!filterValue || !filterValue.length) {
      filterUsingLunr('')
    } else {
      filterUsingLunr(`tags: ${filterValue.join(' ')}`)
    }
  }, [filterValue, setFilterValue])

  useEffect(() => {
    searchUsingLunr(searchValue)
  }, [searchValue])

  const lunrResultSlugs = useMemo(() => {
    if (lunrFilterIds && lunrSearchIds) {
      const lunrFilterSlugs = lunrFilterIds.map((articleRef) => articleRef.slug)
      const lunrSearchSlugs = lunrSearchIds.map((articleRef) => articleRef.slug)

      return lunrFilterSlugs.filter((filterSlug) =>
        lunrSearchSlugs.includes(filterSlug)
      )
    }

    if (lunrFilterIds) return lunrFilterIds.map((articleRef) => articleRef.slug)
    if (lunrSearchIds) return lunrSearchIds.map((articleRef) => articleRef.slug)

    return []
  }, [lunrFilterIds, lunrSearchIds])

  const articleSearchContextValue = useMemo(
    () => ({
      searchValue,
      setSearchValue,
      filterValue,
      setFilterValue,
      lunrResultSlugs,
    }),
    [searchValue, setSearchValue, filterValue, setFilterValue, lunrResultSlugs]
  )

  return (
    <ArticleSearchContext.Provider value={articleSearchContextValue}>
      {children}
    </ArticleSearchContext.Provider>
  )
}

const ArticleListContext = createContext<ArticleListContextValue | undefined>(
  undefined
)

export const useArticleListContext = () => {
  const context = useContext(ArticleListContext)
  if (!context) {
    throw new Error(
      'useArticleListContext must be used within an ArticleListContextProvider'
    )
  }
  return context
}

interface ArticleListContextValue {
  articlesToDisplay: ListViewArticles
  pageCount: number
  pageIndex: number
  setCurrentPageIndex: (val: number) => void
  articleTags: string[]
  sortValue: ArticleSortOption
  setSortValue: (value: ArticleSortOption) => void
  articlesPerPage: number
  setArticlesPerPage: (value: number) => void
  numberOfPages: number
  searchResultsContextValue: ArticleSearchContextValue
}

export const ArticleListContextProvider: React.FC<ArticleListContextProps> = ({
  children,
  pageIndex: originalPageIndex,
  articles,
}) => {
  const articleSearchContextValue = useArticleSearchContext()
  const { searchValue, filterValue, lunrResultSlugs } =
    articleSearchContextValue

  const [sortValue, setSortValue] = useState<ArticleSortOption>(sortOptions[2])
  const [currentPageIndex, setCurrentPageIndex] =
    useState<number>(originalPageIndex)
  const [articlesPerPage, setArticlesPerPage] = useState<number>(9)

  const currentSkipNumber = currentPageIndex * articlesPerPage

  const sortedArticles = getSortedListViewArticles(
    articles,
    sortValue,
    lunrResultSlugs
  )
  const filteredArticles = sortedArticles.filter(({ slug }) => {
    // @ts-ignore
    return lunrResultSlugs.includes(slug.substring(1))
  })

  let articlesToDisplay = []

  // @ts-ignore
  if (!searchValue == '' || !filterValue.length == 0) {
    articlesToDisplay = getCurrentListViewPageArticles(
      filteredArticles,
      originalPageIndex,
      articlesPerPage
    )
  } else {
    articlesToDisplay = getCurrentListViewPageArticles(
      sortedArticles,
      originalPageIndex,
      articlesPerPage
    )
  }

  const numberOfPages = getNumberOfPages(
    filteredArticles.length,
    articlesPerPage
  )

  // @ts-ignore
  const articleTags = useArticleTagsFromNodes(articles) as string[]
  console.log(articleTags)

  const articleListContextValue: ArticleListContextValue = useMemo(
    () => ({
      articlesToDisplay,
      pageCount: Math.ceil(filteredArticles.length / articlesPerPage),
      pageIndex: currentPageIndex,
      setCurrentPageIndex,
      articleTags,
      sortValue,
      setSortValue,
      articlesPerPage,
      setArticlesPerPage,
      numberOfPages,
      searchResultsContextValue: articleSearchContextValue,
    }),
    [
      articlesToDisplay,
      filteredArticles,
      currentPageIndex,
      articleTags,
      sortValue,
      articlesPerPage,
      numberOfPages,
      articleSearchContextValue,
    ]
  )

  return (
    <ArticleListContext.Provider value={articleListContextValue}>
      {children}
    </ArticleListContext.Provider>
  )
}

export const ArticleContextProvider: React.FC<ArticleListContextProps> = ({
  children,
  pageIndex,
  articles,
}) => {
  return (
    <ArticleSearchContextProvider>
      <ArticleListContextProvider pageIndex={pageIndex} articles={articles}>
        {children}
      </ArticleListContextProvider>
    </ArticleSearchContextProvider>
  )
}
