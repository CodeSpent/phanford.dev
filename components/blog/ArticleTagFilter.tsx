import { useState } from 'react'
import { useArticleSearchContext } from 'constants/article-list-context/article-list-context'
import TagFilterControl from 'components/controls/tag-filter-control'

type Props = {
  tags: string[]
}

export default function ArticleTagFilter({ tags }: Props) {
  const { filterValue, setFilterValue, filterMode, setFilterMode } = useArticleSearchContext()
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
