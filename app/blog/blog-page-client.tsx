'use client'

import DefaultLayout from 'layouts/DefaultLayout'
import { ListViewArticles } from 'utils/fs/api'
import ArticleSearch from 'components/blog/ArticleSearch'
import ArticleTagFilter from 'components/blog/ArticleTagFilter'
import ArticleSortFilter from 'components/blog/ArticleSortFilter'
import {
  ArticleListContextProvider,
  ArticleSearchContextProvider,
} from 'constants/article-list-context/article-list-context'
import React, { useState } from 'react'
import ArticleList from 'page-components/blog/article-list/article-list'
import ArticlePagesFilter from 'components/blog/ArticlePagesFilter'
import PaginationControls from 'components/blog/PaginationControls'
import DataSourceSelector from 'components/blog/DataSourceSelector'
import { DataSourceType, getDataSource } from 'constants/data-sources'

type Props = {
  articles: ListViewArticles
  tags: string[]
  pageIndex: number
}

export default function BlogPageClient({
  articles: initialArticles,
  tags: initialTags,
  pageIndex,
}: Props) {
  const dataSource: DataSourceType = 'blog'
  const [articles, setArticles] = useState(initialArticles)
  const [tags, setTags] = useState(initialTags)

  const dataSourceConfig = getDataSource(dataSource)
  const pageTitle = `${dataSourceConfig.name} | Patrick Hanford`

  return (
    <DefaultLayout title={pageTitle}>
      <div className="px-4">
        <div className="relative mx-auto max-w-lg py-6 lg:max-w-7xl">
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
              <PaginationControls />
            </ArticleListContextProvider>
          </ArticleSearchContextProvider>
        </div>
      </div>
    </DefaultLayout>
  )
}