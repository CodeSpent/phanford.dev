#!/usr/bin/env node

/**
 * Script to copy photo images from content/photos folders to public/images/photos
 * This ensures the images are available for Next.js to serve
 */

const fs = require('fs');
const path = require('path');

const CONTENT_PHOTOS_DIR = 'content/photos';
const PUBLIC_PHOTOS_DIR = 'public/images/photos';

console.log('=== Copying Photo Images ===\n');

// Ensure public photos directory exists
if (!fs.existsSync(PUBLIC_PHOTOS_DIR)) {
  fs.mkdirSync(PUBLIC_PHOTOS_DIR, { recursive: true });
  console.log(`✓ Created directory: ${PUBLIC_PHOTOS_DIR}`);
}

// Get all photo folders
if (!fs.existsSync(CONTENT_PHOTOS_DIR)) {
  console.log(`✗ Content photos directory not found: ${CONTENT_PHOTOS_DIR}`);
  process.exit(1);
}

const photoFolders = fs.readdirSync(CONTENT_PHOTOS_DIR, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

console.log(`Found ${photoFolders.length} photo folders\n`);

let copiedCount = 0;
let errorCount = 0;

photoFolders.forEach(folder => {
  const sourceFolderPath = path.join(CONTENT_PHOTOS_DIR, folder);
  const targetFolderPath = path.join(PUBLIC_PHOTOS_DIR, folder);
  
  console.log(`Processing folder: ${folder}`);
  
  // Create target folder if it doesn't exist
  if (!fs.existsSync(targetFolderPath)) {
    fs.mkdirSync(targetFolderPath, { recursive: true });
  }
  
  try {
    const files = fs.readdirSync(sourceFolderPath);
    const imageFiles = files.filter(file => 
      /^image\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
    
    if (imageFiles.length === 0) {
      console.log(`  ⚠ No image files found`);
      return;
    }
    
    imageFiles.forEach(imageFile => {
      const sourcePath = path.join(sourceFolderPath, imageFile);
      const targetPath = path.join(targetFolderPath, imageFile);
      
      try {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`  ✓ Copied: ${imageFile}`);
        copiedCount++;
      } catch (error) {
        console.log(`  ✗ Failed to copy ${imageFile}: ${error.message}`);
        errorCount++;
      }
    });
    
  } catch (error) {
    console.log(`  ✗ Error reading folder: ${error.message}`);
    errorCount++;
  }
  
  console.log('');
});

console.log('=== Copy Complete ===');
console.log(`✓ Successfully copied: ${copiedCount} files`);
if (errorCount > 0) {
  console.log(`✗ Errors: ${errorCount}`);
  process.exit(1);
} else {
  console.log('All images copied successfully!');
}