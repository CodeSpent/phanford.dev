import React from 'react'
import { ComboBoxInput } from '../common/Input'

type TagFilterProps = {
  label: string
  tags: string[]
  value: string[]
  onChange: (value: string[]) => void
}

export default function TagFilterControl({
  label,
  tags,
  value,
  onChange,
}: TagFilterProps) {
  return (
    <ComboBoxInput
      label={label}
      placeholder={'Select Tags'}
      value={value}
      onChange={onChange}
      options={tags.map((tag) => {
        return {
          label: tag,
          value: tag,
        }
      })}
    />
  )
}
