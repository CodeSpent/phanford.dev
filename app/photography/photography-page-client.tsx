'use client'

import { useRouter } from 'next/navigation'
import ContentListingPageClient from 'components/content/ContentListingPageClient'

type Props = {
  items: any[]
  tags: string[]
  pageIndex: number
}

export default function PhotographyPageClient({
  items,
  tags,
  pageIndex,
}: Props) {
  const router = useRouter()

  const handlePhotoClick = (photo: any) => {
    router.push(`/photography/${photo.slugAsParams}`)
  }

  return (
    <ContentListingPageClient
      items={items}
      tags={tags}
      pageIndex={pageIndex}
      dataSourceType="photography"
      onItemClick={handlePhotoClick}
    />
  )
}
