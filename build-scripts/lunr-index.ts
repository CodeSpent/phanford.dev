import lunr from 'lunr'
import { getAllArticles } from '../utils/fs/api'
import { objectFilter } from 'ts-util-helpers'
import * as fs from 'fs'
import * as path from 'path'

interface ArticleWithSlug {
  slug: string;
  [key: string]: any;
}

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
  if (indexCache) {
    console.log('Using cached index');
    return indexCache;
  }

  console.log('Starting Lunr index build process...');
  const store: Record<string, any> = {}
  const storeFields = lunrFields.filter((field) => field.store === true)

  const index = lunr(function () {
    this.ref('id')
    lunrFields.forEach(({ name, attributes = {} }) => {
      console.log(`Adding field to index: ${name}`);
      this.field(name, attributes)
    })

    articles.forEach((article, i) => {
      console.log(`Processing article ${i + 1}/${articles.length}: ${article.slug}`);
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

      console.log(`Adding article to index: ${newArticle.id}`);
      this.add(newArticle)
      store[storeFilteredObj.id!] = storeFilteredObj
    })
  })

  console.log('Lunr index build process completed.');
  indexCache = { index, store }

  return indexCache
}

const getArticlesWithFallback = () => {
  console.log('Fetching all articles...');
  const articles = getAllArticles() as unknown as ArticleWithSlug[];
  console.log(`Found ${articles.length} articles.`);

  const results = articles.map((article) => {
    console.log(`Processing article with slug: ${article.slug}`);
    const slug = article.slug;

    const contentDirectory = path.resolve(process.cwd(), 'content/articles', slug)

    let filePath = path.join(contentDirectory, 'index.mdx')
    if (!fs.existsSync(filePath)) {
      console.log(`.mdx file not found for ${slug}, trying .md`);
      filePath = path.join(contentDirectory, 'index.md')
    }

    if (!fs.existsSync(filePath)) {
      console.error(`Error: Article not found at ${filePath}`);
      throw new Error(`Article not found: ${filePath}`)
    }

    console.log(`Reading content from file: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf8')
    return { slug, content }
  })

  console.log('All articles processed successfully.');
  return results;
}

try {
  console.log('Building Lunr index...');
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

  const outputPath = path.resolve(process.cwd(), './public/indexes/articles.json')
  console.log(`Writing Lunr index to: ${outputPath}`);
  fs.writeFileSync(outputPath, JSON.stringify(exportedIndex, null, 2))
  console.log('Lunr index written successfully.');
} catch (error) {
  console.error('An error occurred during the Lunr index build process:', error);
}