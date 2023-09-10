import { Fragment, useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'

const taglines = [
  'Software',
  'Web Applications',
  'Websites',
  'Native Apps',
  'REST APIs',
  'Automation Tools',
  'Battle Roombas',
  'Schemas',
  'GraphQL APIs',
  'CI/CD Pipelines',
  'Clusters',
  'Aggregators',
  'Interfaces',
  'Cross-platform apps',
  'Infrastructure',

  // Landing tagline remains as last element
  'Solutions',
]

const getRandomLineWidth = (min, max) => {
  return `w-${Math.floor(Math.random() * (max - min + 1) + min)}`
}

const HeroComponent = () => {
  const [tagline, setTagline] = useState('Solutions')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex + 1 != taglines.length) setCurrentIndex(currentIndex + 1)
      setTagline(taglines[currentIndex])
    }, 250)

    return () => clearInterval(interval)
  }, [currentIndex])

  return (
    <div className="flex h-screen flex-col justify-center p-4 leading-6 tracking-widest">
      <div className="min-h-max" style={{ minHeight: '200px' }}>
        <div className="my-10 flex flex-col gap-3">
          <div className="flex h-4 gap-3">
            <div
              className={`w-48 rounded bg-gradient-to-l from-blue-500`}
            ></div>

            <div
              className={
                'w-48 rounded bg-gradient-to-r from-orange-500 to-orange-500'
              }
            ></div>

            <div className="w-4 rounded bg-gradient-to-r from-pink-500 to-red-500 "></div>
          </div>

          <div className="flex h-4 gap-3">
            <div className="transparent w-14"></div>
            <div className="w-12 rounded bg-gradient-to-r from-blue-400 to-blue-500"></div>
            <div className="w-36 rounded bg-gradient-to-r from-green-400 to-green-500"></div>
          </div>

          <div className="flex h-4 gap-3">
            <div className="transparent w-24"></div>
            <div className="w-12 rounded bg-gradient-to-r from-green-400 to-green-500"></div>
            <div className="transparent w-4"></div>

            <div className="w-12 rounded bg-gradient-to-r from-pink-500 to-red-500"></div>
            <div className="w-72 rounded bg-gradient-to-r from-yellow-500 to-orange-500"></div>
            <div className="w-36 rounded bg-gradient-to-r from-green-400 to-green-500"></div>
          </div>
        </div>

        <div className="ml-16">
          <div className="flex h-4 gap-3">
            <span className="-mt-1.5 text-lg font-semibold italic text-gray-300">
              Hi, my name is
            </span>
            <div className="transparent w-36"></div>
            <div className="w-24 rounded bg-gradient-to-r from-green-500 to-green-500"></div>
            <div className="w-4 rounded bg-gradient-to-r from-red-500 to-red-500"></div>
          </div>

          <h1 className="text-6xl text-white lg:text-8xl">Patrick Hanford</h1>
          <Transition
            enter-active-class="transition-opacity duration-75"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-150"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
            show={true}
          >
            <h2 className="text-4xl font-thin italic text-gray-300 lg:text-6xl">
              I build <span className="font-semibold">{tagline}</span>
              <span className="font-semibold italic text-white">.</span>
            </h2>
          </Transition>
        </div>

        <div className="my-10 flex flex-col gap-3">
          <div className="flex h-4 gap-3">
            <div className="w-24 rounded bg-gradient-to-l from-blue-500"></div>
            <div className="w-12 rounded bg-gradient-to-r from-yellow-500 to-orange-500"></div>
            <div className="transparent w-36"></div>
            <div className="w-36 rounded bg-gradient-to-r from-green-400 to-green-500"></div>
          </div>

          <div className="flex h-4 gap-3">
            <div className="transparent w-14"></div>
            <div className="w-36 rounded bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <div className="w-12 rounded bg-gradient-to-r from-pink-500 to-red-500"></div>
            <div className="w-48 rounded bg-gradient-to-r from-yellow-500 to-orange-600"></div>
          </div>
          <div className="flex h-4 gap-3">
            <div className="transparent w-14"></div>
            <div className="w-12 rounded bg-gradient-to-r from-pink-500 to-red-500"></div>
            <div className="w-24 rounded bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <div className="w-48 rounded bg-gradient-to-r from-yellow-500 to-orange-600"></div>
          </div>

          <div className="flex h-4 gap-3"></div>

          <div className="flex h-4 gap-3">
            <div className="w-12 rounded bg-gradient-to-l from-orange-600"></div>
            <div className="w-36 rounded bg-gradient-to-r from-green-400 to-green-600"></div>
            <div className="w-4 rounded bg-gradient-to-r from-blue-400 to-blue-500"></div>
            <div className="w-24 rounded bg-gradient-to-r from-purple-500 to-red-500"></div>
          </div>

          <div className="flex h-4 gap-3">
            <div className="transparent w-14"></div>
            <div className="w-12 rounded bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
            <div className="w-4 rounded bg-gradient-to-r from-green-500 to-green-500"></div>
            <div className="w-72 rounded bg-gradient-to-r from-red-500 to-purple-500"></div>
            <div className="w-24 rounded bg-gradient-to-r from-blue-500 to-blue-600"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroComponent
