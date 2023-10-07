import React, { useCallback, useEffect, useState } from 'react'
import { animated as AnimatedDiv, useSprings } from '@react-spring/web'
import { BarRow } from 'components/bars'
import { generateBarRows } from 'components/bars/utils'
import { IBar } from 'components/bars/types'

interface BarsContainerProps {
  rows: number
  columns: number
  colors: string[]
  widths: string[]
  barHeight?: number
  speed?: number
  animationEnabled?: boolean
  scrollSpeed?: number
  scrollDirection?: 'up' | 'down'
}

export const BarsContainer: React.FC<BarsContainerProps> = React.memo(
  ({
    rows = 28,
    columns = 5,
    colors,
    widths,
    barHeight = 4,
    speed = 1000,
    animationEnabled = true,
    scrollSpeed = 1000,
    scrollDirection = 'up',
  }) => {
    const [animatedBars, setAnimatedBars] = useState<IBar[][]>(
      generateBarRows(rows, widths, colors)
    )

    const springs = useSprings(
      animatedBars.length,
      animatedBars.map((_, i) => ({
        to: {
          marginTop: animationEnabled ? (scrollDirection === 'up' ? -barHeight : barHeight) : 0,
        },
        from: { marginTop: 0 },
        config: { duration: animationEnabled ? scrollSpeed * (i + 1) : 0 },
      }))
    )

    const updateBars = useCallback(() => {
      setAnimatedBars(prevBars => {
        const newBars = generateBarRows(1, widths, colors)
        return scrollDirection === 'up'
          ? [...prevBars.slice(1), ...newBars]
          : [...newBars, ...prevBars.slice(0, -1)]
      })
    }, [widths, colors, scrollDirection])

    useEffect(() => {
      if (!animationEnabled) return

      const intervalId = setInterval(updateBars, speed)
      return () => clearInterval(intervalId)
    }, [animationEnabled, speed, updateBars])

    return (
      <div style={{ overflow: 'hidden', height: '100vh' }} className="flex flex-col gap-3">
        {springs.map((props, i) => (
          <AnimatedDiv.div style={props} key={i}>
            <BarRow bars={animatedBars[i]} />
          </AnimatedDiv.div>
        ))}
      </div>
    )
  }
)
