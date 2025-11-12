import { useArticleSearchContext } from '../../constants/article-list-context/article-list-context'
import SearchControl from '../controls/search-control'

type Props = {
  searchLabel?: string
}

export default function ArticleSearch({ searchLabel = "Search" }: Props) {
  const { searchValue, setSearchValue } = useArticleSearchContext()

  return (
    <SearchControl
      label={searchLabel}
      placeholder="Search"
      value={searchValue}
      onChange={(value) => {
        setSearchValue(value)
      }}
      hotkey="⌘K"
    />
  )
}
