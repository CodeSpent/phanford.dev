import Link from "next/link";
import React, { useContext } from "react";
import { ArticleListContext } from "../../../constants/article-list-context/article-list-context";
import { ChevronDoubleRightIcon } from "@heroicons/react/solid";
import ArticleCard from "../../../components/blog/ArticleCard";

export default function ArticleList() {
  const { articlesToDisplay } = useContext(ArticleListContext);

  // @ts-ignore
  return (
    <div className="grid lg:grid-cols-3 lg:gap-x-5 lg:gap-y-5">
      {articlesToDisplay.map((article) => (
        <ArticleCard
          slug={article.slug}
          publishedDateTime={article.datetime}
          publishedDate={article.date}
          title={article.title}
          description={article.description}
          tags={article.tags}
        />
      ))}
    </div>
  );
}
