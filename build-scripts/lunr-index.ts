import lunr from 'lunr'
import { getAllArticles } from '../utils/fs/api'
import { objectFilter } from 'ts-util-helpers'
import * as fs from 'fs'
import * as path from 'path'
import * as console from 'console' // To ensure compatibility with Vercel logging

interface ArticleWithSlug {
  slug: string;
  [key: string]: any;
}

let indexCache: null | { index: lunr.Index; store: Record<string, any> } = null

export const buildIndex = (
  articles: ArticleWithSlug[],
  lunrFields: Array<{
    name: string
    store?: boolean
    attributes?: object
    resolver?: (obj: ArticleWithSlug) => string | number
  }>
) => {
  if (indexCache) return indexCache

  const store: Record<string, any> = {}
  const storeFields = lunrFields.filter((field) => field.store === true)

  const index = lunr(function () {
    this.ref('id')

    lunrFields.forEach(({ name, attributes = {} }) => {
      this.field(name, attributes)
    })

    console.log('Building Lunr Index...')
    console.log('--------------------------------------------')

    console.table([
      { Field: 'id', Details: 'Slug of the article' },
      ...lunrFields
        .filter((field) => field.name !== 'content') // Exclude content from logging
        .map((field) => ({
          Field: field.name,
          Details: `Indexed: ${field.store ? 'Yes' : 'No'}`
        }))
    ])

    articles.forEach((article, index) => {
      const newArticle: Partial<Record<keyof any, any>> & { id: string } = {
        id: article.slug,
      }

      console.log(`\nIndexing Article #${index + 1}: ${article.slug}`)

      lunrFields.forEach((field) => {
        if (field.resolver) {
          newArticle[field.name] = field.resolver(article)
        } else {
          const postFieldVal = article[field.name]
          newArticle[field.name] = Array.isArray(postFieldVal)
            ? postFieldVal.join(' ')
            : postFieldVal
        }

        // Log all fields except content
        if (field.name !== 'content') {
          console.log(` - ${field.name}:`, newArticle[field.name])
        }
      })

      const storeFilteredObj = objectFilter(newArticle, (_, key) => {
        return (
          key === 'id' ||
          !!storeFields.find((storeField) => storeField.name === key)
        )
      })

      this.add(newArticle)
      store[storeFilteredObj.id!] = storeFilteredObj
    })

    console.log('--------------------------------------------')
    console.log('Indexing Complete.')
  })

  indexCache = { index, store }
  return indexCache
}

const getArticlesWithFallback = () => {
  const articles = getAllArticles() as unknown as ArticleWithSlug[];

  const results = articles.map((article) => {
    const slug = article.slug;

    const contentDirectory = path.resolve(process.cwd(), 'content/articles', slug)

    let filePath = path.join(contentDirectory, 'index.mdx')
    if (!fs.existsSync(filePath)) {
      filePath = path.join(contentDirectory, 'index.md')
    }

    if (!fs.existsSync(filePath)) {
      throw new Error(`Article not found: ${filePath}`)
    }

    const content = fs.readFileSync(filePath, 'utf8')
    return { slug, content }
  })

  return results;
}

const exportedIndex = buildIndex(getArticlesWithFallback(), [
  {
    name: 'title',
    store: true,
    attributes: { boost: 20 },
  },
  {
    name: 'excerpt',
    resolver: (article) => article.description || article.excerpt,
  },
  {
    name: 'slug',
    store: true,
  },
  { name: 'tags' },
  { name: 'content' },
])

fs.writeFileSync(
  path.resolve(process.cwd(), './public/indexes/articles.json'),
  JSON.stringify(exportedIndex)
)