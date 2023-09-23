import { createContext, useEffect, useMemo, useState } from 'react'
import { useLunr } from '../../utils/useLunr'
import { ArticleInfo } from '../../types/ArticleInfo'

const articleSearchContext = {
  searchValue: '',
  setSearchValue: (value: string) => {},
  filterValue: [] as string[],
  setFilterValue: (value: any[]) => {},
}

export const ArticleSearchContext = createContext(articleSearchContext)

export const useSearchValue = () => {
  const [searchValue, setSearchValue] = useState<string>('')

  return useMemo(
    () => ({
      searchValue,
      setSearchValue,
    }),
    [searchValue, setSearchValue]
  )
}

export const useFilterValue = () => {
  const [filterValue, setFilterValue] = useState<string[]>([])

  return useMemo(
    () => ({
      filterValue,
      setFilterValue,
    }),
    [filterValue, setFilterValue]
  )
}

export const useSearchResults = (
  searchValue: string,
  filterValue: string[]
) => {
  const { searchUsingLunr: filterUsingLunr, results: lunrFilterIds } = useLunr()
  const { searchUsingLunr, results: lunrSearchIds } = useLunr()

  useEffect(() => {
    if (!filterValue || !filterValue.length) {
      filterUsingLunr('')
    } else {
      filterUsingLunr(`tags: ${filterValue.join(' ')}`)
    }
  }, [filterValue])

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

  return useMemo(
    () => ({
      lunrResultSlugs,
    }),
    [lunrResultSlugs]
  )
}
