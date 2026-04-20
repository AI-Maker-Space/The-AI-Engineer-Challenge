/**
 * Formats message content to safely display text with proper line breaks
 * and escaped HTML characters
 */
export function formatMessage(content: string): string {
  if (!content) return "";

  // First, escape HTML to prevent XSS
  const escapeHtml = (text: string): string => {
    const map: { [key: string]: string } = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  };

  // Escape HTML
  let formatted = escapeHtml(content);

  // Split by double line breaks to create paragraphs
  const paragraphs = formatted.split(/\n\s*\n/);

  // Process each paragraph
  const processedParagraphs = paragraphs
    .map((para) => {
      // Replace single line breaks within paragraphs with <br>
      const withBreaks = para.trim().replace(/\n/g, "<br>");
      return withBreaks;
    })
    .filter((para) => para.length > 0);

  // Wrap paragraphs in <p> tags
  if (processedParagraphs.length > 1) {
    return processedParagraphs.map((p) => `<p>${p}</p>`).join("");
  } else if (processedParagraphs.length === 1) {
    // If single paragraph, check if it has line breaks
    if (processedParagraphs[0].includes("<br>")) {
      return `<p>${processedParagraphs[0]}</p>`;
    }
    return processedParagraphs[0];
  }

  return formatted;
}
