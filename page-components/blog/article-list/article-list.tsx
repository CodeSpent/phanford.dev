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

  return (
    <div className={`1fr grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-x-2 lg:gap-y-5`}>
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
