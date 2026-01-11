#!/usr/bin/env npx tsx

/**
 * CLI tool to add new photos to the photography section
 *
 * Usage:
 *   npm run add-photo -- /path/to/image.jpg
 *   npx tsx scripts/add-photo.ts /path/to/image.jpg --move --slug custom-slug
 */

import { program } from 'commander'
import inquirer from 'inquirer'
import pc from 'picocolors'
import * as fs from 'fs/promises'
import * as path from 'path'
import { execSync } from 'child_process'

// Constants
const CONTENT_PHOTOS_DIR = 'content/photos'
const VALID_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

// Interfaces
interface PhotoMetadata {
  title: string
  description: string
  date: string
  tags?: string[]
  category?: string
}

interface CLIOptions {
  move: boolean
  slug?: string
  build: boolean
  commit: boolean
  dryRun: boolean
  yes: boolean
}

interface ExistingData {
  tags: string[]
  categories: string[]
  slugs: string[]
}

// Utility Functions
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/['']/g, '') // Remove apostrophes
    .replace(/&/g, 'and') // Replace ampersand
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Spaces to hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-|-$/g, '') // Trim leading/trailing hyphens
}

function getTodayDate(): string {
  const now = new Date()
  return now.toISOString().split('T')[0]
}

async function validateImagePath(imagePath: string): Promise<void> {
  try {
    await fs.access(imagePath)
  } catch {
    console.error(pc.red(`Error: Image file not found: ${imagePath}`))
    process.exit(1)
  }

  const ext = path.extname(imagePath).toLowerCase()
  if (!VALID_EXTENSIONS.includes(ext)) {
    console.error(
      pc.red(`Error: Invalid image format. Supported: ${VALID_EXTENSIONS.join(', ')}`)
    )
    process.exit(1)
  }
}

async function loadExistingData(): Promise<ExistingData> {
  const tagsSet = new Set<string>()
  const categoriesSet = new Set<string>()
  const slugs: string[] = []

  try {
    const folders = await fs.readdir(CONTENT_PHOTOS_DIR)

    for (const folder of folders) {
      const infoPath = path.join(CONTENT_PHOTOS_DIR, folder, 'info.json')

      try {
        const content = await fs.readFile(infoPath, 'utf-8')
        const info = JSON.parse(content)

        slugs.push(folder)

        if (Array.isArray(info.tags)) {
          info.tags.forEach((tag: string) => tagsSet.add(tag))
        }

        if (info.category) {
          categoriesSet.add(info.category)
        }
      } catch {
        // Skip folders without valid info.json
      }
    }
  } catch {
    // content/photos directory doesn't exist yet
  }

  return {
    tags: Array.from(tagsSet).sort(),
    categories: Array.from(categoriesSet).sort(),
    slugs,
  }
}

async function collectMetadata(
  existingData: ExistingData,
  options: CLIOptions
): Promise<PhotoMetadata> {
  if (options.yes) {
    // Use minimal defaults for --yes mode
    return {
      title: 'Untitled Photo',
      description: 'No description provided',
      date: getTodayDate(),
    }
  }

  // Basic info prompts
  const basicAnswers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Photo title:',
      validate: (value: string) => (value.trim() ? true : 'Title is required'),
    },
    {
      type: 'input',
      name: 'description',
      message: 'Description:',
      validate: (value: string) => (value.trim() ? true : 'Description is required'),
    },
    {
      type: 'input',
      name: 'date',
      message: 'Date (YYYY-MM-DD):',
      default: getTodayDate(),
      validate: (value: string) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          return 'Please use YYYY-MM-DD format'
        }
        return true
      },
    },
  ])

  let tags: string[] = []

  // Tag selection if tags exist
  if (existingData.tags.length > 0) {
    const tagAnswers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedTags',
        message: 'Select tags (space to toggle):',
        choices: existingData.tags,
      },
    ])
    tags = tagAnswers.selectedTags
  }

  // Option to add new tags
  const addTagsAnswer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'addNewTags',
      message: 'Add new tags?',
      default: false,
    },
  ])

  if (addTagsAnswer.addNewTags) {
    const newTagsAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'newTags',
        message: 'Enter new tags (comma-separated):',
      },
    ])
    const newTags = newTagsAnswer.newTags
      .split(',')
      .map((t: string) => t.trim().toLowerCase())
      .filter((t: string) => t)
    tags = [...tags, ...newTags]
  }

  // Category selection
  let category: string | undefined
  const categoryChoices = [
    ...existingData.categories,
    new inquirer.Separator(),
    '+ Add new category',
    'No category',
  ]

  const categoryAnswer = await inquirer.prompt([
    {
      type: 'list',
      name: 'category',
      message: 'Category:',
      choices: categoryChoices,
    },
  ])

  if (categoryAnswer.category === '+ Add new category') {
    const newCatAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'newCategory',
        message: 'Enter new category:',
        validate: (value: string) => (value.trim() ? true : 'Category cannot be empty'),
      },
    ])
    category = newCatAnswer.newCategory.toLowerCase()
  } else if (categoryAnswer.category !== 'No category') {
    category = categoryAnswer.category
  }

  return {
    title: basicAnswers.title,
    description: basicAnswers.description,
    date: basicAnswers.date,
    tags: tags.length > 0 ? tags : undefined,
    category,
  }
}

async function resolveSlug(
  slug: string,
  existingSlugs: string[],
  options: CLIOptions
): Promise<string> {
  if (!existingSlugs.includes(slug)) {
    return slug
  }

  if (options.yes) {
    // Auto-increment for --yes mode
    let counter = 2
    while (existingSlugs.includes(`${slug}-${counter}`)) counter++
    return `${slug}-${counter}`
  }

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: `Slug "${slug}" already exists. What would you like to do?`,
      choices: [
        { name: `Use "${slug}-2" (auto-increment)`, value: 'increment' },
        { name: 'Enter a custom slug', value: 'custom' },
        { name: 'Cancel operation', value: 'abort' },
      ],
    },
  ])

  if (answer.action === 'abort') {
    console.log(pc.yellow('Operation cancelled.'))
    process.exit(0)
  }

  if (answer.action === 'custom') {
    const customAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'slug',
        message: 'Enter custom slug:',
        validate: (value: string) => {
          const cleaned = value.trim().toLowerCase()
          if (!cleaned) return 'Slug cannot be empty'
          if (existingSlugs.includes(cleaned)) return 'That slug already exists'
          if (!/^[a-z0-9-]+$/.test(cleaned))
            return 'Slug can only contain lowercase letters, numbers, and hyphens'
          return true
        },
      },
    ])
    return customAnswer.slug.trim().toLowerCase()
  }

  // Auto-increment
  let counter = 2
  while (existingSlugs.includes(`${slug}-${counter}`)) counter++
  return `${slug}-${counter}`
}

async function showPreviewAndConfirm(
  slug: string,
  metadata: PhotoMetadata,
  imagePath: string,
  options: CLIOptions
): Promise<void> {
  const ext = path.extname(imagePath)
  const folderPath = path.join(CONTENT_PHOTOS_DIR, slug)

  console.log('\n' + pc.cyan('Preview:'))
  console.log(pc.dim('─'.repeat(40)))
  console.log(`${pc.bold('Folder:')} ${folderPath}/`)
  console.log(`${pc.bold('Image:')}  ${folderPath}/image${ext}`)
  console.log(`${pc.bold('Action:')} ${options.move ? 'Move' : 'Copy'} from ${imagePath}`)
  console.log(pc.dim('─'.repeat(40)))
  console.log(pc.bold('info.json:'))
  console.log(pc.green(JSON.stringify(metadata, null, 2)))
  console.log(pc.dim('─'.repeat(40)))

  if (options.dryRun) {
    console.log(pc.yellow('\n--dry-run: No files will be created.'))
    process.exit(0)
  }

  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'proceed',
      message: 'Create photo?',
      default: true,
    },
  ])

  if (!answer.proceed) {
    console.log(pc.yellow('Operation cancelled.'))
    process.exit(0)
  }
}

async function createPhotoFolder(
  slug: string,
  metadata: PhotoMetadata,
  imagePath: string,
  options: CLIOptions
): Promise<void> {
  const ext = path.extname(imagePath)
  const folderPath = path.join(CONTENT_PHOTOS_DIR, slug)
  const destImagePath = path.join(folderPath, `image${ext}`)
  const infoJsonPath = path.join(folderPath, 'info.json')

  const createdPaths: string[] = []

  try {
    // Create folder
    await fs.mkdir(folderPath, { recursive: true })
    createdPaths.push(folderPath)

    // Copy or move image
    if (options.move) {
      await fs.rename(imagePath, destImagePath)
    } else {
      await fs.copyFile(imagePath, destImagePath)
    }
    createdPaths.push(destImagePath)

    // Write info.json
    await fs.writeFile(infoJsonPath, JSON.stringify(metadata, null, 2) + '\n')

    console.log(pc.green(`\n✓ Created ${folderPath}/`))
  } catch (error) {
    // Rollback
    console.error(pc.red('Error occurred. Rolling back changes...'))
    for (const p of createdPaths.reverse()) {
      try {
        const stat = await fs.stat(p)
        if (stat.isDirectory()) {
          await fs.rm(p, { recursive: true, force: true })
        } else {
          await fs.unlink(p)
        }
      } catch {
        // Ignore cleanup errors
      }
    }
    throw error
  }
}

function runBuildScripts(): void {
  const scripts = [
    { name: 'EXIF extraction', cmd: 'node scripts/extract-photo-metadata.js' },
    { name: 'Blur placeholder', cmd: 'node scripts/generate-blur-placeholders.js' },
    { name: 'Copy to public', cmd: 'node scripts/copy-photo-images.js' },
    { name: 'Contentlayer', cmd: 'npx contentlayer2 build' },
  ]

  console.log(pc.cyan('\nRunning build scripts...'))

  for (const script of scripts) {
    process.stdout.write(pc.dim(`  ${script.name}... `))
    try {
      execSync(script.cmd, { stdio: 'pipe', cwd: process.cwd() })
      console.log(pc.green('✓'))
    } catch (error) {
      console.log(pc.yellow('⚠ failed'))
      console.warn(pc.yellow(`    You may need to run manually: ${script.cmd}`))
    }
  }
}

function commitToContentSubmodule(slug: string, metadata: PhotoMetadata): void {
  const contentDir = 'content'

  // Build commit message
  const title = `feat(photos): add "${metadata.title}"`
  const bodyParts: string[] = [metadata.description]

  if (metadata.tags && metadata.tags.length > 0) {
    bodyParts.push(`\nTags: ${metadata.tags.join(', ')}`)
  }
  if (metadata.category) {
    bodyParts.push(`Category: ${metadata.category}`)
  }

  const body = bodyParts.join('\n')
  const fullMessage = `${title}\n\n${body}`

  console.log(pc.cyan('\nCommitting to content submodule...'))

  try {
    // Stage the new photo folder
    execSync(`git add photos/${slug}`, { cwd: contentDir, stdio: 'pipe' })

    // Create the commit using heredoc for proper message formatting
    execSync(`git commit -m "${title}" -m "${body}"`, {
      cwd: contentDir,
      stdio: 'pipe',
    })

    console.log(pc.green('✓ Committed to content submodule'))
    console.log(pc.dim(`  Message: ${title}`))
  } catch (error: any) {
    // Check if it's just "nothing to commit"
    if (error.message?.includes('nothing to commit')) {
      console.log(pc.yellow('⚠ Nothing to commit (files may already be committed)'))
    } else {
      console.log(pc.yellow('⚠ Failed to commit'))
      console.warn(pc.yellow(`  You may need to commit manually in the content submodule`))
    }
  }
}

// Main
async function main() {
  program
    .name('add-photo')
    .description('Add a new photo to the photography section')
    .argument('<image-path>', 'Path to the image file')
    .option('-m, --move', 'Move file instead of copying', false)
    .option('-s, --slug <slug>', 'Override auto-generated slug')
    .option('--no-build', 'Skip running build scripts')
    .option('--no-commit', 'Skip committing to content submodule')
    .option('-d, --dry-run', 'Preview changes without creating files', false)
    .option('-y, --yes', 'Accept defaults without prompting', false)
    .parse()

  const imagePath = path.resolve(program.args[0])
  const options = program.opts<CLIOptions>()

  console.log(pc.bold('\n📷 Add Photo\n'))

  // 1. Validate input
  await validateImagePath(imagePath)

  // 2. Load existing data
  const existingData = await loadExistingData()

  // 3. Collect metadata via prompts
  const metadata = await collectMetadata(existingData, options)

  // 4. Generate/resolve slug
  const baseSlug = options.slug || generateSlug(metadata.title)
  const slug = await resolveSlug(baseSlug, existingData.slugs, options)

  // 5. Preview
  if (!options.yes) {
    await showPreviewAndConfirm(slug, metadata, imagePath, options)
  }

  // 6. Handle dry-run
  if (options.dryRun) {
    const ext = path.extname(imagePath)
    const folderPath = path.join(CONTENT_PHOTOS_DIR, slug)
    console.log('\n' + pc.cyan('Dry run preview:'))
    console.log(pc.dim('─'.repeat(40)))
    console.log(`${pc.bold('Would create:')} ${folderPath}/`)
    console.log(`${pc.bold('Image:')}        ${folderPath}/image${ext}`)
    console.log(`${pc.bold('Action:')}       ${options.move ? 'Move' : 'Copy'}`)
    console.log(pc.dim('─'.repeat(40)))
    console.log(pc.bold('info.json:'))
    console.log(pc.green(JSON.stringify(metadata, null, 2)))
    console.log(pc.dim('─'.repeat(40)))
    if (options.commit) {
      const commitTitle = `feat(photos): add "${metadata.title}"`
      console.log(pc.bold('Commit message:'))
      console.log(pc.green(commitTitle))
      console.log(pc.dim(metadata.description))
      if (metadata.tags?.length) {
        console.log(pc.dim(`Tags: ${metadata.tags.join(', ')}`))
      }
      if (metadata.category) {
        console.log(pc.dim(`Category: ${metadata.category}`))
      }
      console.log(pc.dim('─'.repeat(40)))
    }
    console.log(pc.yellow('\n--dry-run: No files created.'))
    process.exit(0)
  }

  // 7. Create files
  await createPhotoFolder(slug, metadata, imagePath, options)

  // 8. Commit to content submodule
  if (options.commit) {
    commitToContentSubmodule(slug, metadata)
  } else {
    console.log(pc.dim('\nSkipped commit (--no-commit)'))
  }

  // 9. Run build scripts
  if (options.build) {
    runBuildScripts()
  } else {
    console.log(pc.dim('Skipped build scripts (--no-build)'))
  }

  // 10. Success message
  console.log(pc.bold(pc.green('\n✓ Photo added successfully!')))
  console.log(`  ${pc.dim('URL:')} ${pc.cyan(`/photography/${slug}`)}`)
  console.log()
}

main().catch((error) => {
  // User pressed Ctrl+C or other interrupt
  if (error.isTtyError || error.message?.includes('User force closed')) {
    console.log(pc.yellow('\nOperation cancelled.'))
    process.exit(0)
  }
  console.error(pc.red(`Error: ${error.message}`))
  process.exit(1)
})
