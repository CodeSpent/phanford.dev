import React from 'react'
import { TagList } from '../common/Tag'
import { SidebarModule } from './SidebarModule'

interface TagsModuleProps {
  tags: string[]
  className?: string
}

/**
 * Tags displayed in sidebar format
 * Alternative to displaying tags in the header
 */
export const TagsModule: React.FC<TagsModuleProps> = ({ tags, className = '' }) => {
  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <SidebarModule title="Tags" className={className}>
      <TagList tags={tags} variant="compact" />
    </SidebarModule>
  )
}
