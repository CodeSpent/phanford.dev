import React from 'react'
import { IBar, IBarRowProps } from './types'
import { Bar } from 'components/bars'

export const BarRow: React.FC<IBarRowProps> = ({ bars }) => {
  return (
    <div className="flex flex-row gap-3">
      {bars.map(bar => (
        <Bar key={bar.id} section={bar} />
      ))}
    </div>
  )
}
