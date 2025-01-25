import Link from 'next/link'
import React from 'react'

type Props = {
  slug: string
  publishedDateTime: string
  publishedDate: string
  title: string
  description: string
  tags: string[]
}

export default function ArticleCard(
  {
    slug,
    publishedDateTime,
    publishedDate,
    title,
    description,
    tags,
  }: Props) {
  return (
    <Link href={['blog', slug].join('')}>
      <div
        className={`flex flex-col h-full bg-card-background group mt-4 rounded-lg shadow-md 
        transition duration-300 hover:z-50 hover:scale-105 hover:shadow-lg`}
      >
        <div
          className="p-4 rounded-lg h-full flex flex-col"
        >
          <div className="flex flex-col h-full">
            <p className="text-sm text-gray-200">
              <time dateTime={publishedDate}>{publishedDate}</time>
            </p>
            <p
              className="my-4 self-start align-baseline justify-self-start text-xl font-semibold
              text-gray-300 text-center group-hover:text-white"
            >
              {title}
            </p>

            <p className="mt-2 text-base text-gray-400 group-hover:text-gray-400">
              {description}
            </p>
          </div>

          <div className="flex flex-col">
            <div className="self-start align-end pb-4 pt-6 flex flex-wrap gap-2 items-center">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded-md bg-gray-700 
                  text-gray-300  group-hover:bg-gray-600 group-hover:text-white`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}