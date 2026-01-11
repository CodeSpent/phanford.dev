import type { CommandHandler, GroupNode, TransformContext, SkillGroup, ASTNode, TextNode, CommandNode } from '../../../types/latex'
import { extractText, extractTextWithCommands } from './base'

/**
 * Resume-Specific LaTeX Command Handlers
 *
 * Handles the custom commands used in the resume document class:
 * - Metadata: \setname, \setmail, \setlinkedinaccount, \setgithubaccount, \setthemecolor
 * - Header: \headerview
 * - Skills: \createskill, \createskills
 * - Experience: \datedexperience, \explanation, \explanationdetail, \coloredbullet
 */

// ============================================================================
// Metadata Commands
// ============================================================================

export const setnameHandler: CommandHandler = {
  name: 'setname',
  handle(args: GroupNode[], context: TransformContext): void {
    const name = extractText(args[0])
    if (context.document.metadata) {
      context.document.metadata.name = name
    }
  },
}

export const setmailHandler: CommandHandler = {
  name: 'setmail',
  handle(args: GroupNode[], context: TransformContext): void {
    const email = extractText(args[0])
    if (context.document.metadata) {
      context.document.metadata.email = email
    }
  },
}

export const setmobileHandler: CommandHandler = {
  name: 'setmobile',
  handle(args: GroupNode[], context: TransformContext): void {
    const mobile = extractText(args[0])
    if (context.document.metadata) {
      context.document.metadata.mobile = mobile || undefined
    }
  },
}

export const setlinkedinHandler: CommandHandler = {
  name: 'setlinkedinaccount',
  handle(args: GroupNode[], context: TransformContext): void {
    const linkedin = extractText(args[0])
    if (context.document.metadata) {
      context.document.metadata.linkedin = linkedin || undefined
    }
  },
}

export const setgithubHandler: CommandHandler = {
  name: 'setgithubaccount',
  handle(args: GroupNode[], context: TransformContext): void {
    const github = extractText(args[0])
    if (context.document.metadata) {
      context.document.metadata.github = github || undefined
    }
  },
}

export const setthemecolorHandler: CommandHandler = {
  name: 'setthemecolor',
  handle(args: GroupNode[], context: TransformContext): void {
    const color = extractText(args[0])
    if (context.document.metadata) {
      context.document.metadata.themeColor = color || undefined
    }
  },
}

// ============================================================================
// Header Command
// ============================================================================

export const headerviewHandler: CommandHandler = {
  name: 'headerview',
  handle(_args: GroupNode[], _context: TransformContext): void {
    // This command just triggers header rendering in the React component
    // No data transformation needed - metadata is already collected
  },
}

// ============================================================================
// Skills Commands
// ============================================================================

/**
 * Parse skill items separated by \cpshalf
 */
function parseSkillItems(group: GroupNode | undefined, context: TransformContext): string[] {
  if (!group) return []

  const text = extractTextWithCommands(group)

  // First expand any macros
  let expandedText = text
  const macroPattern = /\|\|\|MACRO:(\w+)\|\|\|/g
  let match

  while ((match = macroPattern.exec(text)) !== null) {
    const macroName = match[1]
    const macroDef = context.macros.get(macroName)

    if (macroDef) {
      // Extract text from macro definition
      const macroGroup: GroupNode = { type: 'group', children: macroDef }
      const macroText = extractTextWithCommands(macroGroup)
      expandedText = expandedText.replace(match[0], macroText)
    }
  }

  // Split by the CPSHALF marker
  return expandedText
    .split('|||CPSHALF|||')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('|||'))
}

export const createskillHandler: CommandHandler = {
  name: 'createskill',
  handle(args: GroupNode[], context: TransformContext): void {
    const category = extractText(args[0])
    const skills = parseSkillItems(args[1], context)

    const skillGroup: SkillGroup = {
      type: 'skill-group',
      category,
      skills,
    }

    if (context.currentSection && context.currentSection.type === 'skills') {
      context.currentSection.items.push(skillGroup)
    }
  },
}

export const createskillsHandler: CommandHandler = {
  name: 'createskills',
  handle(args: GroupNode[], context: TransformContext): void {
    // \createskills{\skillone, \skilltwo, ...}
    // This expands macros and calls createskill for each

    if (!args[0]) return

    // Extract all macro references from the argument
    const text = extractTextWithCommands(args[0])
    const macroPattern = /\|\|\|MACRO:(\w+)\|\|\|/g
    let match

    while ((match = macroPattern.exec(text)) !== null) {
      const macroName = match[1]
      const macroDef = context.macros.get(macroName)

      if (macroDef) {
        // Find the createskill command in the macro definition
        for (const node of macroDef) {
          if (node.type === 'command') {
            const cmd = node as unknown as CommandNode
            if (cmd.name === 'createskill') {
              createskillHandler.handle(cmd.args, context)
            }
          }
        }
      }
    }
  },
}

// ============================================================================
// Experience Commands
// ============================================================================

export const datedexperienceHandler: CommandHandler = {
  name: 'datedexperience',
  handle(args: GroupNode[], context: TransformContext): void {
    // Finalize any pending experience first
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
    }

    // Start new experience entry
    const company = extractText(args[0])
    const dateRange = extractText(args[1])

    context.pendingExperience = {
      company,
      dateRange,
      title: '',
      bullets: [],
    }
  },
}

export const explanationHandler: CommandHandler = {
  name: 'explanation',
  handle(args: GroupNode[], context: TransformContext): void {
    if (!context.pendingExperience) {
      context.warnings.push('\\explanation without preceding \\datedexperience')
      return
    }

    const title = extractText(args[0])
    const subtitle = extractText(args[1])

    context.pendingExperience.title = title
    if (subtitle) {
      context.pendingExperience.subtitle = subtitle
    }
  },
}

/**
 * Parse bullet points from explanationdetail content
 */
function parseBulletPoints(group: GroupNode | undefined, context: TransformContext): { bullets: string[]; technologies?: string[] } {
  if (!group) return { bullets: [] }

  const text = extractTextWithCommands(group)

  // Split by bullet markers
  const parts = text.split('|||BULLET|||')
    .map(s => s.trim())
    .filter(s => s.length > 0)

  const bullets: string[] = []
  let technologies: string[] | undefined

  for (const part of parts) {
    // Clean up the text
    let cleaned = part
      .replace(/\|\|\|MACRO:\w+\|\|\|/g, '') // Remove unexpanded macros
      .replace(/\|\|\|CPSHALF\|\|\|/g, ' | ') // Convert cpshalf to pipe
      .replace(/\\ /g, ' ') // Remove backslash-space
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()

    if (!cleaned) continue

    // Check if this is a technology list (italicized, comma-separated)
    // The \textit content was already extracted, but it typically appears last
    if (cleaned.includes(',') && !cleaned.includes('.') && parts.indexOf(part) === parts.length - 1) {
      // This might be a technology list
      technologies = cleaned.split(',').map(t => t.trim()).filter(t => t.length > 0)
    } else if (cleaned.length > 0) {
      bullets.push(cleaned)
    }
  }

  return { bullets, technologies }
}

export const explanationdetailHandler: CommandHandler = {
  name: 'explanationdetail',
  handle(args: GroupNode[], context: TransformContext): void {
    if (!context.pendingExperience) {
      context.warnings.push('\\explanationdetail without preceding \\datedexperience')
      return
    }

    const { bullets, technologies } = parseBulletPoints(args[0], context)

    context.pendingExperience.bullets = bullets
    if (technologies && technologies.length > 0) {
      context.pendingExperience.technologies = technologies
    }

    // Don't finalize here - let the next datedexperience or section do it
  },
}

export const coloredbulletHandler: CommandHandler = {
  name: 'coloredbullet',
  handle(_args: GroupNode[], _context: TransformContext): void {
    // Handled inline during text extraction
  },
}

export const cpshalfHandler: CommandHandler = {
  name: 'cpshalf',
  handle(_args: GroupNode[], _context: TransformContext): void {
    // Handled inline during text extraction
  },
}

// ============================================================================
// Export All Resume Commands
// ============================================================================

export const resumeCommands: CommandHandler[] = [
  // Metadata
  setnameHandler,
  setmailHandler,
  setmobileHandler,
  setlinkedinHandler,
  setgithubHandler,
  setthemecolorHandler,
  // Header
  headerviewHandler,
  // Skills
  createskillHandler,
  createskillsHandler,
  cpshalfHandler,
  // Experience
  datedexperienceHandler,
  explanationHandler,
  explanationdetailHandler,
  coloredbulletHandler,
]
