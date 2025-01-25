import React, { useEffect, useState } from 'react'
import SocialLinks from './SocialLinks'
import { animated, useSpring } from '@react-spring/web'

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
        className="flex h-[45px] w-[175px] items-center rounded bg-card-background p-2 text-xs
        font-light uppercase tracking-widest text-gray-300 shadow-2xl lg:text-lg"
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
  return (
    <div
      className="flex h-screen w-screen flex-col overflow-y-hidden p-4 leading-6 tracking-widest
      sm:items-center lg:justify-center"
    >
      <div className="min-h-max w-full" style={{ minHeight: '300px' }}>
        <div className="flex w-full flex-col justify-between">
          <div className="flex flex-col gap-4 sm:items-center lg:ml-0 lg:mt-4 lg:items-start lg:pl-6">
            <div className="flex w-full flex-col items-center justify-center py-6 lg:items-start lg:justify-start">
              <TerminalNameplate />

              <h1
                className="flex whitespace-nowrap text-center text-5xl leading-[2.85rem]
                tracking-tight text-gray-100 lg:ml-0 lg:text-left lg:text-8xl"
              >
                Patrick Hanford
                <span className="hidden lg:block">.</span>
              </h1>
            </div>
            <SocialLinks className="flex justify-center gap-4 lg:justify-start" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroComponent