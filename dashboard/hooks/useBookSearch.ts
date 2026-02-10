import { useState, useEffect, useCallback } from 'react';
import { Book, BookSearchFilters, BookSearchState } from '../types';

const MOCK_BOOKS: Book[] = [
    // --- CLASSICS ---
    {
        id: 'epub-classic-1',
        title: 'Преступление и наказание',
        author: 'Федор Достоевский',
        coverUrl: 'https://covers.openlibrary.org/b/id/12643562-L.jpg',
        epubUrl: 'https://www.gutenberg.org/ebooks/25439.epub.images',
        totalPages: 672,
        currentPage: 0,
        genre: 'Classic',
        language: 'Russian',
        rating: 4.9,
        description: 'Глубокое философское исследование моральных дилемм Родиона Раскольникова.',
    },
    {
        id: 'epub-classic-2',
        title: 'Война и мир',
        author: 'Лев Толстой',
        coverUrl: 'https://covers.openlibrary.org/b/id/12818862-L.jpg',
        epubUrl: 'https://www.gutenberg.org/ebooks/21461.epub.images',
        totalPages: 1225,
        currentPage: 0,
        genre: 'Classic',
        language: 'Russian',
        rating: 4.8,
        description: 'Эпический роман о русском обществе в эпоху Наполеоновских войн.',
    },
    {
        id: 'epub-classic-3',
        title: 'Анна Каренина',
        author: 'Лев Толстой',
        coverUrl: 'https://covers.openlibrary.org/b/id/12061245-L.jpg',
        epubUrl: 'https://www.gutenberg.org/ebooks/13177.epub.images',
        totalPages: 864,
        currentPage: 0,
        genre: 'Classic',
        language: 'Russian',
        rating: 4.7,
        description: 'Трагическая история любви и измены в высшем обществе России XIX века.',
    },
    {
        id: 'epub-classic-4',
        title: 'Идиот',
        author: 'Федор Достоевский',
        coverUrl: 'https://covers.openlibrary.org/b/id/12643570-L.jpg',
        epubUrl: 'https://www.gutenberg.org/ebooks/23412.epub.images',
        totalPages: 640,
        currentPage: 0,
        genre: 'Classic',
        language: 'Russian',
        rating: 4.8,
        description: 'История "совершенно прекрасного человека", князя Мышкина.',
    },

    // --- ROMANCE ---
    {
        id: 'epub-romance-1',
        title: 'Евгений Онегин',
        author: 'Александр Пушкин',
        coverUrl: 'https://covers.openlibrary.org/b/id/12833144-L.jpg',
        epubUrl: 'https://www.gutenberg.org/ebooks/23685.epub.images',
        totalPages: 250,
        currentPage: 0,
        genre: 'Romance',
        language: 'Russian',
        rating: 4.9,
        description: 'Роман в стихах, "энциклопедия русской жизни" и трагическая история любви.',
    },
    {
        id: 'epub-romance-2',
        title: 'Герой нашего времени',
        author: 'Михаил Лермонтов',
        coverUrl: 'https://covers.openlibrary.org/b/id/12643660-L.jpg',
        epubUrl: 'https://www.gutenberg.org/ebooks/25624.epub.images',
        totalPages: 220,
        currentPage: 0,
        genre: 'Romance',
        language: 'Russian',
        rating: 4.8,
        description: 'История Печорина, "лишнего человека", и его поисков смысла в любви и приключениях.',
    },
    {
        id: 'epub-romance-3',
        title: 'Капитанская дочка',
        author: 'Александр Пушкин',
        coverUrl: 'https://covers.openlibrary.org/b/id/12833150-L.jpg',
        epubUrl: 'https://www.gutenberg.org/ebooks/40161.epub.images',
        totalPages: 180,
        currentPage: 0,
        genre: 'Romance',
        language: 'Russian',
        rating: 4.7,
        description: 'Исторический роман о восстании Пугачева и преданной любви Петра Гринева и Маши Мироновой.',
    },
    {
        id: 'epub-romance-4',
        title: 'Отцы и дети',
        author: 'Иван Тургенев',
        coverUrl: 'https://covers.openlibrary.org/b/id/12643670-L.jpg',
        epubUrl: 'https://www.gutenberg.org/ebooks/26182.epub.images',
        totalPages: 280,
        currentPage: 0,
        genre: 'Romance',
        language: 'Russian',
        rating: 4.6,
        description: 'Знаменитый роман о конфликте поколений и философских исканиях Базарова.',
    },

    // --- MYSTERY (Detectives) ---
    {
        id: 'epub-mystery-1',
        title: 'Пиковая дама',
        author: 'Александр Пушкин',
        coverUrl: 'https://covers.openlibrary.org/b/id/12833160-L.jpg',
        epubUrl: 'https://www.gutenberg.org/ebooks/30554.epub.images',
        totalPages: 100,
        currentPage: 0,
        genre: 'Detectives',
        language: 'Russian',
        rating: 4.9,
        description: 'Мистическая повесть о роковой тайне трех карт и безумии Германна.',
    },
    {
        id: 'epub-mystery-2',
        title: 'Записки из подполья',
        author: 'Федор Достоевский',
        coverUrl: 'https://covers.openlibrary.org/b/id/12643680-L.jpg',
        epubUrl: 'https://www.gutenberg.org/ebooks/25440.epub.images',
        totalPages: 150,
        currentPage: 0,
        genre: 'Detectives',
        language: 'Russian',
        rating: 4.7,
        description: 'Психологическое исследование темных сторон человеческой души.',
    },
    {
        id: 'epub-mystery-3',
        title: 'Мертвые души',
        author: 'Николай Гоголь',
        coverUrl: 'https://covers.openlibrary.org/b/id/12643690-L.jpg',
        epubUrl: 'https://www.gutenberg.org/ebooks/26031.epub.images',
        totalPages: 400,
        currentPage: 0,
        genre: 'Detectives',
        language: 'Russian',
        rating: 4.8,
        description: 'Авантюрная история Чичикова, скупающего "мертвые души" крепостных крестьян.',
    },
    {
        id: 'epub-mystery-4',
        title: 'Шерлок Холмс (English)',
        author: 'Arthur Conan Doyle',
        coverUrl: 'https://covers.openlibrary.org/b/id/12643620-L.jpg',
        epubUrl: 'https://www.gutenberg.org/ebooks/1661.epub.images',
        totalPages: 320,
        currentPage: 0,
        genre: 'Detectives',
        language: 'English',
        rating: 4.9,
        description: 'Классический детектив на английском для практики языка (MVP).',
    },

    // --- FANTASY ---
    {
        id: 'epub-fantasy-1',
        title: 'Вечера на хуторе близ Диканьки',
        author: 'Николай Гоголь',
        coverUrl: 'https://covers.openlibrary.org/b/id/12643700-L.jpg',
        epubUrl: 'https://www.gutenberg.org/ebooks/26030.epub.images',
        totalPages: 350,
        currentPage: 0,
        genre: 'Fantasy',
        language: 'Russian',
        rating: 4.9,
        description: 'Волшебные и пугающие истории, пропитанные малороссийским фольклором.',
    },
    {
        id: 'epub-fantasy-2',
        title: 'Тарас Бульба',
        author: 'Николай Гоголь',
        coverUrl: 'https://covers.openlibrary.org/b/id/12643710-L.jpg',
        epubUrl: 'https://www.gutenberg.org/ebooks/35508.epub.images',
        totalPages: 200,
        currentPage: 0,
        genre: 'Fantasy',
        language: 'Russian',
        rating: 4.8,
        description: 'Героическая эпопея о казачестве, чести и верности.',
    },
    {
        id: 'epub-fantasy-3',
        title: 'Alice in Wonderland (English)',
        author: 'Lewis Carroll',
        coverUrl: 'https://covers.openlibrary.org/b/id/12718200-L.jpg',
        epubUrl: 'https://www.gutenberg.org/ebooks/11.epub.images',
        totalPages: 150,
        currentPage: 0,
        genre: 'Fantasy',
        language: 'English',
        rating: 4.9,
        description: 'Классическое фэнтези на английском для практики (MVP).',
    },
    {
        id: 'epub-fantasy-4',
        title: 'Frankenstein (English)',
        author: 'Mary Shelley',
        coverUrl: 'https://covers.openlibrary.org/b/id/12718230-L.jpg',
        epubUrl: 'https://www.gutenberg.org/ebooks/84.epub.images',
        totalPages: 250,
        currentPage: 0,
        genre: 'Fantasy',
        language: 'English',
        rating: 4.8,
        description: 'Основоположник научной фантастики на английском (MVP).',
    },
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
