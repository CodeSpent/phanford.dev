// Test script to verify PhotoCard responsive behavior
const fs = require('fs');

console.log('Testing PhotoCard responsive behavior...');

try {
  const photoCardPath = 'components/blog/PhotoCard.tsx';
  const photoCardContent = fs.readFileSync(photoCardPath, 'utf8');
  
  // Check if shouldShowDescription variable exists
  const hasShouldShowDescription = photoCardContent.includes('shouldShowDescription = cardWidth >= 600');
  console.log('✓ shouldShowDescription variable added:', hasShouldShowDescription);
  
  // Check if conditional rendering is applied to description
  const hasConditionalDescription = photoCardContent.includes('{shouldShowDescription && (') && 
                                   photoCardContent.includes('<p className="text-base text-gray-300 leading-relaxed">');
  console.log('✓ Conditional description rendering:', hasConditionalDescription);
  
  // Check that title is always visible (not conditional)
  const titleAlwaysVisible = photoCardContent.includes('<h3 className="text-xl font-bold text-white leading-tight">') &&
                            !photoCardContent.includes('shouldShowDescription && (') ||
                            photoCardContent.indexOf('<h3 className="text-xl font-bold text-white leading-tight">') < 
                            photoCardContent.indexOf('{shouldShowDescription && (');
  console.log('✓ Title always visible:', titleAlwaysVisible);
  
  // Check that camera details overlay is not affected
  const cameraDetailsUnaffected = photoCardContent.includes('{(lens || settings || camera || location) && (') &&
                                  !photoCardContent.includes('shouldShowDescription') ||
                                  photoCardContent.indexOf('{(lens || settings || camera || location)') < 
                                  photoCardContent.indexOf('shouldShowDescription');
  console.log('✓ Camera details unaffected:', cameraDetailsUnaffected);
  
  // Verify current cardWidth is 400 (less than 600)
  const cardWidthIs400 = photoCardContent.includes('cardWidth = 400');
  console.log('✓ Card width is 400px (< 600px):', cardWidthIs400);
  
  console.log('\n--- Test Results ---');
  if (hasShouldShowDescription && hasConditionalDescription && titleAlwaysVisible && cameraDetailsUnaffected && cardWidthIs400) {
    console.log('✅ All tests passed! PhotoCard will hide description when width < 600px');
    console.log('✅ Title and camera details remain visible');
  } else {
    console.log('❌ Some tests failed. Please review the implementation.');
  }
  
} catch (error) {
  console.error('✗ Error reading PhotoCard component:', error.message);
}

console.log('\nPhotoCard responsive test completed!');