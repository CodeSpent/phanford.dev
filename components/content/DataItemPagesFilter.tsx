import {
  useDataItemListContext,
} from '../../constants/data-item-context/data-item-context'
import { paginationOptions } from '../../constants/content-options'
import { ListBoxInput } from '../common/Input'

type Props = {
  itemNamePlural?: string
  compact?: boolean
}

export default function DataItemPagesFilter({ itemNamePlural = "Items", compact = false }: Props) {
  const { itemsPerPage, setItemsPerPage } = useDataItemListContext()

  return (
    <ListBoxInput
      label="Per Page"
      options={paginationOptions}
      value={itemsPerPage.toString()}
      onChange={setItemsPerPage}
      compact={compact}
    />
  )
}
