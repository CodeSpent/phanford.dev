'use client'

import DefaultLayout from 'layouts/DefaultLayout'
import { Photo } from 'contentlayer/generated'
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
import { useRouter } from 'next/navigation'

type Props = {
  photos: Photo[]
  tags: string[]
  pageIndex: number
}

export default function PhotographyPageClient({
  photos: initialPhotos,
  tags: initialTags,
  pageIndex,
}: Props) {
  const dataSource: DataSourceType = 'photography'
  const [photos, setPhotos] = useState(initialPhotos)
  const [tags, setTags] = useState(initialTags)
  const router = useRouter()

  const dataSourceConfig = getDataSource(dataSource)
  const pageTitle = `${dataSourceConfig.name} | Patrick Hanford`

  const handlePhotoClick = (photo: Photo) => {
    router.push(`/photography/${photo.slugAsParams}`)
  }

  return (
    <DefaultLayout title={pageTitle}>
      <div className="px-4">
        <div className="relative mx-auto max-w-lg py-10 lg:max-w-7xl">
          <ArticleSearchContextProvider articles={photos} dataSourceType={dataSource}>
            <ArticleListContextProvider articles={photos} pageIndex={pageIndex} dataSourceType={dataSource}>
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
              <ArticleList dataSource={dataSource} onPhotoClick={handlePhotoClick} />
              <PaginationControls />
            </ArticleListContextProvider>
          </ArticleSearchContextProvider>
        </div>
      </div>
    </DefaultLayout>
  )
}