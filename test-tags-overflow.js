// Test script to verify PhotoCard tags no longer wrap to multiple lines
const fs = require('fs');

console.log('Testing PhotoCard tags overflow behavior...');

try {
  const photoCardPath = 'components/blog/PhotoCard.tsx';
  const photoCardContent = fs.readFileSync(photoCardPath, 'utf8');
  
  // Check if flex-wrap has been removed from tags section specifically
  const tagsSection = photoCardContent.substring(
    photoCardContent.indexOf('absolute bottom-4 left-4 right-4 z-10'),
    photoCardContent.indexOf('</div>', photoCardContent.indexOf('absolute bottom-4 left-4 right-4 z-10')) + 6
  );
  const noFlexWrapInTags = !tagsSection.includes('flex-wrap');
  console.log('✓ flex-wrap removed from tags section:', noFlexWrapInTags);
  
  // Check if overflow-hidden has been added to tag container
  const hasOverflowHidden = photoCardContent.includes('overflow-hidden');
  console.log('✓ overflow-hidden added:', hasOverflowHidden);
  
  // Check if flex-shrink-0 has been added to individual tags
  const hasFlexShrinkZero = photoCardContent.includes('flex-shrink-0');
  console.log('✓ flex-shrink-0 added to tags:', hasFlexShrinkZero);
  
  // Check that the container still uses flex layout
  const stillUsesFlex = photoCardContent.includes('className="flex gap-2 items-center overflow-hidden"');
  console.log('✓ Still uses flex layout with gap:', stillUsesFlex);
  
  // Verify the tag structure is intact
  const tagStructureIntact = photoCardContent.includes('tags.map((tag, index) => (') &&
                            photoCardContent.includes('formatTag(tag)');
  console.log('✓ Tag structure intact:', tagStructureIntact);
  
  console.log('\n--- Test Results ---');
  if (noFlexWrapInTags && hasOverflowHidden && hasFlexShrinkZero && stillUsesFlex && tagStructureIntact) {
    console.log('✅ All tests passed! Tags will now stay on a single line with hidden overflow');
    console.log('✅ Tags will not wrap to multiple lines anymore');
  } else {
    console.log('❌ Some tests failed. Please review the implementation.');
  }
  
} catch (error) {
  console.error('✗ Error reading PhotoCard component:', error.message);
}

console.log('\nTags overflow test completed!');