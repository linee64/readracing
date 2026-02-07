
export interface Book {
    id: string;
    title: string;
    author: string;
    coverUrl?: string;
    totalPages: number;
    currentPage: number;
    currentPageCfi?: string;
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
