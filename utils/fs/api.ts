import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { countContent, wordCountToMinutesToRead } from '../count-words'
import {
  pickDeep,
  DeepPartial,
  DeepReplaceKeys,
  PickDeep,
} from 'ts-util-helpers'
import { getExcerpt } from '../markdown/getExcerpt'

export interface Article {
  slug: string
  title: string
  published: string
  edited?: string
  excerpt: string
  wordCount: number
  minutesToRead: number
  description?: string
  originalLink?: string
  content: string
  tags: string[]
}

export type DeepPickedArticle = Partial<Pick<Article, 'title' | 'slug' | 'description'>>;


export interface ArticleQuery {
  /*
   * The purpose of an ArticleQuery is to
   * behave similarly to GraphQL in explicitly
   * defining the data we expect to be picked.
   *
   * If we do not provide an ArticleQuery,
   * we will pick all fields.
   *
   * If a partial ArticleQuery is provided,
   * we will only return the fields provided
   * in that query, omitting all else.
   *
   * The only exception to this rule is the
   * `slug` field which acts as our identifier
   * and will ALWAYS be picked.
   * */
  readonly content?: boolean
  readonly wordCount?: boolean
  readonly description?: boolean
  readonly published?: boolean
  readonly title?: boolean
  readonly excerpt?: boolean
  readonly slug?: boolean
  readonly tags?: boolean
  readonly minutesToRead?: boolean
}

type KeysToPick = DeepPartial<DeepReplaceKeys<Article, any>>

interface MarkdownAdditions {
  content: string
  wordCount: number
  minutesToRead: number
}

export const articlesDirectory = join(process.cwd(), 'content/articles')

export function getArticleSlugs() {
  return fs.readdirSync(articlesDirectory)
}

export function readMarkdownFile<
  T,
  ToPick extends DeepPartial<
    DeepReplaceKeys<T & MarkdownAdditions, any>
  > = DeepPartial<DeepReplaceKeys<T & MarkdownAdditions, any>>
>(
  filePath: string,
  fields: ArticleQuery
): {
  frontmatterData: Record<string, any>
  data: PickDeep<T & MarkdownAdditions, ToPick, any>
  content: string
} {
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data: frontmatterData, content } = matter(fileContents)
  const counts = countContent(content) as {
    InlineCodeWords: number
    RootNode: number
    ParagraphNode: number
    SentenceNode: number
    WordNode: number
    TextNode: number
    WhiteSpaceNode: number
    PunctuationNode: number
    SymbolNode: number
    SourceNode: number
  }

  /*
   * Handle default fields to pick
   * when no ArticleQuery is provided.
   *
   * Defaults:
   * - slug
   * */
  if (!fields) {
    fields = {
      slug: true,
    }
  }

  const data = pickDeep(
    frontmatterData,
    fields as DeepReplaceKeys<typeof frontmatterData, Article>
  )

  data.content = content

  data.wordCount = (counts.InlineCodeWords || 0) + (counts.WordNode || 0)

  data.minutesToRead = wordCountToMinutesToRead(data.wordCount)

  return {
    frontmatterData,
    data: data as any,
    content,
  }
}

export function getArticlesBySlug<ToPick extends KeysToPick>(
  slug: string,
  fields?: ArticleQuery
): PickDeep<Article, ToPick, any> {
  const realSlug = slug.replace(/\.md$/, '')

  let filePath = join(articlesDirectory, realSlug, `index.mdx`)

  if (!fs.existsSync(filePath)) {
    console.error(`MDX file not found for ${slug}, falling back to markdown`)
    filePath = join(articlesDirectory, realSlug, `index.md`)
  }

  const fullPath = filePath

  const {
    frontmatterData,
    data,
    content,
  }: { frontmatterData: Record<string, any>; data: any; content: string } =
    readMarkdownFile(fullPath, fields || {})

  data.slug = realSlug

  data.excerpt = getExcerpt(content)

  const article = {
    ...data,
    ...frontmatterData,
  }

  return article as any
}

let allArticlesCache = new WeakMap<object, Article[]>()

export function getAllArticles<ToPick extends KeysToPick>(
  fields?: ArticleQuery,
  cacheString: object | null = null
): DeepPickedArticle[] {
  if (cacheString) {
    const cacheData = allArticlesCache.get(cacheString)
    if (cacheData) return cacheData as any
  }

  if (!fields) {
    fields = {
      slug: true,
      tags: true,
    }
  }

  const slugs = getArticleSlugs()
  const articles = slugs.map((slug) => getArticlesBySlug(slug, fields))

  if (cacheString)
    allArticlesCache.set(cacheString, articles as never as Article[])

  return articles as any[]
}

export function getTopArticles(count: number) {
  const slugs = getArticleSlugs()
  const slicedSlugs = slugs.slice(0, count)

  const articles = slicedSlugs.map((slug) => getArticlesBySlug(slug))

  return articles as any[]
}

export function getArticleTags() {
  const slugs = getArticleSlugs()

  const articles = slugs.map((slug) => getArticlesBySlug(slug))
  const tags = articles.map((article) => Array.isArray(article.tags) ? article.tags : [])

  return tags as any[]
}

export type ListViewArticles = ReturnType<typeof getAllArticles>
export type ListViewDataItems = ListViewArticles
