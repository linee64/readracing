import { useState, useEffect, useCallback } from 'react';
import { Book, BookSearchFilters, BookSearchState } from '../types';
import booksData from '../data/books.json';

// Helper to map genre keys from JSON to UI genres
const mapGenre = (jsonGenre: string): string => {
    const mapping: Record<string, string> = {
        'classics': 'Classic',
        'romance': 'Romance',
        'detective': 'Detectives',
        'scifi': 'Fantasy', // Mapping Sci-Fi to Fantasy as closest existing category
        'fantasy': 'Fantasy'
    };
    return mapping[jsonGenre] || 'Classic';
};

// Transform books.json data into Book[]
const getAllBooks = (): Book[] => {
    const allBooks: Book[] = [];
    
    // Iterate through genre keys in books.json
    Object.entries(booksData).forEach(([jsonGenreKey, books]) => {
        const uiGenre = mapGenre(jsonGenreKey);
        
        books.forEach((book: any) => {
            // Determine language based on title or source
            let language = 'Russian';
            if (book.title.includes('(English)') || book.source === 'standardebooks') {
                language = 'English';
            }

            allBooks.push({
                id: book.id,
                title: book.title,
                author: book.author,
                coverUrl: book.coverUrl,
                epubUrl: book.epubUrl,
                totalPages: book.totalPages || 300,
                currentPage: 0,
                genre: uiGenre,
                language: language,
                rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5 and 5.0
                description: book.description || `A classic ${uiGenre.toLowerCase()} novel by ${book.author}.`,
            });
        });
    });
    
    return allBooks;
};

const ALL_BOOKS: Book[] = getAllBooks();

export const useBookSearch = () => {
    const [state, setState] = useState<BookSearchState>({
        searchQuery: '',
        filters: {
            genre: 'All',
            language: 'All',
        },
        searchResults: [],
        isLoading: false,
        currentPage: 1,
        totalResults: 0,
    });

    const updateSearchQuery = (query: string) => {
        setState(prev => ({ ...prev, searchQuery: query, currentPage: 1 }));
    };

    const updateFilters = (filters: Partial<BookSearchFilters>) => {
        setState(prev => ({
            ...prev,
            filters: { ...prev.filters, ...filters },
            currentPage: 1
        }));
    };

    const resetFilters = () => {
        setState(prev => ({
            ...prev,
            filters: { genre: 'All', language: 'All' },
            currentPage: 1
        }));
    };

    const setPage = (page: number) => {
        setState(prev => ({ ...prev, currentPage: page }));
    };

    const fetchBooks = useCallback(async () => {
        // Set loading state immediately
        setState(prev => ({ ...prev, isLoading: true }));

        // Simulate network delay for realistic feel
        await new Promise(resolve => setTimeout(resolve, 300));

        let filtered = ALL_BOOKS.filter(book => {
            const matchesQuery = book.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                (book.genre && book.genre.toLowerCase().includes(state.searchQuery.toLowerCase()));

            const matchesGenre = state.filters.genre === 'All' || book.genre === state.filters.genre;
            const matchesLanguage = state.filters.language === 'All' || book.language === state.filters.language;

            return matchesQuery && matchesGenre && matchesLanguage;
        });

        const itemsPerPage = 8;
        const totalResults = filtered.length;
        const totalPages = Math.ceil(totalResults / itemsPerPage);
        
        // Adjust current page if it exceeds total pages (e.g. after filtering)
        const safePage = Math.max(1, Math.min(state.currentPage, totalPages || 1));
        
        const startIndex = (safePage - 1) * itemsPerPage;
        const pagedResults = filtered.slice(startIndex, startIndex + itemsPerPage);

        setState(prev => ({
            ...prev,
            searchResults: pagedResults,
            totalResults,
            currentPage: safePage,
            isLoading: false,
        }));
    }, [state.searchQuery, state.filters, state.currentPage]);

    // Use effect to trigger fetch when dependencies change
    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    return {
        ...state,
        updateSearchQuery,
        updateFilters,
        resetFilters,
        setPage,
    };
};
