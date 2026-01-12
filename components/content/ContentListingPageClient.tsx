'use client'

import DefaultLayout from 'layouts/DefaultLayout'
import DataItemSearch from 'components/content/DataItemSearch'
import DataItemTagFilter from 'components/content/DataItemTagFilter'
import DataItemSortFilter from 'components/content/DataItemSortFilter'
import {
  DataItemListContextProvider,
  DataItemSearchContextProvider,
  useDataItemSearchContext,
} from 'constants/data-item-context/data-item-context'
import React, { useState } from 'react'
import DataItemList from 'page-components/content/data-item-list/data-item-list'
import DataItemPagesFilter from 'components/content/DataItemPagesFilter'
import DataItemPaginationControls from 'components/content/DataItemPaginationControls'
import DataSourceSelector from 'components/content/DataSourceSelector'
import { DataSourceType, getDataSource } from 'constants/data-sources'
import { MobileFilterProvider, MobileFilterButton, MobileFilterContent } from 'components/content/MobileFilterPanel'

type FilterControlsSectionProps = {
  tags: string[]
  itemNamePlural: string
  searchLabel: string
}

function FilterControlsSection({ tags, itemNamePlural, searchLabel }: FilterControlsSectionProps) {
  const { filterValue } = useDataItemSearchContext()
  const activeFilterCount = filterValue.length

  return (
    <>
      <MobileFilterProvider>
        <div className="lg:hidden">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <DataItemSearch searchLabel={searchLabel} />
            </div>
            <MobileFilterButton activeFilterCount={activeFilterCount} />
          </div>
          <MobileFilterContent>
            <DataItemTagFilter tags={tags} compact />
            <div className="grid grid-cols-2 gap-3">
              <DataItemSortFilter compact />
              <DataItemPagesFilter itemNamePlural={itemNamePlural} compact />
            </div>
          </MobileFilterContent>
        </div>
      </MobileFilterProvider>

      <div className="hidden lg:flex lg:items-center lg:gap-5">
        <DataItemSearch searchLabel={searchLabel} />
        <DataItemTagFilter tags={tags} />
        <DataItemSortFilter />
        <DataItemPagesFilter itemNamePlural={itemNamePlural} />
      </div>
    </>
  )
}

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

                <div className="mt-3 pt-4 pb-2 sm:mt-4">
                  <FilterControlsSection
                    tags={tags}
                    itemNamePlural={dataSourceConfig.itemNamePlural}
                    searchLabel={dataSourceConfig.searchLabel}
                  />
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
