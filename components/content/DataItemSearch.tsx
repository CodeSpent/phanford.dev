import { useDataItemSearchContext } from '../../constants/data-item-context/data-item-context'
import SearchControl from '../controls/search-control'

type Props = {
  searchLabel?: string
  compact?: boolean
}

export default function DataItemSearch({ searchLabel = "Search", compact = false }: Props) {
  const { searchValue, setSearchValue } = useDataItemSearchContext()

  return (
    <SearchControl
      label={searchLabel}
      placeholder="Search"
      value={searchValue}
      onChange={(value) => {
        setSearchValue(value)
      }}
      hotkey="⌘K"
      compact={compact}
    />
  )
}
