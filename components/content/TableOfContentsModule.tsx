'use client'

import React from 'react'
import { SidebarModule } from './SidebarModule'
import TableOfContents from '../blog/TableOfContents'

interface TableOfContentsModuleProps {
  className?: string
}

/**
 * Table of Contents wrapped in a sidebar module
 * Reuses existing TableOfContents component for consistency
 */
export const TableOfContentsModule: React.FC<TableOfContentsModuleProps> = ({
  className = '',
}) => {
  return (
    <div className={`sticky top-24 ${className}`}>
      <TableOfContents />
    </div>
  )
}
