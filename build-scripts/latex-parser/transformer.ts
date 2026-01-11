import type {
  ASTNode,
  DocumentNode,
  CommandNode,
  GroupNode,
  EnvironmentNode,
  ParsedResumeDocument,
  TransformContext,
  CommandRegistry,
} from '../../types/latex'
import { createRegistry, createTransformContext } from './command-registry'
import { baseCommands } from './commands/base'
import { resumeCommands } from './commands/resume'

/**
 * LaTeX Transformer
 *
 * Walks the AST and invokes registered command handlers
 * to build a typed JSON representation of the document.
 */

export interface TransformResult {
  document: ParsedResumeDocument
  warnings: string[]
  errors: string[]
}

export function transform(ast: DocumentNode, raw: string, slug: string = 'document'): TransformResult {
  const registry = createRegistry()
  const context = createTransformContext()

  // Register all command handlers
  registry.registerMany(baseCommands)
  registry.registerMany(resumeCommands)

  // Set document class and raw source
  context.document.documentClass = ast.documentClass
  context.document.raw = raw
  if (context.document.metadata) {
    context.document.metadata.slug = slug
  }

  // Process all nodes in the document
  processNodes(ast.children, registry, context)

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
  }

  return {
    document: context.document as ParsedResumeDocument,
    warnings: context.warnings,
    errors: context.errors,
  }
}

function processNodes(nodes: ASTNode[], registry: CommandRegistry, context: TransformContext): void {
  for (const node of nodes) {
    processNode(node, registry, context)
  }
}

function processNode(node: ASTNode, registry: CommandRegistry, context: TransformContext): void {
  switch (node.type) {
    case 'command': {
      const cmd = node as CommandNode
      const handler = registry.get(cmd.name)

      if (handler) {
        handler.handle(cmd.args, context)
      } else {
        // Check if it's a macro reference
        const macroDef = context.macros.get(cmd.name)
        if (macroDef) {
          // Expand the macro
          processNodes(macroDef, registry, context)
        } else {
          // Unknown command - log warning but don't fail
          context.warnings.push(`Unknown command: \\${cmd.name}`)
        }
      }
      break
    }

    case 'group': {
      // Process group children
      const group = node as GroupNode
      processNodes(group.children, registry, context)
      break
    }

    case 'environment': {
      // Process environment children
      const env = node as unknown as EnvironmentNode
      processNodes(env.children, registry, context)
      break
    }

    case 'text':
      // Text nodes don't need processing at the document level
      break

    default:
      // Unknown node type
      break
  }
}

/**
 * Create a parser configured for resume documents
 */
export function createResumeTransformer(): {
  transform: (ast: DocumentNode, raw: string, slug?: string) => TransformResult
} {
  return { transform }
}
