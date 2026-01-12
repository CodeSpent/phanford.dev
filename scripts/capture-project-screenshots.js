#!/usr/bin/env node

/**
 * Script to capture screenshots of project websites
 * Reads websiteUrl from project MDX frontmatter and captures screenshots
 * using capture-website-cli with a configurable delay for animated sites.
 *
 * Usage:
 *   node scripts/capture-project-screenshots.js           # Capture all projects
 *   node scripts/capture-project-screenshots.js takepoint # Capture specific project
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { execSync } = require('child_process');

const PROJECTS_DIR = 'content/projects';
const OUTPUT_DIR = 'public/images/projects';
const DEFAULT_DELAY = 20; // 20 seconds for animations
const VIEWPORT_WIDTH = 1920;
const VIEWPORT_HEIGHT = 1080;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

console.log('=== Capturing Project Screenshots ===\n');

/**
 * Parse all project MDX files for websiteUrl
 */
function getProjectsWithUrls() {
  const projects = [];

  if (!fs.existsSync(PROJECTS_DIR)) {
    console.log(`Project directory not found: ${PROJECTS_DIR}`);
    process.exit(1);
  }

  const projectFolders = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const folder of projectFolders) {
    const mdxPath = path.join(PROJECTS_DIR, folder, 'index.mdx');
    if (!fs.existsSync(mdxPath)) continue;

    const content = fs.readFileSync(mdxPath, 'utf8');
    const { data: frontmatter } = matter(content);

    if (frontmatter.websiteUrl) {
      projects.push({
        slug: folder,
        url: frontmatter.websiteUrl,
        title: frontmatter.title || folder
      });
    }
  }

  return projects;
}

/**
 * Sleep helper for retry delays
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Update the MDX frontmatter with the new screenshot path
 */
function updateProjectMdx(project, screenshotPath) {
  const mdxPath = path.join(PROJECTS_DIR, project.slug, 'index.mdx');
  const imagePath = `/images/projects/${project.slug}-screenshot.png`;

  if (!fs.existsSync(mdxPath)) {
    console.log(`  MDX file not found: ${mdxPath}`);
    return false;
  }

  try {
    const fileContent = fs.readFileSync(mdxPath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);

    // Update screenshots array - replace with single auto-generated screenshot
    frontmatter.screenshots = [imagePath];

    // Update screenshotLink if it exists, or create it
    frontmatter.screenshotLink = {
      image: imagePath,
      url: project.url,
      alt: `${project.title} Screenshot`
    };

    // Reconstruct the file with updated frontmatter
    const updatedFile = matter.stringify(content, frontmatter);
    fs.writeFileSync(mdxPath, updatedFile);

    console.log(`  Updated MDX frontmatter with screenshot path`);
    return true;
  } catch (error) {
    console.log(`  Failed to update MDX: ${error.message}`);
    return false;
  }
}

/**
 * Capture a single screenshot with retry logic
 */
async function captureScreenshot(project, attempt = 1) {
  const outputPath = path.join(OUTPUT_DIR, `${project.slug}-screenshot.png`);

  console.log(`Capturing: ${project.title}`);
  console.log(`  URL: ${project.url}`);
  console.log(`  Output: ${outputPath}`);
  console.log(`  Delay: ${DEFAULT_DELAY}s, Viewport: ${VIEWPORT_WIDTH}x${VIEWPORT_HEIGHT}`);

  try {
    execSync(
      `capture-website "${project.url}" ` +
      `--output="${outputPath}" ` +
      `--width=${VIEWPORT_WIDTH} ` +
      `--height=${VIEWPORT_HEIGHT} ` +
      `--delay=${DEFAULT_DELAY} ` +
      `--type=png ` +
      `--overwrite`,
      { stdio: 'inherit' }
    );

    console.log(`  Saved successfully`);

    // Update MDX frontmatter with new screenshot path
    updateProjectMdx(project, outputPath);

    console.log('');
    return { success: true, project };
  } catch (error) {
    console.log(`  Attempt ${attempt}/${MAX_RETRIES} failed: ${error.message}`);

    if (attempt < MAX_RETRIES) {
      console.log(`  Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await sleep(RETRY_DELAY_MS);
      return captureScreenshot(project, attempt + 1);
    }

    console.log(`  Failed after ${MAX_RETRIES} attempts\n`);
    return { success: false, project, error: error.message };
  }
}

async function main() {
  const targetSlug = process.argv[2];

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let projects = getProjectsWithUrls();

  if (targetSlug) {
    projects = projects.filter(p => p.slug === targetSlug);
    if (projects.length === 0) {
      console.error(`No project found with slug: ${targetSlug}`);
      process.exit(1);
    }
  }

  console.log(`Found ${projects.length} project(s) with websiteUrl\n`);

  if (projects.length === 0) {
    console.log('No projects to capture.');
    process.exit(0);
  }

  const results = [];
  for (const project of projects) {
    results.push(await captureScreenshot(project));
  }

  const succeeded = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log('=== Capture Complete ===');
  console.log(`Succeeded: ${succeeded}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    console.log('\nFailed projects:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.project.title} (${r.project.url})`);
    });
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
