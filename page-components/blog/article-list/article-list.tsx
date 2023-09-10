import Link from 'next/link'
import React, { useContext } from 'react'
import {
  useArticleListContext,
  useArticleSearchContext,
} from '../../../constants/article-list-context/article-list-context'
import { ChevronDoubleRightIcon } from '@heroicons/react/solid'
import ArticleCard from '../../../components/blog/ArticleCard'

export default function ArticleList() {
  const { articlesToDisplay } = useArticleListContext()

  const neonColors = [
    '#FF5733', // Base color
    '#5733FF', // Complementary color
    '#33FF57', // First split complementary
    '#3357FF', // Second split complementary
    '#FFB48F', // Lighter base color
    '#E63D00', // Darker base color
    '#B48FFF', // Lighter complementary color
    '#2900B5', // Darker complementary color
    '#6FFF96', // Lighter split complementary 1
    '#00B03A', // Darker split complementary 1
    '#967FFF', // Lighter split complementary 2
    '#0038B0', // Darker split complementary 2
  ]

  // const neonColors = [
  //   "#ff8484", // Red
  //   "#4ECDC4", // Turquoise
  //   "#FFD166", // Yellow
  //   "#06D6A0", // Green
  //   "#536DFE", // Blue
  //   "#FF8C94", // Pink
  //   "#62CBC6", // Teal
  //   "#FFC156", // Orange
  //   "#7DCFB6", // Mint
  //   "#FFD97D", // Light Yellow
  //   "#62A1FF", // Sky Blue
  //   "#F0883E", // Coral
  //   "#D881D8", // Purple
  //   "#FFAC4B", // Amber
  //   "#A2D5F2", // Light Blue
  //   "#ACD8AA", // Light Green
  //   "#F15B47", // Dark Orange
  //   "#77C4D3", // Light Teal
  //   "#8DABD3", // Lavender
  //   "#FF9C9C", // Pale Pink
  //   "#60D394", // Bright Green
  //   "#FFD700", // Gold
  //   "#FF7373", // Salmon
  //   "#69A1FF", // Electric Blue
  //   "#FFC0CB", // Pink
  //   "#95D0FC", // Periwinkle
  // ];

  return (
    <div
      className={`grid grid-cols-1 1fr gap-5 md:gap-3.5 lg:grid-cols-3 lg:gap-x-2 lg:gap-y-5`}
    >
      {articlesToDisplay.map((article, index) => (
        <ArticleCard
          key={index}
          slug={article.slug}
          publishedDateTime={article.datetime}
          publishedDate={article.date}
          title={article.title}
          description={article.description}
          tags={article.tags}
          color={neonColors[index % neonColors.length]}
        />
      ))}
    </div>
  )
}
