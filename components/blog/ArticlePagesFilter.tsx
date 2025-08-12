import { Fragment, useContext } from 'react'
import {
  useArticleListContext,
} from '../../constants/article-list-context/article-list-context'
import { paginationOptions } from '../../constants/blog'
import { ListBoxInput } from '../common/Input'

type Props = {
  itemNamePlural?: string
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ArticlePagesFilter({ itemNamePlural = "Items" }: Props) {
  const { articlesPerPage, setArticlesPerPage } = useArticleListContext()

  return (
    <>
      <ListBoxInput
        label="Per Page"
        options={paginationOptions}
        value={articlesPerPage.toString()}
        onChange={setArticlesPerPage}
      />
    </>
  )
}
