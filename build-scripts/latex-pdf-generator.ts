#!/usr/bin/env npx tsx

/**
 * LaTeX PDF Generator
 *
 * Generates PDFs from LaTeX documents using xelatex.
 * Run before committing to ensure PDFs are up-to-date.
 *
 * Usage:
 *   npx tsx build-scripts/latex-pdf-generator.ts
 *
 * Output:
 *   public/documents/{slug}/{slug}.pdf
 */

import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'
import * as os from 'os'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'documents')
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'documents')

interface DocumentFolder {
  slug: string
  folderPath: string
  texFile: string
}

interface ProcessResult {
  slug: string
  success: boolean
  outputPath?: string
  error?: string
}

/**
 * Find all document folders containing LaTeX files
 */
function findLatexDocuments(dir: string): DocumentFolder[] {
  const folders: DocumentFolder[] = []

  if (!fs.existsSync(dir)) {
    return folders
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      const folderContents = fs.readdirSync(fullPath)
      const texFile = folderContents.find((f) => f.endsWith('.tex') || f.endsWith('.latex'))

      if (texFile) {
        folders.push({
          slug: entry.name,
          folderPath: fullPath,
          texFile: path.join(fullPath, texFile),
        })
      }
    }
  }

  return folders
}

/**
 * Compile a LaTeX document to PDF
 */
function compileDocument(folder: DocumentFolder): ProcessResult {
  const { slug, folderPath, texFile } = folder
  const texFileName = path.basename(texFile)

  console.log(`  Compiling: ${slug}/${texFileName}`)

  let tempDir: string | null = null

  try {
    // Create temp directory
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `latex-${slug}-`))

    // Copy all files from document folder to temp
    const files = fs.readdirSync(folderPath)
    for (const file of files) {
      const srcPath = path.join(folderPath, file)
      const destPath = path.join(tempDir, file)
      const stat = fs.statSync(srcPath)

      if (stat.isFile()) {
        fs.copyFileSync(srcPath, destPath)
      }
    }

    const tempTexPath = path.join(tempDir, texFileName)
    const xelatexCmd = `xelatex -interaction=nonstopmode -output-directory="${tempDir}" "${tempTexPath}"`

    // Run xelatex twice for cross-references
    try {
      execSync(xelatexCmd, { cwd: tempDir, stdio: 'pipe', timeout: 60000 })
      execSync(xelatexCmd, { cwd: tempDir, stdio: 'pipe', timeout: 60000 })
    } catch (compileError: any) {
      // Check if PDF was still generated despite errors
      const pdfName = texFileName.replace(/\.(tex|latex)$/, '.pdf')
      const tempPdfPath = path.join(tempDir, pdfName)

      if (!fs.existsSync(tempPdfPath)) {
        // Read log for error details
        const logPath = path.join(tempDir, texFileName.replace(/\.(tex|latex)$/, '.log'))
        let errorDetails = compileError.message
        if (fs.existsSync(logPath)) {
          const logContent = fs.readFileSync(logPath, 'utf-8')
          const errorLines = logContent
            .split('\n')
            .filter((line) => line.startsWith('!') || line.includes('Error'))
            .slice(0, 5)
            .join('\n')
          if (errorLines) {
            errorDetails = errorLines
          }
        }
        throw new Error(`Compilation failed: ${errorDetails}`)
      }
      // PDF generated despite warnings - continue
    }

    // Copy PDF to output directory
    const pdfName = texFileName.replace(/\.(tex|latex)$/, '.pdf')
    const tempPdfPath = path.join(tempDir, pdfName)
    const outputSubDir = path.join(OUTPUT_DIR, slug)
    const outputPath = path.join(outputSubDir, `${slug}.pdf`)

    // Ensure output directory exists
    fs.mkdirSync(outputSubDir, { recursive: true })

    // Copy PDF
    fs.copyFileSync(tempPdfPath, outputPath)

    console.log(`    ✓ Generated: public/documents/${slug}/${slug}.pdf`)

    return {
      slug,
      success: true,
      outputPath,
    }
  } catch (error: any) {
    console.error(`    ✗ Failed: ${error.message}`)
    return {
      slug,
      success: false,
      error: error.message,
    }
  } finally {
    // Clean up temp directory
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }
  }
}

/**
 * Check if xelatex is available
 */
function checkXelatex(): boolean {
  try {
    execSync('which xelatex', { stdio: 'pipe' })
    return true
  } catch {
    return false
  }
}

function main(): void {
  console.log('LaTeX PDF Generator')
  console.log('='.repeat(50))
  console.log()

  // Check for xelatex
  if (!checkXelatex()) {
    console.error('Error: xelatex not found.')
    console.error('Please install TeX Live or MacTeX to compile LaTeX documents.')
    process.exit(1)
  }

  // Find all LaTeX documents
  const documents = findLatexDocuments(CONTENT_DIR)

  if (documents.length === 0) {
    console.log('No LaTeX documents found in content/documents/')
    return
  }

  console.log(`Found ${documents.length} LaTeX document(s)`)
  console.log()

  // Compile each document
  const results: ProcessResult[] = []

  for (const doc of documents) {
    const result = compileDocument(doc)
    results.push(result)
  }

  console.log()
  console.log('='.repeat(50))

  // Summary
  const successful = results.filter((r) => r.success)
  const failed = results.filter((r) => !r.success)

  console.log(`Generated ${successful.length}/${documents.length} PDF(s)`)

  if (failed.length > 0) {
    console.log()
    console.log('Failed documents:')
    for (const f of failed) {
      console.log(`  - ${f.slug}: ${f.error}`)
    }
    process.exit(1)
  }
}

main()
