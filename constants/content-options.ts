
import { ComboBoxOption } from '../components/common/Input'

// --------------------------------------------
// Sort options & types
// --------------------------------------------
export enum DataItemSortOptionValue {
  TIME_ASCENDING = 'time_asc',
  TIME_DESCENDING = 'time_desc',
  DATE_ASCENDING = 'date_asc',
  DATE_DESCENDING = 'date_desc',
  RELEVANCE = 'relevance',
}

export type DataItemSortOption = {
  label: string
  value: DataItemSortOptionValue
}

export const sortOptions: DataItemSortOption[] = [
  { label: 'Relevance', value: DataItemSortOptionValue.RELEVANCE },
  { label: 'Date ↑', value: DataItemSortOptionValue.DATE_ASCENDING },
  { label: 'Date ↓', value: DataItemSortOptionValue.DATE_DESCENDING },
  { label: 'Time to Read ↑', value: DataItemSortOptionValue.TIME_ASCENDING },
  { label: 'Time to Read ↓', value: DataItemSortOptionValue.TIME_DESCENDING },
]

// --------------------------------------------
// Pagination options & types
// --------------------------------------------
export const paginationOptions: ComboBoxOption[] = [
  { label: '6', value: '6' },
  { label: '9', value: '9' },
  { label: '18', value: '18' },
  { label: '36', value: '36' },
]
