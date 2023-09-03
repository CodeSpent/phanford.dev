import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/solid";
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
      <div
        key={slug}
        className="group mt-4 flex transform flex-col justify-between rounded border border-gray-900 bg-black-glass p-4 text-white shadow-lg backdrop-blur-sm transition duration-500 hover:z-50 hover:scale-110 hover:bg-darkened-black-glass"
      >
        <p className="text-sm text-gray-500">
          <time dateTime={publishedDateTime}>{publishedDate}</time>
        </p>
        <div className="mt-2 block">
            <p className="from-orange-500 to-yellow-500 text-xl font-semibold text-gray-300 group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:text-transparent">
              {title}
            </p>
            <p className="mt-3 text-base text-gray-500 transition group-hover:text-white">
              {description}
            </p>
            <p>{publishedDateTime}</p>
        </div>

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
      </div>
    </Link>
  );
}
