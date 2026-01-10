'use client'

import DefaultLayout from 'layouts/DefaultLayout'
import DataItemSearch from 'components/content/DataItemSearch'
import DataItemTagFilter from 'components/content/DataItemTagFilter'
import DataItemSortFilter from 'components/content/DataItemSortFilter'
import {
  DataItemListContextProvider,
  DataItemSearchContextProvider,
} from 'constants/data-item-context/data-item-context'
import React, { useState } from 'react'
import DataItemList from 'page-components/content/data-item-list/data-item-list'
import DataItemPagesFilter from 'components/content/DataItemPagesFilter'
import DataItemPaginationControls from 'components/content/DataItemPaginationControls'
import DataSourceSelector from 'components/content/DataSourceSelector'
import { DataSourceType, getDataSource } from 'constants/data-sources'

type Props = {
  items: any[]
  tags: string[]
  pageIndex: number
  dataSourceType: DataSourceType
  onItemClick?: (item: any) => void
}

export default function ContentListingPageClient({
  items: initialItems,
  tags: initialTags,
  pageIndex,
  dataSourceType,
  onItemClick,
}: Props) {
  const [items] = useState(initialItems)
  const [tags] = useState(initialTags)

  const dataSourceConfig = getDataSource(dataSourceType)
  const pageTitle = `${dataSourceConfig.name} | Patrick Hanford`

  // Projects page has different padding
  const containerPadding = dataSourceType === 'projects' ? 'py-10' : 'py-2'

  return (
    <DefaultLayout title={pageTitle}>
      <div className="px-4">
        <div className={`relative mx-auto max-w-lg ${containerPadding} lg:max-w-7xl`}>
          <DataItemSearchContextProvider items={items} dataSourceType={dataSourceType}>
            <DataItemListContextProvider items={items} pageIndex={pageIndex} dataSourceType={dataSourceType}>
              <div>
                <div className="flex items-center">
                  <DataSourceSelector selectedDataSource={dataSourceType} />
                </div>

                <div className="sm:fl mt-3 flex flex-col gap-3 pt-4 pb-2 sm:mt-4 lg:flex-row lg:items-center lg:gap-5">
                  <DataItemSearch searchLabel={dataSourceConfig.searchLabel} />
                  <DataItemTagFilter tags={tags} />
                  <DataItemSortFilter />
                  <DataItemPagesFilter itemNamePlural={dataSourceConfig.itemNamePlural} />
                </div>
              </div>
              <DataItemList dataSource={dataSourceType} onItemClick={onItemClick} />
              <DataItemPaginationControls />
            </DataItemListContextProvider>
          </DataItemSearchContextProvider>
        </div>
      </div>
    </DefaultLayout>
  )
}
