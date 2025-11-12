import React from 'react'

export type ProjectStatus = 'active' | 'in-development' | 'archived' | 'maintained'

interface ProjectStatusBadgeProps {
  status: ProjectStatus | string
  className?: string
}

const statusConfig: Record<string, { label: string; colorClasses: string }> = {
  'active': {
    label: 'Active',
    colorClasses: 'bg-green-500/10 text-green-400 border-green-500/20',
  },
  'in-development': {
    label: 'In Development',
    colorClasses: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  'archived': {
    label: 'Archived',
    colorClasses: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  },
  'maintained': {
    label: 'Maintained',
    colorClasses: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  },
}

export const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ status, className = '' }) => {
  const config = statusConfig[status.toLowerCase()] || statusConfig['active']

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${config.colorClasses} ${className}`}
    >
      {config.label}
    </span>
  )
}
