import rehypeSlug from 'rehype-slug'
import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
  slug: {
    type: 'string',
    resolve: doc => `/${doc._raw.flattenedPath.split('/').pop()}`,
  },
  slugAsParams: {
    type: 'string',
    resolve: doc => doc._raw.flattenedPath.split('/').pop(),
  },
}

export const Article = defineDocumentType(() => ({
  name: 'Article',
  filePathPattern: 'articles/**/*.md',
  contentType: 'md',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
    published: {
      type: 'date',
      required: true,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      required: false,
    },
  },
  computedFields,
}))

export const Resume = defineDocumentType(() => ({
  name: 'Resume',
  filePathPattern: 'documents/resume.mdx',
  contentType: 'mdx',
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Article, Resume],
  md: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: 'github-dark',
          onVisitLine(node) {
            // Prevent collapsing in `grid` mode and allow
            // copy/paste of empty lines.
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }]
            }
          },
          onVisitHighlightedLine(node) {
            node.properties.className.push('line-highlighted')
          },
          onVisitHighlightedWords(node) {
            node.properties.className.push('word-highlighted')
          },
        },
      ],
    ],
  },
})
