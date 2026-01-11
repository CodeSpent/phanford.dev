import type { CommandHandler, CommandRegistry } from '../../types/latex'

/**
 * Command Registry
 *
 * Plugin system for LaTeX command handlers.
 * Allows registering handlers that transform specific LaTeX commands
 * into structured data.
 */

export function createRegistry(): CommandRegistry {
  const handlers = new Map<string, CommandHandler>()

  return {
    register(handler: CommandHandler): void {
      handlers.set(handler.name, handler)

      // Register aliases
      if (handler.aliases) {
        for (const alias of handler.aliases) {
          handlers.set(alias, handler)
        }
      }
    },

    registerMany(newHandlers: CommandHandler[]): void {
      for (const handler of newHandlers) {
        this.register(handler)
      }
    },

    get(name: string): CommandHandler | undefined {
      return handlers.get(name)
    },

    has(name: string): boolean {
      return handlers.has(name)
    },
  }
}

/**
 * Create a new transform context for processing a document
 */
export function createTransformContext(): import('../../types/latex').TransformContext {
  return {
    document: {
      documentClass: 'unknown',
      metadata: {
        name: '',
        email: '',
        slug: 'document',
      },
      sections: [],
      raw: '',
    },
    currentSection: null,
    pendingExperience: null,
    macros: new Map(),
    warnings: [],
    errors: [],
  }
}
