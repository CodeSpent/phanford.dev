import React from 'react'
import { Meta } from '@storybook/react'
import { BarsContainer, BarsContainerProps } from 'components/bars'

export default {
  title: 'Components/BarsContainer',
  component: BarsContainer,
  args: {
    rows: 28,
    columns: 5,
    colors: [
      'from-red-400 to-red-500',
      'from-purple-400 to-purple-500',
      'from-blue-400 to-blue-500',
      'from-orange-400 to-orange-500',
      'from-gray-500 to-gray-600',
      'from-indigo-400 to-indigo-500',
    ],
    widths: ['w-4', 'w-48', 'w-24', 'w-18'],
    barHeight: 4,
    speed: 1000,
    animationEnabled: true,
    scrollSpeed: 1000,
    scrollDirection: 'up',
  },
} as Meta

const Template = args => <BarsContainer {...args} />

export const Default = Template.bind({})
Default.args = {}
