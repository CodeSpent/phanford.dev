export interface IContextMenuOption {
  label: string
  description: string
  action?: (selectedValue?: any) => void
  dropdownOptions?: string[]
}

export interface IContextMenuSubsection {
  label: string
  options: IContextMenuOption[]
}

export interface IContextMenuSection {
  label: string
  options: IContextMenuSubsection[]
}

export interface IContextMenuProps {
  clickCoords: { x: number; y: number }
  onOptionSelected: () => void
  onWidthChanged?: (width: number) => void
  visible: boolean
  menuOptions: IContextMenuSection[]
  onSectionCollapse?: () => {}
  collapsedSectionIndexes: number[]
}
