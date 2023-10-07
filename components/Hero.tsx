import React, { useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import { v4 as uuidv4 } from 'uuid'
import { useSiteSettings } from 'constants/site-settings-context/site-settings-context'
import SocialLinks from './SocialLinks'
import { IBar, Tagline } from 'components/bars/types'
import { BarsContainer } from 'components/bars'
import { animated, useSpring } from '@react-spring/web'

const taglines: Tagline[] = [
  { adverb: 'write', name: 'Code' },
  { adverb: 'develop', name: 'Software' },
  { adverb: 'build', name: 'Web Applications' },
  { adverb: 'build', name: 'Websites' },
  { adverb: 'build', name: 'Native Mobile Apps' },
  { adverb: 'design', name: 'REST APIs' },
  { adverb: 'refine', name: 'Process' },
  { adverb: 'build', name: 'Automation Tools' },
  { adverb: 'break', name: 'Security Systems' },
  { adverb: 'build', name: 'IoT Devices' },
  { adverb: 'improve', name: 'DX' },
  { adverb: 'build', name: 'Battle Roombas' },
  { adverb: 'design', name: 'Schemas' },
  { adverb: 'design', name: 'GraphQL APIs' },
  { adverb: 'design', name: 'CI/CD Pipelines' },
  { adverb: 'design', name: 'Unreal Engine UIs' },
  { adverb: 'design', name: 'Infrastructure' },
  { adverb: 'code', name: 'Infrastructure' },
  { adverb: 'maintain', name: 'Infrastructure' },
  { adverb: 'build', name: 'Solutions' },
  { adverb: 'write', name: 'Code' },
]

const widths: string[] = [
  'w-7',
  'w-8',
  'w-9',
  'w-10',
  'w-12',
  'w-16',
  'w-20',
  'w-24',
  'w-28',
  'w-32',
  'w-36',
  'w-40',
  'w-44',
  'w-48',
  'w-52',
  'w-56',
]

const colors: string[] = [
  'from-blue-500 to-blue-500',
  'from-orange-500 to-orange-500',
  'from-pink-500 to-red-500',
  'from-green-500 to-green-600',
  'from-yellow-400 to-yellow-500',
  'from-red-400 to-red-500',
  'from-purple-400 to-purple-500',
  'from-blue-400 to-blue-500',
  'from-orange-400 to-orange-500',
  'from-gray-500 to-gray-600',
  'from-indigo-400 to-indigo-500',
  'from-red-500 to-red-600',
  'from-yellow-500 to-yellow-600',
  'from-green-400 to-green-500',
  'from-blue-400 to-blue-500',
  'from-indigo-500 to-indigo-600',
  'from-gray-400 to-gray-500',
  'from-pink-400 to-pink-500',
  'from-blue-600 to-blue-700',
  'from-orange-600 to-orange-700',
  'from-yellow-500 to-yellow-600',
  'from-red-500 to-red-600',
  'from-blue-500 to-blue-600',
  'from-orange-500 to-orange-600',
  'from-gray-600 to-gray-700',
  'from-indigo-500 to-indigo-600',
  'from-red-600 to-red-700',
]

const generateBars = (count: number): IBar[] => {
  const bars: IBar[] = []
  for (let i = 0; i < count; i++) {
    const randomWidth = widths[Math.floor(Math.random() * widths.length)]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    bars.push({ id: uuidv4(), width: randomWidth, colors: randomColor })
  }
  return bars
}

const generateBarRows = (rowCount: number): IBar[][] => {
  const rows: IBar[][] = []
  for (let i = 0; i < rowCount; i++) {
    const barsInRow = 3 + Math.floor(Math.random() * 3)
    const bars = generateBars(barsInRow)
    rows.push(bars)
  }
  return rows
}

const TerminalNameplate: React.FC = () => {
  const [typedText, setTypedText] = useState('')
  const [isCursorVisible, setIsCursorVisible] = useState(true)

  const cursorStyles = useSpring({
    opacity: isCursorVisible ? 1 : 0,
    config: { tension: 170, friction: 26 },
    reset: true,
    reverse: isCursorVisible,
  })

  useEffect(() => {
    setTypedText('')
    const cursorInterval = setInterval(() => {
      setIsCursorVisible(visible => !visible)
    }, 500)

    const initialDelay = 2000
    setTimeout(() => {
      const text = 'Hi, my name is'
      let i = -1

      const typingInterval = setInterval(() => {
        if (i < text.length) {
          i += 1
          setTypedText(prev => prev + text.charAt(i))
        } else {
          clearInterval(typingInterval)
        }
      }, 150)
    }, initialDelay)

    return () => {
      clearInterval(cursorInterval)
    }
  }, [])

  return (
    <div className="mb-4 mt-6 flex h-4 w-full items-center justify-center lg:mt-8 lg:justify-start">
      <span
        className="flex h-[45px] w-[175px] items-center rounded bg-card-background p-2 text-xs font-light
                  uppercase tracking-widest
                text-gray-300 shadow-2xl lg:text-lg"
      >
        {typedText}
        <animated.span style={cursorStyles} className="-ml-3/4 mb-1 text-xl tracking-tighter">
          |
        </animated.span>
      </span>
    </div>
  )
}

const HeroComponent: React.FC = () => {
  const [tagline, setTagline] = useState<Tagline>(taglines[0])
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState<number>(0)
  const [bars, setBars] = useState<IBar[][]>([])
  const [adverbBackgroundColor, setAdverbBackgroundColor] = useState<string>(
    'from-green-500 to-green-700'
  )
  const [taglineAnimationFinished, setTaglineAnimationFinished] = useState<boolean>(false)

  const { animationEnabled } = useSiteSettings()

  useEffect(() => {
    if (bars.length === 0) {
      setBars(generateBarRows(28))
    }

    if (!animationEnabled) return

    if (animationEnabled) {
      const shiftInterval = setInterval(() => {
        setBars(prevBars => {
          const shiftAmount = 1
          const oldBars = prevBars.slice(shiftAmount)
          const newBars = generateBarRows(shiftAmount)

          return [...oldBars, ...newBars]
        })
      }, 9999999)

      return () => clearInterval(shiftInterval)
    }
  }, [animationEnabled])

  useEffect(() => {
    if (!animationEnabled) {
      setCurrentTaglineIndex(taglines.length - 1)
      setTaglineAnimationFinished(true)
      return
    }

    setAdverbBackgroundColor(
      colors.filter(color => color !== 'opacity-0')[Math.floor(Math.random() * colors.length)]
    )

    if (currentTaglineIndex >= taglines.length - 1) {
      setTaglineAnimationFinished(true)
      return
    }

    const timeout = setTimeout(() => {
      if (!animationEnabled) return
      setCurrentTaglineIndex(prevIndex => prevIndex + 1)
      setTagline(taglines[currentTaglineIndex])
    }, 950)
    return () => clearTimeout(timeout)
  }, [currentTaglineIndex])

  useEffect(() => {
    setTagline(taglines[currentTaglineIndex])

    if (!animationEnabled) return
  }, [currentTaglineIndex])

  return (
    <div
      className="flex h-screen w-screen flex-col overflow-y-hidden p-4 leading-6 tracking-widest
      sm:items-center lg:justify-center"
    >
      <div className="min-h-max w-full" style={{ minHeight: '300px' }}>
        <div className="flex w-full flex-col justify-between">
          <div className="flex flex-col gap-4 sm:items-center lg:ml-0 lg:mt-4 lg:items-start lg:pl-6">
            <div className="mt-auto h-24 sm:h-16">
              <BarsContainer
                rows={4}
                columns={5}
                barHeight={30}
                scrollSpeed={1000}
                colors={colors}
                widths={widths}
                animationEnabled={false}
                scrollDirection={'up'}
              />
            </div>

            <div className="flex w-full flex-col items-center justify-center py-6 lg:items-start lg:justify-start">
              <TerminalNameplate />

              <h1
                className="flex whitespace-nowrap text-center text-5xl leading-[2.85rem]
                tracking-tight text-gray-100 lg:ml-0 lg:text-left lg:text-8xl"
              >
                Patrick Hanford
                <span className="hidden lg:block">.</span>
              </h1>

              <Transition
                enter="transition-opacity duration-75"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                show
              >
                <h2
                  className="flex w-full flex-col items-center gap-0 py-2 text-4xl font-thin
                      text-gray-300 lg:w-1/2 lg:flex-row lg:items-center lg:py-4 lg:text-6xl"
                >
                  <div className="my-4 flex w-full items-center justify-center gap-2 lg:my-0 lg:w-auto lg:items-center">
                    <span className="justify-start self-center font-semibold">I</span>
                    <span
                      className={`mx-2 w-[300px] rounded-lg bg-gradient-to-r stroke-black stroke-1 p-2 text-center 
                          font-semibold lowercase tracking-wider shadow-2xl [text-shadow:_5px_5px_0_rgb(0_0_0_/_40%)]
                          lg:border-none ${adverbBackgroundColor} self-center`}
                    >
                      {tagline.adverb}
                    </span>
                  </div>
                  <span
                    className={`ml-2 h-12 self-center whitespace-nowrap text-center font-bold tracking-widest 
                    lg:text-6xl ${tagline.name.length >= 18 ? 'text-3xl' : 'text-4xl'}`}
                  >
                    {tagline.name}
                  </span>
                  <Transition
                    show={taglineAnimationFinished}
                    as={'span'}
                    enter="transition-opacity ease-linear duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                  >
                    <span className="mt-4 hidden text-5xl font-bold lg:block">.</span>
                  </Transition>
                </h2>
              </Transition>
            </div>
            <SocialLinks className=" flex justify-center gap-4 lg:justify-start lg:pl-6" />

            <div className="mt-auto h-24 sm:h-16">
              <BarsContainer
                rows={4}
                columns={5}
                barHeight={30}
                scrollSpeed={1000}
                colors={colors}
                widths={widths}
                animationEnabled={false}
                scrollDirection={'up'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default HeroComponent
