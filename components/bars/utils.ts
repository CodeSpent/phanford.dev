import { IBar, Tagline } from 'components/bars/types'
import { v4 as uuidv4 } from 'uuid'

export const generateBars = (count: number, widths: string[], colors: string[]): IBar[] => {
  const bars: IBar[] = []
  for (let i = 0; i < count; i++) {
    const randomWidth = widths[Math.floor(Math.random() * widths.length)]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    bars.push({ id: uuidv4(), width: randomWidth, colors: randomColor })
  }
  return bars
}

export const generateBarRows = (rowCount: number, widths: string[], colors: string[]): IBar[][] => {
  const rows: IBar[][] = []
  for (let i = 0; i < rowCount; i++) {
    const barsInRow = 3 + Math.floor(Math.random() * 3)
    const bars = generateBars(barsInRow, widths, colors)
    rows.push(bars)
  }
  return rows
}
