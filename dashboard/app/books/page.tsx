'use client';

import React, { useState } from 'react';
import { useBookSearch } from '../../hooks/useBookSearch';
import SearchBar from '../../components/Library/SearchBar';
import BookGrid from '../../components/Library/BookGrid';
import LoadingSkeleton from '../../components/Library/LoadingSkeleton';
import EmptyState from '../../components/Library/EmptyState';
import AddBookButton from '../../components/Library/AddBookButton';
import AddBookModal from '../../components/Library/AddBookModal';
import QuickViewModal from '../../components/Library/QuickViewModal';
import { Book } from '../../types';
import { useLanguage } from '@/context/LanguageContext';
import { useDownload } from '@/context/DownloadContext';

export default function BooksPage() {
    const { t } = useLanguage();
    const { downloadBook } = useDownload();
    const {
        searchQuery,
        filters,
        searchResults,
        isLoading,
        currentPage,
        totalResults,
        updateSearchQuery,
        updateFilters,
        resetFilters,
        setPage,
    } = useBookSearch();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [viewingBook, setViewingBook] = useState<Book | null>(null);

    const handleAddBook = async (bookId: string) => {
        const bookToAdd = searchResults.find(b => b.id === bookId);
        if (!bookToAdd) return;
        await downloadBook(bookToAdd);
    };

    const handleManualAdd = async (bookData: any) => {
        const newBook: Book = {
            ...bookData,
            currentPage: 0,
            coverUrl: bookData.coverUrl || ''
        };
        await downloadBook(newBook);
        setIsAddModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-cream-50 text-brown-900 font-sans">
            {/* Header / Hero */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-16 pb-10">
                <header className="mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-black text-brown-900 mb-4 leading-tight tracking-tight">
                        {t.library.explore_title}
                    </h1>
                    <p className="text-brown-800/60 text-lg md:text-2xl font-medium font-sans max-w-2xl">
                        {t.library.explore_desc}
                    </p>
                </header>

                {/* Search and Filters */}
                <div className="mb-8 md:mb-16">
                    <SearchBar
                        query={searchQuery}
                        onQueryChange={updateSearchQuery}
                        filters={filters}
                        onFilterChange={updateFilters}
                        onReset={resetFilters}
                        totalResults={totalResults}
                    />
                </div>

                {/* Content */}
                <main className="pb-32">
                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : searchResults.length > 0 ? (
                        <div className="space-y-16">
                            <BookGrid
                                books={searchResults}
                                onAdd={handleAddBook}
                                onPreview={setViewingBook}
                            />

                            {/* Pagination */}
                            {totalResults > 8 && (
                                <div className="flex flex-col md:flex-row justify-center items-center gap-3 mt-16 pb-12 font-sans">
                                    <div className="flex w-full md:w-auto justify-center gap-2">
                                        <button
                                            onClick={() => setPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className="h-12 px-6 rounded-xl bg-white border-2 border-cream-200 text-brown-900 font-bold disabled:opacity-30 hover:border-brown-900/20 transition-all active:scale-95 flex-1 md:flex-none"
                                        >
                                            {t.library.previous}
                                        </button>
                                        
                                        <button
                                            onClick={() => setPage(Math.min(Math.ceil(totalResults / 8), currentPage + 1))}
                                            disabled={currentPage === Math.ceil(totalResults / 8)}
                                            className="h-12 px-6 rounded-xl bg-white border-2 border-cream-200 text-brown-900 font-bold disabled:opacity-30 hover:border-brown-900/20 transition-all active:scale-95 flex-1 md:flex-none md:hidden"
                                        >
                                            {t.library.next}
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 overflow-x-auto max-w-full px-2">
                                        {Array.from({ length: Math.ceil(totalResults / 8) }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setPage(i + 1)}
                                                className={`flex-shrink-0 w-12 h-12 rounded-xl text-sm font-black transition-all border-2 ${currentPage === i + 1
                                                        ? 'bg-brown-900 border-brown-900 text-cream-50 shadow-lg scale-110'
                                                        : 'bg-white border-cream-200 text-brown-800/40 hover:border-brown-900/20 hover:text-brown-900'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setPage(Math.min(Math.ceil(totalResults / 8), currentPage + 1))}
                                        disabled={currentPage === Math.ceil(totalResults / 8)}
                                        className="hidden md:block h-12 px-6 rounded-xl bg-white border-2 border-cream-200 text-brown-900 font-bold disabled:opacity-30 hover:border-brown-900/20 transition-all active:scale-95"
                                    >
                                        {t.library.next}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <EmptyState onAddManual={() => setIsAddModalOpen(true)} />
                    )}
                </main>
            </div>

            {/* Modals */}
            <AddBookModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleManualAdd}
            />

            <QuickViewModal
                book={viewingBook}
                isOpen={!!viewingBook}
                onClose={() => setViewingBook(null)}
                onAdd={handleAddBook}
            />
        </div>
    );
}
