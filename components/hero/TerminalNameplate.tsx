import React, { useState, useEffect } from 'react';
import { animated, useSpring, useSpringRef } from '@react-spring/web';
import { useChain } from 'react-spring';

const TerminalNameplate: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);

  const cursorSpringRef = useSpringRef();
  const terminalSpringRef = useSpringRef();
  const delay = 200;

  const terminalStyles = useSpring({
    ref: terminalSpringRef,
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay,
    config: { tension: 400, friction: 45 },
    onRest: () => setIsTerminalVisible(true),
  });

  const cursorStyles = useSpring({
    ref: cursorSpringRef,
    from: { opacity: 0 },
    to: { opacity: 0 }, // TODO: Fix cursor blink
    loop: true,
    config: { duration: 500 },
  });

  useEffect(() => {
    if (isTerminalVisible && typedText === '') {
      const text = 'whoami';
      text.split('').forEach((char, index) => {
        setTimeout(() => setTypedText((prev) => prev + char), index * 100);
      });
    }
  }, [isTerminalVisible, typedText]);

  useChain([terminalSpringRef, cursorSpringRef], [0, 1]);

  return (
    <div className="mb-4 mt-6 flex h-4 w-full items-center justify-center lg:mt-8 lg:justify-start">
      <animated.div style={terminalStyles}>
        <div
          className="flex h-[45px] w-auto items-center rounded bg-card-background px-2 py-2 text-xs font-light
          lowercase tracking-widest text-gray-300 shadow-2xl lg:text-lg"
        >
          <span className="text-terminal-header text-green-400 mr-2">~ </span>
          <span className="italic">{typedText}</span>
          <animated.span
            style={cursorStyles}
            className="ml-1 text-xl tracking-tighter"
          >
            |
          </animated.span>
        </div>
      </animated.div>
    </div>
  );
};

export default TerminalNameplate;