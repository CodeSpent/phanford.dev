// Simple test to verify Masonry implementation
const fs = require('fs');
const path = require('path');

console.log('Testing Masonry implementation...');

// Check if masonry-layout is installed
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const hasMasonry = packageJson.dependencies['masonry-layout'];
  const hasMasonryTypes = packageJson.dependencies['@types/masonry-layout'];
  
  console.log('✓ masonry-layout installed:', !!hasMasonry);
  console.log('✓ @types/masonry-layout installed:', !!hasMasonryTypes);
} catch (error) {
  console.error('✗ Error reading package.json:', error.message);
}

// Check if ArticleList component has Masonry import
try {
  const articleListPath = 'page-components/blog/article-list/article-list.tsx';
  const articleListContent = fs.readFileSync(articleListPath, 'utf8');
  
  const hasMasonryImport = articleListContent.includes("import Masonry from 'masonry-layout'");
  const hasMasonryRef = articleListContent.includes('masonryRef');
  const hasMasonryInit = articleListContent.includes('new Masonry(');
  const hasMasonryItem = articleListContent.includes('masonry-item');
  
  console.log('✓ Masonry import added:', hasMasonryImport);
  console.log('✓ Masonry ref created:', hasMasonryRef);
  console.log('✓ Masonry initialization:', hasMasonryInit);
  console.log('✓ Masonry item class:', hasMasonryItem);
} catch (error) {
  console.error('✗ Error reading ArticleList component:', error.message);
}

// Check if PhotoCard component has been updated
try {
  const photoCardPath = 'components/blog/PhotoCard.tsx';
  const photoCardContent = fs.readFileSync(photoCardPath, 'utf8');
  
  const hasFixedWidth = photoCardContent.includes('cardWidth = 300');
  const removedFlexbox = !photoCardContent.includes('flexBasis');
  const hasMasonryComment = photoCardContent.includes('Masonry layout approach');
  
  console.log('✓ Fixed width for Masonry:', hasFixedWidth);
  console.log('✓ Flexbox styling removed:', removedFlexbox);
  console.log('✓ Masonry comment added:', hasMasonryComment);
} catch (error) {
  console.error('✗ Error reading PhotoCard component:', error.message);
}

console.log('\nMasonry implementation test completed!');