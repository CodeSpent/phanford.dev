import React from 'react'
import { animated, useSpring } from '@react-spring/web'
import { IBarProps } from './types'

export const Bar: React.FC<IBarProps> = React.memo(({ section }) => {
  const props = useSpring({
    from: { opacity: 1, transform: 'scale(1.0)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 420, friction: 80, duration: 2200 },
    reset: true,
  })

  return (
    <animated.div
      key={section.id}
      style={props}
      className={`${section.width} h-4 overflow-hidden rounded`}
    >
      <div className={`bg-gradient-to-r ${section.colors} h-full w-full`} />
    </animated.div>
  )
})
