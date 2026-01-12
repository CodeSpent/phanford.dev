import {
  useDataItemListContext,
} from '../../constants/data-item-context/data-item-context'
import { ListBoxInput } from '../common/Input'
import { sortOptions } from '../../constants/content-options'

type Props = {
  compact?: boolean
}

export default function DataItemSortFilter({ compact = false }: Props) {
  const { sortValue, setSortValue } = useDataItemListContext()

  return (
    <ListBoxInput
      label="Sort"
      options={sortOptions}
      value={sortValue}
      onChange={setSortValue}
      compact={compact}
    />
  )
}
