#!/usr/bin/env node

/**
 * Script to generate blur placeholder data URLs for photo images
 * This creates base64-encoded blur data URLs for progressive image loading
 */

const fs = require('fs');
const path = require('path');

const CONTENT_PHOTOS_DIR = 'content/photos';

let processedCount = 0;
let errorCount = 0;
let skippedCount = 0;

async function generateBlurPlaceholder(imagePath) {
  try {
    // Dynamic import for ESM module
    const { getPlaiceholder } = await import('plaiceholder');
    const imageBuffer = fs.readFileSync(imagePath);
    const { base64 } = await getPlaiceholder(imageBuffer, { size: 10 });
    return base64;
  } catch (error) {
    console.log(`  ⚠ Could not generate blur placeholder: ${error.message}`);
    return null;
  }
}

async function processPhotoFolder(folder) {
  const folderPath = path.join(CONTENT_PHOTOS_DIR, folder);
  const infoJsonPath = path.join(folderPath, 'info.json');

  console.log(`Processing folder: ${folder}`);

  // Find image file
  const files = fs.readdirSync(folderPath);
  const imageFile = files.find(file =>
    /^image\.(jpg|jpeg|png|gif|webp)$/i.test(file)
  );

  if (!imageFile) {
    console.log(`  ⚠ No image file found`);
    skippedCount++;
    return;
  }

  const imagePath = path.join(folderPath, imageFile);

  // Read existing info.json
  let existingInfo = {};
  if (fs.existsSync(infoJsonPath)) {
    try {
      const content = fs.readFileSync(infoJsonPath, 'utf8');
      existingInfo = JSON.parse(content);
    } catch (error) {
      console.log(`  ⚠ Could not parse existing info.json: ${error.message}`);
      errorCount++;
      return;
    }
  } else {
    console.log(`  ⚠ No info.json found, skipping`);
    skippedCount++;
    return;
  }

  // Generate blur placeholder
  const blurDataUrl = await generateBlurPlaceholder(imagePath);

  if (!blurDataUrl) {
    console.log(`  ⚠ Failed to generate blur placeholder`);
    errorCount++;
    return;
  }

  // Update info.json with blurDataUrl
  const updatedInfo = { ...existingInfo, blurDataUrl };

  try {
    fs.writeFileSync(infoJsonPath, JSON.stringify(updatedInfo, null, 2));
    console.log(`  ✓ Generated blur placeholder (${blurDataUrl.length} chars)`);
    processedCount++;
  } catch (error) {
    console.log(`  ✗ Failed to write info.json: ${error.message}`);
    errorCount++;
  }

  console.log('');
}

async function main() {
  console.log('=== Generating Blur Placeholders ===\n');

  // Check directory exists
  if (!fs.existsSync(CONTENT_PHOTOS_DIR)) {
    console.log(`✗ Content photos directory not found: ${CONTENT_PHOTOS_DIR}`);
    process.exit(1);
  }

  // Get all photo folders
  const photoFolders = fs.readdirSync(CONTENT_PHOTOS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  console.log(`Found ${photoFolders.length} photo folders\n`);

  for (const folder of photoFolders) {
    await processPhotoFolder(folder);
  }

  console.log('=== Blur Placeholder Generation Complete ===');
  console.log(`✓ Successfully processed: ${processedCount} folders`);
  if (skippedCount > 0) {
    console.log(`⊘ Skipped: ${skippedCount} folders`);
  }
  if (errorCount > 0) {
    console.log(`✗ Errors: ${errorCount}`);
    process.exit(1);
  } else {
    console.log('All blur placeholders generated successfully!');
  }
}

main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
