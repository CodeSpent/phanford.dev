#!/usr/bin/env node

/**
 * MDX Content Validation Script
 * Validates all articles and documents for common issues
 * Run this script before committing content changes
 */

import { allArticles, allDocs } from '../.contentlayer/generated/index.mjs'

let hasErrors = false
let hasWarnings = false

function logError(type, title, message) {
  console.error(`❌ [${type}] ${title}: ${message}`)
  hasErrors = true
}

function logWarning(type, title, message) {
  console.warn(`⚠️  [${type}] ${title}: ${message}`)
  hasWarnings = true
}

function logSuccess(type, title) {
  console.log(`✅ [${type}] ${title}`)
}

function validateContent(item, type) {
  const title = item.title || 'Unknown'
  let isValid = true

  // Check 1: Compiled code exists
  if (!item.body?.code) {
    logError(type, title, 'Missing compiled MDX code - Contentlayer compilation may have failed')
    return false
  }

  // Check 2: Raw content exists and has reasonable length
  if (!item.body?.raw) {
    logWarning(type, title, 'Missing raw content')
    isValid = false
  } else if (item.body.raw.length < 50) {
    logWarning(type, title, `Suspiciously short content (${item.body.raw.length} characters)`)
  }

  // Check 3: Check for unclosed tags
  const unclosedTagPattern = /<([a-zA-Z][a-zA-Z0-9]*)[^>]*>[^<]*$/m
  if (item.body?.raw && unclosedTagPattern.test(item.body.raw)) {
    // More sophisticated check: count opening and closing tags
    const openTags = (item.body.raw.match(/<[a-zA-Z][^/>]*>/g) || []).length
    const closeTags = (item.body.raw.match(/<\/[a-zA-Z][^>]*>/g) || []).length
    const selfClosingTags = (item.body.raw.match(/<[a-zA-Z][^>]*\/>/g) || []).length

    const expectedCloseTags = openTags - selfClosingTags
    if (closeTags < expectedCloseTags) {
      logError(type, title, `Potential unclosed tags detected (${openTags} open, ${closeTags} close, ${selfClosingTags} self-closing)`)
      isValid = false
    }
  }

  // Check 4: Required frontmatter fields
  if (!item.title) {
    logError(type, title, 'Missing title in frontmatter')
    isValid = false
  }

  if (!item.date) {
    logWarning(type, title, 'Missing date in frontmatter')
  }

  // Check 5: Valid date format
  if (item.date) {
    const date = new Date(item.date)
    if (isNaN(date.getTime())) {
      logError(type, title, `Invalid date format: "${item.date}"`)
      isValid = false
    }
  }

  // Check 6: Tags array
  if (!Array.isArray(item.tags)) {
    logWarning(type, title, 'Tags is not an array or is missing')
  } else if (item.tags.length === 0) {
    logWarning(type, title, 'No tags defined')
  }

  // Check 7: Description length
  if (item.description && item.description.length > 200) {
    logWarning(type, title, `Description is very long (${item.description.length} characters)`)
  }

  // Check 8: Check for common MDX syntax issues
  if (item.body?.raw) {
    // Check for React component usage without imports
    const componentPattern = /<[A-Z][a-zA-Z0-9]*[\s/>]/g
    const components = item.body.raw.match(componentPattern)
    if (components && components.length > 0) {
      const uniqueComponents = [...new Set(components.map(c => c.match(/<([A-Z][a-zA-Z0-9]*)/)[1]))]
      logWarning(type, title, `Uses React components: ${uniqueComponents.join(', ')} - ensure these are available in MDX context`)
    }

    // Check for invalid JSX attributes (class instead of className)
    if (item.body.raw.includes('class=') && !item.body.raw.includes('className=')) {
      logWarning(type, title, 'Found "class=" attribute - should use "className=" in JSX')
    }
  }

  if (isValid) {
    logSuccess(type, title)
  }

  return isValid
}

console.log('\n🔍 Validating MDX Content...\n')
console.log(`Found ${allArticles.length} articles and ${allDocs.length} documents\n`)

// Validate all articles
console.log('📝 Validating Articles:')
console.log('─'.repeat(50))
let validArticles = 0
allArticles.forEach(article => {
  if (validateContent(article, 'Article')) {
    validArticles++
  }
})

console.log('')

// Validate all documents
console.log('📄 Validating Documents:')
console.log('─'.repeat(50))
let validDocs = 0
allDocs.forEach(doc => {
  if (validateContent(doc, 'Document')) {
    validDocs++
  }
})

// Summary
console.log('')
console.log('═'.repeat(50))
console.log('📊 Validation Summary:')
console.log('─'.repeat(50))
console.log(`Articles: ${validArticles}/${allArticles.length} valid`)
console.log(`Documents: ${validDocs}/${allDocs.length} valid`)

if (hasErrors) {
  console.log('\n❌ Validation FAILED - Errors must be fixed before deployment')
  process.exit(1)
} else if (hasWarnings) {
  console.log('\n⚠️  Validation completed with warnings - Review recommended')
  process.exit(0)
} else {
  console.log('\n✅ All content validated successfully!')
  process.exit(0)
}
