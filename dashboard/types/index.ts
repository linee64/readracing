
export interface Book {
    id: string;
    title: string;
    author: string;
    coverUrl?: string;
    epubUrl?: string; // URL to download the EPUB file
    totalPages: number;
    currentPage: number;
    currentPageCfi?: string;
    genre?: string;
    rating?: number;
    description?: string;
    language?: string;
    pagesRead?: number;
    lastReadAt?: number; // Timestamp of last read/interaction
}

export interface BookSearchFilters {
    genre: string;
    language: string;
}

export interface BookSearchState {
    searchQuery: string;
    filters: BookSearchFilters;
    searchResults: Book[];
    isLoading: boolean;
    currentPage: number;
    totalResults: number;
}

export interface User {
    id: string;
    name: string;
    avatarUrl?: string;
    isPro: boolean;
}

export interface Highlight {
    id: string;
    text: string;
    bookTitle: string;
    page: number;
}

export interface LeaderboardEntry {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    booksCount: number;
    pagesCount: number;
    rank: number;
}
