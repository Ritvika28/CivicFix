// Common English stop words
const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "he", "in",
  "is", "it", "its", "of", "on", "that", "the", "to", "was", "were", "will", "with"
]);

/**
 * Normalizes text by removing punctuation, converting to lower case, and filtering stop words.
 * @param {string} text 
 * @returns {Set<string>} token set
 */
export function tokenizeText(text) {
  if (!text) return new Set();
  
  const tokens = text
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOP_WORDS.has(token));
    
  return new Set(tokens);
}

/**
 * Calculates Jaccard similarity index [0.0 to 1.0] between two text descriptions.
 * @param {string} textA 
 * @param {string} textB 
 * @returns {number} similarity score
 */
export function calculateTextSimilarity(textA, textB) {
  const setA = tokenizeText(textA);
  const setB = tokenizeText(textB);

  if (setA.size === 0 || setB.size === 0) return 0;

  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);

  return Number((intersection.size / union.size).toFixed(2));
}
