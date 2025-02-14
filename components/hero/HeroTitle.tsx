import React, { useEffect, useMemo, useState } from 'react';
import { animated, useSpring } from '@react-spring/web';

const NameComponent: ({index }) => React.JSX.Element = ({index}) => {
  const subtitleToNameMap: { [key: string]: string } = useMemo(
    () => ({
      'Software Engineer': 'Patrick Hanford',
      'Competitive Gamer': 'CodeSpent',
      'Metalcore Musician': 'Divisionary',
      'Non-Profit Organizer': 'C.W. Tech',
      'Consulting': 'ForthWall',
    }),
    []
  );

  const currentName = useMemo(
    () => Object.values(subtitleToNameMap)[index],
    [index, subtitleToNameMap]
  );

  useEffect(() => {
    const interval = setInterval(() => {
    }, 4000);
    return () => clearInterval(interval);
  }, [subtitleToNameMap]);

  return (
      <h1
        className="text-5xl leading-[2.85rem]
        tracking-tight text-gray-100 lg:ml-0 lg:text-left lg:text-8xl"
      >
        {currentName}
      </h1>
  );
};

export default NameComponent;