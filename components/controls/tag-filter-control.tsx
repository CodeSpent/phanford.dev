import React from 'react'
import { ComboBoxInput } from 'components/common/Input'

type TagFilterProps = {
  label: string
  tags: string[]
  value: string[]
  selectedTags: string[]
  onChange: (value: string[]) => void
}

const getPlaceholderText = (selectedTags: string[]) => {
  if (selectedTags.length === 0) return 'Select Tags'

  if (selectedTags.length > 2) {
    return `${selectedTags.length} tags selected`
  } else {
    return selectedTags.join(', ')
  }
}

export default function TagFilterControl({
  label,
  tags,
  value,
  onChange,
  selectedTags,
}: TagFilterProps) {
  return (
    <ComboBoxInput
      label={label}
      placeholder={getPlaceholderText(selectedTags)}
      value={value}
      onChange={onChange}
      options={tags.map(tag => {
        return {
          label: tag,
          value: tag,
        }
      })}
    />
  )
}
