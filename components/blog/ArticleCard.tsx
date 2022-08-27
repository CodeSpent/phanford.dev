import Link from "next/link";
import { ArrowRightIcon, ChevronDoubleRightIcon } from "@heroicons/react/solid";
import React from "react";

type Props = {
  slug: string;
  publishedDateTime: string;
  publishedDate: string;
  title: string;
  description: string;
  tags: string[];
};

export default function ArticleCard({
  slug,
  publishedDateTime,
  publishedDate,
  title,
  description,
  tags,
}: Props) {
  return (
    <Link href={["blog", slug].join("/")}>
      <a
        key={slug}
        className="mt-4 flex flex-col justify-between rounded border border-gray-900 bg-black-glass p-4 text-white shadow-lg backdrop-blur-sm"
      >
        <p className="text-sm text-gray-500">
          <time dateTime={publishedDateTime}>{publishedDate}</time>
        </p>
        <Link href={["blog", slug].join("/")}>
          <a className="mt-2 block">
            <p className="text-xl font-semibold text-gray-300">{title}</p>
            <p className="mt-3 text-base text-gray-500">{description}</p>
            <p>{publishedDateTime}</p>
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
            tags.join(", ")
          }
        </div>

        <div className="col mt-3 flex">
          <Link href={["blog", slug].join("/")}>
            <a
              href={["blog", slug].join("/")}
              className="align-center ml-auto flex items-center justify-center gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-sm text-transparent hover:border-b"
            >
              Read more
              <ArrowRightIcon className="h-4 w-4 text-white" />
            </a>
          </Link>
        </div>
      </a>
    </Link>
  );
}
