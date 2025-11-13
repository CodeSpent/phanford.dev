import lunr from 'lunr'
import { allArticles, allProjects, allPhotos, allDocs } from '../.contentlayer/generated/index.mjs'
import { objectFilter } from 'ts-util-helpers'
import * as fs from 'fs'
import * as path from 'path'
import * as console from 'console'

type ContentType = 'article' | 'project' | 'photo' | 'document'

interface SearchableItem {
  id: string
  type: ContentType
  title: string
  description: string
  url: string
  tags?: string[]
  content?: string
  [key: string]: any
}

interface LunrField {
  name: string
  store?: boolean
  attributes?: object
  resolver?: (obj: SearchableItem) => string | number
}

let indexCache: null | { index: lunr.Index; store: Record<string, any> } = null

export const buildIndex = (
  items: SearchableItem[],
  lunrFields: LunrField[]
) => {
  if (indexCache) return indexCache

  const store: Record<string, any> = {}
  const storeFields = lunrFields.filter((field) => field.store === true)

  const index = lunr(function () {
    this.ref('id')

    lunrFields.forEach(({ name, attributes = {} }) => {
      this.field(name, attributes)
    })

    console.log('Building Global Search Index...')
    console.log('--------------------------------------------')
    console.table([
      { Field: 'id', Details: 'Unique identifier' },
      ...lunrFields
        .filter((field) => field.name !== 'content')
        .map((field) => ({
          Field: field.name,
          Details: `Store: ${field.store ? 'Yes' : 'No'}, Boost: ${
            (field.attributes as any)?.boost || 1
          }`
        }))
    ])

    items.forEach((item, index) => {
      const newItem: Partial<Record<string, any>> & { id: string } = {
        id: item.id,
      }

      console.log(`\nIndexing ${item.type} #${index + 1}: ${item.id}`)

      lunrFields.forEach((field) => {
        if (field.resolver) {
          newItem[field.name] = field.resolver(item)
        } else {
          const fieldVal = item[field.name]
          newItem[field.name] = Array.isArray(fieldVal)
            ? fieldVal.join(' ')
            : fieldVal
        }

        if (field.name !== 'content') {
          console.log(` - ${field.name}:`, newItem[field.name])
        }
      })

      const storeFilteredObj = objectFilter(newItem, (_, key) => {
        return (
          key === 'id' ||
          !!storeFields.find((storeField) => storeField.name === key)
        )
      })

      this.add(newItem)
      store[storeFilteredObj.id!] = storeFilteredObj
    })

    console.log('--------------------------------------------')
    console.log(`Indexing Complete. Total items: ${items.length}`)
  })

  indexCache = { index, store }
  return indexCache
}

// Transform articles to searchable items
const getArticleItems = (): SearchableItem[] => {
  return allArticles.map((article) => ({
    id: `article-${article.slug}`,
    type: 'article' as ContentType,
    title: article.title,
    description: article.description || (article as any).excerpt || '',
    url: `/blog/${article.slugAsParams}`,
    tags: article.tags || [],
    content: article.body.raw,
    readingTime: article.readingTime,
    date: article.date,
  }))
}

// Transform projects to searchable items
const getProjectItems = (): SearchableItem[] => {
  return (allProjects as any[]).map((project) => ({
    id: `project-${project.slug}`,
    type: 'project' as ContentType,
    title: project.title,
    description: project.shortDescription || project.description || '',
    url: `/projects/${project.slug}`,
    tags: (project as any).tags || [],
    content: project.body.raw,
    category: project.category,
    status: project.status,
    technologies: project.technologies?.join(' ') || '',
    languages: project.languages?.join(' ') || '',
    icon: project.icon,
  }))
}

// Transform photos to searchable items
const getPhotoItems = (): SearchableItem[] => {
  return allPhotos.map((photo) => ({
    id: `photo-${photo.slug}`,
    type: 'photo' as ContentType,
    title: photo.title,
    description: photo.description || '',
    url: `/photography/${photo.slug}`,
    tags: photo.tags || [],
    location: (photo as any).location || '',
    camera: photo.camera || '',
    imageUrl: photo.imageUrl,
  }))
}

// Transform documents to searchable items
const getDocItems = (): SearchableItem[] => {
  return allDocs.map((doc) => ({
    id: `doc-${doc.slug}`,
    type: 'document' as ContentType,
    title: doc.title,
    description: doc.description || '',
    url: `/documents/${doc.slug}`,
    tags: doc.tags || [],
    content: doc.body.raw,
    category: doc.category,
    fileType: doc.fileType,
  }))
}

// Combine all items
const getAllSearchableItems = (): SearchableItem[] => {
  const articles = getArticleItems()
  const projects = getProjectItems()
  const photos = getPhotoItems()
  const docs = getDocItems()

  console.log('\nContent Summary:')
  console.table([
    { Type: 'Articles', Count: articles.length },
    { Type: 'Projects', Count: projects.length },
    { Type: 'Photos', Count: photos.length },
    { Type: 'Documents', Count: docs.length },
    { Type: 'Total', Count: articles.length + projects.length + photos.length + docs.length }
  ])

  return [...articles, ...projects, ...photos, ...docs]
}

// Build the index with all content types
const exportedIndex = buildIndex(getAllSearchableItems(), [
  {
    name: 'type',
    store: true,
  },
  {
    name: 'title',
    store: true,
    attributes: { boost: 20 },
  },
  {
    name: 'description',
    store: true,
    attributes: { boost: 5 },
  },
  {
    name: 'url',
    store: true,
  },
  {
    name: 'tags',
    store: true,
    attributes: { boost: 10 },
  },
  {
    name: 'technologies',
    attributes: { boost: 8 },
  },
  {
    name: 'languages',
    attributes: { boost: 6 },
  },
  {
    name: 'location',
  },
  {
    name: 'category',
    store: true,
  },
  {
    name: 'status',
    store: true,
  },
  {
    name: 'readingTime',
    store: true,
  },
  {
    name: 'date',
    store: true,
  },
  {
    name: 'icon',
    store: true,
  },
  {
    name: 'imageUrl',
    store: true,
  },
  {
    name: 'content',
    attributes: { boost: 1 },
  },
])

// Write to global search index
const outputPath = path.resolve(process.cwd(), './public/indexes/global-search.json')
fs.writeFileSync(outputPath, JSON.stringify(exportedIndex))
console.log(`\n✓ Global search index written to: ${outputPath}`)
