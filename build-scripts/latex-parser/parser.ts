import type {
  Token,
  ASTNode,
  DocumentNode,
  CommandNode,
  TextNode,
  GroupNode,
  EnvironmentNode,
  ParseError,
} from '../../types/latex'

/**
 * LaTeX Parser
 *
 * Converts a token stream into an Abstract Syntax Tree (AST).
 * Handles nested brace groups, environments, and command arguments.
 */

export interface ParserResult {
  ast: DocumentNode
  errors: ParseError[]
}

export class Parser {
  private tokens: Token[]
  private pos: number = 0
  private errors: ParseError[] = []

  constructor(tokens: Token[]) {
    // Filter out comments and pure whitespace tokens for simpler parsing
    this.tokens = tokens.filter(t => t.type !== 'comment')
  }

  parse(): ParserResult {
    const children = this.parseContent()
    const documentClass = this.extractDocumentClass(children)

    const ast: DocumentNode = {
      type: 'document',
      documentClass,
      children: this.filterDocumentBody(children),
    }

    return { ast, errors: this.errors }
  }

  private peek(offset: number = 0): Token | undefined {
    return this.tokens[this.pos + offset]
  }

  private advance(): Token | undefined {
    return this.tokens[this.pos++]
  }

  private check(type: string): boolean {
    const token = this.peek()
    return token?.type === type
  }

  private checkCommand(name: string): boolean {
    const token = this.peek()
    return token?.type === 'command' && token.value === name
  }

  private parseContent(stopAtCloseBrace: boolean = false): ASTNode[] {
    const nodes: ASTNode[] = []

    while (this.pos < this.tokens.length) {
      const token = this.peek()
      if (!token) break

      // Stop if we hit a closing brace and we're parsing group content
      if (stopAtCloseBrace && token.type === 'closeBrace') {
        break
      }

      const node = this.parseNode()
      if (node) {
        nodes.push(node)
      }
    }

    return nodes
  }

  private parseNode(): ASTNode | null {
    const token = this.peek()
    if (!token) return null

    switch (token.type) {
      case 'command':
        return this.parseCommand()
      case 'openBrace':
        return this.parseGroup()
      case 'closeBrace':
        // Unmatched close brace - skip it
        this.advance()
        return null
      case 'text':
        return this.parseText()
      case 'newline':
      case 'whitespace':
        // Collapse whitespace into text
        return this.parseWhitespace()
      default:
        this.advance()
        return null
    }
  }

  private parseCommand(): CommandNode | EnvironmentNode | null {
    const token = this.advance()!
    const name = token.value

    // Handle \begin{environment}
    if (name === 'begin') {
      return this.parseEnvironment()
    }

    // Handle \end{environment} - should be consumed by parseEnvironment
    if (name === 'end') {
      // Skip the environment name argument
      if (this.check('openBrace')) {
        this.parseGroup()
      }
      return null
    }

    // Parse command arguments (brace groups that immediately follow)
    const args: GroupNode[] = []

    // Skip whitespace between command and arguments
    this.skipWhitespace()

    // Collect all consecutive brace groups as arguments
    while (this.check('openBrace')) {
      const group = this.parseGroup()
      if (group) {
        args.push(group)
      }
      // Skip whitespace between arguments
      this.skipWhitespaceNotNewline()
    }

    return {
      type: 'command',
      name,
      args,
      position: token.position,
    }
  }

  private parseEnvironment(): EnvironmentNode | null {
    // Parse the environment name from {name}
    if (!this.check('openBrace')) {
      this.errors.push({
        message: 'Expected environment name after \\begin',
        line: this.peek()?.position.line || 0,
        column: this.peek()?.position.column || 0,
      })
      return null
    }

    const nameGroup = this.parseGroup()
    if (!nameGroup || nameGroup.children.length === 0) {
      return null
    }

    const envName = this.extractTextContent(nameGroup.children)

    // Parse environment content until \end{envName}
    const children: ASTNode[] = []

    while (this.pos < this.tokens.length) {
      // Check for \end{envName}
      if (this.checkCommand('end')) {
        const endToken = this.peek()
        this.advance() // consume \end

        // Skip whitespace
        this.skipWhitespace()

        // Parse the environment name
        if (this.check('openBrace')) {
          const endNameGroup = this.parseGroup()
          const endEnvName = this.extractTextContent(endNameGroup?.children || [])

          if (endEnvName === envName) {
            // Matching \end found
            break
          } else {
            // Mismatched \end - add as content and continue
            this.errors.push({
              message: `Mismatched environment: expected \\end{${envName}}, got \\end{${endEnvName}}`,
              line: endToken?.position.line || 0,
              column: endToken?.position.column || 0,
            })
          }
        }
        continue
      }

      const node = this.parseNode()
      if (node) {
        children.push(node)
      }
    }

    return {
      type: 'environment',
      name: envName,
      children,
    }
  }

  private parseGroup(): GroupNode | null {
    const openBrace = this.advance() // consume {

    if (openBrace?.type !== 'openBrace') {
      return null
    }

    const children = this.parseContent(true)

    // Consume closing brace
    if (this.check('closeBrace')) {
      this.advance()
    } else {
      this.errors.push({
        message: 'Unclosed brace group',
        line: openBrace.position.line,
        column: openBrace.position.column,
      })
    }

    return {
      type: 'group',
      children,
      position: openBrace.position,
    }
  }

  private parseText(): TextNode {
    const token = this.advance()!
    return {
      type: 'text',
      content: token.value,
      position: token.position,
    }
  }

  private parseWhitespace(): TextNode | null {
    let content = ''
    const position = this.peek()?.position

    while (this.check('whitespace') || this.check('newline')) {
      content += this.advance()!.value
    }

    if (content.length === 0) return null

    return {
      type: 'text',
      content,
      position,
    }
  }

  private skipWhitespace(): void {
    while (this.check('whitespace') || this.check('newline')) {
      this.advance()
    }
  }

  private skipWhitespaceNotNewline(): void {
    while (this.check('whitespace')) {
      this.advance()
    }
  }

  private extractTextContent(nodes: ASTNode[]): string {
    return nodes
      .map(node => {
        if (node.type === 'text') {
          return (node as TextNode).content
        }
        if (node.type === 'group') {
          return this.extractTextContent((node as GroupNode).children)
        }
        return ''
      })
      .join('')
      .trim()
  }

  private extractDocumentClass(nodes: ASTNode[]): string {
    for (const node of nodes) {
      if (node.type === 'command' && (node as CommandNode).name === 'documentclass') {
        const cmd = node as CommandNode
        if (cmd.args.length > 0) {
          return this.extractTextContent(cmd.args[0].children)
        }
      }
    }
    return 'unknown'
  }

  private filterDocumentBody(nodes: ASTNode[]): ASTNode[] {
    // Return ALL nodes including preamble - we need metadata commands
    // The transformer will handle extracting metadata and document content separately
    return nodes
  }
}

/**
 * Helper function to extract all text content from an AST node
 */
export function getTextContent(node: ASTNode): string {
  switch (node.type) {
    case 'text':
      return (node as TextNode).content
    case 'group':
      return (node as GroupNode).children.map(getTextContent).join('')
    case 'command':
      return '' // Commands don't contribute text directly
    case 'environment':
      return (node as EnvironmentNode).children.map(getTextContent).join('')
    case 'document':
      return (node as DocumentNode).children.map(getTextContent).join('')
    default:
      return ''
  }
}

/**
 * Debug utility to print AST
 */
export function debugAST(node: ASTNode, indent: number = 0): string {
  const pad = '  '.repeat(indent)

  switch (node.type) {
    case 'document': {
      const doc = node as DocumentNode
      return `${pad}Document (class: ${doc.documentClass})\n` +
        doc.children.map(c => debugAST(c, indent + 1)).join('')
    }
    case 'command': {
      const cmd = node as CommandNode
      const argsStr = cmd.args.map(a => debugAST(a, 0)).join(', ')
      return `${pad}Command: \\${cmd.name}${argsStr ? ` [${cmd.args.length} args]` : ''}\n`
    }
    case 'text': {
      const text = (node as TextNode).content.trim()
      if (!text) return ''
      return `${pad}Text: "${text.slice(0, 40)}${text.length > 40 ? '...' : ''}"\n`
    }
    case 'group': {
      const group = node as GroupNode
      const content = group.children.map(c => debugAST(c, indent + 1)).join('')
      return `${pad}Group {\n${content}${pad}}\n`
    }
    case 'environment': {
      const env = node as EnvironmentNode
      return `${pad}Environment: ${env.name}\n` +
        env.children.map(c => debugAST(c, indent + 1)).join('')
    }
    default:
      return `${pad}Unknown: ${node.type}\n`
  }
}
