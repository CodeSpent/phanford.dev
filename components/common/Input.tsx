import React, { ChangeEvent, useState } from 'react'
import { Combobox } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { classNames } from 'utils/common'

interface InputProps {
  label: string
  type: string
  placeholder: string
  value: string
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
  value: string
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
}

export const ComboBoxInput: React.FC<ComboBoxInputProps> = ({
  label,
  options,
  placeholder,
  value,
  onChange,
}) => {
  const [selectedFilters, setSelectedFilters] = useState<ComboBoxOption[]>([])
  const [filteredOptions, setFilteredOptions] = useState<ComboBoxOption[]>(options)

  const filterOptionsBySelectedFilters = selectedFilters => {
    if (selectedFilters.length > 0) {
      setFilteredOptions(
        options.filter(option => option.value.toLowerCase().includes(option.value.toLowerCase()))
      )
    } else {
      setFilteredOptions(options)
    }
  }

  const getComboBoxOptionFromValue = (value: string): ComboBoxOption | undefined => {
    return options.find(option => option.value === value)
  }

  // @ts-ignore
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-400">{label}</label>
      <Combobox as="div" value={value} multiple={true} className="relative" onChange={onChange}>
        <Combobox.Input
          className="h-9 w-full rounded-md border-none bg-gray-900 py-2 pl-3 pr-10 capitalize text-gray-600 shadow-sm
          focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 sm:text-sm"
          placeholder={placeholder}
          displayValue={() =>
            selectedFilters.length == 0 ? placeholder : `${selectedFilters.length} selected`
          }
          onChange={e => {
            filterOptionsBySelectedFilters(e.target.value)
          }}
        />

        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {options.length > 0 && (
          <Combobox.Options
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-900
          py-1 text-base capitalize text-gray-600 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
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
          </Combobox.Options>
        )}
      </Combobox>
    </div>
  )
}

export default Input
