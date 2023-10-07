export interface Tagline {
  adverb: string
  name: string
}

export interface IBar {
  id: string
  width: string
  colors: string
}

export interface IBarProps {
  section: IBar
}

export interface IBarRowProps {
  bars: IBar[]
}

export interface BarsContainerProps {
  rows: IBar[][]
  barsPerRow?: number
  barHeight?: number
  speed?: number
  numRows?: number
}
