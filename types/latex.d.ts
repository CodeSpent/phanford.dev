// LaTeX Parser Type Definitions

// ============================================================================
// Token Types (output of tokenizer)
// ============================================================================

export type TokenType = 'command' | 'text' | 'openBrace' | 'closeBrace' | 'comment' | 'newline' | 'whitespace'

export interface Token {
  type: TokenType
  value: string
  position: TokenPosition
}

export interface TokenPosition {
  line: number
  column: number
  offset: number
}

// ============================================================================
// AST Node Types (output of parser)
// ============================================================================

export type ASTNodeType = 'document' | 'command' | 'text' | 'group' | 'environment'

export interface ASTNode {
  type: ASTNodeType
  position?: TokenPosition
}

export interface DocumentNode extends ASTNode {
  type: 'document'
  documentClass: string
  children: ASTNode[]
}

export interface CommandNode extends ASTNode {
  type: 'command'
  name: string
  args: GroupNode[]
}

export interface TextNode extends ASTNode {
  type: 'text'
  content: string
}

export interface GroupNode extends ASTNode {
  type: 'group'
  children: ASTNode[]
}

export interface EnvironmentNode extends ASTNode {
  type: 'environment'
  name: string
  children: ASTNode[]
}

// ============================================================================
// Parsed Resume Types (output of transformer)
// ============================================================================

export interface ParsedResumeDocument {
  documentClass: string
  metadata: ResumeMetadata
  sections: ResumeSection[]
  raw: string
}

export interface ResumeMetadata {
  name: string
  email: string
  mobile?: string
  linkedin?: string
  github?: string
  themeColor?: string
  slug: string
  // Additional metadata from info.json
  title?: string
  description?: string
  tags?: string[]
  category?: string
  date?: string
}

export type ResumeSectionType = 'skills' | 'experience' | 'projects' | 'education' | 'custom'

export interface ResumeSection {
  id: string
  type: ResumeSectionType
  title: string
  items: ResumeSectionItem[]
}

export type ResumeSectionItem = SkillGroup | ExperienceEntry

export interface SkillGroup {
  type: 'skill-group'
  category: string
  skills: string[]
}

export interface ExperienceEntry {
  type: 'experience'
  company: string
  dateRange: string
  title: string
  subtitle?: string
  bullets: string[]
  technologies?: string[]
}

// ============================================================================
// Command Handler Types (plugin system)
// ============================================================================

export interface TransformContext {
  document: Partial<ParsedResumeDocument>
  currentSection: ResumeSection | null
  pendingExperience: Partial<ExperienceEntry> | null
  macros: Map<string, ASTNode[]>
  warnings: string[]
  errors: string[]
}

export interface CommandHandler {
  name: string
  aliases?: string[]
  handle: (args: GroupNode[], context: TransformContext) => void
}

export interface CommandRegistry {
  register: (handler: CommandHandler) => void
  registerMany: (handlers: CommandHandler[]) => void
  get: (name: string) => CommandHandler | undefined
  has: (name: string) => boolean
}

// ============================================================================
// Parse Result Types
// ============================================================================

export interface ParseResult<T> {
  success: boolean
  data?: T
  errors: ParseError[]
  warnings: string[]
}

export interface ParseError {
  message: string
  line: number
  column: number
  context?: string
}

// ============================================================================
// Loader Types (for runtime usage)
// ============================================================================

export interface LaTeXDocumentLoader {
  getDocument: (slug: string) => ParsedResumeDocument | undefined
  getAllDocuments: () => ParsedResumeDocument[]
}
