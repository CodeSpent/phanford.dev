import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { animated, useSpring } from '@react-spring/web';

const Subtitle: ({ index }) => React.JSX.Element = ({index} ) => {
  const subtitles = useMemo(
    () => [
      'Software Engineer',
      'Competitive Gamer',
      'Metalcore Musician',
      'Non-Profit Organizer',
      'Consulting',
    ],
    []
  );

  const [springStyles, api] = useSpring(() => ({
    opacity: 0,
    transform: 'translateY(50%)',
    config: { tension: 300, friction: 50 },
  }));

  const animateSubtitle = useCallback(async () => {
    while (true) {
      await api.start({ opacity: 1, transform: 'translateY(-30%)' });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await api.start({ opacity: 0, transform: 'translateY(50%)' });
    }
  }, [api, subtitles.length]);

  useEffect(() => {
    animateSubtitle();
  }, [animateSubtitle]);

  return (
    <div
      className="text-left text-xl lg:text-3xl font-semibold text-gray-400 h-10 flex justify-center lg:justify-start"
    >
      {subtitles[index]}
    </div>
  );
};

export default Subtitle;