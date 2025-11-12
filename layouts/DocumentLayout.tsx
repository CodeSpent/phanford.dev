import NavbarWrapper from '../components/common/navbars/NavbarWrapper'
import Footer from '../components/common/navbars/Footer'
import MetaTags from '../components/seo/MetaTags'

const DocumentLayout = ({ children, title, description }) => {
  return (
    <>
      <MetaTags
        contentType="page"
        title={title || 'Document'}
        description={description || 'Document by Patrick Hanford'}
        url={typeof window !== 'undefined' ? window.location.href : 'https://phanford.dev'}
      />
      <div className="relative mx-auto max-w-lg lg:max-w-7xl">
        <NavbarWrapper />

        <div className="p-4">{children}</div>

        <footer>
          <Footer />
        </footer>
      </div>
    </>
  )
}

export default DocumentLayout
