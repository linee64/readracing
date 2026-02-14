import booksData from '../data/books.json';
import { API_CONFIG } from '../config/apiConfig';
import { Book } from '../types';

// Interface for the raw data from books.json
interface JsonBook {
  id: string;
  title: string;
  author: string;
  genre: string;
  gutenbergId?: string;
  epubUrl: string;
  apiUrl: string;
  coverUrl?: string;
  totalPages?: number;
  source?: string;
}

interface BooksData {
  [key: string]: JsonBook[];
}

const typedBooksData: BooksData = booksData as unknown as BooksData;

/**
 * Helper to convert JsonBook to application Book type
 */
const mapJsonBookToBook = (jsonBook: JsonBook): Book => ({
  id: jsonBook.id,
  title: jsonBook.title,
  author: jsonBook.author,
  coverUrl: jsonBook.coverUrl,
  epubUrl: jsonBook.epubUrl,
  totalPages: jsonBook.totalPages || 0,
  currentPage: 0,
  genre: jsonBook.genre,
  description: `A classic book from ${jsonBook.source === 'standardebooks' ? 'Standard Ebooks' : 'Project Gutenberg'}.`,
  language: 'ru', // Assuming Russian based on titles
});

/**
 * Helper function to introduce a delay
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Helper function to perform fetch with retry logic
 */
async function fetchWithRetry(url: string, options: RequestInit = {}, retries = API_CONFIG.RETRIES): Promise<Response> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...API_CONFIG.HEADERS,
        ...options.headers,
      }
    });

    if (!response.ok) {
      // Throw error for non-2xx responses to trigger retry
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Request failed for ${url}. Retrying... (${retries} attempts left)`);
      await delay(API_CONFIG.RETRY_DELAY);
      return fetchWithRetry(url, options, retries - 1);
    } else {
      console.error(`Request failed for ${url} after multiple attempts:`, error);
      throw error;
    }
  }
}

/**
 * Service for handling book-related operations
 */
export const bookService = {
  /**
   * Get all books from all categories
   */
  getAllBooks: (): Book[] => {
    try {
      const allJsonBooks = Object.values(typedBooksData).flat();
      return allJsonBooks.map(mapJsonBookToBook);
    } catch (error) {
      console.error('Error getting all books:', error);
      return [];
    }
  },

  /**
   * Get books by genre (category key in JSON)
   */
  getBooksByGenre: (genre: string): Book[] => {
    try {
      const allBooks = bookService.getAllBooks();
      return allBooks.filter(book => book.genre?.toLowerCase() === genre.toLowerCase());
    } catch (error) {
      console.error(`Error getting books by genre ${genre}:`, error);
      return [];
    }
  },

  /**
   * Get a book by its ID
   */
  getBookById: (id: string): Book | undefined => {
    try {
      const allBooks = bookService.getAllBooks();
      return allBooks.find(book => book.id === id);
    } catch (error) {
      console.error(`Error getting book by id ${id}:`, error);
      return undefined;
    }
  },

  /**
   * Download EPUB file from the provided URL
   * Returns an ArrayBuffer
   */
  downloadEpub: async (epubUrl: string): Promise<ArrayBuffer | null> => {
    try {
      console.log(`Starting download for EPUB: ${epubUrl}`);
      const response = await fetchWithRetry(epubUrl);
      const buffer = await response.arrayBuffer();
      console.log(`Successfully downloaded EPUB: ${epubUrl}`);
      return buffer;
    } catch (error) {
      console.error(`Failed to download EPUB from ${epubUrl}:`, error);
      throw error;
    }
  },

  /**
   * Get book metadata from the API URL
   */
  getBookMetadata: async (apiUrl: string): Promise<any> => {
    try {
      console.log(`Fetching metadata from: ${apiUrl}`);
      const response = await fetchWithRetry(apiUrl);
      
      // Check content type to decide how to parse
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data;
      } else {
        // Fallback for HTML/XML or other formats
        const text = await response.text();
        return { raw: text, type: contentType };
      }
    } catch (error) {
      console.error(`Failed to fetch metadata from ${apiUrl}:`, error);
      throw error;
    }
  }
};
