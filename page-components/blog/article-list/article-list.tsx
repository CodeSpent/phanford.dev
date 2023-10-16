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
    '#FF5733',
    '#5733FF',
    '#33FF57',
    '#3357FF',
    '#FFB48F',
    '#E63D00',
    '#B48FFF',
    '#2900B5',
    '#6FFF96',
    '#00B03A',
    '#967FFF',
    '#0038B0',
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
