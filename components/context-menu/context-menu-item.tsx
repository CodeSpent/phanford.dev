import React, { FC, useCallback } from 'react'
import { IContextMenuOption } from './types'

interface IMenuItemProps {
  option: IContextMenuOption
  onSelected: () => void
}

const ContextMenuItem: FC<IMenuItemProps> = ({ option, onSelected }) => {
  const handleDropdownChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      option.action && option.action(e.target.value)
      onSelected()
    },
    [option, onSelected]
  )

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!option.dropdownOptions) {
        option.action && option.action()
        onSelected()
      }
    },
    [option, onSelected]
  )

  return (
    <div
      className="flex w-full cursor-pointer flex-col justify-between gap-1 px-4 py-4 pl-8 hover:bg-background focus:outline-none"
      onClick={handleClick}
    >
      {option.dropdownOptions ? (
        <div className="flex flex-col justify-between">
          <span className="text-sm">{option.label}</span>
          <select
            onChange={handleDropdownChange}
            className="my-2 w-full rounded-md border bg-card-background p-1 text-sm"
          >
            {option.dropdownOptions.map(dropdownOption => (
              <option key={dropdownOption} value={dropdownOption}>
                {dropdownOption}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <button className="text-left text-sm">{option.label}</button>
      )}
      <span className="whitespace-pre-line text-xs text-gray-500">{option.description}</span>
    </div>
  )
}

export default ContextMenuItem
