import Link from 'next/link'
import ArticleLayout from '../../../layouts/ArticleLayout'
import { CalendarIcon, LocationMarkerIcon, ChevronDoubleLeftIcon, CameraIcon } from '@heroicons/react/solid'
import { allPhotos } from 'contentlayer/generated'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { DataSourceType, getDataSource } from 'constants/data-sources'
import MetaTags from '../../../components/seo/MetaTags'

import Image from 'next/image'
import { MDXComponents } from 'mdx/types'

type Props = {
  photo: any
  slug: string
  dataSource?: DataSourceType
}

const ContentItem = ({ photo, dataSource = 'photos' }: Props) => {
  const MDXContent = useMDXComponent(photo.body.code)

  const ds = getDataSource(dataSource)
  const contentType = ds.id

  const components: MDXComponents = {
    img: props => {
      return (
        <Image
          src={`/${contentType}/${photo.slugAsParams}/${props.src}`}
          alt={props.alt as any}
          width={500}
          height={500}
        />
      )
    },
  }

  return (
    <>
      <MetaTags
        contentType="photo"
        content={photo}
        title={photo.title}
        description={photo.description || `Photography by Patrick Hanford${photo.location ? ` taken in ${photo.location}` : ''}`}
        url={typeof window !== 'undefined' ? window.location.href : `https://phanford.dev/photos/${photo.slugAsParams}`}
      />
      <ArticleLayout dataSource={dataSource}>
        <div className="rounded bg-gray-900 p-8">
          <div className="flex justify-between">
            <Link href={`/${ds.id}`} className="text-decoration-white group mb-8 flex items-center gap-1">
              <ChevronDoubleLeftIcon className="h-4 w-4 group-hover:text-white" />
              <p className="text-gray-400 hover:text-gray-200">Back to {ds.name}</p>
            </Link>
          </div>
          
          {/* Main photo display */}
          <div className="mb-8">
            <div className="relative w-full h-96 rounded-lg overflow-hidden">
              <Image
                src={photo.imageUrl}
                alt={photo.title}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="mb-12">
            <div className="mb-4">
              <p className="text-lg text-gray-400">{photo.tags?.join(' | ')}</p>
              <h1 className="text-6xl text-gray-300">{photo.title}</h1>
            </div>
            
            <div className="my-4 flex flex-wrap gap-7">
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <p className="text-gray-400">{new Date(photo.date).toDateString()}</p>
              </span>

              {photo.location && (
                <span className="flex items-center gap-1">
                  <LocationMarkerIcon className="h-4 w-4" />
                  <p className="text-gray-400">{photo.location}</p>
                </span>
              )}

              {photo.camera && (
                <span className="flex items-center gap-1">
                  <CameraIcon className="h-4 w-4" />
                  <p className="text-gray-400">{photo.camera}</p>
                </span>
              )}
            </div>

            {/* Technical details */}
            {(photo.lens || photo.settings) && (
              <div className="my-4 p-4 bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Technical Details</h3>
                {photo.lens && <p className="text-gray-400">Lens: {photo.lens}</p>}
                {photo.settings && <p className="text-gray-400">Settings: {photo.settings}</p>}
              </div>
            )}
          </div>
          
          <article className="article-body prose prose-invert text-gray-400">
            <MDXContent components={components} />
          </article>
        </div>
      </ArticleLayout>
    </>
  )
}

export async function getStaticProps({ params }: any) {
  const isStr = (val: any): val is string => typeof val === 'string'
  const slug = isStr(params.slug) ? params.slug : ''

  const photo = allPhotos.find(photo => photo.slugAsParams === slug)
  return {
    props: {
      photo,
      slug,
      dataSource: 'photos',
    } as Props,
  }
}

export async function getStaticPaths() {
  const paths = allPhotos.map(photo => {
    return {
      params: {
        slug: photo.slugAsParams,
      },
    }
  })

  return {
    paths,
    fallback: false,
  }
}

export default ContentItem