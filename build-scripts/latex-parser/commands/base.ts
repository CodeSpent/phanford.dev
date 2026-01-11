import type { CommandHandler, GroupNode, TransformContext, ASTNode, TextNode, CommandNode } from '../../../types/latex'

/**
 * Base LaTeX Command Handlers
 *
 * Handles common LaTeX commands like:
 * - \section
 * - \textit, \textbf
 * - \newcommand
 * - Spacing commands
 */

/**
 * LaTeX escape sequences that should be replaced with their literal characters
 */
const ESCAPE_SEQUENCES: Record<string, string> = {
  '%': '%',
  '#': '#',
  '$': '$',
  '&': '&',
  '_': '_',
  '{': '{',
  '}': '}',
  '~': '~',
  '^': '^',
  '\\': '\\',
  ' ': ' ', // Non-breaking space (backslash-space)
}

/**
 * Extract text content from a group node
 */
export function extractText(group: GroupNode | undefined): string {
  if (!group) return ''

  return group.children
    .map(node => {
      if (node.type === 'text') {
        return (node as TextNode).content
      }
      if (node.type === 'group') {
        return extractText(node as GroupNode)
      }
      if (node.type === 'command') {
        // Handle inline commands like \cpshalf
        const cmd = node as unknown as CommandNode

        // Handle LaTeX escape sequences
        if (cmd.name in ESCAPE_SEQUENCES) {
          return ESCAPE_SEQUENCES[cmd.name]
        }

        if (cmd.name === 'cpshalf') {
          return ' | ' // Separator
        }
        if (cmd.name === 'textit' && cmd.args[0]) {
          return extractText(cmd.args[0])
        }
        if (cmd.name === 'textbf' && cmd.args[0]) {
          return extractText(cmd.args[0])
        }
        // For macro references, we need to look them up
        return ''
      }
      return ''
    })
    .join('')
    .trim()
}

/**
 * Extract text but preserve command markers for later processing
 */
export function extractTextWithCommands(group: GroupNode | undefined): string {
  if (!group) return ''

  return group.children
    .map(node => {
      if (node.type === 'text') {
        return (node as TextNode).content
      }
      if (node.type === 'group') {
        return extractTextWithCommands(node as GroupNode)
      }
      if (node.type === 'command') {
        const cmd = node as unknown as CommandNode

        // Handle LaTeX escape sequences
        if (cmd.name in ESCAPE_SEQUENCES) {
          return ESCAPE_SEQUENCES[cmd.name]
        }

        if (cmd.name === 'cpshalf') {
          return '|||CPSHALF|||' // Marker for later splitting
        }
        if (cmd.name === 'textit' && cmd.args[0]) {
          return extractTextWithCommands(cmd.args[0])
        }
        if (cmd.name === 'textbf' && cmd.args[0]) {
          return extractTextWithCommands(cmd.args[0])
        }
        if (cmd.name === 'coloredbullet') {
          return '|||BULLET|||'
        }
        // Check if it's a macro reference (single backslash followed by name)
        return `|||MACRO:${cmd.name}|||`
      }
      return ''
    })
    .join('')
}

/**
 * Section command handler
 * Creates a new section in the document
 */
export const sectionHandler: CommandHandler = {
  name: 'section',
  handle(args: GroupNode[], context: TransformContext): void {
    const title = extractText(args[0])

    // Determine section type based on title
    let type: 'skills' | 'experience' | 'projects' | 'education' | 'custom' = 'custom'
    const lowerTitle = title.toLowerCase()

    if (lowerTitle.includes('skill')) {
      type = 'skills'
    } else if (lowerTitle.includes('experience') || lowerTitle.includes('work')) {
      type = 'experience'
    } else if (lowerTitle.includes('project')) {
      type = 'projects'
    } else if (lowerTitle.includes('education')) {
      type = 'education'
    }

    // Finalize any pending experience entry
    if (context.pendingExperience && context.currentSection) {
      context.currentSection.items.push({
        type: 'experience',
        company: context.pendingExperience.company || '',
        dateRange: context.pendingExperience.dateRange || '',
        title: context.pendingExperience.title || '',
        subtitle: context.pendingExperience.subtitle,
        bullets: context.pendingExperience.bullets || [],
        technologies: context.pendingExperience.technologies,
      })
      context.pendingExperience = null
    }

    // Create new section
    const section = {
      id: title.toLowerCase().replace(/\s+/g, '-'),
      type,
      title,
      items: [],
    }

    context.document.sections?.push(section)
    context.currentSection = section
  },
}

/**
 * Newcommand handler
 * Stores macro definitions for later expansion
 */
export const newcommandHandler: CommandHandler = {
  name: 'newcommand',
  handle(args: GroupNode[], context: TransformContext): void {
    // \newcommand{\macroname}{definition}
    if (args.length < 2) return

    // Extract macro name from first arg (should be a command like \skillone)
    const nameArg = args[0]
    let macroName = ''

    for (const node of nameArg.children) {
      if (node.type === 'command') {
        const cmd = node as unknown as CommandNode
        macroName = cmd.name
        break
      }
    }

    if (!macroName) return

    // Store the definition (second arg's children)
    context.macros.set(macroName, args[1].children)
  },
}

/**
 * Spacing commands - no-ops for document structure
 */
export const spacingHandlers: CommandHandler[] = [
  {
    name: 'smallskip',
    handle(): void {
      // No structural effect
    },
  },
  {
    name: 'bigskip',
    handle(): void {
      // No structural effect
    },
  },
  {
    name: 'vspace',
    handle(): void {
      // No structural effect
    },
  },
  {
    name: 'hspace',
    handle(): void {
      // No structural effect
    },
  },
]

/**
 * Text formatting commands
 */
export const textFormattingHandlers: CommandHandler[] = [
  {
    name: 'textit',
    handle(): void {
      // Handled inline during text extraction
    },
  },
  {
    name: 'textbf',
    handle(): void {
      // Handled inline during text extraction
    },
  },
  {
    name: 'emph',
    handle(): void {
      // Handled inline during text extraction
    },
  },
]

/**
 * Document structure commands
 */
export const documentStructureHandlers: CommandHandler[] = [
  {
    name: 'documentclass',
    handle(): void {
      // Document class is extracted by the parser directly
    },
  },
  {
    name: 'usepackage',
    handle(): void {
      // Packages are ignored in web rendering
    },
  },
]

/**
 * All base command handlers
 */
export const baseCommands: CommandHandler[] = [
  sectionHandler,
  newcommandHandler,
  ...spacingHandlers,
  ...textFormattingHandlers,
  ...documentStructureHandlers,
]
