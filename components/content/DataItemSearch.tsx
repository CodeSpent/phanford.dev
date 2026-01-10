import { useDataItemSearchContext } from '../../constants/data-item-context/data-item-context'
import SearchControl from '../controls/search-control'

type Props = {
  searchLabel?: string
}

export default function DataItemSearch({ searchLabel = "Search" }: Props) {
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
    />
  )
}
