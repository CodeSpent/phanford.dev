
import { Article, ListViewArticles } from '../fs/api'
import { ArticleInfo } from '../../types/ArticleInfo'
import { useMemo } from 'react'
import { ArticleSortOption, ArticleSortOptionValue } from '../../constants/blog'
import { DataSourceType, getDataSource } from '../../constants/data-sources'

export const getSortedListViewArticles = (
  articlesToSort: ListViewArticles,
  sortValue: ArticleSortOptionValue,
  searchResults: string[] | undefined,
  dataSourceType: DataSourceType = 'blog'
): ListViewArticles => {
  const dataSource = getDataSource(dataSourceType)
  switch (sortValue) {
    case ArticleSortOptionValue.RELEVANCE:
      /* Relevance
       *
       * Relevance sort needs to sort articlesToSort based on the
       * numeric score from our Lunr result. This means this sort
       * requires an accompanying `searchValue: string` else returns the default
       * sorted array.
       * */

      /*
       * searchResults will be lunrResultSlugs which is an array of slugs
       * that are sorted by their relevance numeric. We can rely on this
       * ordering to avoid tightly coupling search functionality to this
       * sort.
       *
       * We are also using these lunrResultSlugs (searchResults) within
       * the ArticleListContext to set the articlesToDisplay, so we can
       * rely as well on the length of searchResults to be the same as
       * our displayed articlesToSort.
       * */

      if (!searchResults) {
        return articlesToSort
      }

      const sortedArticles: typeof articlesToSort = []

      articlesToSort.forEach((article) => {
        sortedArticles.splice(searchResults.indexOf(article.slug || ''), 0, article)
      })

      return sortedArticles

    case ArticleSortOptionValue.DATE_DESCENDING:
      /* Date Descending
       *
       * Date Descending sort needs to sort articlesToSort based on
       * the date in descending order.
       * */
      return articlesToSort.sort((a: any, b: any): number => {
        const dateA = dataSource.getItemDate(a)
        const dateB = dataSource.getItemDate(b)
        if (!dateA || !dateB) return 0
        return new Date(dateB).valueOf() - new Date(dateA).valueOf()
      })

    case ArticleSortOptionValue.DATE_ASCENDING:
      /* Date Ascending
       *
       * Date Ascending sort needs to sort articlesToSort based on
       * the date in ascending order.
       * */
      return articlesToSort.sort((a: any, b: any): number => {
        const dateA = dataSource.getItemDate(a)
        const dateB = dataSource.getItemDate(b)
        if (!dateA || !dateB) return 0
        return new Date(dateA).valueOf() - new Date(dateB).valueOf()
      })

    case ArticleSortOptionValue.TIME_DESCENDING:
      /* Time Descending
       *
       * Time Descending sort needs to sort articlesToSort based on
       * the reading time in descending order.
       * */
      return articlesToSort.sort((a: any, b: any): number => {
        const timeA = dataSource.getItemReadingTime(a)
        const timeB = dataSource.getItemReadingTime(b)
        return timeB - timeA
      })

    case ArticleSortOptionValue.TIME_ASCENDING:
      /* Time Ascending
       *
       * Time Ascending sort needs to sort articlesToSort based on
       * the reading time in ascending order.
       * */
      return articlesToSort.sort((a: any, b: any): number => {
        const timeA = dataSource.getItemReadingTime(a)
        const timeB = dataSource.getItemReadingTime(b)
        return timeA - timeB
      })

    default:
      /* Default
       *
       * Return the array unsorted.
       * */
      return articlesToSort
  }
}

export const getInitialListViewPageArticles = (
  articles: ListViewArticles,
  originalPageIndex: number,
  articlesPerPage: number
): ListViewArticles =>
  articles.slice(
    originalPageIndex * articlesPerPage,
    (originalPageIndex + 1) * articlesPerPage
  );

export const getCurrentListViewPageArticles = (
  articles: ListViewArticles,
  pageIndex: number,
  articlesPerPage: number
): ListViewArticles =>
  articles.slice(
    pageIndex * articlesPerPage,
    (pageIndex + 1) * articlesPerPage
  );

export const useArticleTagsFromNodes = <T extends { tags: Article['tags'] }>(
  articles: Article[],
) => {
  const articleTags = useMemo(() => {
    return Array.from(
      articles.reduce((previousValue, article) => {
        if (article.tags && Array.isArray(article.tags)) {
          article.tags.forEach((tag) => previousValue.add(tag))
        }
        return previousValue
      }, new Set())
    )
  }, [articles])
  return articleTags
}

export const getNumberOfPages = (
  articlesArrayLength: number,
  articlesPerPage: number
) => Math.ceil(articlesArrayLength / articlesPerPage)
