import React from 'react'
import {
  SiReact,
  SiNodedotjs,
  SiTypescript,
  SiJavascript,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiNextdotjs,
  SiTailwindcss,
  SiVercel,
  SiPrisma,
  SiDocker,
  SiKubernetes,
  SiPython,
  SiGo,
  SiRust,
  SiVuedotjs,
  SiAngular,
  SiExpress,
  SiNestjs,
  SiGraphql,
  SiMysql,
  SiSqlite,
  SiAmazon,
  SiGooglecloud,
  SiGit,
  SiDiscord,
  SiVite,
} from 'react-icons/si'
import { IconType } from 'react-icons'

// Map technology names to their corresponding icons
const techIconMap: Record<string, IconType> = {
  // Frontend
  react: SiReact,
  'react.js': SiReact,
  nextjs: SiNextdotjs,
  'next.js': SiNextdotjs,
  vue: SiVuedotjs,
  'vue.js': SiVuedotjs,
  angular: SiAngular,

  // Backend
  nodejs: SiNodedotjs,
  'node.js': SiNodedotjs,
  node: SiNodedotjs,
  express: SiExpress,
  'express.js': SiExpress,
  nestjs: SiNestjs,
  graphql: SiGraphql,

  // Languages
  typescript: SiTypescript,
  javascript: SiJavascript,
  python: SiPython,
  go: SiGo,
  rust: SiRust,

  // Databases
  mongodb: SiMongodb,
  postgresql: SiPostgresql,
  postgres: SiPostgresql,
  redis: SiRedis,
  mysql: SiMysql,
  sqlite: SiSqlite,

  // Styling
  tailwind: SiTailwindcss,
  'tailwind css': SiTailwindcss,
  tailwindcss: SiTailwindcss,

  // Tools & Platforms
  prisma: SiPrisma,
  vercel: SiVercel,
  docker: SiDocker,
  kubernetes: SiKubernetes,
  aws: SiAmazon,
  gcp: SiGooglecloud,
  'google cloud': SiGooglecloud,
  git: SiGit,
  discord: SiDiscord,
  'discord.js': SiDiscord,
  vite: SiVite,
}

// Get icon component for a technology name (case-insensitive)
function getTechIcon(techName: string): IconType | null {
  const normalizedName = techName.toLowerCase().trim()
  return techIconMap[normalizedName] || null
}

interface TechStackIconsProps {
  technologies?: string[]
  languages?: string[]
  maxIcons?: number
  className?: string
}

export const TechStackIcons: React.FC<TechStackIconsProps> = ({
  technologies = [],
  languages = [],
  maxIcons = 3,
  className = '',
}) => {
  // Combine technologies and languages, prioritizing technologies
  const allTechs = [...technologies, ...languages]

  // Get icons for available technologies
  const techsWithIcons = allTechs
    .map((tech) => ({
      name: tech,
      Icon: getTechIcon(tech),
    }))
    .filter((item) => item.Icon !== null)
    .slice(0, maxIcons)

  if (techsWithIcons.length === 0) {
    return null
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {techsWithIcons.map(({ name, Icon }, index) => (
        <div
          key={index}
          className="group/icon relative"
        >
          {Icon && (
            <>
              <Icon className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors" />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-gray-200 text-xs rounded opacity-0 invisible group-hover/icon:opacity-100 group-hover/icon:visible transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700/50 shadow-lg z-50">
                {name}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
