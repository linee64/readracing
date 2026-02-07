'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import { Book } from '@/types';
import ePub from 'epubjs';
import { set, get, del } from 'idb-keyval';

export default function LibraryPage() {
    const router = useRouter();
    const [books, setBooks] = useState<Book[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [newBook, setNewBook] = useState({ title: '', author: '', totalPages: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                            const coverPath = await epub.coverUrl();
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

    const handleAddBook = async (e: React.FormEvent) => {
        e.preventDefault();
        const book: Book = {
            id: Date.now().toString(),
            title: newBook.title,
            author: newBook.author,
            totalPages: parseInt(newBook.totalPages) || 0,
            currentPage: 0,
        };
        const updatedBooks = [...books, book];
        await saveBooks(updatedBooks);
        setIsModalOpen(false);
        setNewBook({ title: '', author: '', totalPages: '' });
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
        try {
            const arrayBuffer = await file.arrayBuffer();
            const book = ePub(arrayBuffer);
            const metadata = await book.loaded.metadata;

            // Extract cover if possible
            let coverUrl = '';
            try {
                const coverPath = await book.coverUrl();
                if (coverPath) {
                    // Try to get the blob and convert to base64
                    const response = await fetch(coverPath);
                    if (response.ok) {
                        const blob = await response.blob();
                        coverUrl = await new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result as string);
                            reader.onerror = reject;
                            reader.readAsDataURL(blob);
                        });
                        console.log('Cover converted to base64');
                    }
                }
            } catch (e) {
                console.error('Error extracting cover:', e);
            }

            const bookId = `epub-${Date.now()}`;

            // Store file in IndexedDB
            await set(bookId, arrayBuffer);

            const newBookEntry: Book = {
                id: bookId,
                title: metadata.title || file.name.replace('.epub', ''),
                author: metadata.creator || 'Unknown Author',
                totalPages: 0, // Will be calculated during reading
                currentPage: 0,
                coverUrl: coverUrl
            };

            const updatedBooks = [...books, newBookEntry];
            await saveBooks(updatedBooks);

        } catch (error) {
            console.error('Error parsing EPUB:', error);
            alert('Failed to parse EPUB file');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="min-h-screen bg-cream-50">
            <div className="max-w-7xl mx-auto p-8 pb-20">
                <DashboardHeader username="Alex" />

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
                            className="bg-green-700 text-cream-50 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-green-800 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                        >
                            {isUploading ? (
                                <span className="animate-spin">⏳</span>
                            ) : (
                                <span>📁</span>
                            )}
                            {isUploading ? 'Uploading...' : 'Upload EPUB'}
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-brown-900 text-cream-50 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-brown-800 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center gap-2"
                        >
                            <span>+</span> Add New Book
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
                                onClick={() => book.id.startsWith('epub-') && router.push(`/reader/${book.id}`)}
                                className={`bg-white rounded-2xl p-6 shadow-sm border border-cream-200 hover:shadow-md transition-shadow group relative flex flex-col ${book.id.startsWith('epub-') ? 'cursor-pointer' : ''}`}
                            >
                                <div className="aspect-[2/3] bg-cream-100 rounded-xl mb-4 flex items-center justify-center shadow-inner border border-cream-200 overflow-hidden relative">
                                    <span className="absolute text-4xl opacity-20 group-hover:scale-110 transition-transform duration-500">📖</span>
                                    {book.coverUrl && (
                                        <img
                                            src={book.coverUrl}
                                            alt={book.title}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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

                                    {book.id.startsWith('epub-') && (
                                        <div className="mt-4 w-full bg-brown-900 text-cream-50 py-2 rounded-xl font-bold text-center block hover:bg-brown-800 transition-colors">
                                            Read Book
                                        </div>
                                    )}
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

                {/* Add Book Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-brown-900/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                        <div className="bg-cream-50 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-cream-200">
                            <h3 className="text-2xl font-serif font-bold text-brown-900 mb-6 italic">Add New Book</h3>
                            <form onSubmit={handleAddBook} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black text-brown-800/40 uppercase tracking-widest mb-1 ml-1">Title</label>
                                    <input
                                        required
                                        type="text"
                                        value={newBook.title}
                                        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                                        className="w-full bg-white border border-cream-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brown-900/20 text-brown-900 font-medium"
                                        placeholder="e.g. The Great Gatsby"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-brown-800/40 uppercase tracking-widest mb-1 ml-1">Author</label>
                                    <input
                                        required
                                        type="text"
                                        value={newBook.author}
                                        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                                        className="w-full bg-white border border-cream-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brown-900/20 text-brown-900 font-medium"
                                        placeholder="e.g. F. Scott Fitzgerald"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-brown-800/40 uppercase tracking-widest mb-1 ml-1">Total Pages</label>
                                    <input
                                        required
                                        type="number"
                                        value={newBook.totalPages}
                                        onChange={(e) => setNewBook({ ...newBook, totalPages: e.target.value })}
                                        className="w-full bg-white border border-cream-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brown-900/20 text-brown-900 font-medium"
                                        placeholder="e.g. 320"
                                    />
                                </div>
                                <div className="flex gap-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-6 py-3 rounded-xl font-bold text-brown-900 border-2 border-brown-900 hover:bg-cream-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 rounded-xl font-bold bg-brown-900 text-cream-50 hover:bg-brown-800 shadow-lg transition-colors"
                                    >
                                        Add Book
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
