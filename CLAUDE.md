# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
# Development
npm run dev              # Start dev server with Node inspector on localhost:3000

# Building
npm run build            # Full build: contentlayer → lunr index → next build
npm run build:content    # Build contentlayer only (.contentlayer/generated)
npm run build:lunr       # Build search index (public/indexes/articles.json)
npm run build:photos     # Extract EXIF metadata and copy photo images

# Type Checking
npm run type-check       # Run TypeScript compiler without emitting files

# Storybook
npm run storybook        # Start Storybook dev server on port 6006
npm run build-storybook  # Build static Storybook
```

**Important**: The build process is sequential: `contentlayer build` → `build:lunr` → `next build`. If you modify article content, run `npm run build:content` before `npm run build:lunr`.

## Architecture Overview

### Next.js App Router (Primary Routing System)

This project uses **Next.js 15.4.6 with App Router** as the primary routing mechanism. Key routes:

- `/app/page.tsx` - Homepage
- `/app/blog/page.tsx` - Blog listing
- `/app/blog/[slug]/page.tsx` - Individual blog articles
- `/app/photography/page.tsx` - Photography gallery
- `/app/photography/[slug]/page.tsx` - Individual photo pages
- `/app/documents/page.tsx` - Documents listing
- `/app/documents/resume/page.tsx` - Resume document
- `/app/layout.tsx` - Root layout with providers

**Routing Pattern**: Server components fetch data via Contentlayer, then pass to client components for MDX rendering and interactivity. Dynamic routes use `generateStaticParams()` to pre-render all pages at build time.

**URL-Based Pagination**: All listing pages (blog, photography, documents) use URL query parameters for pagination (e.g., `/blog?page=2`). Server components read the `page` param from `searchParams` and pass the initial page index to client components. The `PaginationControls` component (`components/blog/PaginationControls.tsx`) handles both URL updates and context state synchronization.

### Contentlayer Content Management

Content is managed via Contentlayer 0.3.4 with three document types defined in `contentlayer.config.js`:

#### 1. Article (Blog Posts)
- **Location**: `content/articles/**/*.{md,mdx}`
- **Fields**: title, description, excerpt, date/datetime/published, tags
- **Computed**: slug, slugAsParams, readingTime (200 wpm), formatted date
- **MDX Rendering**: Use `useMDXComponent()` from `next-contentlayer/hooks` in client components
- **Import**: `import { allArticles } from 'contentlayer/generated'`

#### 2. Photo
- **Location**: `content/photos/*/info.json` (metadata) + `image.{jpg|jpeg|png|gif|webp}` (image file)
- **Fields**: title, description, date, tags, location, camera, lens, settings, category, orientation, naturalWidth/Height
- **Computed**: imageUrl auto-detected from folder, slug from folder name
- **EXIF Extraction**: Run `npm run build:photos:metadata` to extract camera metadata from images
- **Import**: `import { allPhotos } from 'contentlayer/generated'`

#### 3. Doc (Documents)
- **Location**: `content/documents/**/*.{md,mdx,pdf,docx}`
- **Fields**: title, description, date, tags, category, fileType, pageCount
- **Import**: `import { allDocs } from 'contentlayer/generated'`

**Contentlayer Regeneration**: Contentlayer watches for changes in dev mode. For production builds, changes to content require `npm run build:content` before `next build`.

### Data Source Abstraction Pattern

**Critical Architecture**: The codebase uses a unified `DataSource` interface (`constants/data-sources.ts`) to abstract blog, photography, and documents content. This allows:

- Shared filtering, sorting, and pagination UI across all content types
- Type-safe data access via uniform getter methods
- Easy addition of new content types

**Interface**:
```typescript
interface DataSource {
  id: DataSourceType
  name/description: string
  itemName/itemNamePlural: string
  searchLabel: string
  getItems(): any[]
  getItemUrl(item): string
  getItemTitle/Description/Date/Tags/ReadingTime(item): string | string[]
  getAvailableTags(): string[]
}
```

When building new features that work across content types (filtering, search, etc.), use the DataSource abstraction rather than hardcoding content type logic.

### Dual-Context State Management

Two sophisticated context systems manage application state:

#### 1. SiteSettingsContext
**Location**: `constants/site-settings-context/site-settings-context.tsx`

Manages global UI settings with localStorage persistence:
- `animationEnabled`: Particle animations toggle
- `particlesHidden`: Hide/show background particles
- `announcementBannerVisible`: Banner visibility
- `darkModeEnabled`: Dark mode toggle

**Usage**: Wrap components with `<SiteSettingsProvider>`, access via `useSiteSettings()` hook.

#### 2. Article/Data Context System (Filtering & Pagination)
**Location**: `constants/article-list-context/article-list-context.tsx`

**Two contexts working together**:

**ArticleSearchContext**: Search & tag filtering
- `searchValue`: Text search across titles/descriptions
- `filterValue`: Tag-based filtering
- `tagGroups`: Multi-group filtering with OR/AND modes
- `resultSlugs`: Computed matching articles

**ArticleListContext**: Pagination & sorting
- `articlesToDisplay`: Current page of results
- `pageCount/pageIndex`: Pagination state
- `sortValue`: Sort direction
- `articlesPerPage`: Configurable items per page
- Integrates ArticleSearchContext for filtered results

**Usage**: Wrap with `<ArticleContextProvider>`, access both contexts separately or use combined state.

**Advanced Filtering**: Supports sophisticated multi-group tag filtering with configurable AND/OR logic within and across groups. See `ArticleTagFilter` component for implementation.

### MDX Rendering Pattern

**Server Component** (e.g., `app/blog/[slug]/page.tsx`):
```typescript
export default function ArticlePage({ params }) {
  const article = allArticles.find(a => a.slugAsParams === params.slug)
  return <ArticleClient article={article} />
}
```

**Client Component** (e.g., `ArticleClient.tsx`):
```typescript
'use client'
import { useMDXComponent } from 'next-contentlayer/hooks'

export default function ArticleClient({ article }) {
  const MDXContent = useMDXComponent(article.body.code)
  return <MDXContent />
}
```

**Known Issue**: React hooks errors in MDX rendering were resolved by ensuring client components use `'use client'` directive. See `MDX-HOOKS-FIX.md`.

### Search Index (Lunr.js)

**Build-time index generation**: `build-scripts/lunr-index.ts` creates a Lunr search index at build time.

**Index Structure**:
- Fields: slug, title (boost: 20), description, excerpt, tags, content
- Output: `public/indexes/articles.json`
- Used client-side via `utils/useLunr.ts` hook

**Usage**:
```typescript
import { useLunr } from '@/utils/useLunr'

const { search, results } = useLunr()
search('query string')
```

**Rebuilding**: After adding/modifying articles, run `npm run build:lunr` to regenerate the index.

### Component Organization

Components are organized by feature/purpose:

- **`components/common/`**: Reusable UI (Button, Input, Tag, PhotoModal, Navbar, Footer, etc.)
- **`components/blog/`**: Content-specific (ArticleCard, ArticleSearch, ArticleTagFilter, ArticleSortFilter, ArticlePaginator, DataSourceSelector, TableOfContents)
- **`components/hero/`**: Landing page (Hero, HeroTitle, HeroSubtitle, TerminalNameplate)
- **`components/bars/`**: Skill bars
- **`components/controls/`**: Filter controls
- **`components/context-menu/`**: Custom right-click menu system
- **`components/seo/`**: MetaTags component
- **`components/modals/`**: Modal components

**Client vs Server**: Page routes are server components by default. Add `'use client'` directive only when needed for hooks, event handlers, or browser APIs.

### Webpack Configuration

`next.config.js` includes custom webpack configuration:

1. **CopyPlugin**: Copies non-markdown assets from `content/articles/` to `public/articles/` (client build only)
2. **SVG Loader**: Uses `@svgr/webpack` to import SVGs as React components
3. **Path Polyfill**: Aliases Node's `path` to `path-browserify` for browser compatibility

**Important**: Webpack config changes require restarting dev server.

## Photography Content Workflow

### Adding New Photos

1. Create folder: `content/photos/{slug}/`
2. Add image: `content/photos/{slug}/image.{jpg|jpeg|png|gif|webp}`
3. Create metadata: `content/photos/{slug}/info.json` with required fields (title, description, date)
4. Extract EXIF: `npm run build:photos:metadata` (auto-populates camera, lens, settings)
5. Rebuild content: `npm run build:content`

**Auto-detection**: Contentlayer automatically finds `image.*` in each photo folder and generates the `imageUrl` computed field.

### Photo Metadata Structure

```json
{
  "title": "Photo title",
  "description": "Photo description",
  "date": "2024-01-01",
  "tags": ["nature", "landscape"],
  "location": "Location name",
  "camera": "Make Model",
  "lens": "Lens info",
  "settings": "F/2.8, 1/500s, ISO 400",
  "orientation": "portrait|landscape",
  "naturalWidth": 4000,
  "naturalHeight": 6000
}
```

**EXIF Script**: `scripts/extract-photo-metadata.js` uses the `exifr` library to extract camera metadata. It formats exposure time as fractions (e.g., "1/500s"), focal length with units, and combines aperture/shutter/ISO into the `settings` field.

## Common Development Patterns

### Adding a New Article

1. Create file: `content/articles/{slug}.mdx`
2. Add frontmatter:
   ```yaml
   ---
   title: "Article Title"
   description: "Article description"
   published: 2024-01-01
   tags: ["tag1", "tag2"]
   ---
   ```
3. Write content in MDX
4. Rebuild: `npm run build:content` (or just save in dev mode)
5. Rebuild search index: `npm run build:lunr`

**Computed Fields**: slug, readingTime, and formatted date are auto-generated from frontmatter.

### Dynamic Metadata for SEO

All dynamic routes generate metadata via `generateMetadata()`:

```typescript
export async function generateMetadata({ params }) {
  const article = allArticles.find(a => a.slugAsParams === params.slug)

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.datetime,
      authors: ['Patrick Hanford'],
      tags: article.tags,
      images: [/* extracted from content */]
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [/* extracted from content */]
    }
  }
}
```

**OG Images**: Blog articles extract the first image from MDX content for Open Graph images. Photos use the photo's imageUrl.

### Styling with Tailwind

**Theme Configuration**: Custom colors, backgrounds, and utilities in `tailwind.config.js`

**Key Custom Colors**:
- Background: `hsl(240 100% 4.3%)` (near-black)
- Card background: `hsl(225 45% 8%)`
- Custom palette: accent, red, amber, emerald, blue, indigo, violet, pink

**Typography**: Uses `@tailwindcss/typography` plugin for prose styling. Apply with `prose` class on MDX containers.

**Dark Mode**: Site is dark-mode-first. All components use dark background colors by default.

## File System Utilities

**Location**: `utils/fs/api.ts`

Provides file system operations for content:

- `getArticleSlugs()`: List all article directories
- `readMarkdownFile(slug, fields)`: Read markdown with GraphQL-like field selection
- `getAllArticles(fields)`: Fetch all articles with specific fields
- Word count and reading time calculation

**Usage**: These are legacy utilities. Prefer using Contentlayer's `allArticles`, `allPhotos`, `allDocs` exports from `contentlayer/generated`.

## Known Issues and Recent Fixes

### Routing Migration
**Issue**: Project migrated from Pages Router to App Router.

**Status**: Migration complete. App Router is the only routing system. Do not create Pages Router routes.

**Files**: `ROUTING-FIX.md` documents the resolution of routing conflicts.

### MDX Hooks Context
**Issue**: React hooks errors when rendering MDX in server components.

**Solution**: Ensure MDX rendering happens in client components with `'use client'` directive.

**Files**: `MDX-HOOKS-FIX.md` documents the fix.

### Test Scripts
**Available scripts** for debugging build issues:
- `fix-build.sh`: Cleans `.next` and `.contentlayer`, rebuilds from scratch
- `test-build.sh`: Validates build completes without errors
- `test-routing.sh`: Tests routing configuration
- `test-blog.sh`: Tests blog article rendering

## TypeScript Configuration

**Base URL**: Set to `.` allowing absolute imports from project root

**Path Mappings**:
- `contentlayer/generated` → `./.contentlayer/generated`

**Strict Mode**: Partially enabled (`strict: false`, but `strictNullChecks: true`)

**Module Resolution**: Node-style with ESNext modules

**Type Roots**: `node_modules/@types`, `types/`

## Deployment Notes

**Build Command**: `npm run build`

**Output**: `.next/` directory with static HTML + React hydration

**Environment**: Next.js 15+ requires Node.js 18.17 or later

**Static Assets**:
- `/public/` served at root
- `/public/articles/` populated by webpack CopyPlugin during build
- `/public/indexes/articles.json` generated by `npm run build:lunr`
- `/public/images/photos/` must be manually populated with photo images

**Contentlayer**: Generates TypeScript types at `.contentlayer/generated`. This directory is gitignored and regenerated on each build.
