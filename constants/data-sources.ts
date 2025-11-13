import { Article, Doc, Photo, Project, allArticles, allDocs, allPhotos, allProjects } from 'contentlayer/generated'

export type DataSourceType = 'blog' | 'photography' | 'documents' | 'projects'

export interface DataSource {
  id: DataSourceType
  name: string
  description: string
  itemName: string // Singular name for items (e.g., "Article", "Photo", "Document")
  itemNamePlural: string // Plural name for items (e.g., "Articles", "Photos", "Documents")
  searchLabel: string // Label for search input (e.g., "Search Articles", "Search Photos")
  getItems: () => any[]
  getItemUrl: (item: any) => string
  getItemTitle: (item: any) => string
  getItemDescription: (item: any) => string
  getItemDate: (item: any) => string | null
  getItemTags: (item: any) => string[]
  getItemReadingTime: (item: any) => number
  getAvailableTags: () => string[] // Available tags for this data source
}

export const dataSources: Record<DataSourceType, DataSource> = {
  blog: {
    id: 'blog',
    name: 'Blog',
    description: 'Articles I\'ve written.',
    itemName: 'Article',
    itemNamePlural: 'Articles',
    searchLabel: 'Search Articles',
    getItems: () => {
      try {
        return Array.isArray(allArticles) ? allArticles : []
      } catch (error) {
        console.error('Error loading articles:', error)
        return []
      }
    },
    getItemUrl: (item: Article) => `/blog${item.slug}`,
    getItemTitle: (item: Article) => item.title,
    getItemDescription: (item: Article) => item.description,
    getItemDate: (item: Article) => item.date || item.datetime || item.published || null,
    getItemTags: (item: Article) => Array.isArray(item.tags) ? item.tags : [],
    getItemReadingTime: (item: Article) => 0, // Reading time not available in Article type
    getAvailableTags: () => [
      'javascript', 'typescript', 'python', 'react', 'nextjs', 'django', 'flask',
      'web development', 'programming', 'tutorial', 'guide', 'best practices',
      'software engineering', 'devops', 'aws', 'docker', 'kubernetes', 'database',
      'api', 'frontend', 'backend', 'full-stack', 'machine learning', 'data science',
      'elixir', 'pattern matching', 'functional programming', 'algorithms'
    ],
  },
  documents: {
    id: 'documents',
    name: 'Documents',
    description: 'Documents I\'ve published.',
    itemName: 'Document',
    itemNamePlural: 'Documents',
    searchLabel: 'Search Documents',
    getItems: () => {
      try {
        return Array.isArray(allDocs) ? allDocs : []
      } catch (error) {
        console.error('Error loading documents:', error)
        return []
      }
    },
    getItemUrl: (item: Doc) => `/documents${item.slug}`,
    getItemTitle: (item: Doc) => item.title,
    getItemDescription: (item: Doc) => item.description || 'Document',
    getItemDate: (item: Doc) => item.date || null,
    getItemTags: (item: Doc) => Array.isArray(item.tags) ? item.tags : [],
    getItemReadingTime: (item: Doc) => 5, // Estimated reading time for documents
    getAvailableTags: () => [
      'resume', 'cv', 'software engineer', 'full-stack', 'python', 'javascript', 'react',
      'portfolio', 'professional', 'experience', 'skills', 'education', 'certification',
      'project', 'documentation', 'specification', 'proposal', 'report', 'whitepaper',
      'guide', 'manual', 'reference', 'template', 'contract', 'legal'
    ],
  },
  photography: {
    id: 'photography',
    name: 'Photos',
    description: 'Photographs I\'ve taken.',
    itemName: 'Photograph',
    itemNamePlural: 'Photographs',
    searchLabel: 'Search Photographs',
    getItems: () => {
      try {
        return Array.isArray(allPhotos) ? allPhotos : []
      } catch (error) {
        console.error('Error loading photos:', error)
        return []
      }
    },
    getItemUrl: (item: Photo) => `/photography${item.slug}`,
    getItemTitle: (item: Photo) => item.title,
    getItemDescription: (item: Photo) => item.description,
    getItemDate: (item: Photo) => item.date,
    getItemTags: (item: Photo) => Array.isArray(item.tags) ? item.tags : [],
    getItemReadingTime: (item: Photo) => 2,
    getAvailableTags: () => [
      'landscape', 'portrait', 'nature', 'wildlife', 'street', 'architecture', 'macro',
      'sunset', 'sunrise', 'mountains', 'ocean', 'forest', 'urban', 'travel', 'adventure',
      'black and white', 'color', 'long exposure', 'golden hour', 'blue hour', 'night',
      'canon', 'nikon', 'sony', 'fuji', 'leica', 'film', 'digital', 'drone', 'aerial',
      'wedding', 'event', 'family', 'children', 'pets', 'sports', 'action', 'abstract',
      'minimalist', 'vintage', 'artistic', 'documentary', 'photojournalism'
    ],
  },
  projects: {
    id: 'projects',
    name: 'Projects',
    description: 'Projects I\'ve built.',
    itemName: 'Project',
    itemNamePlural: 'Projects',
    searchLabel: 'Search Projects',
    getItems: () => {
      try {
        return Array.isArray(allProjects) ? allProjects : []
      } catch (error) {
        console.error('Error loading projects:', error)
        return []
      }
    },
    getItemUrl: (item: Project) => `/projects${item.slug}`,
    getItemTitle: (item: Project) => item.title,
    getItemDescription: (item: Project) => item.shortDescription || item.description,
    getItemDate: (item: Project) => item.lastUpdated || item.startDate || item.date,
    getItemTags: (item: Project) => {
      // Combine technologies and languages for tags
      const technologies = Array.isArray(item.technologies) ? item.technologies : []
      const languages = Array.isArray(item.languages) ? item.languages : []
      return [...technologies, ...languages]
    },
    getItemReadingTime: (item: Project) => item.readingTime || 5,
    getAvailableTags: () => [
      // Categories
      'Webapps/SaaS', 'Mobile Apps', 'Discord Bots', 'Open Source', 'Software', 'CLI Tools',
      // Frontend
      'React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'Tailwind CSS', 'TypeScript', 'JavaScript',
      // Backend
      'Node.js', 'Python', 'Django', 'Flask', 'FastAPI', 'Express', 'NestJS', 'Go', 'Rust',
      // Databases
      'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'SQLite', 'Prisma', 'Supabase',
      // Cloud/DevOps
      'AWS', 'Vercel', 'Docker', 'Kubernetes', 'GitHub Actions', 'CI/CD',
      // Mobile
      'React Native', 'Flutter', 'Swift', 'Kotlin',
      // Other
      'Discord.js', 'APIs', 'Microservices', 'Real-time', 'AI/ML', 'E-commerce', 'Analytics'
    ],
  },
}

export const getDataSource = (type: DataSourceType): DataSource => {
  return dataSources[type]
}

export const getAllDataSources = (): DataSource[] => {
  return Object.values(dataSources)
}

export const getDefaultDataSource = (): DataSource => {
  return dataSources.blog
}
