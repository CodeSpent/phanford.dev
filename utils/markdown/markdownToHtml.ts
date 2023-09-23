import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import remarkToRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import remarkUnwrapImages from 'remark-unwrap-images'
import remarkGfm from 'remark-gfm'
import rehypeImageSize from 'rehype-img-size'
import remarkEmbedder, { RemarkEmbedderOptions } from '@remark-embedder/core'
import rehypeSlug from 'rehype-slug'
import { rehypeHeaderText } from './plugins/add-header-text'
import remarkTwoslash from 'remark-shiki-twoslash'
import { UserConfigSettings } from 'shiki-twoslash'
import { rehypeTabs } from '../markdown/plugins/tabs'
import { PluggableList } from 'unified'
import behead from 'remark-behead'

interface markdownChainProps {
  remarkPlugins: PluggableList
  rehypePlugins: PluggableList
}

const unifiedChain = ({ remarkPlugins, rehypePlugins }: markdownChainProps) => {
  let unifiedChain = unified()
    .use(remarkParse)
    .use(remarkPlugins)
    .use(remarkStringify)
    .use(remarkToRehype, { allowDangerousHtml: true })
    .use(rehypePlugins)
    .use(rehypeStringify, { allowDangerousHtml: true })

  return unifiedChain
}

export default async function markdownToHtml(
  content: string,
  imgDirectory: string
) {
  const renderData = {
    headingsWithId: [],
  }

  const result = await unifiedChain({
    remarkPlugins: [
      remarkGfm,
      remarkUnwrapImages,
      [behead, { after: 0, depth: 1 }],

      [
        remarkEmbedder as any,
        {
          transformers: [],
        } as RemarkEmbedderOptions,
      ],
      [
        remarkTwoslash,
        {
          themes: ['css-variables'],
        } as UserConfigSettings,
      ],
    ],
    rehypePlugins: [
      [
        rehypeImageSize as any,
        {
          dir: imgDirectory,
        },
      ],
      rehypeTabs,
      [
        rehypeSlug,
        {
          maintainCase: true,
          removeAccents: true,
          enableCustomId: true,
        },
      ],
      [rehypeHeaderText(renderData)],
    ],
  }).process(content)

  return {
    html: result.toString(),
    headingsWithId: renderData.headingsWithId,
  }
}
