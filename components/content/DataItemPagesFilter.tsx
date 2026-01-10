import {
  useDataItemListContext,
} from '../../constants/data-item-context/data-item-context'
import { paginationOptions } from '../../constants/content-options'
import { ListBoxInput } from '../common/Input'

type Props = {
  itemNamePlural?: string
}

export default function DataItemPagesFilter({ itemNamePlural = "Items" }: Props) {
  const { itemsPerPage, setItemsPerPage } = useDataItemListContext()

  return (
    <>
      <ListBoxInput
        label="Per Page"
        options={paginationOptions}
        value={itemsPerPage.toString()}
        onChange={setItemsPerPage}
      />
    </>
  )
}
