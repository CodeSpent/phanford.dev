import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  FC,
} from 'react'
import { Article } from 'contentlayer/generated'
import {
  getCurrentListViewPageArticles,
  getNumberOfPages,
  getSortedListViewArticles,
  useArticleTagsFromNodes,
} from '../../utils/blog'
import { ComboBoxOption } from '../../components/common/Input'
import { DeepPickedArticle, ListViewArticles } from '../../utils/fs/api'
import { ArticleSortOption, sortOptions } from '../blog'

// --------------------------------------------
// Helper: Filter articles by searchValue & tags
// --------------------------------------------
function filterArticles(
  articles: Article[],
  searchValue: string,
  filterValue: string[]
): string[] {

  let filtered = articles

  // --------------------------------------------
  // 1. Filter by tags if we have any
  // --------------------------------------------
  // Return any objects with matching tags.
  // --------------------------------------------
  if (filterValue && filterValue.length > 0) {
    filtered = filtered.filter((article) =>
      filterValue.some((tag) => article.tags.includes(tag))
    )
  }
  // --------------------------------------------
  // 2. Filter by searchValue (title or excerpt)
  // --------------------------------------------
  // If a match is found by title or excerpt return
  // the matching object.
  // --------------------------------------------
  if (searchValue) {
    const lowerSearch = searchValue.toLowerCase()
    filtered = filtered.filter((article) => {
      const titleMatch = article.title.toLowerCase().includes(lowerSearch)
      const excerptMatch = article.description.toLowerCase().includes(lowerSearch)
      return titleMatch || excerptMatch
    })
  }
  // --------------------------------------------
  // 3. Return filterted list of articles.
  // --------------------------------------------
  // Return array of slugs matching search & filter values.
  // --------------------------------------------
  const filteredSlugs = filtered.map((article) => article.slug)
  return filteredSlugs
}

// --------------------------------------------
// ArticleSearchContext
// --------------------------------------------
interface ArticleSearchContextValue {
  searchValue: string
  setSearchValue: (value: string) => void
  filterValue: string[]
  setFilterValue: (value: string[]) => void
  resultSlugs: string[]
}

const ArticleSearchContext = createContext<ArticleSearchContextValue | undefined>(
  undefined
)

export const useArticleSearchContext = () => {
  const context = useContext(ArticleSearchContext)
  if (!context) {
    throw new Error(
      'useArticleSearchContext must be used within an ArticleSearchContextProvider'
    )
  }
  return context
}

interface ArticleSearchContextProviderProps {
  articles: any[]
}

export const ArticleSearchContextProvider: FC<ArticleSearchContextProviderProps> =
  ({
     children,
     articles,
   }) => {
  const [searchValue, setSearchValue] = useState('')
  const [filterValue, setFilterValue] = useState<string[]>([])

  const resultSlugs = useMemo(() => {
    return filterArticles(articles, searchValue, filterValue)
  }, [articles, searchValue, filterValue])

  const articleSearchContextValue: ArticleSearchContextValue = useMemo(
    () => ({
      searchValue,
      setSearchValue,
      filterValue,
      setFilterValue,
      resultSlugs,
    }),
    [searchValue, filterValue, resultSlugs]
  )

  return (
    <ArticleSearchContext.Provider value={articleSearchContextValue}>
      {children}
    </ArticleSearchContext.Provider>
  )
}

// --------------------------------------------
// ArticleListContext
// --------------------------------------------
interface ArticleListContextProps {
  pageIndex: number
  articles: any[]
}

interface ArticleListContextValue {
  articlesToDisplay: Partial<Article>[] // Allow partial articles if necessary
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

const ArticleListContext =
  createContext<ArticleListContextValue | undefined>(undefined)

export const useArticleListContext = () => {
  const context = useContext(ArticleListContext)
  if (!context) {
    throw new Error(
      'useArticleListContext must be used within an ArticleListContextProvider'
    )
  }
  return context
}

export const ArticleListContextProvider: FC<ArticleListContextProps> =
  ({ children,
     pageIndex,
     articles,
   }) => {
  const searchCtx = useArticleSearchContext()
  const { searchValue, filterValue, resultSlugs } = searchCtx;

  const [sortValue, setSortValue] = useState<ArticleSortOption>(sortOptions[2])
  const [currentPageIndex, setCurrentPageIndex] =
    useState<number>(pageIndex)
  const [articlesPerPage, setArticlesPerPage] = useState<number>(9)

  // sortedArticles is the full unfiltered article list
  const sortedArticles = useMemo(() => {
    return getSortedListViewArticles(articles, sortValue, resultSlugs)
  }, [articles, sortValue, resultSlugs])

  // Filter articles to only those that match the slugs from ArticleSearchContext
  const filteredArticles = useMemo(() => {
    if (!sortedArticles || !resultSlugs.length) {
      return [];
    }

    return sortedArticles.filter(({ slug }) => {
      return resultSlugs.includes(slug)
    })
  }, [sortedArticles, resultSlugs])

  // Decide which articles to display based on search/filter usage
  let articlesToDisplay: ListViewArticles = [];

  // Paginate articles by page limit & current page
  if (searchValue !== '' || filterValue.length > 0) {
    // Get articles with search/filter values
    articlesToDisplay = getCurrentListViewPageArticles(
      filteredArticles,
      currentPageIndex,
      articlesPerPage
    )
  } else {
    // Get initial articles with no search or filter values
    articlesToDisplay = getCurrentListViewPageArticles(
      sortedArticles,
      currentPageIndex,
      articlesPerPage
    )
  }

  // Get total count of pages based on page limit & relevant article count
  const numberOfPages = getNumberOfPages(filteredArticles.length, articlesPerPage)

  // Extract tags from articles
  const articleTags = (useArticleTagsFromNodes(articles) || []) as string[]

  // Memoize article list
  const articleListContextValue: {
    articlesToDisplay: DeepPickedArticle[];
    pageCount: number;
    pageIndex: number;
    setCurrentPageIndex: (value: (((prevState: number) => number) | number)) => void;
    articleTags: string[];
    sortValue: ArticleSortOption;
    setSortValue: (value: (((prevState: ArticleSortOption) => ArticleSortOption) | ArticleSortOption)) => void;
    articlesPerPage: number;
    setArticlesPerPage: (value: (((prevState: number) => number) | number)) => void;
    numberOfPages: number;
    searchResultsContextValue: ArticleSearchContextValue
  } = useMemo(
    () => ({
      articlesToDisplay: articlesToDisplay as Article[],
      pageCount: Math.ceil(filteredArticles.length / articlesPerPage),
      pageIndex: currentPageIndex,
      setCurrentPageIndex,
      articleTags,
      sortValue,
      setSortValue,
      articlesPerPage,
      setArticlesPerPage,
      numberOfPages,
      searchResultsContextValue: searchCtx,
    }),
    [currentPageIndex, sortValue, articlesPerPage, numberOfPages, searchCtx, filteredArticles.length]
  )

  return (
    <ArticleListContext.Provider value={articleListContextValue}>
      {children}
    </ArticleListContext.Provider>
  )
}

// --------------------------------------------
// Composed Provider (ArticleContextProvider)
// --------------------------------------------
export const ArticleContextProvider: FC<ArticleListContextProps> =
  ({
     children,
     pageIndex,
     articles,
   }) => {
  return (
    <ArticleSearchContextProvider articles={articles}>
      <ArticleListContextProvider pageIndex={pageIndex} articles={articles}>
        {children}
      </ArticleListContextProvider>
    </ArticleSearchContextProvider>
  );
};