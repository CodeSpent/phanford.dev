import React, { FC, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { IContextMenuProps } from './types'
import ContextMenuSection from './context-menu-section'
import { useContextMenuState } from 'components/context-menu/context-menu-context'
const ContextMenu: FC<IContextMenuProps> = ({
  onOptionSelected,
  menuOptions,
  collapsedSectionIndexes,
}) => {
  const contextMenuRef = useRef<HTMLDivElement>(null)

  const { isOpen, coords, menuDisabled, toggleContextMenu } = useContextMenuState()

  useEffect(() => {
    if (!isOpen || menuDisabled) return

    const handleOutsideClick = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        onOptionSelected()
      }
    }

    document.addEventListener('click', handleOutsideClick)

    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [contextMenuRef, onOptionSelected, isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={contextMenuRef}
      style={{ top: coords.y, left: coords.x }}
      className="absolute z-50 w-[328px] overflow-hidden rounded-md border border-black bg-card-background
      text-gray-300 drop-shadow-2xl"
    >
      <button
        onClick={() => toggleContextMenu()}
        className="absolute right-0 top-0 cursor-pointer px-4 py-2 text-red-500 hover:text-red-600"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
      {menuOptions.map(menuItem => (
        <ContextMenuSection
          key={menuItem.label}
          section={menuItem}
          onOptionSelected={onOptionSelected}
          collapsedSectionIndexes={collapsedSectionIndexes}
        />
      ))}
    </div>
  )
}

export default ContextMenu
