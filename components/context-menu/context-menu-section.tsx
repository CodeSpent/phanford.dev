import React, { FC } from 'react'
import { IContextMenuSection } from './types'
import ContextMenuSubsection from './context-menu-subsection'
interface ContextMenuSectionProps {
  section: IContextMenuSection
  onOptionSelected: () => void
  collapsedSectionIndexes: number[]
}

const ContextMenuSection: FC<ContextMenuSectionProps> = ({ section, onOptionSelected }) => {
  return (
    <div>
      <div className="py-1">
        <div className="border-b border-gray-600 border-opacity-[0.5] px-4 py-2 text-sm font-semibold">
          {section.label}
        </div>
        {section.options.map((subsection, index) => (
          <ContextMenuSubsection
            key={subsection.label}
            subsection={subsection}
            onOptionSelected={onOptionSelected}
            parentSectionIndex={index}
          />
        ))}
      </div>
    </div>
  )
}

export default ContextMenuSection
