
export interface Book {
    id: string;
    title: string;
    author: string;
    coverUrl?: string;
    totalPages: number;
    currentPage: number;
    currentPageCfi?: string;
    genre?: string;
    rating?: number;
    description?: string;
    language?: string;
    pagesRead?: number;
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
    rank: number;
}
