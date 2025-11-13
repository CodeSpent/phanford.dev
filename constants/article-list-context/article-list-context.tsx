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
import { DeepPickedArticle, ListViewArticles } from '../../utils/fs/api'
import { ArticleSortOptionValue, sortOptions } from '../blog'
import { DataSourceType, getDataSource } from '../data-sources'

// --------------------------------------------
// Types for advanced tag filtering
// --------------------------------------------
export type FilterMode = 'OR' | 'AND'

export interface TagGroup {
  tags: string[]
  mode: FilterMode
}

// --------------------------------------------
// Helper: Filter articles by searchValue & tags
// --------------------------------------------
function filterArticles(
  articles: any[],
  searchValue: string,
  filterValue: string[],
  filterMode: FilterMode = 'OR',
  tagGroups: TagGroup[] = [],
  dataSourceType: DataSourceType = 'blog'
): string[] {
  const dataSource = getDataSource(dataSourceType)
  let filtered = articles

  // --------------------------------------------
  // 1. Filter by tags if we have any
  // --------------------------------------------
  if (filterValue && filterValue.length > 0) {
    filtered = filtered.filter((article) => {
      const itemTags = dataSource.getItemTags(article)

      if (filterMode === 'OR') {
        // OR mode: article matches if it has ANY of the selected tags
        return filterValue.some((tag) => itemTags.includes(tag))
      } else {
        // AND mode: article matches if it has ALL of the selected tags
        return filterValue.every((tag) => itemTags.includes(tag))
      }
    })
  }

  // --------------------------------------------
  // 2. Filter by tag groups (for mixed OR/AND combinations)
  // --------------------------------------------
  if (tagGroups && tagGroups.length > 0) {
    filtered = filtered.filter((article) => {
      const itemTags = dataSource.getItemTags(article)

      // Each group is connected by OR, but within each group tags are connected by the group's mode
      return tagGroups.some((group) => {
        if (group.mode === 'OR') {
          return group.tags.some((tag) => itemTags.includes(tag))
        } else {
          return group.tags.every((tag) => itemTags.includes(tag))
        }
      })
    })
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
      const title = dataSource.getItemTitle(article).toLowerCase()
      const description = dataSource.getItemDescription(article).toLowerCase()
      const titleMatch = title.includes(lowerSearch)
      const excerptMatch = description.includes(lowerSearch)
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
  filterMode: FilterMode
  setFilterMode: (mode: FilterMode) => void
  tagGroups: TagGroup[]
  setTagGroups: (groups: TagGroup[]) => void
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
  children: React.ReactNode
  articles: any[]
  dataSourceType?: DataSourceType
}

export const ArticleSearchContextProvider: FC<ArticleSearchContextProviderProps> =
  ({
     children,
     articles,
     dataSourceType = 'blog',
   }) => {
  const [searchValue, setSearchValue] = useState('')
  const [filterValue, setFilterValue] = useState<string[]>([])
  const [filterMode, setFilterMode] = useState<FilterMode>('OR')
  const [tagGroups, setTagGroups] = useState<TagGroup[]>([])

  const resultSlugs = useMemo(() => {
    return filterArticles(articles, searchValue, filterValue, filterMode, tagGroups, dataSourceType)
  }, [articles, searchValue, filterValue, filterMode, tagGroups, dataSourceType])

  const articleSearchContextValue: ArticleSearchContextValue = useMemo(
    () => ({
      searchValue,
      setSearchValue,
      filterValue,
      setFilterValue,
      filterMode,
      setFilterMode,
      tagGroups,
      setTagGroups,
      resultSlugs,
    }),
    [searchValue, filterValue, filterMode, tagGroups, resultSlugs]
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
  children: React.ReactNode
  pageIndex: number
  articles: any[]
  dataSourceType?: DataSourceType
}

interface ArticleListContextValue {
  articlesToDisplay: Partial<Article>[] // Allow partial articles if necessary
  pageCount: number
  pageIndex: number
  setCurrentPageIndex: (value: number) => void
  articleTags: string[]
  sortValue: ArticleSortOptionValue
  setSortValue: (value: ArticleSortOptionValue) => void
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
     dataSourceType = 'blog',
   }) => {
  const searchCtx = useArticleSearchContext()
  const { searchValue, filterValue, resultSlugs } = searchCtx;

  const [sortValue, setSortValue] = useState<ArticleSortOptionValue>(sortOptions[0].value)
  const [currentPageIndex, setCurrentPageIndex] =
    useState<number>(pageIndex)
  const [articlesPerPage, setArticlesPerPage] = useState<number>(9)

  // sortedArticles is the full unfiltered article list
  const sortedArticles = useMemo(() => {
    return getSortedListViewArticles(articles, sortValue, resultSlugs, dataSourceType)
  }, [articles, sortValue, resultSlugs, dataSourceType])

  // Filter articles to only those that match the slugs from ArticleSearchContext
  const filteredArticles = useMemo(() => {
    if (!sortedArticles || !resultSlugs.length) {
      return [];
    }

    return sortedArticles.filter(({ slug }) => {
      return slug && resultSlugs.includes(slug)
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
    sortValue: ArticleSortOptionValue;
    setSortValue: (value: (((prevState: ArticleSortOptionValue) => ArticleSortOptionValue) | ArticleSortOptionValue)) => void;
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
    [currentPageIndex, sortValue, articlesPerPage, numberOfPages, searchCtx, filteredArticles.length, articlesToDisplay]
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
interface ArticleContextProviderProps extends ArticleListContextProps {
  dataSourceType?: DataSourceType
}

export const ArticleContextProvider: FC<ArticleContextProviderProps> =
  ({
     children,
     pageIndex,
     articles,
     dataSourceType = 'blog',
   }) => {
  return (
    <ArticleSearchContextProvider articles={articles} dataSourceType={dataSourceType}>
      <ArticleListContextProvider pageIndex={pageIndex} articles={articles} dataSourceType={dataSourceType}>
        {children}
      </ArticleListContextProvider>
    </ArticleSearchContextProvider>
  );
};
