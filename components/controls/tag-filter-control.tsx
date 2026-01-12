import React from 'react'
import { ComboBoxInput } from 'components/common/Input'
import { formatTag } from '../../utils/formatTag'

type TagFilterProps = {
  label: string
  tags: string[]
  value: string[]
  selectedTags: string[]
  onChange: (value: string[]) => void
  showFilterMode?: boolean
  filterMode?: 'OR' | 'AND'
  onFilterModeChange?: (mode: 'OR' | 'AND') => void
  compact?: boolean
}

const getPlaceholderText = (selectedTags: string[]) => {
  if (selectedTags.length === 0) return 'Select Tags'

  if (selectedTags.length > 2) {
    return `${selectedTags.length} tags selected`
  } else {
    return selectedTags.map(formatTag).join(', ')
  }
}

export default function TagFilterControl({
  label,
  tags,
  value,
  onChange,
  selectedTags,
  showFilterMode = false,
  filterMode = 'OR',
  onFilterModeChange,
  compact = false,
}: TagFilterProps) {
  return (
    <ComboBoxInput
      label={formatTag(label)}
      placeholder={getPlaceholderText(selectedTags)}
      value={value}
      onChange={onChange}
      showFilterMode={showFilterMode}
      filterMode={filterMode}
      onFilterModeChange={onFilterModeChange}
      compact={compact}
      options={tags.map(tag => {
        return {
          label: formatTag(tag),
          value: tag,
        }
      })}
    />
  )
}
