import Link from "next/link";
import React, { useContext } from "react";
import { ArticleListContext } from "../../../constants/article-list-context/article-list-context";
import { ChevronDoubleRightIcon } from "@heroicons/react/solid";

export default function ArticleList() {
  const { articlesToDisplay } = useContext(ArticleListContext);

  // @ts-ignore
  // @ts-ignore
  return (
    <div className="grid lg:grid-cols-3 lg:gap-x-5 lg:gap-y-5">
      {articlesToDisplay.map((article) => (
        <Link href={["blog", article.slug].join("/")}>
          <a
            key={article.slug}
            className="mt-4 flex flex-col justify-between rounded bg-gray-800 p-4 text-white shadow-lg"
          >
            <p className="text-sm text-gray-500">
              <time dateTime={article.datetime}>{article.date}</time>
            </p>
            <Link href={["blog", article.slug].join("/")}>
              <a className="mt-2 block">
                <p className="text-xl font-semibold text-gray-300">
                  {article.title}
                </p>
                <p className="mt-3 text-base text-gray-500">
                  {article.description}
                </p>
                <p>{article.published}</p>
              </a>
            </Link>

            <div className="mt-4 flex text-gray-400">
              {
                /*
                 * TODO: Fix type error that doesn't affect functionality.
                 *
                 * Error below.
                 *
                 * ```
                 * TS2339: Property 'join' does not exist on type 'never'.
                 * ```
                 * */
                // @ts-ignore
                article.tags.join(", ")
              }
            </div>

            <div className="col mt-3 flex">
              <Link href={["blog", article.slug].join("/")}>
                <a
                  href={["blog", article.slug].join("/")}
                  className="align-center ml-auto flex items-center justify-center text-sm text-gray-200 underline"
                >
                  <span className="hover:hidden">Read Article</span>
                  <ChevronDoubleRightIcon className="mb-1 h-4 w-4" />
                </a>
              </Link>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
}
