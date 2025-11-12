'use client'

import React, { useEffect, useMemo, useState } from 'react'
import SocialLinks from '../SocialLinks';
import { animated, useSpring } from '@react-spring/web';
import { NameComponent, SubtitleComponent, TerminalNameplate } from 'components/hero'
import { useTransition } from 'react-spring'

const ANIMATION_CONFIG = {
  interval: 2500,
  steps: 5,
  title: {
    tension: 90,
    friction: 20,
    distance: 50,
    delay: 1800,
  },
  subtitle: {
    tension: 140,
    friction: 70,
    distance: 20,
    delay: 2200,
  },
  links: {
    tension: 140,
    friction: 80,
    distance: 40,
    delay: 2600,
  }
}

const NameSubtitleWrapper: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= ANIMATION_CONFIG.steps) {
          clearInterval(interval);
          return 0;
        }
        return nextIndex;
      });
    }, ANIMATION_CONFIG.interval);

    return () => clearInterval(interval);
  }, []);

  const nameTransitions = useTransition(index, {
    from: { opacity: 0, transform: `translateX(-${ANIMATION_CONFIG.title.distance}px)` },
    enter: { opacity: 1, transform: 'translateX(0px)' },
    leave: { opacity: 0, transform: `translateX(${ANIMATION_CONFIG.title.distance}px)` },
    config: { tension: ANIMATION_CONFIG.title.tension, friction: ANIMATION_CONFIG.title.friction },
    delay: ANIMATION_CONFIG.title.delay,
  });

  const subtitleTransitions = useTransition(index, {
    from: { opacity: 0, transform: `translateX(-${ANIMATION_CONFIG.subtitle.distance}px)` },
    enter: { opacity: 1, transform: 'translateX(0px)' },
    leave: { opacity: 0, transform: `translateX(${ANIMATION_CONFIG.subtitle.distance}px)` },
    config: { tension: ANIMATION_CONFIG.subtitle.tension, friction: ANIMATION_CONFIG.subtitle.friction },
    delay: ANIMATION_CONFIG.subtitle.delay,
  });

  return (
    <div className="w-full text-center py-4 flex flex-col justify-between">
      <div className="relative w-full min-h-[60px]">
        {nameTransitions((style, currentIndex) => (
          <animated.div
            style={{
              ...style,
              position: 'absolute',
              width: '100%',
            }}
          >
            <NameComponent index={currentIndex} />
          </animated.div>
        ))}
      </div>

      <div className="relative w-full min-h-[30px] lg:pt-6">
        {subtitleTransitions((style, currentIndex) => (
          <animated.div
            style={{
              ...style,
              position: 'absolute',
              width: '100%',
            }}
          >
            <SubtitleComponent index={currentIndex} />
          </animated.div>
        ))}
      </div>
    </div>
  );
};

const HeroComponent: React.FC = () => {
  const linkStyles = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { tension: ANIMATION_CONFIG.links.tension, friction: ANIMATION_CONFIG.links.friction },
    delay: ANIMATION_CONFIG.links.delay,
  });

  const componentContent = useMemo(() => {
    return (
      <div
        className="flex h-screen w-screen flex-col overflow-y-hidden px-4 leading-6 tracking-widest
        sm:items-center lg:justify-center"
      >
        <div className="min-h-max w-full" style={{ minHeight: '300px' }}>
          <div className="flex w-full flex-col justify-between">
            <div className="flex flex-col gap-4 sm:items-center lg:ml-0 lg:mt-4 lg:items-start lg:pl-6">
              <div className="flex w-full flex-col items-center justify-center lg:items-start lg:justify-start pb-4">

                <TerminalNameplate />

                <NameSubtitleWrapper />

              </div>

              <animated.div style={linkStyles}>
                <SocialLinks className="flex justify-center gap-4 lg:justify-start" />
              </animated.div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [linkStyles]);

  return componentContent;
};


export default HeroComponent;