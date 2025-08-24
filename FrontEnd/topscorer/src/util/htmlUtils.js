// Utility functions for safely handling HTML content

/**
 * Safely renders HTML content by decoding HTML entities and cleaning the content
 * @param {string} htmlContent - The HTML content to render
 * @returns {string} - Cleaned HTML content
 */
export const sanitizeHtml = (htmlContent) => {
  if (!htmlContent) return '';
  
  // Decode common HTML entities
  const decodedContent = htmlContent
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&copy;/g, '©')
    .replace(/&reg;/g, '®')
    .replace(/&trade;/g, '™');

  return decodedContent;
};

/**
 * Creates a safe HTML object for React's dangerouslySetInnerHTML
 * @param {string} htmlContent - The HTML content to render
 * @returns {object} - Object with __html property for React
 */
export const createSafeHtml = (htmlContent) => {
  const sanitizedContent = sanitizeHtml(htmlContent);
  return { __html: sanitizedContent };
};

/**
 * Strips HTML tags to get plain text content
 * @param {string} htmlContent - The HTML content
 * @returns {string} - Plain text without HTML tags
 */
export const stripHtmlTags = (htmlContent) => {
  if (!htmlContent) return '';
  
  // Remove HTML tags but keep line breaks
  return htmlContent
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .trim();
};

/**
 * Truncates HTML content to a specified length while preserving HTML structure
 * @param {string} htmlContent - The HTML content
 * @param {number} maxLength - Maximum length in characters
 * @returns {string} - Truncated HTML content
 */
export const truncateHtml = (htmlContent, maxLength = 150) => {
  if (!htmlContent) return '';
  
  const plainText = stripHtmlTags(htmlContent);
  
  if (plainText.length <= maxLength) {
    return htmlContent;
  }
  
  // Truncate plain text and add ellipsis
  const truncatedText = plainText.substring(0, maxLength) + '...';
  return truncatedText;
};
