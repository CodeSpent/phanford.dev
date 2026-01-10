
import { Article, ListViewDataItems } from '../fs/api'
import { useMemo } from 'react'
import { DataItemSortOptionValue } from '../../constants/content-options'
import { DataSourceType, getDataSource } from '../../constants/data-sources'

export const getSortedDataItems = (
  itemsToSort: ListViewDataItems,
  sortValue: DataItemSortOptionValue,
  searchResults: string[] | undefined,
  dataSourceType: DataSourceType = 'blog'
): ListViewDataItems => {
  const dataSource = getDataSource(dataSourceType)
  switch (sortValue) {
    case DataItemSortOptionValue.RELEVANCE:
      /* Relevance
       *
       * Relevance sort needs to sort items based on the
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
       * the DataItemListContext to set the itemsToDisplay, so we can
       * rely as well on the length of searchResults to be the same as
       * our displayed itemsToSort.
       * */

      if (!searchResults) {
        return itemsToSort
      }

      const sortedItems: typeof itemsToSort = []

      itemsToSort.forEach((item) => {
        sortedItems.splice(searchResults.indexOf(item.slug || ''), 0, item)
      })

      return sortedItems

    case DataItemSortOptionValue.DATE_DESCENDING:
      /* Date Descending
       *
       * Date Descending sort needs to sort items based on
       * the date in descending order.
       * */
      return itemsToSort.sort((a: any, b: any): number => {
        const dateA = dataSource.getItemDate(a)
        const dateB = dataSource.getItemDate(b)
        if (!dateA || !dateB) return 0
        return new Date(dateB).valueOf() - new Date(dateA).valueOf()
      })

    case DataItemSortOptionValue.DATE_ASCENDING:
      /* Date Ascending
       *
       * Date Ascending sort needs to sort items based on
       * the date in ascending order.
       * */
      return itemsToSort.sort((a: any, b: any): number => {
        const dateA = dataSource.getItemDate(a)
        const dateB = dataSource.getItemDate(b)
        if (!dateA || !dateB) return 0
        return new Date(dateA).valueOf() - new Date(dateB).valueOf()
      })

    case DataItemSortOptionValue.TIME_DESCENDING:
      /* Time Descending
       *
       * Time Descending sort needs to sort items based on
       * the reading time in descending order.
       * */
      return itemsToSort.sort((a: any, b: any): number => {
        const timeA = dataSource.getItemReadingTime(a)
        const timeB = dataSource.getItemReadingTime(b)
        return timeB - timeA
      })

    case DataItemSortOptionValue.TIME_ASCENDING:
      /* Time Ascending
       *
       * Time Ascending sort needs to sort items based on
       * the reading time in ascending order.
       * */
      return itemsToSort.sort((a: any, b: any): number => {
        const timeA = dataSource.getItemReadingTime(a)
        const timeB = dataSource.getItemReadingTime(b)
        return timeA - timeB
      })

    default:
      /* Default
       *
       * Return the array unsorted.
       * */
      return itemsToSort
  }
}

export const getInitialPageDataItems = (
  items: ListViewDataItems,
  originalPageIndex: number,
  itemsPerPage: number
): ListViewDataItems =>
  items.slice(
    originalPageIndex * itemsPerPage,
    (originalPageIndex + 1) * itemsPerPage
  );

export const getCurrentPageDataItems = (
  items: ListViewDataItems,
  pageIndex: number,
  itemsPerPage: number
): ListViewDataItems =>
  items.slice(
    pageIndex * itemsPerPage,
    (pageIndex + 1) * itemsPerPage
  );

export const useDataItemTagsFromNodes = <T extends { tags: Article['tags'] }>(
  items: Article[],
) => {
  const itemTags = useMemo(() => {
    return Array.from(
      items.reduce((previousValue, item) => {
        if (item.tags && Array.isArray(item.tags)) {
          item.tags.forEach((tag) => previousValue.add(tag))
        }
        return previousValue
      }, new Set())
    )
  }, [items])
  return itemTags
}

export const getNumberOfPages = (
  itemsArrayLength: number,
  itemsPerPage: number
) => Math.ceil(itemsArrayLength / itemsPerPage)
