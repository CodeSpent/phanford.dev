import { useState } from 'react'
import { useDataItemSearchContext } from 'constants/data-item-context/data-item-context'
import TagFilterControl from 'components/controls/tag-filter-control'

type Props = {
  tags: string[]
}

export default function DataItemTagFilter({ tags }: Props) {
  const { filterValue, setFilterValue, filterMode, setFilterMode } = useDataItemSearchContext()
  const [filteredTags] = useState(tags)

  return (
    <TagFilterControl
      label="Filter by Tag"
      tags={filteredTags}
      value={filterValue}
      selectedTags={filterValue}
      onChange={setFilterValue}
      showFilterMode={true}
      filterMode={filterMode}
      onFilterModeChange={setFilterMode}
    />
  )
}
