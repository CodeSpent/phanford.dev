import React, { ChangeEvent, useState, useRef, useCallback, useEffect } from 'react'
import { Combobox } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { classNames } from 'utils/common'

interface InputProps {
  label: string
  type: string
  placeholder: string
  value: any
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const Input: React.FC<InputProps> = ({ label, type, placeholder, value, onChange }) => {
  return (
    <div className="mb-5 w-full">
      <label className="block text-sm font-medium text-gray-400">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="block w-full rounded-md border-none bg-gray-900 pr-12 text-gray-600 shadow-sm
        focus:border-gray-600 focus:ring-gray-500 sm:text-sm"
      />
    </div>
  )
}

export interface ListBoxOption {
  value: string
  label: string
}

interface ListBoxInputProps {
  label: string
  options: ListBoxOption[]
  value: any
  onChange: (newValue: any) => void
}

export const ListBoxInput: React.FC<ListBoxInputProps> = ({ label, options, value, onChange }) => {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-400">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="block w-full rounded-md border-none bg-gray-900 pr-12 text-gray-600 shadow-sm focus:border-gray-600
        focus:ring-gray-600 sm:text-sm"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export interface ComboBoxOption {
  value: string
  label: string
}

export interface ComboBoxInputProps {
  label: string
  options: ComboBoxOption[]
  placeholder: string
  value: any
  onChange: (value: any[]) => void
  showFilterMode?: boolean
  filterMode?: 'OR' | 'AND'
  onFilterModeChange?: (mode: 'OR' | 'AND') => void
}

export const ComboBoxInput: React.FC<ComboBoxInputProps> = ({
  label,
  options,
  placeholder,
  value,
  onChange,
  showFilterMode = false,
  filterMode = 'OR',
  onFilterModeChange,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredOptions, setFilteredOptions] = useState<ComboBoxOption[]>(options)
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const comboboxRef = useRef<HTMLDivElement>(null)

  // Get selected options from value prop
  const selectedOptions = options.filter(option => value.includes(option.value))

  const filterOptionsBySearchTerm = (term: string) => {
    if (!term.trim()) {
      setFilteredOptions(options)
    } else {
      const lowerTerm = term.toLowerCase()
      setFilteredOptions(
        options.filter(option => 
          option.value.toLowerCase().includes(lowerTerm) ||
          option.label.toLowerCase().includes(lowerTerm)
        )
      )
    }
  }

  // Sync filteredOptions when options prop changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOptions(options)
    } else {
      filterOptionsBySearchTerm(searchTerm)
    }
  }, [options])

  // Memoize the filter mode change handler to prevent unnecessary re-renders
  const handleFilterModeChange = useCallback((mode: 'OR' | 'AND') => {
    // Call the parent handler without causing dropdown to close
    onFilterModeChange?.(mode)
  }, [onFilterModeChange])

  // @ts-ignore
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-400">{label}</label>
      <Combobox 
        as="div" 
        value={value} 
        multiple={true} 
        className="relative" 
        onChange={(newValue) => {
          onChange(newValue)
          // Clear search term after selection to allow new search
          setSearchTerm('')
          filterOptionsBySearchTerm('')
        }}
        ref={comboboxRef}
      >
        <Combobox.Input
          className="h-9 w-full rounded-md border-none bg-gray-900 py-2 pl-3 pr-10 capitalize text-gray-600 shadow-sm
          focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 sm:text-sm"
          placeholder={placeholder}
          value={isFocused ? searchTerm : (selectedOptions.length === 0 ? '' : 
            selectedOptions.length > 2 ? `${selectedOptions.length} tags selected` : 
            selectedOptions.map(opt => opt.label).join(', '))}
          onChange={e => {
            const newSearchTerm = e.target.value
            setSearchTerm(newSearchTerm)
            filterOptionsBySearchTerm(newSearchTerm)
          }}
          onFocus={() => {
            setIsFocused(true)
            setSearchTerm('')
            filterOptionsBySearchTerm('')
          }}
          onBlur={() => {
            setIsFocused(false)
            setSearchTerm('')
          }}
        />

        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {options.length > 0 && (
          <Combobox.Options
            className="absolute z-10 mt-1 w-full rounded-md bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 max-h-60 overflow-auto text-base capitalize text-gray-600 focus:outline-none sm:text-sm"
          >
            <div className="py-1">
              {filteredOptions.map(option => (
                <Combobox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) =>
                    classNames(
                      'relative cursor-default select-none py-2 pl-3 pr-9 capitalize',
                      active ? 'bg-gray-900 text-gray-600' : 'text-gray-200'
                    )
                  }
                >
                  {({ active, selected }) => (
                    <>
                      <span
                        className={classNames(
                          'block truncate capitalize',
                          selected && 'font-semibold'
                        )}
                      >
                        {option.label}
                      </span>

                      {selected && (
                        <span
                          className={classNames(
                            'absolute inset-y-0 right-0 flex items-center pr-4',
                            active ? 'text-white' : 'text-gray-600'
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </div>
            {showFilterMode && (
              <div className="sticky bottom-0 border-t border-gray-700 bg-gray-900 py-1">
                <div className="px-1 flex justify-center">
                  <div className="flex rounded border border-gray-600 overflow-hidden">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleFilterModeChange('OR')
                      }}
                      className={`px-1.5 py-0.5 text-xs transition-colors ${
                        filterMode === 'OR'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      OR
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleFilterModeChange('AND')
                      }}
                      className={`px-1.5 py-0.5 text-xs transition-colors ${
                        filterMode === 'AND'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      AND
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Combobox.Options>
        )}
      </Combobox>
    </div>
  )
}

export default Input
