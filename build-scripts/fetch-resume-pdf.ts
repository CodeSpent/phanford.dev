#!/usr/bin/env npx tsx

/**
 * Fetch Resume PDF from GitHub Releases
 *
 * Downloads the compiled resume.pdf from the latest GitHub release
 * of CodeSpent/resume for static serving on the website.
 *
 * Usage:
 *   npx tsx build-scripts/fetch-resume-pdf.ts
 *
 * Output:
 *   public/documents/resume.pdf
 */

import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'

const REPO_OWNER = 'CodeSpent'
const REPO_NAME = 'resume'
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'documents')
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'resume.pdf')

interface ReleaseAsset {
  name: string
  browser_download_url: string
}

interface Release {
  tag_name: string
  name: string
  assets: ReleaseAsset[]
}

function fetchJson<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'phanford.dev-build',
        Accept: 'application/vnd.github+json',
      },
    }

    https
      .get(url, options, res => {
        if (res.statusCode === 404) {
          reject(new Error('No releases found'))
          return
        }

        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`))
          return
        }

        let data = ''
        res.on('data', chunk => (data += chunk))
        res.on('end', () => {
          try {
            resolve(JSON.parse(data))
          } catch (e) {
            reject(e)
          }
        })
      })
      .on('error', reject)
  })
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'phanford.dev-build',
        Accept: 'application/octet-stream',
      },
    }

    const request = (currentUrl: string) => {
      https
        .get(currentUrl, options, res => {
          // Handle redirects
          if (res.statusCode === 302 || res.statusCode === 301) {
            const location = res.headers.location
            if (location) {
              request(location)
              return
            }
          }

          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode}`))
            return
          }

          const file = fs.createWriteStream(dest)
          res.pipe(file)
          file.on('finish', () => {
            file.close()
            resolve()
          })
        })
        .on('error', err => {
          fs.unlink(dest, () => {})
          reject(err)
        })
    }

    request(url)
  })
}

async function main(): Promise<void> {
  console.log('Fetch Resume PDF')
  console.log('='.repeat(50))
  console.log()

  try {
    // Fetch latest release
    console.log(`Fetching latest release from ${REPO_OWNER}/${REPO_NAME}...`)
    const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`

    const release = await fetchJson<Release>(apiUrl)
    console.log(`  Found release: ${release.name || release.tag_name}`)

    // Find PDF asset
    const pdfAsset = release.assets.find(a => a.name.endsWith('.pdf'))

    if (!pdfAsset) {
      console.log('  No PDF found in release assets')
      console.log('  Skipping PDF fetch (will use existing if available)')
      return
    }

    console.log(`  PDF asset: ${pdfAsset.name}`)

    // Ensure output directory exists
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })

    // Download PDF
    console.log(`  Downloading to ${path.relative(process.cwd(), OUTPUT_FILE)}...`)
    await downloadFile(pdfAsset.browser_download_url, OUTPUT_FILE)

    const stats = fs.statSync(OUTPUT_FILE)
    console.log(`  Downloaded: ${(stats.size / 1024).toFixed(1)} KB`)

    console.log()
    console.log('='.repeat(50))
    console.log('Resume PDF fetched successfully')
  } catch (error) {
    if (error instanceof Error && error.message === 'No releases found') {
      console.log('  No releases found yet')
      console.log('  Skipping PDF fetch (create a release to enable)')
    } else {
      console.error(`  Error: ${error}`)
      console.log('  Skipping PDF fetch')
    }
  }
}

main()
