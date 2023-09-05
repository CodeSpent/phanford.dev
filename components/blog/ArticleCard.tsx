import Link from "next/link";
import React from "react";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter/dist/cjs/';

type Props = {
  slug: string;
  publishedDateTime: string;
  publishedDate: string;
  title: string;
  description: string;
  tags: string[];
  color: string;
};


export default function ArticleCard({
                                      slug,
                                      publishedDateTime,
                                      publishedDate,
                                      title,
                                      description,
                                      tags,
                                      color
                                    }: Props) {
  const codeSnippet = `
# Example of a Python list comprehension
numbers = [1, 2, 3, 4, 5]
squared_numbers = [num ** 2 for num in numbers]
print(squared_numbers)
# Output: [1, 4, 9, 16, 25]
`;
  return (
    <Link href={["blog", slug].join("")}>
      <div className={`flex flex-col min-h-full bg-card-background group mt-4 rounded-lg border-t-4 border-solid 
      border-purple-600 shadow-md transition duration-300 hover:z-50 hover:scale-105 hover:shadow-lg`}>

        <div style={{ borderTopColor: color }} className="p-4 border-t-4 border-solid border-t-4 h-full flex
        flex-col">
          <div className="flex flex-col h-full">
            <p className="text-sm text-gray-200">
              <time dateTime={publishedDate}>{publishedDate}</time>
            </p>
            <p className="my-4 self-start align-baseline justify-self-start text-xl font-semibold text-gray-300
            text-center group-hover:text-white">
              {title}
            </p>

            {codeSnippet && tags.includes('python') && (
              <div className="py-2 drop-shadow-2xl">
                <SyntaxHighlighter language="python" style={vscDarkPlus}>
                  {codeSnippet}
                </SyntaxHighlighter>
              </div>
            )}


            <p className="mt-2 text-base text-gray-400 group-hover:text-gray-400">
              {description}
            </p>
          </div>

          <div className="flex flex-col">
            <div className="mt-auto pb-4 pt-6 flex flex-wrap gap-2 items-center">
              {tags.map((tag, index) =>
                <span
                  key={index}
                  style={{borderColor: color}}
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded-md border border-solid 
                  border-opacity-50 border-${tag.toLowerCase()} hover:border-opacity-100`}>{tag}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
