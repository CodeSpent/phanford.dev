
import { ComboBoxOption } from '../components/common/Input'

// --------------------------------------------
// Sort options & types
// --------------------------------------------
export enum ArticleSortOptionValue {
  TIME_ASCENDING = 'time_asc',
  TIME_DESCENDING = 'time_desc',
  DATE_ASCENDING = 'date_asc',
  DATE_DESCENDING = 'date_desc',
  RELEVANCE = 'relevance',
}

export type ArticleSortOption = {
  label: string
  value: ArticleSortOptionValue
}

export const sortOptions: ArticleSortOption[] = [
  { label: 'Relevance', value: ArticleSortOptionValue.RELEVANCE },
  { label: 'Date ↑', value: ArticleSortOptionValue.DATE_ASCENDING },
  { label: 'Date ↓', value: ArticleSortOptionValue.DATE_DESCENDING },
  { label: 'Time to Read ↑', value: ArticleSortOptionValue.TIME_ASCENDING },
  { label: 'Time to Read ↓', value: ArticleSortOptionValue.TIME_DESCENDING },
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
