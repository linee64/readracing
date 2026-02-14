'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { get } from 'idb-keyval';
import { Book } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface Highlight {
    id: string;
    quote: string;
    book_title: string;
    page_number: number;
    color: string;
    created_at: string;
}

interface LocalHighlight {
    cfiRange: string;
    color: string;
    created_at: number;
}
const COLORS = [
    'bg-brand-gold/20',
    'bg-cream-200',
    'bg-brown-100',
    'bg-green-100/50',
    'bg-blue-100/50'
];

export default function RecentHighlights() {
    const { t } = useLanguage();
    const router = useRouter();
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userBooks, setUserBooks] = useState<Book[]>([]);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Import state
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [localHighlightsBooks, setLocalHighlightsBooks] = useState<{book: Book, count: number}[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [importingBookId, setImportingBookId] = useState<string | null>(null);

    // Form state
    const [quote, setQuote] = useState('');
    const [bookTitle, setBookTitle] = useState('');
    const [pageNumber, setPageNumber] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchHighlights();
        fetchUserBooks();
    }, []);

    const fetchUserBooks = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data } = await supabase
                .from('books')
                .select('*')
                .eq('user_id', user.id)
                .order('title', { ascending: true });
            if (data) setUserBooks(data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const scanForLocalHighlights = async () => {
        setIsScanning(true);
        setLocalHighlightsBooks([]);
        try {
            const library = await get('readracing_library_v2') as Book[];
            if (!library) {
                setIsScanning(false);
                return;
            }

            const booksWithHighlights = [];
            for (const book of library) {
                const localHighlights = await get(`highlights_${book.id}`) as LocalHighlight[];
                if (localHighlights && localHighlights.length > 0) {
                    booksWithHighlights.push({
                        book,
                        count: localHighlights.length
                    });
                }
            }
            setLocalHighlightsBooks(booksWithHighlights);
        } catch (error) {
            console.error('Error scanning local highlights:', error);
        } finally {
            setIsScanning(false);
        }
    };

    const handleImportHighlights = async (book: Book) => {
        setImportingBookId(book.id);
        console.log(`Starting import for book: ${book.title} (${book.id})`);
        
        try {
            const { data, error: authError } = await supabase.auth.getUser();
            if (authError || !data?.user) {
                console.error('Auth error or no user:', authError);
                throw new Error('User not authenticated');
            }
            const user = data.user;

            // 1. Get local highlights
            const localHighlights = await get(`highlights_${book.id}`) as LocalHighlight[];
            if (!localHighlights || localHighlights.length === 0) {
                console.log('No local highlights found for this book.');
                return;
            }
            console.log(`Found ${localHighlights.length} local highlights.`);

            // 2. Get existing remote highlights to avoid duplicates
            if (!book.id) {
                console.error('Book ID is missing');
                alert('Invalid book ID');
                return;
            }

            const { data: remoteHighlights, error: remoteError } = await supabase
                .from('highlights')
                .select('cfi_range')
                .eq('user_id', user.id)
                .eq('book_id', book.id);
            
            if (remoteError) {
                console.error('Error fetching remote highlights:', JSON.stringify(remoteError, null, 2));
                // Continue anyway with empty set to allow import if fetch fails
            }
            
            const existingCfiRanges = new Set(remoteHighlights?.map(h => h.cfi_range) || []);
            console.log(`Found ${existingCfiRanges.size} existing remote highlights.`);

            // 3. Filter and prepare new highlights
            const newHighlights = [];
            const colorMap: Record<string, string> = {
                '#93c5fd': 'bg-blue-100/50',
                '#86efac': 'bg-green-100/50',
                '#fde047': 'bg-brand-gold/20',
                '#d1d5db': 'bg-cream-200'
            };

            // 4. Load book data
            const bookData = await get(book.id);
            if (!bookData) {
                console.error('Book data (ArrayBuffer) not found in IndexedDB.');
                alert('Book file not found locally. Please re-download the book.');
                return;
            }
            console.log('Book data loaded from IndexedDB, size:', (bookData as ArrayBuffer).byteLength);

            // 5. Initialize ePub
            // Use try-catch for dynamic import
            let ePub;
            try {
                const epubModule = await import('epubjs');
                ePub = epubModule.default || epubModule;
            } catch (importError) {
                console.error('Failed to import epubjs:', importError);
                throw new Error('Failed to load ePub reader engine.');
            }

            // Create book instance
            // ePub constructor can take ArrayBuffer directly
            const epubBook = ePub(bookData as ArrayBuffer);
            
            console.log('Waiting for book to be ready...');
            await epubBook.ready;
            console.log('Book is ready. Processing highlights...');

            // Process highlights
            let successCount = 0;
            let failCount = 0;

            for (const hl of localHighlights) {
                if (existingCfiRanges.has(hl.cfiRange)) continue;

                try {
                    // getRange returns a Range object
                    const range = await epubBook.getRange(hl.cfiRange);
                    if (range) {
                        const text = range.toString();
                        if (text) {
                            const dashboardColor = colorMap[hl.color] || 'bg-brand-gold/20';
                            
                            newHighlights.push({
                                user_id: user.id,
                                quote: text,
                                book_title: book.title,
                                page_number: 0, 
                                color: dashboardColor,
                                cfi_range: hl.cfiRange,
                                book_id: book.id,
                                created_at: new Date(hl.created_at).toISOString()
                            });
                            successCount++;
                        } else {
                            console.warn(`Empty text for CFI: ${hl.cfiRange}`);
                            failCount++;
                        }
                    } else {
                        console.warn(`Could not get range for CFI: ${hl.cfiRange}`);
                        failCount++;
                    }
                } catch (e) {
                    console.warn(`Error resolving CFI ${hl.cfiRange}:`, e);
                    failCount++;
                }
            }
            
            console.log(`Processed highlights: ${successCount} success, ${failCount} failed.`);

            if (newHighlights.length > 0) {
                console.log(`Inserting ${newHighlights.length} highlights to Supabase...`);
                const { error: insertError } = await supabase.from('highlights').insert(newHighlights);
                if (insertError) {
                    console.error('Supabase insert error:', insertError);
                    throw insertError;
                }
                
                fetchHighlights(); // Refresh list
                alert(`Successfully imported ${newHighlights.length} highlights.`);
            } else {
                if (localHighlights.length > 0 && existingCfiRanges.size >= localHighlights.length) {
                    alert('All local highlights are already imported.');
                } else {
                    alert(`No new highlights found to import. (${failCount} failed to resolve)`);
                }
            }
            
            setIsImportModalOpen(false);

        } catch (error: any) {
            console.error('Error importing highlights (full object):', error);
            console.error('Error message:', error?.message);
            console.error('Error stack:', error?.stack);
            alert(`Failed to import highlights: ${error?.message || 'Unknown error'}`);
        } finally {
            setImportingBookId(null);
        }
    };


    const fetchHighlights = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('highlights')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(3);

            if (data) {
                setHighlights(data);
            }
        } catch (error) {
            console.error('Error fetching highlights:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddHighlight = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

            const { error } = await supabase.from('highlights').insert({
                user_id: user.id,
                quote,
                book_title: bookTitle,
                page_number: parseInt(pageNumber) || 0,
                color: randomColor
            });

            if (!error) {
                setQuote('');
                setBookTitle('');
                setPageNumber('');
                setIsModalOpen(false);
                fetchHighlights();
            }
        } catch (error) {
            console.error('Error adding highlight:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-cream-200 shadow-sm flex flex-col h-full relative">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-serif font-bold text-brown-900">{t.dashboard.recent_highlights}</h3>
                <button 
                    onClick={() => router.push('/highlights')}
                    className="text-sm font-bold text-brown-800/60 hover:text-brown-900 uppercase tracking-widest transition-colors"
                >
                    {t.dashboard.view_all}
                </button>
            </div>

            <div className="flex justify-end mb-4">
                <button 
                    onClick={() => {
                        setIsImportModalOpen(true);
                        scanForLocalHighlights();
                    }}
                    className="text-xs font-bold text-brown-800/60 hover:text-brown-900 uppercase tracking-widest transition-colors flex items-center gap-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Import from Book
                </button>
            </div>

            <div className="flex-1 space-y-4">
                {loading ? (
                    <div className="animate-pulse space-y-4">
                        <div className="h-32 bg-cream-100 rounded-3xl"></div>
                        <div className="h-32 bg-cream-100 rounded-3xl"></div>
                    </div>
                ) : highlights.length > 0 ? (
                    highlights.map((highlight) => (
                        <div key={highlight.id} className={`p-6 rounded-3xl ${highlight.color} group hover:scale-[1.02] transition-transform duration-300 cursor-pointer`}>
                            <p className="font-serif text-lg text-brown-900 leading-relaxed italic mb-4">
                                "{highlight.quote}"
                            </p>
                            <div className="flex justify-between items-center text-xs font-black text-brown-800/40 uppercase tracking-widest">
                                <span>{highlight.book_title}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-brown-800/40 italic">
                        {t.dashboard.no_highlights}
                    </div>
                )}
                
                <div 
                    onClick={() => setIsModalOpen(true)}
                    className="p-6 rounded-3xl border-2 border-dashed border-cream-200 flex items-center justify-center text-brown-800/40 font-bold hover:bg-cream-50 hover:border-cream-300 transition-all cursor-pointer group"
                >
                    <span className="group-hover:scale-110 transition-transform">+ {t.dashboard.add_highlight}</span>
                </div>
            </div>

            {/* Import Modal */}
            {isImportModalOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-[2.5rem]" onClick={() => setIsImportModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-md p-6 rounded-3xl shadow-2xl border border-cream-200 relative z-10 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-serif font-bold text-brown-900 mb-4">Import Highlights</h3>
                        
                        {isScanning ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <div className="w-8 h-8 border-4 border-brown-900 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-brown-800/60 font-bold">Scanning local books...</p>
                            </div>
                        ) : localHighlightsBooks.length > 0 ? (
                            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                                <p className="text-sm text-brown-800/60 mb-4">Select a book to import locally saved highlights from:</p>
                                {localHighlightsBooks.map(({book, count}) => (
                                    <div 
                                        key={book.id}
                                        onClick={() => handleImportHighlights(book)}
                                        className="p-4 bg-cream-50 hover:bg-cream-100 rounded-xl cursor-pointer transition-colors border border-cream-200 flex justify-between items-center group"
                                    >
                                        <div className="flex-1 min-w-0 mr-4">
                                            <div className="font-bold text-brown-900 truncate">{book.title}</div>
                                            <div className="text-xs text-brown-800/60">{count} local highlights</div>
                                        </div>
                                        {importingBookId === book.id ? (
                                            <div className="w-5 h-5 border-2 border-brown-900 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brown-900 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                    <polyline points="7 10 12 15 17 10"></polyline>
                                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-brown-800/40 italic">
                                No local highlights found.
                            </div>
                        )}

                        <div className="mt-6">
                            <button 
                                type="button"
                                onClick={() => setIsImportModalOpen(false)}
                                className="w-full py-3 font-bold text-brown-800/60 hover:bg-cream-100 rounded-xl transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-[2.5rem]" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-md p-6 rounded-3xl shadow-2xl border border-cream-200 relative z-10 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-serif font-bold text-brown-900 mb-4">{t.dashboard.add_highlight_title}</h3>
                        <form onSubmit={handleAddHighlight} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-brown-800/60 uppercase tracking-widest mb-1">{t.dashboard.quote}</label>
                                <textarea 
                                    value={quote}
                                    onChange={(e) => setQuote(e.target.value)}
                                    className="w-full p-3 bg-cream-50 rounded-xl border border-cream-200 focus:outline-none focus:border-brown-900 min-h-[100px]"
                                    placeholder={t.dashboard.enter_quote}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <label className="block text-xs font-bold text-brown-800/60 uppercase tracking-widest mb-1">{t.dashboard.book_title}</label>
                                {userBooks.length > 0 ? (
                                    <>
                                        <div 
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="w-full p-3 bg-cream-50 rounded-xl border border-cream-200 cursor-pointer flex justify-between items-center hover:bg-cream-100 transition-colors group"
                                        >
                                            <span className={`font-medium ${!bookTitle ? 'text-brown-800/40' : 'text-brown-900'}`}>
                                                {bookTitle || t.dashboard.select_book}
                                            </span>
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                width="20" 
                                                height="20" 
                                                viewBox="0 0 24 24"
                                                className={`text-brown-800/40 transition-transform duration-200 group-hover:text-brown-800 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                            >
                                                <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6l-6-6l1.41-1.41z"/>
                                            </svg>
                                        </div>
                                        
                                        {isDropdownOpen && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                                                <div className="absolute z-20 w-full mt-2 bg-white rounded-xl border border-cream-200 shadow-xl max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                                                    {userBooks.map(book => (
                                                        <div 
                                                            key={book.id} 
                                                            onClick={() => {
                                                                setBookTitle(book.title);
                                                                setIsDropdownOpen(false);
                                                            }}
                                                            className="p-3 hover:bg-cream-50 cursor-pointer transition-colors border-b border-cream-50 last:border-0"
                                                        >
                                                            <div className="font-bold text-brown-900 text-sm truncate">{book.title}</div>
                                                            <div className="text-xs text-brown-800/40 font-medium truncate">{book.author}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <input 
                                        type="text"
                                        value={bookTitle}
                                        onChange={(e) => setBookTitle(e.target.value)}
                                        className="w-full p-3 bg-cream-50 rounded-xl border border-cream-200 focus:outline-none focus:border-brown-900"
                                        placeholder={t.dashboard.book_placeholder}
                                        required
                                    />
                                )}
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 font-bold text-brown-800/60 hover:bg-cream-100 rounded-xl transition-colors"
                                >
                                    {t.dashboard.cancel}
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 font-bold text-cream-50 bg-brown-900 hover:bg-brown-800 rounded-xl shadow-lg transition-all disabled:opacity-70"
                                >
                                    {isSubmitting ? t.dashboard.saving : t.dashboard.save}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
