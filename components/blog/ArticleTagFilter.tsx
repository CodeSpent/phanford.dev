import { useState } from 'react'
import { ComboBoxInput } from '../common/Input'
import { useArticleSearchContext } from '../../constants/article-list-context/article-list-context'
import TagFilterControl from '../controls/tag-filter-control'

type Props = {
  tags: string[]
}

export default function ArticleTagFilter({ tags }: Props) {
  const { filterValue, setFilterValue } = useArticleSearchContext()
  const [filteredTags] = useState(tags)

  return (
    <TagFilterControl
      label="Filter by Tag"
      tags={tags}
      value={filterValue}
      onChange={setFilterValue}
    />
  )
}
