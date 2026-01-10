import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  FC,
} from 'react'
import { Article } from 'contentlayer/generated'
import {
  getCurrentPageDataItems,
  getNumberOfPages,
  getSortedDataItems,
  useDataItemTagsFromNodes,
} from '../../utils/content'
import { DeepPickedArticle, ListViewDataItems } from '../../utils/fs/api'
import { DataItemSortOptionValue, sortOptions } from '../content-options'
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
// Helper: Filter data items by searchValue & tags
// --------------------------------------------
function filterDataItems(
  items: any[],
  searchValue: string,
  filterValue: string[],
  filterMode: FilterMode = 'OR',
  tagGroups: TagGroup[] = [],
  dataSourceType: DataSourceType = 'blog'
): string[] {
  const dataSource = getDataSource(dataSourceType)
  let filtered = items

  // --------------------------------------------
  // 1. Filter by tags if we have any
  // --------------------------------------------
  if (filterValue && filterValue.length > 0) {
    filtered = filtered.filter((item) => {
      const itemTags = dataSource.getItemTags(item)

      if (filterMode === 'OR') {
        // OR mode: item matches if it has ANY of the selected tags
        return filterValue.some((tag) => itemTags.includes(tag))
      } else {
        // AND mode: item matches if it has ALL of the selected tags
        return filterValue.every((tag) => itemTags.includes(tag))
      }
    })
  }

  // --------------------------------------------
  // 2. Filter by tag groups (for mixed OR/AND combinations)
  // --------------------------------------------
  if (tagGroups && tagGroups.length > 0) {
    filtered = filtered.filter((item) => {
      const itemTags = dataSource.getItemTags(item)

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
  // 3. Filter by searchValue (title or excerpt)
  // --------------------------------------------
  // If a match is found by title or excerpt return
  // the matching object.
  // --------------------------------------------
  if (searchValue) {
    const lowerSearch = searchValue.toLowerCase()
    filtered = filtered.filter((item) => {
      const title = dataSource.getItemTitle(item).toLowerCase()
      const description = dataSource.getItemDescription(item).toLowerCase()
      const titleMatch = title.includes(lowerSearch)
      const excerptMatch = description.includes(lowerSearch)
      return titleMatch || excerptMatch
    })
  }
  // --------------------------------------------
  // 4. Return filtered list of items.
  // --------------------------------------------
  // Return array of slugs matching search & filter values.
  // --------------------------------------------
  const filteredSlugs = filtered.map((item) => item.slug)
  return filteredSlugs
}

// --------------------------------------------
// DataItemSearchContext
// --------------------------------------------
interface DataItemSearchContextValue {
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

const DataItemSearchContext = createContext<DataItemSearchContextValue | undefined>(
  undefined
)

export const useDataItemSearchContext = () => {
  const context = useContext(DataItemSearchContext)
  if (!context) {
    throw new Error(
      'useDataItemSearchContext must be used within a DataItemSearchContextProvider'
    )
  }
  return context
}

interface DataItemSearchContextProviderProps {
  children: React.ReactNode
  items: any[]
  dataSourceType?: DataSourceType
}

export const DataItemSearchContextProvider: FC<DataItemSearchContextProviderProps> =
  ({
     children,
     items,
     dataSourceType = 'blog',
   }) => {
  const [searchValue, setSearchValue] = useState('')
  const [filterValue, setFilterValue] = useState<string[]>([])
  const [filterMode, setFilterMode] = useState<FilterMode>('OR')
  const [tagGroups, setTagGroups] = useState<TagGroup[]>([])

  const resultSlugs = useMemo(() => {
    return filterDataItems(items, searchValue, filterValue, filterMode, tagGroups, dataSourceType)
  }, [items, searchValue, filterValue, filterMode, tagGroups, dataSourceType])

  const dataItemSearchContextValue: DataItemSearchContextValue = useMemo(
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
    <DataItemSearchContext.Provider value={dataItemSearchContextValue}>
      {children}
    </DataItemSearchContext.Provider>
  )
}

// --------------------------------------------
// DataItemListContext
// --------------------------------------------
interface DataItemListContextProps {
  children: React.ReactNode
  pageIndex: number
  items: any[]
  dataSourceType?: DataSourceType
}

interface DataItemListContextValue {
  itemsToDisplay: Partial<Article>[] // Allow partial items if necessary
  pageCount: number
  pageIndex: number
  setCurrentPageIndex: (value: number) => void
  itemTags: string[]
  sortValue: DataItemSortOptionValue
  setSortValue: (value: DataItemSortOptionValue) => void
  itemsPerPage: number
  setItemsPerPage: (value: number) => void
  numberOfPages: number
  searchResultsContextValue: DataItemSearchContextValue
}

const DataItemListContext =
  createContext<DataItemListContextValue | undefined>(undefined)

export const useDataItemListContext = () => {
  const context = useContext(DataItemListContext)
  if (!context) {
    throw new Error(
      'useDataItemListContext must be used within a DataItemListContextProvider'
    )
  }
  return context
}

export const DataItemListContextProvider: FC<DataItemListContextProps> =
  ({ children,
     pageIndex,
     items,
     dataSourceType = 'blog',
   }) => {
  const searchCtx = useDataItemSearchContext()
  const { searchValue, filterValue, resultSlugs } = searchCtx;

  const [sortValue, setSortValue] = useState<DataItemSortOptionValue>(sortOptions[0].value)
  const [currentPageIndex, setCurrentPageIndex] =
    useState<number>(pageIndex)
  const [itemsPerPage, setItemsPerPage] = useState<number>(9)

  // sortedItems is the full unfiltered item list
  const sortedItems = useMemo(() => {
    return getSortedDataItems(items, sortValue, resultSlugs, dataSourceType)
  }, [items, sortValue, resultSlugs, dataSourceType])

  // Filter items to only those that match the slugs from DataItemSearchContext
  const filteredItems = useMemo(() => {
    if (!sortedItems || !resultSlugs.length) {
      return [];
    }

    return sortedItems.filter(({ slug }) => {
      return slug && resultSlugs.includes(slug)
    })
  }, [sortedItems, resultSlugs])

  // Decide which items to display based on search/filter usage
  let itemsToDisplay: ListViewDataItems = [];

  // Paginate items by page limit & current page
  if (searchValue !== '' || filterValue.length > 0) {
    // Get items with search/filter values
    itemsToDisplay = getCurrentPageDataItems(
      filteredItems,
      currentPageIndex,
      itemsPerPage
    )
  } else {
    // Get initial items with no search or filter values
    itemsToDisplay = getCurrentPageDataItems(
      sortedItems,
      currentPageIndex,
      itemsPerPage
    )
  }

  // Get total count of pages based on page limit & relevant item count
  const numberOfPages = getNumberOfPages(filteredItems.length, itemsPerPage)

  // Extract tags from items
  const itemTags = (useDataItemTagsFromNodes(items) || []) as string[]

  // Memoize item list
  const dataItemListContextValue: {
    itemsToDisplay: DeepPickedArticle[];
    pageCount: number;
    pageIndex: number;
    setCurrentPageIndex: (value: (((prevState: number) => number) | number)) => void;
    itemTags: string[];
    sortValue: DataItemSortOptionValue;
    setSortValue: (value: (((prevState: DataItemSortOptionValue) => DataItemSortOptionValue) | DataItemSortOptionValue)) => void;
    itemsPerPage: number;
    setItemsPerPage: (value: (((prevState: number) => number) | number)) => void;
    numberOfPages: number;
    searchResultsContextValue: DataItemSearchContextValue
  } = useMemo(
    () => ({
      itemsToDisplay: itemsToDisplay as Article[],
      pageCount: Math.ceil(filteredItems.length / itemsPerPage),
      pageIndex: currentPageIndex,
      setCurrentPageIndex,
      itemTags,
      sortValue,
      setSortValue,
      itemsPerPage,
      setItemsPerPage,
      numberOfPages,
      searchResultsContextValue: searchCtx,
    }),
    [currentPageIndex, sortValue, itemsPerPage, numberOfPages, searchCtx, filteredItems.length, itemsToDisplay]
  )

  return (
    <DataItemListContext.Provider value={dataItemListContextValue}>
      {children}
    </DataItemListContext.Provider>
  )
}

// --------------------------------------------
// Composed Provider (DataItemContextProvider)
// --------------------------------------------
interface DataItemContextProviderProps extends DataItemListContextProps {
  dataSourceType?: DataSourceType
}

export const DataItemContextProvider: FC<DataItemContextProviderProps> =
  ({
     children,
     pageIndex,
     items,
     dataSourceType = 'blog',
   }) => {
  return (
    <DataItemSearchContextProvider items={items} dataSourceType={dataSourceType}>
      <DataItemListContextProvider pageIndex={pageIndex} items={items} dataSourceType={dataSourceType}>
        {children}
      </DataItemListContextProvider>
    </DataItemSearchContextProvider>
  );
};
