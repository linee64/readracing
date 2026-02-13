'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import { Book } from '@/types';
import { supabase } from '@/lib/supabase';
import ePub from 'epubjs';
import { set, get, del } from 'idb-keyval';
import { useLanguage } from '@/context/LanguageContext';

export default function LibraryPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [books, setBooks] = useState<Book[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
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

    // Sync library function
    const syncLibrary = async (silent = false) => {
        if (isSyncing) return;
        setIsSyncing(true);
        try {
            // 1. Load local books
            const localBooks = await get('readracing_library_v2') as Book[] || [];
            
            // 2. Sync with Supabase
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Fetch books from Supabase 'books' table
                const { data: remoteBooks, error } = await supabase
                    .from('books')
                    .select('*')
                    .eq('user_id', user.id);

                if (remoteBooks && !error) {
                    // Merge remote books with local books
                    const mergedBooks = mergeBooks(localBooks, remoteBooks);
                    setBooks(mergedBooks);
                    // Update local storage
                    await set('readracing_library_v2', mergedBooks);
                    
                    // Download missing book files in background
                    await downloadMissingBooks(mergedBooks);
                    
                    // Upload local-only books to Supabase (Sync Up)
                    await uploadMissingBooks(localBooks, remoteBooks, user.id);
                    
                    if (!silent) alert(t.my_books.sync_success);
                } else if (!silent && error) {
                    throw error;
                }
            } else if (!silent) {
                alert(t.my_books.login_required);
            }
        } catch (e: any) {
            console.error('Sync failed:', e);
            if (!silent) alert(`${t.my_books.sync_failed} ${e.message || e}`);
        } finally {
            setIsSyncing(false);
        }
    };

    // Load books from IndexedDB on mount
    useEffect(() => {
        const loadBooks = async () => {
            // Load local books immediately
            const localBooks = await get('readracing_library_v2') as Book[];
            if (localBooks) {
                setBooks(localBooks);
            }
            // Trigger silent sync
            await syncLibrary(true);
        };
        loadBooks();
    }, []);

    const uploadMissingBooks = async (local: Book[], remote: any[], userId: string) => {
        const remoteIds = new Set(remote.map(r => r.id));
        const missingInRemote = local.filter(b => !remoteIds.has(b.id));

        for (const book of missingInRemote) {
            try {
                console.log(`Syncing up book: ${book.title}`);
                const fileData = await get(book.id);
                if (fileData) {
                    const fileName = `${userId}/${book.id}.epub`;
                    const { error: uploadError } = await supabase.storage
                        .from('books')
                        .upload(fileName, fileData, { upsert: true });

                    if (!uploadError) {
                        const { data } = supabase.storage.from('books').getPublicUrl(fileName);
                        const publicUrl = data.publicUrl;

                        await supabase.from('books').insert({
                            id: book.id,
                            user_id: userId,
                            title: book.title,
                            author: book.author,
                            cover_url: book.coverUrl,
                            file_url: publicUrl,
                            total_pages: book.totalPages,
                            current_page: book.currentPage,
                            current_page_cfi: book.currentPageCfi,
                            last_read_at: new Date(book.lastReadAt || Date.now()).toISOString()
                        });
                        console.log(`Synced up: ${book.title}`);
                    }
                }
            } catch (e) {
                console.error(`Failed to sync up book ${book.title}`, e);
            }
        }
    };

    const mergeBooks = (local: Book[], remote: any[]): Book[] => {
        const map = new Map<string, Book>();
        
        // Add local books first
        local.forEach(b => map.set(b.id, b));
        
        // Merge remote books
        remote.forEach(r => {
            const existing = map.get(r.id);
            const remoteBook: Book = {
                id: r.id,
                title: r.title,
                author: r.author,
                coverUrl: r.cover_url,
                totalPages: r.total_pages,
                currentPage: r.current_page,
                currentPageCfi: r.current_page_cfi,
                lastReadAt: new Date(r.last_read_at).getTime(),
                epubUrl: r.file_url
            };

            if (!existing) {
                map.set(r.id, remoteBook);
            } else {
                // Update if remote is newer
                if ((remoteBook.lastReadAt || 0) > (existing.lastReadAt || 0)) {
                    map.set(r.id, { ...existing, ...remoteBook });
                }
            }
        });
        
        return Array.from(map.values());
    };

    const downloadMissingBooks = async (books: Book[]) => {
        for (const book of books) {
            // Check if file exists locally
            const fileData = await get(book.id);
            if (!fileData && book.epubUrl) {
                try {
                    console.log(`Downloading book: ${book.title}`);
                    const response = await fetch(book.epubUrl);
                    if (response.ok) {
                        const blob = await response.blob();
                        const arrayBuffer = await blob.arrayBuffer();
                        await set(book.id, arrayBuffer);
                        console.log(`Downloaded and saved: ${book.title}`);
                    }
                } catch (e) {
                    console.error(`Failed to download book ${book.title}`, e);
                }
            }
        }
    };

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
            // Also delete from Supabase if online
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from('books').delete().eq('id', id);
                await supabase.storage.from('books').remove([`${user.id}/${id}.epub`]);
            }
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

            // 2. Upload to Supabase Storage
            const { data: { user } } = await supabase.auth.getUser();
            let publicUrl = '';

            if (user) {
                const fileName = `${user.id}/${bookId}.epub`;
                const { error: uploadError } = await supabase.storage
                    .from('books')
                    .upload(fileName, file);
                
                if (!uploadError) {
                    const { data } = supabase.storage.from('books').getPublicUrl(fileName);
                    publicUrl = data.publicUrl;
                }
            }

            // 3. Create basic entry first so user sees SOMETHING
            const initialEntry: Book = {
                id: bookId,
                title: file.name.replace('.epub', ''),
                author: t.my_books.loading_author,
                totalPages: 0,
                currentPage: 0,
                coverUrl: '',
                lastReadAt: Date.now(), // Set initial timestamp
                epubUrl: publicUrl
            };
            
            setBooks(prev => [...prev, initialEntry]);

            // 4. Try to parse metadata in background
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

                // 5. Update the entry with real metadata
                const finalEntry: Book = {
                    ...initialEntry,
                    title: metadata.title || initialEntry.title,
                    author: metadata.creator || t.my_books.unknown_author,
                    coverUrl: coverUrl
                };

                // Update state and persistent storage
                setBooks(prev => {
                    const updated = prev.map(b => b.id === bookId ? finalEntry : b);
                    set('readracing_library_v2', updated);
                    return updated;
                });

                // Sync metadata to Supabase DB
                if (user && publicUrl) {
                    await supabase.from('books').insert({
                        id: bookId,
                        user_id: user.id,
                        title: finalEntry.title,
                        author: finalEntry.author,
                        cover_url: finalEntry.coverUrl,
                        file_url: publicUrl,
                        total_pages: finalEntry.totalPages,
                        current_page: 0,
                        last_read_at: new Date().toISOString()
                    });
                }

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
            alert(t.my_books.upload_failed);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="min-h-screen bg-cream-50">
            <div className="max-w-7xl mx-auto p-4 md:p-8 pb-20">
                <DashboardHeader username={username} />

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-brown-900 italic">{t.my_books.title}</h2>
                    <div className="flex gap-4 self-start md:self-auto w-full md:w-auto">
                        <button
                            onClick={() => syncLibrary(false)}
                            disabled={isSyncing}
                            className="bg-cream-200 text-brown-900 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-cream-300 transition-colors disabled:opacity-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isSyncing ? "animate-spin" : ""}>
                                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                                <path d="M16 16h5v5" />
                            </svg>
                            {isSyncing ? t.my_books.syncing : t.my_books.sync}
                        </button>

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
                            className="w-full md:w-auto justify-center bg-brown-900 text-cream-50 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-brown-800 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                        >
                            {isUploading ? (
                                <span className="animate-spin">⏳</span>
                            ) : (
                                <span>📁</span>
                            )}
                            {isUploading ? t.my_books.uploading : t.my_books.upload_epub}
                        </button>
                    </div>
                </div>

                {books.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 md:p-20 text-center border-2 border-dashed border-cream-300">
                        <div className="text-4xl md:text-6xl mb-4 opacity-20">📚</div>
                        <h3 className="text-lg md:text-xl font-serif font-semibold text-brown-900/50">{t.my_books.empty_title}</h3>
                        <p className="text-sm md:text-base text-brown-800/40 mt-2">{t.my_books.empty_desc}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {books.map((book) => (
                            <div
                                key={book.id}
                                onClick={() => router.push(`/reader/${book.id}`)}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200 hover:shadow-md transition-shadow group relative flex flex-col cursor-pointer"
                            >
                                <div className="flex gap-4">
                                    <div className="w-20 h-28 bg-cream-100 rounded-lg flex-shrink-0 overflow-hidden shadow-sm">
                                        {book.coverUrl ? (
                                            <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl">📖</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-brown-900 truncate mb-1">{book.title}</h3>
                                        <p className="text-sm text-brown-600 truncate mb-2">{book.author}</p>
                                        <div className="text-xs text-brown-400">
                                            {Math.round((book.currentPage / (book.totalPages || 1)) * 100)}% {t.my_books.complete}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm(t.my_books.confirm_delete)) {
                                            handleDeleteBook(book.id);
                                        }
                                    }}
                                    className="absolute top-2 right-2 p-2 text-brown-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18" />
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}