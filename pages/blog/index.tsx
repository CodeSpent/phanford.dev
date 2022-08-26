import Layout from "../../components/Layout";
import Link from "next/link";
import {
  ArticleQuery,
  getAllArticles,
  ListViewArticles,
} from "../../utils/fs/api";
import ArticleSearch from "../../components/blog/ArticleSearch";
import ArticleTagFilter from "../../components/blog/ArticleTagFilter";
import ArticleSortFilter from "../../components/blog/ArticleSortFilter";
import {
  ArticleListContext,
  ArticleListProvider,
} from "../../constants/article-list-context/article-list-context";
import React, { useCallback, useContext, useMemo, useState } from "react";
import ArticleList from "../../page-components/blog/article-list/article-list";
import ArticlePagesFilter from "../../components/blog/ArticlePagesFilter";
import ArticlePaginator from "../../components/blog/ArticlePaginator";
import ignore from "ignore";

type Article = {
  title: string;
  datetime: string;
  date: string;
  slug: string;
  description: string;
  tags: string[];
};

type Props = {
  articles: ListViewArticles;
  tags: string[];
  numberOfPages: number;
  pageNumber: number;
  articlesPerPage: number;
};

export default function BlogPage({
  articles,
  tags,
  numberOfPages,
  pageNumber,
  articlesPerPage,
}: Props) {
  return (
    <Layout title="Blog | Patrick Hanford">
      <div className="px-4">
        <div className="relative mx-auto max-w-lg py-10 lg:max-w-7xl">
          <ArticleListProvider articles={articles} pageIndex={pageNumber}>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Blog
              </h2>

              <div className="sm:fl mt-3 flex flex-col gap-3 py-4 sm:mt-4 lg:flex-row lg:items-center lg:gap-5">
                <ArticleSearch />
                <ArticleTagFilter tags={tags} />

                <div className="flex w-full flex-row gap-5">
                  <ArticleSortFilter />
                  <ArticlePagesFilter />
                </div>
              </div>
            </div>
            <ArticleList />
            <ArticlePaginator />
          </ArticleListProvider>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const articlesForListViewQuery: ArticleQuery = {
    slug: true,
    excerpt: true,
    content: false,
  };

  const articles = getAllArticles();
  const tags = [];

  articles.forEach((article) => {
    // FIXME: `tags` evaluates to type of `never`.
    // @ts-ignore
    article.tags.forEach((tag) => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
  });

  const pageIndex = 1;

  return {
    props: {
      pageIndex,
      path: `/`,
      articles,
      tags,
    },
  };
};
