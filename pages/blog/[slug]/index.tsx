import Link from 'next/link'
import ArticleLayout from '../../../layouts/ArticleLayout'
import { CalendarIcon, ClockIcon, ChevronDoubleLeftIcon } from '@heroicons/react/solid'
import { allArticles } from 'contentlayer/generated'
import { useMDXComponent } from 'next-contentlayer/hooks'

import Image from 'next/image'
import { MDXComponents } from 'mdx/types'

type Props = {
  article: any
  slug: string
}

const Article = ({ article }: Props) => {
  const MDXContent = useMDXComponent(article.body.code)

  const components: MDXComponents = {
    img: props => {
      return (
        <Image
          src={`/articles/${article.slugAsParams}/${props.src}`}
          alt={props.alt as any}
          width={500}
          height={500}
        />
      )
    },
  }

  return (
    <ArticleLayout>
      <div className="rounded bg-gray-900 p-8">
        <div className="flex justify-between">
          <Link href="/blog" className="text-decoration-white group mb-8 flex items-center gap-1">
            <ChevronDoubleLeftIcon className="h-4 w-4 group-hover:text-white" />
            <p className="text-gray-400 hover:text-gray-200">Back to articles</p>
          </Link>
        </div>
        <div className="mb-12">
          <div className="mb-4">
            <p className="text-lg text-gray-400">{article.tags?.join(' | ')}</p>
            <h1 className="text-6xl text-gray-300">{article.title}</h1>
          </div>
          <div className="my-4 flex gap-7">
            <span className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              <p className="text-gray-400">{article.minutesToRead} minute read</p>
            </span>

            <span className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <p className="text-gray-400">{new Date(article.published).toDateString()}</p>
            </span>
          </div>
        </div>
        <article className="article-body prose prose-invert text-gray-400">
          <MDXContent components={components} />
        </article>
      </div>
    </ArticleLayout>
  )
}

export async function getStaticProps({ params }: any) {
  const isStr = (val: any): val is string => typeof val === 'string'
  const slug = isStr(params.slug) ? params.slug : ''

  const article = allArticles.find(article => article.slugAsParams === slug)
  return {
    props: {
      article,
      slug,
    } as Props,
  }
}

export async function getStaticPaths() {
  const paths = allArticles.map(article => {
    return {
      params: {
        slug: article.slugAsParams,
      },
    }
  })

  return {
    paths,
    fallback: false,
  }
}

export default Article
