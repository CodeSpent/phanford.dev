import { useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import { v4 as uuidv4 } from 'uuid'

const taglines: { adverb: string, name: string }[] = [
  { adverb: 'develop', name: 'Software' },
  { adverb: 'build', name: 'Web Applications' },
  { adverb: 'build', name: 'Websites' },
  { adverb: 'create', name: 'Connected Experiences' },
  { adverb: 'build', name: 'Native Mobile Apps' },
  { adverb: 'design', name: 'REST APIs' },
  { adverb: 'build', name: 'Automation Tools' },
  { adverb: 'break', name: 'Security Systems' },
  { adverb: 'build', name: 'IoT Devices' },
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
];


const widths: string[] = [
  'w-8',
  'w-10',
  'w-12',
  'w-16',
  'w-20',
  'w-24',
  'w-28',
  'w-32',
  'w-36',
  'w-40',
  'w-42',
  'w-46',
  'w-48',
  'w-50',
  'w-54',
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

const generateRandomBars = (count: number) => {
  const bars = []
  for (let i = 0; i < count; i++) {
    const randomWidth = widths[Math.floor(Math.random() * widths.length)]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    bars.push({ id: uuidv4(), width: randomWidth, colors: randomColor })
  }
  return bars
}

const HeroComponent = () => {
  const [tagline, setTagline] = useState(taglines[0])
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0)
  const [bars, setBars] = useState([])
  const [, setRows] = useState([])

  const itemsPerRow = 4

  useEffect(() => {
    const newRows = Array.from({ length: Math.ceil((24 + 1) / 4) }).map(
      () => 2 + Math.floor(Math.random() * 3)
    )
    setRows(newRows)

    setBars(generateRandomBars(28).map((bar) => ({ id: uuidv4(), ...bar })))

    const shiftInterval = setInterval(() => {
      setBars((prevBars) => {
        const shiftAmount = itemsPerRow
        const shifted = prevBars.slice(0, shiftAmount)
        return [...prevBars.slice(shiftAmount), ...shifted]
      })
    }, 950)

    return () => clearInterval(shiftInterval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentTaglineIndex + 1 != taglines.length) setCurrentTaglineIndex(currentTaglineIndex + 1)
      setTagline(taglines[currentTaglineIndex])
    }, 250)

    return () => clearInterval(interval)
  }, [currentTaglineIndex])

  const renderBars = (startIndex:number, endIndex:number) => (
    <div className="mb-1 flex flex-col gap-4">
      {Array.from({ length: Math.ceil((endIndex - startIndex + 1) / 4) }).map(
        (_, rowIndex) => {
          const barsInRow = 2 + Math.floor(Math.random() * 3)
          const rowStart = startIndex + rowIndex * barsInRow
          let rowEnd = rowStart + barsInRow

          if (rowEnd > endIndex) {
            rowEnd = endIndex
          }

          return (
            <div key={rowIndex} className="flex flex-row gap-3">
              {bars.slice(rowStart, rowEnd).map((section) => {
                return (
                  <Transition
                    key={section.id}
                    show={true}
                    appear={true}
                    enter="transition-all transform ease-in-out duration-500 opacity-0 translate-y-4"
                    enterFrom="opacity-0 translate-y-4"
                    enterTo="opacity-100 translate-y-0"
                    className={`${section.width} rounded h-4 overflow-hidden`}
                  >
                    <div
                      className={`bg-gradient-to-r ${section.colors} w-full h-full`}
                    />
                  </Transition>
                )
              })}
            </div>
          )
        }
      )}
    </div>
  )

  return (
    <div className="flex flex-col h-screen lg:justify-center p-4 leading-6 tracking-widest">
      <div className="min-h-max" style={{ minHeight: '300px' }}>
        <div className="my-10">
          <div className="h-24">{renderBars(0, 12)}</div>

          <div className="lg:ml-0 lg:pl-4 my-8 flex items-center">
            <div className="pl-4">
              <div className="flex h-4 gap-3">
                <span className="-mt-1.5 text-lg font-semibold italic text-gray-300">
                  Hi, my name is
                </span>
              </div>
              <h1 className="text-6xl text-white lg:text-8xl">
                Patrick Hanford
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
                <h2 className="text-4xl flex gap-2 font-thin italic text-gray-300 lg:text-6xl">
                  I
                  <span className="font-thin">{tagline.adverb}</span>
                  <span className="font-semibold">{tagline.name}</span>
                  <span className="-mx-2">.</span>
                </h2>
              </Transition>
            </div>
          </div>

          <div className="h-24">{renderBars(12, 24)}</div>
        </div>
      </div>
    </div>
  )
}

export default HeroComponent
