import React, { useState, useEffect } from 'react'
import Input from 'components/common/Input'

export default function SearchControl({ label, placeholder, value, onChange, hotkey, compact = false }) {
  const [searchValue, setSearchValue] = useState(value)

  useEffect(() => {
    setSearchValue(value)
  }, [value])

  const handleChange = event => {
    const newValue = event.target.value
    setSearchValue(newValue)

    if (onChange) {
      onChange(newValue)
    }
  }

  return (
    <Input
      label={label}
      type="text"
      placeholder={placeholder}
      value={searchValue}
      onChange={handleChange}
      compact={compact}
      rightAddon={
        hotkey ? (
          <kbd
            className="inline-flex items-center rounded border border-gray-200 px-2 font-sans text-sm
            font-medium text-gray-400"
          >
            {hotkey}
          </kbd>
        ) : undefined
      }
    />
  )
}
