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

export default function BooksPage() {
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
    const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null);

    const showToast = (message: string) => {
        setToast({ message, visible: true });
        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    const handleAddBook = (id: string) => {
        showToast('✓ Book added to your library');
    };

    const handleManualAdd = (bookData: any) => {
        showToast('✓ Book created and added to library');
    };

    return (
        <div className="min-h-screen bg-[#F5F1E8] text-[#2C2416] font-sans">
            {/* Header / Hero */}
            <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
                <header className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3D2817] mb-2 leading-tight">
                        Welcome back, Alex!
                    </h1>
                    <p className="text-[#8B7E6A] text-xl font-medium font-sans">
                        Discover your next great read
                    </p>
                </header>

                {/* Search and Filters */}
                <div className="mb-12">
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
                <main className="pb-24">
                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : searchResults.length > 0 ? (
                        <div className="space-y-12">
                            <BookGrid
                                books={searchResults}
                                onAdd={handleAddBook}
                                onPreview={setViewingBook}
                            />

                            {/* Pagination */}
                            {totalResults > 8 && (
                                <div className="flex justify-center items-center gap-2 mt-12 pb-12 font-sans">
                                    <button
                                        onClick={() => setPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="h-10 px-4 rounded-lg bg-white border border-[#E5DCC8] text-[#3D2817] disabled:opacity-50 hover:bg-[#F5F1E8] transition-colors"
                                    >
                                        Previous
                                    </button>

                                    {Array.from({ length: Math.ceil(totalResults / 8) }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPage(i + 1)}
                                            className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${currentPage === i + 1
                                                    ? 'bg-[#3D2817] text-white'
                                                    : 'bg-white border border-[#E5DCC8] text-[#8B7E6A] hover:bg-[#F5F1E8]'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setPage(Math.min(Math.ceil(totalResults / 8), currentPage + 1))}
                                        disabled={currentPage === Math.ceil(totalResults / 8)}
                                        className="h-10 px-4 rounded-lg bg-white border border-[#E5DCC8] text-[#3D2817] disabled:opacity-50 hover:bg-[#F5F1E8] transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <EmptyState onAddManual={() => setIsAddModalOpen(true)} />
                    )}
                </main>
            </div>

            {/* Floating Button */}
            <AddBookButton onClick={() => setIsAddModalOpen(true)} />

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

            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 bg-[#2D7A4F] text-white px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-top duration-300 font-sans">
                    <span className="font-semibold">{toast.message}</span>
                    <button
                        onClick={() => setToast(null)}
                        className="text-white/80 hover:text-white text-sm font-bold ml-4 border-l border-white/20 pl-4"
                    >
                        Undo
                    </button>
                </div>
            )}
        </div>
    );
}
