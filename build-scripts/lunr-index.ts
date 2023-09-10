import lunr from 'lunr'
import { getAllArticles } from '../utils/fs/api'
import { objectFilter } from 'ts-util-helpers'
import * as fs from 'fs'
import * as path from 'path'

let indexCache: null | { index: lunr.Index; store: Record<string, any> } = null

export const buildIndex = (
  articles: any,
  lunrFields: Array<{
    name: string
    store?: boolean
    attributes?: object
    resolver?: (obj: any) => string | number
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

    articles.forEach((article) => {
      const newArticle: Partial<Record<keyof any, any>> & { id: string } = {
        id: article.slug,
      }
      for (let field of lunrFields) {
        if (field.resolver) {
          newArticle[field.name] = field.resolver(article)
          continue
        }
        const postFieldVal = article[field.name]
        newArticle[field.name] = Array.isArray(postFieldVal)
          ? postFieldVal.join(' ')
          : postFieldVal
      }

      const storeFilteredObj = objectFilter(newArticle, (_, key) => {
        return (
          key === 'id' ||
          !!storeFields.find((storeField) => storeField.name === key)
        )
      })

      this.add(newArticle)
      store[storeFilteredObj.id!] = storeFilteredObj
    })
  })

  indexCache = { index, store }

  return indexCache
}

const exportedIndex = buildIndex(getAllArticles(), [
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
