import {
  createContext,
  default as React,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArticleSearchContext,
  useSearchFilterValue,
} from "../article-search-context/article-search-context";

import { ListViewArticles } from "../../utils/fs/api";
import {
  getCurrentListViewPageArticles,
  getInitialListViewPageArticles,
  getNumberOfPages,
  getSortedListViewArticles,
  useArticleTagsFromNodes,
} from "../../utils/blog";

export enum ArticleSortOptionValue {
  TIME_ASCENDING = "time_asc",
  TIME_DESCENDING = "time_desc",
  DATE_ASCENDING = "date_asc",
  DATE_DESCENDING = "date_desc",
  RELEVANCE = "relevance",
}

export type ArticleSortOption = {
  name: string;
  value: ArticleSortOptionValue;
};

export const sortOptions: ArticleSortOption[] = [
  { name: "Relevance", value: ArticleSortOptionValue.RELEVANCE },
  { name: "Date ↑", value: ArticleSortOptionValue.DATE_ASCENDING },
  { name: "Date ↓", value: ArticleSortOptionValue.DATE_DESCENDING },
  { name: "Time to Read ↑", value: ArticleSortOptionValue.TIME_ASCENDING },
  { name: "Time to Read ↓", value: ArticleSortOptionValue.TIME_DESCENDING },
];

export const articlesPerPageOptions = [6, 9, 18, 36];

interface ArticleListContextProps {
  pageIndex: number;
  articles: ListViewArticles;
}

const initialArticleListContext = {
  articlesToDisplay: [] as ListViewArticles,
  pageCount: 0 as number,
  pageIndex: 0 as number,
  setCurrentPageIndex: (val: number) => {},
  articleTags: [] as string[],
  sortValue: sortOptions[2] as ArticleSortOption,
  setSortValue: (value: {}) => {},
  articlesPerPage: articlesPerPageOptions[1] as number,
  setArticlesPerPage: (value: {}) => {},
  numberOfPages: 0 as number,
  setNumberOfPages: (value: {}) => {},
};

export const ArticleListContext = createContext(initialArticleListContext);

export const ArticleListProvider: React.FC<ArticleListContextProps> = ({
  children,
  pageIndex: originalPageIndex,
  articles,
}) => {
  const searchContextValue = useSearchFilterValue();

  const [sortValue, setSortValue] = useState(sortOptions[2]);

  const [currentPageIndex, setCurrentPageIndex] = useState(originalPageIndex);
  const [articlesPerPage, setArticlesPerPage] = useState(9);

  const currentSkipNumber = currentPageIndex * articlesPerPage;

  const [filteredArticles, setFilteredArticles] = useState([]);
  const [sortedArticles, setSortedArticles] = useState([]);
  const [articlesToDisplay, setArticlesToDisplay] = useState(
    getInitialListViewPageArticles(articles, originalPageIndex, articlesPerPage)
  );

  const [numberOfPages, setNumberOfPages] = useState(
    getNumberOfPages(filteredArticles.length, articlesPerPage)
  );

  useEffect(() => {
    /*
     * Sort articles before any other filters are applied
     * to ensure that we know the order of articles before
     * we decide which articles to display per page.
     *
     * Default sort order: DATE_DESCENDING
     * */

    setSortedArticles(
      getSortedListViewArticles(
        articles,
        sortValue,
        searchContextValue.lunrResultSlugs
      )
    );

    if (
      !searchContextValue.searchValue &&
      !searchContextValue.filterValue.length
    ) {
      setCurrentPageIndex(originalPageIndex || 0);
      setFilteredArticles(sortedArticles);
      setNumberOfPages(
        getNumberOfPages(filteredArticles.length, articlesPerPage)
      );

      return;
    }

    setFilteredArticles(
      sortedArticles.filter(({ slug }) =>
        searchContextValue.lunrResultSlugs.includes(slug)
      )
    );

    setCurrentPageIndex(0);
    setNumberOfPages(
      getNumberOfPages(filteredArticles.length, articlesPerPage)
    );
  }, [
    searchContextValue.searchValue,
    searchContextValue.filterValue,
    articles,
    sortValue,
    sortedArticles,
    filteredArticles,
    originalPageIndex,
    articlesPerPage,
    numberOfPages,
    setNumberOfPages,
  ]);

  useEffect(() => {
    setArticlesToDisplay(
      getCurrentListViewPageArticles(
        filteredArticles,
        originalPageIndex,
        articlesPerPage
      )
    );
  }, [
    currentPageIndex,
    currentSkipNumber,
    filteredArticles,
    articlesPerPage,
    sortValue,
    sortedArticles,
    searchContextValue.lunrResultSlugs,
    numberOfPages,
    setNumberOfPages,
  ]);

  const { pageCount, pageIndex } = useMemo(() => {
    if (
      !searchContextValue.searchValue &&
      !searchContextValue.filterValue.length
    )
      return {
        pageCount: numberOfPages,
        pageIndex: originalPageIndex,
      };
    return {
      pageCount: Math.ceil(filteredArticles.length / 10),
      pageIndex: currentPageIndex,
    };
  }, [
    searchContextValue.searchValue,
    searchContextValue.filterValue,
    searchContextValue.lunrResultSlugs,
    numberOfPages,
    filteredArticles,
    articlesPerPage,
    currentPageIndex,
    originalPageIndex,
    sortValue,
    sortedArticles,
    articlesPerPage,
  ]);

  /*
   * TODO: Fix type error that doesn't affect functionality.
   *
   * Relates to use of PickDeepObj<Article, DeepPartial> in
   * `fs/api.ts` (subject to move during refactors).
   *
   * Full error below.
   *
   * ```
   * TS2345: Argument of type 'PickDeepObj<Article, DeepPartial<DeepReplaceKeysPartialObj<Article, any>>, any>[]'
   * is not assignable to parameter of type '{ tags: string[]; }[]'.   Property 'tags' is missing in type
   * 'PickDeepObj<Article, DeepPartial<DeepReplaceKeysPartialObj<Article, any>>, any>' but required in type
   * '{ tags: string[]; }'.
   * ```
   *
   *
   * */
  // @ts-ignore
  const articleTags = useArticleTagsFromNodes(articles) as string[];

  const contextValue = {
    pageCount,
    pageIndex,
    articlesToDisplay,
    setCurrentPageIndex,
    articleTags,
    sortValue,
    setSortValue,
    articlesPerPage,
    setArticlesPerPage,
    numberOfPages,
  };

  return (
    <ArticleListContext.Provider value={contextValue}>
      <ArticleSearchContext.Provider value={searchContextValue}>
        {children}
      </ArticleSearchContext.Provider>
    </ArticleListContext.Provider>
  );
};
