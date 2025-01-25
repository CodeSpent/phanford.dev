import { Fragment } from 'react'
import {
  ArticleListContextProvider,
  ArticleSearchContextProvider,
  useArticleListContext,
} from '../../constants/article-list-context/article-list-context'
import { ListBoxInput } from '../common/Input'
import { sortOptions } from '../../constants/blog'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ArticleSortFilter() {
  const { sortValue, setSortValue } = useArticleListContext()

  return (
    <>
      <ListBoxInput
        label="Sort"
        options={sortOptions}
        value={sortValue.value}
        onChange={setSortValue}
      />
    </>
  )
}
