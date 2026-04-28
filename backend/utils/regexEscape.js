/**
 * Utility to escape special regex characters
 * Prevents regex errors with skills like C++, C#, Node.js, etc.
 */

/**
 * Escape all special regex characters in a string
 * This allows safe use of any string in RegExp without syntax errors
 * 
 * Special characters to escape: * + ? . ^ $ ( ) [ ] { } | \
 * 
 * @param {string} str - The string to escape
 * @returns {string} - The escaped string safe for use in RegExp
 */
function escapeRegex(str) {
  if (!str || typeof str !== 'string') {
    return '';
  }
  
  // Escape all special regex characters
  return str.replace(/[.*+?^$()[\]{}|\\]/g, '\\$&');
}

/**
 * Create a safe word-boundary regex from a string
 * Automatically escapes special characters
 * 
 * @param {string} str - The string to match (e.g., "C++", "Node.js")
 * @param {string} flags - Regex flags (default: 'gi' for global, case-insensitive)
 * @returns {RegExp} - A safe RegExp with word boundaries
 */
function createSafeWordBoundaryRegex(str, flags = 'gi') {
  if (!str || typeof str !== 'string') {
    return /$^/; // Return never-matching regex
  }
  
  const escaped = escapeRegex(str);
  return new RegExp(`\\b${escaped}\\b`, flags);
}

/**
 * Test if a regex is valid
 * @param {RegExp} regex - The regex to test
 * @returns {boolean} - true if valid, false otherwise
 */
function isValidRegex(regex) {
  try {
    // Try to use the regex to test a string
    if (!regex || !(regex instanceof RegExp)) {
      return false;
    }
    regex.test('');
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = {
  escapeRegex,
  createSafeWordBoundaryRegex,
  isValidRegex
};
