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

    const handleAddBook = async (bookId: string) => {
        const bookToAdd = searchResults.find(b => b.id === bookId);
        if (!bookToAdd) return;

        try {
            const { get, set } = await import('idb-keyval');
            const currentLibrary = await get('readracing_library_v2') as Book[] || [];
            
            if (currentLibrary.some(b => b.id === bookId)) {
                setToast({ message: 'Book already in library', visible: true });
                return;
            }

            // If the book has an epubUrl, download it and save to IndexedDB
            if (bookToAdd.epubUrl) {
                setToast({ message: 'Downloading book...', visible: true });
                
                let arrayBuffer: ArrayBuffer | null = null;
                const isLocal = bookToAdd.epubUrl.startsWith('/');

                try {
                    if (isLocal) {
                        // For local files, fetch directly and don't use proxies
                        const response = await fetch(bookToAdd.epubUrl);
                        if (response.ok) {
                            arrayBuffer = await response.arrayBuffer();
                        } else {
                            console.error(`Local book file not found at ${bookToAdd.epubUrl}. Please add it to public/books/`);
                            setToast({ message: '❌ Local file not found in public/books/', visible: true });
                            return;
                        }
                    } else {
                        // For external URLs, use the proxy rotation system
                        const proxies = [
                            (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
                            (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
                            (url: string) => `https://thingproxy.freeboard.io/fetch/${url}`,
                        ];

                        // Try direct fetch first (some servers might have CORS enabled)
                        try {
                            const response = await fetch(bookToAdd.epubUrl!, { signal: AbortSignal.timeout(10000) });
                            if (response.ok) {
                                arrayBuffer = await response.arrayBuffer();
                            }
                        } catch (e) {
                            console.log('Direct fetch failed, trying proxies...');
                        }

                        if (!arrayBuffer) {
                            for (const getProxyUrl of proxies) {
                                try {
                                    const targetUrl = getProxyUrl(bookToAdd.epubUrl!);
                                    console.log(`Trying proxy: ${targetUrl}`);
                                    const response = await fetch(targetUrl, { signal: AbortSignal.timeout(45000) }); // Increased to 45s for proxies
                                    if (response.ok) {
                                        arrayBuffer = await response.arrayBuffer();
                                        if (arrayBuffer && arrayBuffer.byteLength > 0) {
                                            console.log('Download successful via proxy');
                                            break;
                                        }
                                    }
                                } catch (e) { 
                                    console.warn(`Proxy failed:`, e);
                                    continue; 
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error('Download process failed:', e);
                }

                if (arrayBuffer && arrayBuffer.byteLength > 0) {
                    try {
                        // Save the EPUB file to IndexedDB using the book's ID
                        await set(bookId, arrayBuffer);
                        
                        const bookWithEpub: Book = {
                            ...bookToAdd,
                            id: bookId 
                        };
                        
                        await set('readracing_library_v2', [...currentLibrary, bookWithEpub]);
                        setToast({ message: '✓ Downloaded and added to My Books!', visible: true });
                    } catch (err) {
                        console.error('Failed to save EPUB to IDB:', err);
                        setToast({ message: '❌ Error saving file', visible: true });
                        return;
                    }
                } else {
                    setToast({ message: '❌ Download failed. Try again later.', visible: true });
                    return;
                }
            } else {
                // Regular mock book without EPUB (shouldn't happen with our new list)
                await set('readracing_library_v2', [...currentLibrary, bookToAdd]);
                setToast({ message: 'Added to My Books!', visible: true });
            }
            
            setTimeout(() => setToast(null), 3000);
        } catch (err) {
            console.error('Failed to add book:', err);
        }
    };

    const showToast = (message: string) => {
        setToast({ message, visible: true });
        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    const handleManualAdd = async (bookData: any) => {
        try {
            const { get, set } = await import('idb-keyval');
            const currentLibrary = await get('readracing_library_v2') as Book[] || [];
            
            const newBook: Book = {
                ...bookData,
                currentPage: 0,
                coverUrl: bookData.coverUrl || ''
            };

            await set('readracing_library_v2', [...currentLibrary, newBook]);
            showToast('✓ Book created and added to library');
        } catch (err) {
            console.error('Failed to add manual book:', err);
            showToast('❌ Failed to add book');
        }
    };

    return (
        <div className="min-h-screen bg-cream-50 text-brown-900 font-sans">
            {/* Header / Hero */}
            <div className="max-w-7xl mx-auto px-8 pt-16 pb-10">
                <header className="mb-12">
                    <h1 className="text-5xl md:text-6xl font-serif font-black text-brown-900 mb-4 leading-tight tracking-tight">
                        Explore Your Next Great Read
                    </h1>
                    <p className="text-brown-800/60 text-2xl font-medium font-sans max-w-2xl">
                        Discover a world of stories, knowledge, and inspiration. Your next favorite book is just a search away.
                    </p>
                </header>

                {/* Search and Filters */}
                <div className="mb-16">
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
                                <div className="flex justify-center items-center gap-3 mt-16 pb-12 font-sans">
                                    <button
                                        onClick={() => setPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="h-12 px-6 rounded-xl bg-white border-2 border-cream-200 text-brown-900 font-bold disabled:opacity-30 hover:border-brown-900/20 transition-all active:scale-95"
                                    >
                                        Previous
                                    </button>

                                    <div className="flex items-center gap-2">
                                        {Array.from({ length: Math.ceil(totalResults / 8) }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setPage(i + 1)}
                                                className={`w-12 h-12 rounded-xl text-sm font-black transition-all border-2 ${currentPage === i + 1
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
                                        className="h-12 px-6 rounded-xl bg-white border-2 border-cream-200 text-brown-900 font-bold disabled:opacity-30 hover:border-brown-900/20 transition-all active:scale-95"
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
