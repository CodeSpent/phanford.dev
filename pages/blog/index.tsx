import DefaultLayout from 'layouts/DefaultLayout'
import { ListViewArticles } from 'utils/fs/api'
import ArticleSearch from 'components/blog/ArticleSearch'
import ArticleTagFilter from 'components/blog/ArticleTagFilter'
import ArticleSortFilter from 'components/blog/ArticleSortFilter'
import {
  ArticleListContextProvider,
  ArticleSearchContextProvider,
} from 'constants/article-list-context/article-list-context'
import React from 'react'
import ArticleList from 'page-components/blog/article-list/article-list'
import ArticlePagesFilter from 'components/blog/ArticlePagesFilter'
import ArticlePaginator from 'components/blog/ArticlePaginator'

import { allArticles } from 'contentlayer/generated'

type Article = {
  title: string
  datetime: string
  date: string
  slug: string
  description: string
  tags: string[]
}

type Props = {
  articles: ListViewArticles
  tags: string[]
  numberOfPages: number
  pageIndex: number
  articlesPerPage: number
}

export default function BlogPage({
  articles,
  tags,
  numberOfPages,
  pageIndex,
  articlesPerPage,
}: Props) {
  return (
    <DefaultLayout title="Blog | Patrick Hanford">
      <div className="px-4">
        <div className="relative mx-auto max-w-lg py-10 lg:max-w-7xl">
          <ArticleSearchContextProvider articles={articles}>
            <ArticleListContextProvider articles={articles} pageIndex={pageIndex}>
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Blog
                </h2>

                <div className="sm:fl mt-3 flex flex-col gap-3 py-8 sm:mt-4 lg:flex-row lg:items-center lg:gap-5">
                  <ArticleSearch />
                  <ArticleTagFilter tags={tags} />
                  <ArticleSortFilter />
                  <ArticlePagesFilter />
                </div>
              </div>
              <ArticleList />
              <ArticlePaginator />
            </ArticleListContextProvider>
          </ArticleSearchContextProvider>
        </div>
      </div>
    </DefaultLayout>
  )
}

export const getStaticProps = async () => {
  const articles = allArticles
  const tags = []

  articles.forEach(article => {
    // FIXME: `tags` evaluates to type of `never`.
    // @ts-ignore
    article.tags.forEach(tag => {
      if (!tags.includes(tag)) {
        tags.push(tag)
      }
    })
  })

  return {
    props: {
      pageIndex: 0,
      path: `/`,
      articles,
      tags,
    },
  }
}
