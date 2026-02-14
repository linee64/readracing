export const API_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  GUTENBERG_BASE_URL: 'https://www.gutenberg.org',
  STANDARD_EBOOKS_BASE_URL: 'https://standardebooks.org',
  // Note: Project Gutenberg does not provide a public JSON API for individual books.
  // The provided URLs in books.json point to the book landing pages.
  // For metadata, we might need to parse HTML or use a third-party API like Gutendex.
  // For this implementation, we will assume we can fetch the provided URL.
  
  // CORS configuration note:
  // If running in a browser environment, requests to these domains will likely fail due to CORS.
  // These requests should ideally be made from a server-side environment (Node.js/Next.js API Route).
  HEADERS: {
    'User-Agent': 'ReadRacing/1.0 (Educational Project)',
    'Accept': 'application/json, text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8'
  }
};
