/**
 * Formats a tag with smart casing that preserves existing uppercase letters
 * while still formatting lowercase tags properly
 * @param tag - The raw tag string (e.g., "web-development", "OBS", "ATDocs")
 * @returns The formatted tag string (e.g., "Web Development", "OBS", "ATDocs")
 */
export function formatTag(tag: string): string {
  if (!tag || typeof tag !== 'string') {
    return tag;
  }
  
  // Common acronyms that should be all uppercase
  const knownAcronyms = new Set([
    'obs', 'api', 'html', 'css', 'js', 'ts', 'ui', 'ux', 'ai', 'ml', 'sql',
    'http', 'https', 'url', 'uri', 'json', 'xml', 'csv', 'pdf', 'gif', 'jpg',
    'png', 'svg', 'cdn', 'dns', 'ssl', 'tls', 'ssh', 'ftp', 'tcp', 'udp',
    'aws', 'gcp', 'linux', 'unix', 'gui', 'cli', 'ide'
  ]);
  
  // Replace hyphens with spaces
  const withSpaces = tag.replace(/-/g, ' ');
  
  // Split into words to handle each separately
  const words = withSpaces.split(' ');
  
  return words.map(word => {
    if (!word) return word;
    
    const lowerWord = word.toLowerCase();
    
    // If it's a known acronym, make it uppercase
    if (knownAcronyms.has(lowerWord)) {
      return word.toUpperCase();
    }
    
    // If the word has any uppercase letters, preserve the original casing
    if (/[A-Z]/.test(word)) {
      return word;
    }
    
    // If the word is all lowercase, apply sentence case
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}

/**
 * Formats an array of tags
 * @param tags - Array of raw tag strings
 * @returns Array of formatted tag strings
 */
export function formatTags(tags: string[]): string[] {
  if (!Array.isArray(tags)) {
    return tags;
  }
  
  return tags.map(formatTag);
}