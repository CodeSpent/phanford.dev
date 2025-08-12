import DocumentLayout from '../../layouts/DocumentLayout'
import { allDocs } from 'contentlayer/generated'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link'
export default function ResumePage({ resumeDoc }) {
  const MDXContent = useMDXComponent(resumeDoc.body.code)
  return (
    <DocumentLayout 
      title="Patrick Hanford | Resume"
      description="Fullstack Software Engineering Resume. Always kept up to date for easy reference, and available to export in preferred format."
    >
      <div className="rounded bg-gray-900 p-8">
        <h1 className="flex items-center gap-3 text-gray-300">
          <span className="text-4xl font-thin">Software Engineering Resume</span>
        </h1>

        <div className="my-4 flex flex-row-reverse justify-between border-b border-gray-600 py-4">
          <div className="flex gap-3">
            <Link
              href="https://github.com/CodeSpent/phanford.dev/tree/main/content/documents/resume.mdx"
              target="_blank"
              className="flex items-center gap-2 text-gray-300 hover:text-gray-400"
            >
              <FontAwesomeIcon icon={faGithub} />
              View on Github
            </Link>
          </div>
        </div>
        <article className="prose-lg prose-invert lg:prose-xl">
          <MDXContent />
        </article>
      </div>
    </DocumentLayout>
  )
}

export async function getStaticProps() {
  const resumeDoc = allDocs.find(doc => doc.slugAsParams === 'resume' || doc.category === 'resume')

  return { props: { resumeDoc } }
}
