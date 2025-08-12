#!/usr/bin/env node

/**
 * Script to extract metadata from photo images and update info.json files
 * This extracts EXIF data including camera, lens, settings, and dimensions
 */

const fs = require('fs');
const path = require('path');
const exifr = require('exifr');

const CONTENT_PHOTOS_DIR = 'content/photos';

console.log('=== Extracting Photo Metadata ===\n');

// Get all photo folders
if (!fs.existsSync(CONTENT_PHOTOS_DIR)) {
  console.log(`✗ Content photos directory not found: ${CONTENT_PHOTOS_DIR}`);
  process.exit(1);
}

const photoFolders = fs.readdirSync(CONTENT_PHOTOS_DIR, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

console.log(`Found ${photoFolders.length} photo folders\n`);

let processedCount = 0;
let errorCount = 0;

async function extractMetadata(imagePath) {
  try {
    const exifData = await exifr.parse(imagePath, {
      pick: [
        'Make', 'Model', 'LensModel', 'LensInfo', 'FocalLength',
        'FNumber', 'ExposureTime', 'ISO', 'DateTime', 'DateTimeOriginal',
        'ImageWidth', 'ImageHeight', 'ExifImageWidth', 'ExifImageHeight',
        'Orientation', 'GPS'
      ]
    });
    
    return exifData;
  } catch (error) {
    console.log(`  ⚠ Could not extract EXIF data: ${error.message}`);
    return null;
  }
}

function formatExposureTime(exposureTime) {
  if (!exposureTime) return null;
  if (exposureTime >= 1) {
    return `${exposureTime}s`;
  } else {
    return `1/${Math.round(1 / exposureTime)}s`;
  }
}

function formatFocalLength(focalLength) {
  if (!focalLength) return null;
  return `${Math.round(focalLength)}mm`;
}

function formatAperture(fNumber) {
  if (!fNumber) return null;
  return `f/${fNumber}`;
}

function formatISO(iso) {
  if (!iso) return null;
  return `ISO ${iso}`;
}

function buildCameraString(make, model) {
  if (!make && !model) return null;
  if (make && model) {
    // Avoid duplication if model already contains make
    if (model.toLowerCase().includes(make.toLowerCase())) {
      return model;
    }
    return `${make} ${model}`;
  }
  return make || model;
}

function buildSettingsString(aperture, exposureTime, iso) {
  const parts = [aperture, exposureTime, iso].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : null;
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
    return;
  }
  
  const imagePath = path.join(folderPath, imageFile);
  
  // Extract metadata
  const exifData = await extractMetadata(imagePath);
  
  if (!exifData) {
    console.log(`  ⚠ No EXIF data available`);
    return;
  }
  
  // Read existing info.json
  let existingInfo = {};
  if (fs.existsSync(infoJsonPath)) {
    try {
      const content = fs.readFileSync(infoJsonPath, 'utf8');
      existingInfo = JSON.parse(content);
    } catch (error) {
      console.log(`  ⚠ Could not parse existing info.json: ${error.message}`);
    }
  }
  
  // Build metadata object
  const metadata = {};
  
  // Camera information
  const camera = buildCameraString(exifData.Make, exifData.Model);
  if (camera) metadata.camera = camera;
  
  // Lens information
  if (exifData.LensModel) {
    metadata.lens = exifData.LensModel;
  } else if (exifData.LensInfo && Array.isArray(exifData.LensInfo)) {
    // LensInfo is typically [minFocalLength, maxFocalLength, minAperture, maxAperture]
    const [minFL, maxFL, minAp, maxAp] = exifData.LensInfo;
    if (minFL && maxFL) {
      if (minFL === maxFL) {
        metadata.lens = `${minFL}mm`;
      } else {
        metadata.lens = `${minFL}-${maxFL}mm`;
      }
      if (minAp && maxAp) {
        if (minAp === maxAp) {
          metadata.lens += ` f/${minAp}`;
        } else {
          metadata.lens += ` f/${minAp}-${maxAp}`;
        }
      }
    }
  }
  
  // Camera settings
  const aperture = formatAperture(exifData.FNumber);
  const exposureTime = formatExposureTime(exifData.ExposureTime);
  const iso = formatISO(exifData.ISO);
  const settings = buildSettingsString(aperture, exposureTime, iso);
  if (settings) metadata.settings = settings;
  
  // Image dimensions
  const width = exifData.ExifImageWidth || exifData.ImageWidth;
  const height = exifData.ExifImageHeight || exifData.ImageHeight;
  if (width) metadata.naturalWidth = width;
  if (height) metadata.naturalHeight = height;
  
  // Orientation
  if (width && height) {
    metadata.orientation = width > height ? 'landscape' : 'portrait';
  }
  
  // Merge with existing info, preserving existing values unless they're empty
  const updatedInfo = { ...existingInfo };
  
  Object.keys(metadata).forEach(key => {
    if (!updatedInfo[key] || updatedInfo[key] === '') {
      updatedInfo[key] = metadata[key];
    }
  });
  
  // Write updated info.json
  try {
    fs.writeFileSync(infoJsonPath, JSON.stringify(updatedInfo, null, 2));
    console.log(`  ✓ Updated info.json with metadata`);
    
    // Log what was extracted
    const extractedFields = Object.keys(metadata);
    if (extractedFields.length > 0) {
      console.log(`  📋 Extracted: ${extractedFields.join(', ')}`);
    }
    
    processedCount++;
  } catch (error) {
    console.log(`  ✗ Failed to write info.json: ${error.message}`);
    errorCount++;
  }
  
  console.log('');
}

async function main() {
  for (const folder of photoFolders) {
    await processPhotoFolder(folder);
  }
  
  console.log('=== Metadata Extraction Complete ===');
  console.log(`✓ Successfully processed: ${processedCount} folders`);
  if (errorCount > 0) {
    console.log(`✗ Errors: ${errorCount}`);
    process.exit(1);
  } else {
    console.log('All metadata extracted successfully!');
  }
}

main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});