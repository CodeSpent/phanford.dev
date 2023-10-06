import React, { FC } from 'react'
import { IContextMenuSubsection } from './types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import ContextMenuItem from './context-menu-item'
import { useContextMenuState } from './context-menu-context'
import { sluggify } from '../../utils/common'

const ContextMenuSubsection: FC<{
  subsection: IContextMenuSubsection
  onOptionSelected: () => void
  parentSectionIndex: number
}> = ({ subsection, onOptionSelected, parentSectionIndex }) => {
  const { collapsedSectionLabels, addCollapsedSectionLabel, removeCollapsedSectionLabel } =
    useContextMenuState()

  const labelSlug = sluggify(subsection.label)

  const collapsed = collapsedSectionLabels.includes(labelSlug)
  const handleToggle = () => {
    if (collapsed) {
      removeCollapsedSectionLabel(labelSlug)
    } else {
      addCollapsedSectionLabel(labelSlug)
    }
  }

  return (
    <div>
      <div className="flex cursor-pointer justify-between px-4 py-2 text-xs" onClick={handleToggle}>
        {subsection.label}
        <FontAwesomeIcon icon={collapsed ? faChevronDown : faChevronUp} className="text-xs" />
      </div>
      {!collapsed &&
        subsection.options.map((item, index) => (
          <ContextMenuItem key={index} option={item} onSelected={onOptionSelected} />
        ))}
    </div>
  )
}

export default ContextMenuSubsection
