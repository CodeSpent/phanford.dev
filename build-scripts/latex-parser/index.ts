#!/usr/bin/env npx tsx

/**
 * LaTeX Parser Build Script
 *
 * Parses LaTeX documents and generates JSON output for use by the website.
 *
 * Supports folder structure:
 *   content/documents/{slug}/
 *     *.tex or *.latex     - LaTeX source file
 *     info.json (optional) - Metadata overrides (title, description, tags, etc.)
 *
 * Usage:
 *   npx tsx build-scripts/latex-parser/index.ts
 *
 * Output:
 *   .contentlayer/latex-generated/{slug}.json
 *   .contentlayer/latex-generated/index.json
 */

import * as fs from 'fs'
import * as path from 'path'
import { tokenize } from './tokenizer'
import { Parser } from './parser'
import { transform } from './transformer'
import type { ParsedResumeDocument, ResumeMetadata } from '../../types/latex'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'documents')
const OUTPUT_DIR = path.join(process.cwd(), '.contentlayer', 'latex-generated')

interface InfoJson {
  title?: string
  description?: string
  tags?: string[]
  category?: string
  date?: string
  [key: string]: any
}

interface DocumentFolder {
  slug: string
  folderPath: string
  texFile: string
  infoJson?: InfoJson
}

interface ProcessedDocument {
  slug: string
  inputPath: string
  document: ParsedResumeDocument
  warnings: string[]
  errors: string[]
}

/**
 * Find all document folders containing LaTeX files
 */
function findDocumentFolders(dir: string): DocumentFolder[] {
  const folders: DocumentFolder[] = []

  if (!fs.existsSync(dir)) {
    return folders
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      // Look for .tex file in this folder
      const folderContents = fs.readdirSync(fullPath)
      const texFile = folderContents.find(f => f.endsWith('.tex') || f.endsWith('.latex'))

      if (texFile) {
        // Found a document folder
        const folder: DocumentFolder = {
          slug: entry.name,
          folderPath: fullPath,
          texFile: path.join(fullPath, texFile),
        }

        // Check for info.json
        const infoPath = path.join(fullPath, 'info.json')
        if (fs.existsSync(infoPath)) {
          try {
            const infoContent = fs.readFileSync(infoPath, 'utf-8').trim()
            if (infoContent) {
              folder.infoJson = JSON.parse(infoContent)
            }
          } catch (e) {
            console.warn(`  Warning: Could not parse info.json in ${entry.name}`)
          }
        }

        folders.push(folder)
      } else {
        // Recursively search subdirectories
        folders.push(...findDocumentFolders(fullPath))
      }
    } else if (entry.isFile() && (entry.name.endsWith('.tex') || entry.name.endsWith('.latex'))) {
      // Standalone .tex file (legacy support)
      folders.push({
        slug: path.basename(entry.name, path.extname(entry.name)),
        folderPath: dir,
        texFile: fullPath,
      })
    }
  }

  return folders
}

function processFolder(folder: DocumentFolder): ProcessedDocument | null {
  const relativePath = path.relative(CONTENT_DIR, folder.texFile)

  console.log(`  Processing: ${relativePath}`)

  try {
    const source = fs.readFileSync(folder.texFile, 'utf-8')

    // Tokenize
    const { tokens, errors: tokenErrors } = tokenize(source)

    if (tokenErrors.length > 0) {
      console.log(`    Tokenizer warnings:`)
      for (const error of tokenErrors) {
        console.log(`      ${error.position.line}:${error.position.column} - ${error.message}`)
      }
    }

    // Parse
    const parser = new Parser(tokens)
    const { ast, errors: parseErrors } = parser.parse()

    if (parseErrors.length > 0) {
      console.log(`    Parser errors:`)
      for (const error of parseErrors) {
        console.log(`      ${error.line}:${error.column} - ${error.message}`)
      }
    }

    // Transform
    const { document, warnings, errors } = transform(ast, source, folder.slug)

    // Merge info.json metadata if present
    if (folder.infoJson) {
      console.log(`    Merging info.json metadata`)
      const info = folder.infoJson

      if (info.title) document.metadata.title = info.title
      if (info.description) document.metadata.description = info.description
      if (info.tags) document.metadata.tags = info.tags
      if (info.category) document.metadata.category = info.category
      if (info.date) document.metadata.date = info.date
    }

    if (warnings.length > 0) {
      console.log(`    Warnings:`)
      for (const warning of warnings) {
        console.log(`      - ${warning}`)
      }
    }

    if (errors.length > 0) {
      console.log(`    Transform errors:`)
      for (const error of errors) {
        console.log(`      - ${error}`)
      }
    }

    // Log success info
    const sectionCount = document.sections.length
    const itemCount = document.sections.reduce((sum, s) => sum + s.items.length, 0)
    console.log(`    Success: ${sectionCount} sections, ${itemCount} items`)

    return {
      slug: folder.slug,
      inputPath: folder.texFile,
      document,
      warnings,
      errors,
    }
  } catch (error) {
    console.error(`    Error processing file: ${error}`)
    return null
  }
}

function main(): void {
  console.log('LaTeX Parser Build Script')
  console.log('='.repeat(50))
  console.log()

  // Find all document folders
  const folders = findDocumentFolders(CONTENT_DIR)

  if (folders.length === 0) {
    console.log('No LaTeX documents found in content/documents/')
    return
  }

  console.log(`Found ${folders.length} LaTeX document(s)`)
  console.log()

  // Process each folder
  const processed: ProcessedDocument[] = []

  for (const folder of folders) {
    const result = processFolder(folder)
    if (result) {
      processed.push(result)
    }
  }

  console.log()

  // Create output directory
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  // Write individual document files
  for (const doc of processed) {
    const outputPath = path.join(OUTPUT_DIR, `${doc.slug}.json`)
    fs.writeFileSync(outputPath, JSON.stringify(doc.document, null, 2))
    console.log(`  Written: ${path.relative(process.cwd(), outputPath)}`)
  }

  // Write index file
  const index = processed.map(p => ({
    slug: p.slug,
    title: p.document.metadata.title || p.document.metadata.name || p.slug,
    description: p.document.metadata.description || `Resume for ${p.document.metadata.name}`,
    tags: p.document.metadata.tags || [],
    category: p.document.metadata.category,
    date: p.document.metadata.date,
    email: p.document.metadata.email,
    linkedin: p.document.metadata.linkedin,
    github: p.document.metadata.github,
  }))

  const indexPath = path.join(OUTPUT_DIR, 'index.json')
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2))
  console.log(`  Written: ${path.relative(process.cwd(), indexPath)}`)

  console.log()
  console.log('='.repeat(50))
  console.log(`Processed ${processed.length} document(s)`)

  // Report any errors
  const totalErrors = processed.reduce((sum, p) => sum + p.errors.length, 0)
  const totalWarnings = processed.reduce((sum, p) => sum + p.warnings.length, 0)

  if (totalErrors > 0) {
    console.log(`  Errors: ${totalErrors}`)
  }
  if (totalWarnings > 0) {
    console.log(`  Warnings: ${totalWarnings}`)
  }
}

main()
