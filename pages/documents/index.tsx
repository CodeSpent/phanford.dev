import DefaultLayout from 'layouts/DefaultLayout'
import { ListViewArticles } from 'utils/fs/api'
import ArticleSearch from 'components/blog/ArticleSearch'
import ArticleTagFilter from 'components/blog/ArticleTagFilter'
import ArticleSortFilter from 'components/blog/ArticleSortFilter'
import {
  ArticleListContextProvider,
  ArticleSearchContextProvider,
} from 'constants/article-list-context/article-list-context'
import React, { useState, useEffect, useCallback } from 'react'
import ArticleList from 'page-components/blog/article-list/article-list'
import ArticlePagesFilter from 'components/blog/ArticlePagesFilter'
import ArticlePaginator from 'components/blog/ArticlePaginator'
import DataSourceSelector from 'components/blog/DataSourceSelector'
import { DataSourceType, getDataSource } from 'constants/data-sources'

type Props = {
  articles: ListViewArticles
  tags: string[]
  numberOfPages: number
  pageIndex: number
  articlesPerPage: number
}

export default function DocumentsPage({
  articles: initialArticles,
  tags: initialTags,
  numberOfPages,
  pageIndex,
  articlesPerPage,
}: Props) {
  const dataSource: DataSourceType = 'documents'
  const [articles, setArticles] = useState(initialArticles)
  const [tags, setTags] = useState(initialTags)

  const dataSourceConfig = getDataSource(dataSource)
  const pageTitle = `${dataSourceConfig.name} | Patrick Hanford`

  return (
    <DefaultLayout title={pageTitle}>
      <div className="px-4">
        <div className="relative mx-auto max-w-lg py-10 lg:max-w-7xl">
          <ArticleSearchContextProvider articles={articles} dataSourceType={dataSource}>
            <ArticleListContextProvider articles={articles} pageIndex={pageIndex} dataSourceType={dataSource}>
              <div>
                <div className="flex items-center">
                  <DataSourceSelector selectedDataSource={dataSource} />
                </div>

                <div className="sm:fl mt-3 flex flex-col gap-3 pt-4 pb-2 sm:mt-4 lg:flex-row lg:items-center lg:gap-5">
                  <ArticleSearch searchLabel={dataSourceConfig.searchLabel} />
                  <ArticleTagFilter tags={tags} />
                  <ArticleSortFilter />
                  <ArticlePagesFilter itemNamePlural={dataSourceConfig.itemNamePlural} />
                </div>
              </div>
              <ArticleList dataSource={dataSource} />
              <ArticlePaginator />
            </ArticleListContextProvider>
          </ArticleSearchContextProvider>
        </div>
      </div>
    </DefaultLayout>
  )
}

export const getStaticProps = async () => {
  const dataSource = getDataSource('documents')
  const articles = dataSource.getItems() || []
  const tags = dataSource.getAvailableTags()

  return {
    props: {
      pageIndex: 0,
      path: `/documents`,
      articles,
      tags,
    },
  }
}
