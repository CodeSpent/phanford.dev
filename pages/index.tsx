import VerticalNavigationLayout from '../layouts/VerticalNavigationLayout'
import HeroComponent from '../components/hero/Hero'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { Fragment } from 'react'

const IndexPage = () => (
  <VerticalNavigationLayout title="Patrick Hanford | Web, Software, Mobile, DevOps">
    <Fragment>
      <HeroComponent />

      <a className="fixed inset-x-0 bottom-0 mt-20 flex flex-col items-center justify-center p-4">
        <ChevronDownIcon
          className="mr-1 hidden h-8 w-8 animate-bounce text-white group-hover:text-white"
          aria-hidden="true"
        />
      </a>
    </Fragment>
  </VerticalNavigationLayout>
)

export default IndexPage
