import ArticleLayout from '../../layouts/ArticleLayout'
import { allDocs } from 'contentlayer/generated'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { MDXComponents } from 'mdx/types'
import { DataSourceType, getDataSource } from 'constants/data-sources'

type Props = {
  resume: any
  dataSource?: DataSourceType
}

const Resume = ({ resume, dataSource = 'documents' }: Props) => {
  const MDXContent = useMDXComponent(resume.body.code)
  const ds = getDataSource(dataSource)

  return (
    <ArticleLayout dataSource={dataSource}>
      <div className="rounded bg-gray-900 p-8">
        <div className="mb-12">
          <article className="article-body prose prose-invert text-gray-400">
            <MDXContent />
          </article>
        </div>
      </div>
    </ArticleLayout>
  )
}

export async function getStaticProps() {
  const resume = allDocs.find(doc => doc.slugAsParams === 'resume' || doc.category === 'resume')

  return {
    props: {
      resume,
      dataSource: 'documents',
    } as Props,
  }
}

export default Resume
