import { Fragment, useContext } from 'react'
import {
  useArticleListContext,
} from '../../constants/article-list-context/article-list-context'
import { paginationOptions } from '../../constants/blog'
import { ListBoxInput } from '../common/Input'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ArticlePagesFilter() {
  const { articlesPerPage, setArticlesPerPage } = useArticleListContext()

  return (
    <>
      <ListBoxInput
        label="Posts Per Page"
        options={paginationOptions}
        value={articlesPerPage.toString()}
        onChange={setArticlesPerPage}
      />
    </>
  )
}
