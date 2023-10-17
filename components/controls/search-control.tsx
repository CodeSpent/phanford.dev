import React, { useState, useEffect } from 'react'
import Input from 'components/common/Input'

export default function SearchControl({ label, placeholder, value, onChange, hotkey }) {
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
    <div>
      <div className="relative mt-1 flex h-9 items-center">
        <Input
          label={label}
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleChange}
        />
        {hotkey && (
          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <kbd
              className="inline-flex items-center rounded border border-gray-200 px-2 font-sans text-sm
            font-medium text-gray-400"
            >
              {hotkey}
            </kbd>
          </div>
        )}
      </div>
    </div>
  )
}
