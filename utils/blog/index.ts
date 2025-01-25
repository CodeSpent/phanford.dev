
import { Article, ListViewArticles } from '../fs/api'
import { ArticleInfo } from '../../types/ArticleInfo'
import { useMemo } from 'react'
import { ArticleSortOption, ArticleSortOptionValue } from '../../constants/blog'

export const getSortedListViewArticles = (
  articlesToSort: ListViewArticles,
  sortValue: ArticleSortOptionValue,
  searchResults: string[] | undefined
): ListViewArticles => {
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

      const sortedArticles = []

      articlesToSort.forEach((article) => {
        sortedArticles.splice(searchResults.indexOf(article.slug), 0, article)
      })

      return sortedArticles

    case ArticleSortOptionValue.DATE_DESCENDING:
      /* Date Descending
       *
       * Date Descending sort needs to sort articlesToSort based on
       * the `published: string` date in descending order.
       * */
      return articlesToSort.sort((a: any, b: any): number => {
        return new Date(b.published).valueOf() - new Date(a.published).valueOf()
      })

    case ArticleSortOptionValue.DATE_ASCENDING:
      /* Date Ascending
       *
       * Date Descending sort needs to sort articlesToSort based on
       * the `published: string` date in ascending order.
       * */
      return articlesToSort.sort((a: any, b: any): number => {
        return new Date(a.published).valueOf() - new Date(b.published).valueOf()
      })

    case ArticleSortOptionValue.TIME_DESCENDING:
      /* Time Descending
       *
       * Time Descending sort needs to sort articlesToSort based on
       * the `minutesToRead: number` in descending order.
       * */
      return articlesToSort.sort((a: any, b: any): number => {
        return b.minutesToRead - a.minutesToRead
      })

    case ArticleSortOptionValue.TIME_ASCENDING:
      /* Time Ascending
       *
       * Time Ascending sort needs to sort articlesToSort based on
       * the `minutesToRead: number` in ascending order.
       * */
      return articlesToSort.sort((a: any, b: any): number => {
        return a.minutesToRead - b.minutesToRead
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
        article.tags.forEach((tag) => previousValue.add(tag))
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
