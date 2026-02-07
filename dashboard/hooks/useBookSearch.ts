import { useState, useEffect, useCallback } from 'react';
import { Book, BookSearchFilters, BookSearchState } from '../types';

const MOCK_BOOKS: Book[] = [
    {
        id: '1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=280&h=420&auto=format&fit=crop',
        totalPages: 180,
        currentPage: 0,
        genre: 'Classic',
        language: 'English',
        rating: 4.5,
        description: 'The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
    },
    {
        id: '2',
        title: '1984',
        author: 'George Orwell',
        coverUrl: 'https://images.unsplash.com/photo-1543005128-d39eef402c83?q=80&w=280&h=420&auto=format&fit=crop',
        totalPages: 328,
        currentPage: 0,
        genre: 'Sci-Fi',
        language: 'English',
        rating: 4.8,
        description: 'A dystopian social science fiction novel and cautionary tale about ubiquitous government surveillance.',
    },
    {
        id: '3',
        title: 'Crime and Punishment',
        author: 'Fyodor Dostoevsky',
        coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=280&h=420&auto=format&fit=crop',
        totalPages: 672,
        currentPage: 0,
        genre: 'Classic',
        language: 'Russian',
        rating: 4.9,
        description: "A profound exploration of Rodion Raskolnikov's mental anguish and moral dilemmas after committing a crime.",
    },
    {
        id: '4',
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        coverUrl: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?q=80&w=280&h=420&auto=format&fit=crop',
        totalPages: 310,
        currentPage: 0,
        genre: 'Fantasy',
        language: 'English',
        rating: 4.7,
        description: 'The adventures of Bilbo Baggins as he journeys to the Lonely Mountain.',
    },
    ...Array.from({ length: 24 }).map((_, i) => ({
        id: `mock-${i + 5}`,
        title: `Book Discovery ${i + 5}`,
        author: `Author ${i + 5}`,
        coverUrl: `https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=280&h=420&auto=format&fit=crop`,
        totalPages: 250,
        currentPage: 0,
        genre: i % 2 === 0 ? 'Classic' : 'Modern Prose',
        language: i % 3 === 0 ? 'Russian' : 'English',
        rating: Number((4.0 + (i % 10) / 10).toFixed(1)),
        description: 'Detailed description of this interesting book that you should definitely read.',
    }))
];

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
        setState(prev => ({ ...prev, isLoading: true }));

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 600));

        let filtered = MOCK_BOOKS.filter(book => {
            const matchesQuery = book.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                (book.genre && book.genre.toLowerCase().includes(state.searchQuery.toLowerCase()));

            const matchesGenre = state.filters.genre === 'All' || book.genre === state.filters.genre;
            const matchesLanguage = state.filters.language === 'All' || book.language === state.filters.language;

            return matchesQuery && matchesGenre && matchesLanguage;
        });

        const itemsPerPage = 8;
        const totalResults = filtered.length;
        const startIndex = (state.currentPage - 1) * itemsPerPage;
        const pagedResults = filtered.slice(startIndex, startIndex + itemsPerPage);

        setState(prev => ({
            ...prev,
            searchResults: pagedResults,
            totalResults,
            isLoading: false,
        }));
    }, [state.searchQuery, state.filters, state.currentPage]);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchBooks();
        }, 300);

        return () => clearTimeout(handler);
    }, [fetchBooks]);

    return {
        ...state,
        updateSearchQuery,
        updateFilters,
        resetFilters,
        setPage,
    };
};
