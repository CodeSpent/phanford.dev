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
 *
 * Note: Combines top-40 with -mt-2 for fine-tuned positioning below navbar
 */
export const TableOfContentsModule: React.FC<TableOfContentsModuleProps> = ({
  className = '',
}) => {
  return (
    <div className={`sticky top-40 -mt-2 ${className}`}>
      <TableOfContents />
    </div>
  )
}
