import type { ParsedResumeDocument } from '../types/latex'
import * as fs from 'fs'
import * as path from 'path'

/**
 * LaTeX Document Loader
 *
 * Loads parsed LaTeX documents from the build output.
 * Used at build time and server-side runtime.
 */

const LATEX_OUTPUT_DIR = path.join(process.cwd(), '.contentlayer', 'latex-generated')

/**
 * Load a specific LaTeX document by slug
 */
export function getLatexDocument(slug: string): ParsedResumeDocument | null {
  try {
    const filePath = path.join(LATEX_OUTPUT_DIR, `${slug}.json`)

    if (!fs.existsSync(filePath)) {
      return null
    }

    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content) as ParsedResumeDocument
  } catch (error) {
    console.error(`Error loading LaTeX document "${slug}":`, error)
    return null
  }
}

/**
 * Load all LaTeX documents
 */
export function getAllLatexDocuments(): ParsedResumeDocument[] {
  try {
    if (!fs.existsSync(LATEX_OUTPUT_DIR)) {
      return []
    }

    const files = fs.readdirSync(LATEX_OUTPUT_DIR)
    const documents: ParsedResumeDocument[] = []

    for (const file of files) {
      if (file.endsWith('.json') && file !== 'index.json') {
        const slug = file.replace('.json', '')
        const doc = getLatexDocument(slug)
        if (doc) {
          documents.push(doc)
        }
      }
    }

    return documents
  } catch (error) {
    console.error('Error loading LaTeX documents:', error)
    return []
  }
}

/**
 * Get LaTeX document index (lightweight metadata only)
 */
export function getLatexDocumentIndex(): Array<{
  slug: string
  title: string
  description: string
  email?: string
  linkedin?: string
  github?: string
}> {
  try {
    const indexPath = path.join(LATEX_OUTPUT_DIR, 'index.json')

    if (!fs.existsSync(indexPath)) {
      return []
    }

    const content = fs.readFileSync(indexPath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error('Error loading LaTeX document index:', error)
    return []
  }
}

/**
 * Check if a document is a LaTeX document (vs MDX)
 */
export function isLatexDocument(slug: string): boolean {
  const filePath = path.join(LATEX_OUTPUT_DIR, `${slug}.json`)
  return fs.existsSync(filePath)
}
