import React from 'react'
import { useArticleListContext } from 'constants/article-list-context/article-list-context'
import ArticleCard from 'components/blog/ArticleCard'

export default function ArticleList() {
  const { articlesToDisplay } = useArticleListContext()

  return (
    <div className={`1fr my-4 grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-x-2 lg:gap-y-5`}>
      {articlesToDisplay.map((article, index) => (
        <ArticleCard
          key={index}
          slug={article.slug}
          publishedDateTime={article.datetime}
          publishedDate={article.date}
          title={article.title}
          description={article.description}
          tags={article.tags}
        />
      ))}
    </div>
  )
}
