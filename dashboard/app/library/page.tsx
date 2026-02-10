'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import { Book } from '@/types';
import { supabase } from '@/lib/supabase';
import ePub from 'epubjs';
import { set, get, del } from 'idb-keyval';

export default function LibraryPage() {
    const router = useRouter();
    const [books, setBooks] = useState<Book[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [username, setUsername] = useState<string>('Reader');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get current user for header
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Reader';
                setUsername(name);
            }
        });

        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Reader';
                setUsername(name);
            }
        };
        getUser();

        return () => subscription.unsubscribe();
    }, []);

    // Load books from IndexedDB on mount
    useEffect(() => {
        const loadBooks = async () => {
            // Try IndexedDB first
            const savedBooks = await get('readracing_library_v2') as Book[];
            if (savedBooks) {
                setBooks(savedBooks);
                repairCovers(savedBooks);
            } else {
                // Fallback to old localStorage and migrate
                const oldBooks = localStorage.getItem('readracing_library');
                if (oldBooks) {
                    try {
                        const parsed = JSON.parse(oldBooks);
                        setBooks(parsed);
                        // Save to IndexedDB for future
                        await set('readracing_library_v2', parsed);
                        repairCovers(parsed);
                    } catch (e) {
                        console.error('Failed to parse books from localStorage', e);
                    }
                }
            }
        };
        loadBooks();
    }, []);

    const repairCovers = async (currentBooks: Book[]) => {
        let needsUpdate = false;
        const updatedBooks = await Promise.all(currentBooks.map(async (book) => {
            // If cover is missing or is an expired blob URL
            if (!book.coverUrl || book.coverUrl.startsWith('blob:')) {
                if (book.id.startsWith('epub-')) {
                    try {
                        const arrayBuffer = await get(book.id);
                        if (arrayBuffer) {
                            const epub = ePub(arrayBuffer);
                            // Add a timeout to epub.coverUrl()
                            const coverPath = await Promise.race([
                                epub.coverUrl(),
                                new Promise<null>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
                            ]) as string | null;

                            if (coverPath) {
                                const response = await fetch(coverPath);
                                if (response.ok) {
                                    const blob = await response.blob();
                                    const base64 = await new Promise<string>((resolve) => {
                                        const reader = new FileReader();
                                        reader.onloadend = () => resolve(reader.result as string);
                                        reader.readAsDataURL(blob);
                                    });
                                    needsUpdate = true;
                                    return { ...book, coverUrl: base64 };
                                }
                            }
                        }
                    } catch (e) {
                        console.error(`Failed to repair cover for ${book.title}:`, e);
                    }
                }
            }
            return book;
        }));

        if (needsUpdate) {
            saveBooks(updatedBooks);
        }
    };

    // Save books to IndexedDB whenever they change
    const saveBooks = async (updatedBooks: Book[]) => {
        setBooks(updatedBooks);
        await set('readracing_library_v2', updatedBooks);
    };

    const handleDeleteBook = async (id: string) => {
        const updatedBooks = books.filter(b => b.id !== id);
        await saveBooks(updatedBooks);
        if (id.startsWith('epub-')) {
            await del(id);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const bookId = `epub-${Date.now()}`;

        try {
            const arrayBuffer = await file.arrayBuffer();
            
            // 1. First, save the file to IndexedDB immediately
            // This ensures the file is there even if parsing fails
            await set(bookId, arrayBuffer);
            console.log('File saved to IndexedDB');

            // 2. Create basic entry first so user sees SOMETHING
            const initialEntry: Book = {
                id: bookId,
                title: file.name.replace('.epub', ''),
                author: 'Loading...',
                totalPages: 0,
                currentPage: 0,
                coverUrl: ''
            };
            
            setBooks(prev => [...prev, initialEntry]);

            // 3. Try to parse metadata in background
            try {
                const book = ePub(arrayBuffer);
                
                await Promise.race([
                    book.ready,
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 15000))
                ]);

                const metadata = await book.loaded.metadata;
                
                // Extract cover
                let coverUrl = '';
                try {
                    const coverPath = await Promise.race([
                        book.coverUrl(),
                        new Promise<null>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
                    ]) as string | null;

                    if (coverPath) {
                        const response = await fetch(coverPath);
                        if (response.ok) {
                            const blob = await response.blob();
                            coverUrl = await new Promise((resolve) => {
                                const reader = new FileReader();
                                reader.onloadend = () => resolve(reader.result as string);
                                reader.readAsDataURL(blob);
                            });
                        }
                    }
                } catch (coverErr) {
                    console.warn('Cover extraction failed, continuing without cover', coverErr);
                }

                // 4. Update the entry with real metadata
                const finalEntry: Book = {
                    ...initialEntry,
                    title: metadata.title || initialEntry.title,
                    author: metadata.creator || 'Unknown Author',
                    coverUrl: coverUrl
                };

                // Update state and persistent storage
                setBooks(prev => {
                    const updated = prev.map(b => b.id === bookId ? finalEntry : b);
                    set('readracing_library_v2', updated);
                    return updated;
                });

                // Cleanup epubjs object
                try { book.destroy(); } catch(e) {}

            } catch (parseErr) {
                console.error('Metadata parsing failed, ensuring basic entry is saved', parseErr);
                // The initialEntry is already in the 'books' state from step 2.
                // We just need to make sure the persistent storage is updated.
                setBooks(prev => {
                    set('readracing_library_v2', prev);
                    return prev;
                });
            }

        } catch (error) {
            console.error('Critical upload error:', error);
            alert('Failed to upload file. Please try again.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="min-h-screen bg-cream-50">
            <div className="max-w-7xl mx-auto p-8 pb-20">
                <DashboardHeader username={username} />

                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-serif font-bold text-brown-900 italic">My Library</h2>
                    <div className="flex gap-4">
                        <input
                            type="file"
                            accept=".epub"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="bg-brown-900 text-cream-50 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-brown-800 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                        >
                            {isUploading ? (
                                <span className="animate-spin">⏳</span>
                            ) : (
                                <span>📁</span>
                            )}
                            {isUploading ? 'Uploading...' : 'Upload EPUB'}
                        </button>
                    </div>
                </div>

                {books.length === 0 ? (
                    <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-cream-300">
                        <div className="text-6xl mb-4 opacity-20">📚</div>
                        <h3 className="text-xl font-serif font-semibold text-brown-900/50">Your library is empty</h3>
                        <p className="text-brown-800/40 mt-2">Start your journey by adding your first book!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {books.map((book) => (
                            <div
                                key={book.id}
                                onClick={() => router.push(`/reader/${book.id}`)}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200 hover:shadow-md transition-shadow group relative flex flex-col cursor-pointer"
                            >
                                <div className="aspect-[2/3] bg-cream-100 rounded-xl mb-4 flex items-center justify-center shadow-inner border border-cream-200 overflow-hidden relative">
                                    <span className="absolute text-4xl opacity-20 group-hover:scale-110 transition-transform duration-500">📖</span>
                                    {book.coverUrl && (
                                        <img
                                            src={book.coverUrl}
                                            alt={book.title}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            crossOrigin="anonymous"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-brown-900/10 to-transparent pointer-events-none"></div>
                                </div>
                                <h3 className="text-lg font-serif font-bold text-brown-900 truncate">{book.title}</h3>
                                <p className="text-sm text-brown-800/60 font-medium truncate mb-4">by {book.author}</p>

                                <div className="mt-auto">
                                    <div className="w-full bg-cream-100 rounded-full h-2 border border-cream-200 overflow-hidden">
                                        <div
                                            className="bg-brown-900 h-full rounded-full transition-all duration-500"
                                            style={{ width: `${book.totalPages > 0 ? (book.currentPage / book.totalPages) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between mt-2 text-[10px] font-black text-brown-800/40 uppercase tracking-widest">
                                        <span>{book.currentPage} / {book.totalPages || '?'} pages</span>
                                        <span>{book.totalPages > 0 ? Math.round((book.currentPage / book.totalPages) * 100) : 0}%</span>
                                    </div>

                                    <div className="mt-4 w-full bg-brown-900 text-cream-50 py-2 rounded-xl font-bold text-center block hover:bg-brown-800 transition-colors">
                                        Read Book
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteBook(book.id);
                                    }}
                                    className="absolute top-4 right-4 w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 z-10"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
