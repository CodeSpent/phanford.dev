import rehypeSlug from 'rehype-slug'
import { defineDocumentType, makeSource } from 'contentlayer2/source-files'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import fs from 'fs'
import path from 'path'

/** @type {import('contentlayer2/source-files').ComputedFields} */
const computedFields = {
  slug: {
    type: 'string',
    resolve: doc => `/${doc._raw.flattenedPath.split('/').pop()}`,
  },
  slugAsParams: {
    type: 'string',
    resolve: doc => doc._raw.flattenedPath.split('/').pop(),
  },
  readingTime: {
    type: 'number',
    resolve: doc => {
      // Calculate reading time based on word count (average 200 words per minute)
      const wordsPerMinute = 200
      const wordCount = doc.body.raw.split(/\s+/).length
      const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute)
      return readingTimeMinutes
    },
  },
  date: {
    type: 'string',
    resolve: doc => {
      // Use published field if available, otherwise use date field, or fallback to current date
      const publishedDate = doc.published || doc.date
      if (publishedDate) {
        return new Date(publishedDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }
      return new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
  },
  datetime: {
    type: 'string',
    resolve: doc => {
      // Use published field if available, otherwise use datetime field, or fallback to current date
      const publishedDate = doc.published || doc.datetime
      if (publishedDate) {
        return new Date(publishedDate).toISOString()
      }
      return new Date().toISOString()
    },
  },
}

export const Article = defineDocumentType(() => ({
  name: 'Article',
  filePathPattern: 'articles/**/*.{md,mdx}',
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
    excerpt: {
      type: 'string',
      required: false,
    },
    datetime: {
      type: 'date',
      required: false,
    },
    date: {
      type: 'date',
      required: false,
    },
    published: {
      type: 'date',
      required: false,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      required: false,
    },
    headerImage: {
      type: 'string',
      required: false,
    },
    imagePosition: {
      type: 'string',
      required: false,
    },
  },
  computedFields,
}))

export const Photo = defineDocumentType(() => ({
  name: 'Photo',
  filePathPattern: 'photos/*/info.json',
  contentType: 'data',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
    imageUrl: {
      type: 'string',
      required: false, // Now optional since we'll compute it
    },
    date: {
      type: 'date',
      required: true,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      required: false,
    },
    location: {
      type: 'string',
      required: false,
    },
    camera: {
      type: 'string',
      required: false,
    },
    lens: {
      type: 'string',
      required: false,
    },
    settings: {
      type: 'string',
      required: false,
    },
    category: {
      type: 'string',
      required: false,
    },
    orientation: {
      type: 'string',
      required: false,
    },
    naturalWidth: {
      type: 'number',
      required: false,
    },
    naturalHeight: {
      type: 'number',
      required: false,
    },
    blurDataUrl: {
      type: 'string',
      required: false,
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: doc => {
        // Extract folder name from path like "photos/folder-name/info.json"
        const pathParts = doc._raw.flattenedPath.split('/')
        const folderName = pathParts[pathParts.length - 2] // Get the folder name
        return `/${folderName}`
      },
    },
    slugAsParams: {
      type: 'string',
      resolve: doc => {
        const pathParts = doc._raw.flattenedPath.split('/')
        return pathParts[pathParts.length - 2] // Get the folder name
      },
    },
    imageUrl: {
      type: 'string',
      resolve: doc => {
        // If imageUrl is provided in frontmatter, use it
        if (doc.imageUrl) {
          return doc.imageUrl
        }
        
        // Otherwise, auto-detect image file in the same folder
        const pathParts = doc._raw.sourceFilePath.split('/')
        const folderPath = pathParts.slice(0, -1).join('/') // Remove 'info.json'
        const contentFolderPath = path.join(process.cwd(), 'content', folderPath)
        
        try {
          const files = fs.readdirSync(contentFolderPath)
          const imageFile = files.find(file => 
            /^image\.(jpg|jpeg|png|gif|webp)$/i.test(file)
          )
          
          if (imageFile) {
            // Return path relative to public directory
            const folderName = pathParts[pathParts.length - 2]
            return `/images/photos/${folderName}/${imageFile}`
          }
        } catch (error) {
          console.warn(`Could not read directory ${contentFolderPath}:`, error.message)
        }
        
        return '/images/photos/placeholder.jpg' // Fallback
      },
    },
  },
}))

export const Doc = defineDocumentType(() => ({
  name: 'Doc',
  filePathPattern: 'documents/**/*.{md,mdx,pdf,docx}',
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: false,
    },
    date: {
      type: 'date',
      required: false,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      required: false,
    },
    category: {
      type: 'string',
      required: false,
    },
    fileType: {
      type: 'string',
      required: false,
    },
    pageCount: {
      type: 'number',
      required: false,
    },
  },
  computedFields,
}))

export const Project = defineDocumentType(() => ({
  name: 'Project',
  filePathPattern: 'projects/**/*.{md,mdx}',
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    shortDescription: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
    category: {
      type: 'string',
      required: true,
    },
    status: {
      type: 'string',
      required: true,
    },
    version: {
      type: 'string',
      required: false,
    },
    hasDetailPage: {
      type: 'boolean',
      required: false,
    },
    featured: {
      type: 'boolean',
      required: false,
    },
    technologies: {
      type: 'list',
      of: { type: 'string' },
      required: false,
    },
    languages: {
      type: 'list',
      of: { type: 'string' },
      required: false,
    },
    links: {
      type: 'json',
      required: false,
    },
    startDate: {
      type: 'date',
      required: false,
    },
    endDate: {
      type: 'date',
      required: false,
    },
    lastUpdated: {
      type: 'date',
      required: false,
    },
    headerImage: {
      type: 'string',
      required: false,
    },
    icon: {
      type: 'string',
      required: false,
    },
    layoutType: {
      type: 'string',
      required: false,
    },
    screenshots: {
      type: 'list',
      of: { type: 'string' },
      required: false,
    },
    githubRepo: {
      type: 'string',
      required: false,
    },
    demoUrl: {
      type: 'string',
      required: false,
    },
    videoUrl: {
      type: 'string',
      required: false,
    },
    highlightedFeatures: {
      type: 'list',
      of: { type: 'string' },
      required: false,
    },
    stats: {
      type: 'json',
      required: false,
    },
    statsLastUpdated: {
      type: 'date',
      required: false,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      required: false,
    },
    imagePosition: {
      type: 'string',
      required: false,
    },
    screenshotLink: {
      type: 'json',
      required: false,
    },
    websiteUrl: {
      type: 'string',
      required: false,
    },
    ctaButtonConfig: {
      type: 'json',
      required: false,
    },
  },
  computedFields: {
    ...computedFields,
    icon: {
      type: 'string',
      resolve: doc => {
        // Auto-detect icon file in the same folder
        const pathParts = doc._raw.sourceFilePath.split('/')
        const folderPath = pathParts.slice(0, -1).join('/') // Remove file name
        const contentFolderPath = path.join(process.cwd(), 'content', folderPath)

        try {
          const files = fs.readdirSync(contentFolderPath)
          const iconFile = files.find(file =>
            /^icon\.(png|svg|jpg|jpeg)$/i.test(file)
          )

          if (iconFile) {
            const folderName = pathParts[pathParts.length - 2]
            return `/images/projects/${folderName}/${iconFile}`
          }
        } catch (error) {
          console.warn(`Could not read directory ${contentFolderPath}:`, error.message)
        }

        return null // No icon
      },
    },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Article, Photo, Doc, Project],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: 'github-dark',
          keepBackground: true,
        },
      ],
    ],
  },
})
