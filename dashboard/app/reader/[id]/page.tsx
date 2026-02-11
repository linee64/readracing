'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ePub, { Rendition } from 'epubjs';
import { get, set } from 'idb-keyval';
import { Book } from '@/types';
import { supabase } from '@/lib/supabase';

export default function ReaderPage() {
    const { id } = useParams();
    const router = useRouter();
    const viewerRef = useRef<HTMLDivElement>(null);
    const bookRef = useRef<any>(null);
    const renditionRef = useRef<Rendition | null>(null);
    
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPaginated, setIsPaginated] = useState(false);
    const [title, setTitle] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [leftPage, setLeftPage] = useState(0);
    const [rightPage, setRightPage] = useState(0);

    const updateLibraryProgress = async (curr: number, total: number, cfi?: string) => {
        try {
            console.log('Attempting to update progress:', { curr, total });
            const library = await get('readracing_library_v2') as Book[];
            if (library) {
                const updatedLibrary = library.map(b => {
                    if (b.id === id) {
                        const newPage = Math.max(b.currentPage || 0, curr);
                        return { 
                            ...b, 
                            currentPage: newPage,
                            currentPageCfi: cfi || b.currentPageCfi,
                            totalPages: total > 0 ? total : b.totalPages 
                        };
                    }
                    return b;
                });
                
                await set('readracing_library_v2', updatedLibrary);
                
                const { data: { session } } = await supabase.auth.getSession();
                const user = session?.user;
                if (user) {
                    const totalPagesRead = updatedLibrary.reduce((acc, book) => acc + (book.currentPage || 0), 0);
                    const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown Reader';
                    
                    await supabase
                        .from('profiles')
                        .upsert({ 
                            id: user.id, 
                            full_name: name, 
                            pages_read: totalPagesRead,
                            updated_at: new Date().toISOString()
                        });
                }
            }
        } catch (e) {
            console.error('Error updating progress:', e);
        }
    };

    useEffect(() => {
        let isMounted = true;
        let resizeObserver: ResizeObserver | null = null;
        
        const loadBook = async () => {
            if (!id || !viewerRef.current) return;

            try {
                if (renditionRef.current) {
                    try {
                        renditionRef.current.destroy();
                    } catch (e) {}
                    renditionRef.current = null;
                }

                const data = await get(id as string);
                if (!data || !isMounted) {
                    if (!data) {
                        alert('Book not found in local storage');
                        router.push('/library');
                    }
                    return;
                }

                const book = ePub(data);
                bookRef.current = book;

                const metadata = await book.loaded.metadata;
                if (!isMounted) return;
                setTitle(metadata.title);

                // 1. Render IMMEDIATELY
                const rendition = book.renderTo(viewerRef.current, {
                    width: '100%',
                    height: '100%',
                    flow: 'paginated',
                    manager: 'default',
                    allowScriptedContent: true,
                    spread: 'always', // Will be overridden by resize
                    minSpreadWidth: 800, // Increased to force single page on mobile
                });

                renditionRef.current = rendition;

                // Apply styles - Responsive font size
                const isMobile = window.innerWidth < 768;
                rendition.themes.default({
                    'body': {
                        'padding': isMobile ? '20px 20px !important' : '40px 60px !important',
                        'margin': '0 !important',
                        'font-size': isMobile ? '18px !important' : '16px !important',
                        'line-height': '1.6 !important',
                        'color': '#2C2416 !important',
                        'font-family': 'Georgia, serif !important',
                        'max-width': '100% !important',
                        'box-sizing': 'border-box !important'
                    },
                    'img': {
                        'max-width': '100% !important',
                        'height': 'auto !important'
                    }
                });
                
                const library = await get('readracing_library_v2') as Book[];
                const currentBook = library?.find(b => b.id === id);
                
                if (currentBook) {
                    if (currentBook.currentPage) setCurrentPage(currentBook.currentPage);
                    if (currentBook.totalPages) setTotalPages(currentBook.totalPages);
                }

                if (currentBook?.currentPageCfi) {
                    await rendition.display(currentBook.currentPageCfi);
                } else {
                    await rendition.display();
                }
                
                if (!isMounted) return;
                setIsLoaded(true);

                // 2. Background location generation
                book.ready.then(() => {
                    return book.locations.generate(1000);
                }).then(() => {
                    if (!isMounted) return;
                    const total = book.locations.length();
                    setTotalPages(total);
                    setIsPaginated(true);
                }).catch(() => {
                    if (isMounted) setIsPaginated(true);
                });

                // Handle location changes
                rendition.on('relocated', async (relocatedLocation: any) => {
                    if (!isMounted || !bookRef.current) return;
                    const cfi = relocatedLocation.start.cfi;
                    const total = bookRef.current.locations.length();
                    let curr = 0;

                    if (total > 0) {
                        const percent = bookRef.current.locations.percentageFromCfi(cfi);
                        curr = Math.floor(percent * total) + 1;
                    } else {
                        curr = relocatedLocation.start.index + 1;
                    }

                    if (curr > 0) {
                        setCurrentPage(curr);
                        const startPage = curr % 2 === 0 ? curr - 1 : curr;
                        setLeftPage(startPage);
                        const actualTotal = total > 0 ? total : bookRef.current.spine.length;
                        setRightPage(startPage + 1 <= actualTotal ? startPage + 1 : 0);
                        updateLibraryProgress(curr, actualTotal, cfi);
                    }
                });

                resizeObserver = new ResizeObserver(() => {
                    if (renditionRef.current && isMounted) {
                        try { 
                            (renditionRef.current as any).resize();
                            // Re-apply responsive styles on resize
                            const isMobileNow = window.innerWidth < 768;
                            renditionRef.current.themes.default({
                                'body': {
                                    'padding': isMobileNow ? '20px 20px !important' : '40px 60px !important',
                                    'margin': '0 !important',
                                    'font-size': isMobileNow ? '18px !important' : '16px !important',
                                    'line-height': '1.6 !important',
                                    'color': '#2C2416 !important',
                                    'font-family': 'Georgia, serif !important',
                                    'max-width': '100% !important',
                                    'box-sizing': 'border-box !important'
                                }
                            });
                        } catch (e) {}
                    }
                });
                resizeObserver.observe(viewerRef.current);

                rendition.on('keyup', (event: KeyboardEvent) => {
                    if (event.key === 'ArrowLeft') prevPage();
                    if (event.key === 'ArrowRight') nextPage();
                });

            } catch (error) {
                console.error('Error loading book:', error);
                if (isMounted) alert('Failed to load book');
            }
        };

        const timer = setTimeout(loadBook, 100);

        return () => {
            isMounted = false;
            clearTimeout(timer);
            if (resizeObserver) resizeObserver.disconnect();
            if (renditionRef.current) {
                try { renditionRef.current.destroy(); } catch (e) {}
                renditionRef.current = null;
            }
            if (bookRef.current) {
                try { bookRef.current.destroy(); } catch (e) {}
                bookRef.current = null;
            }
        };
    }, [id]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prevPage();
            if (e.key === 'ArrowRight') nextPage();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const prevPage = () => renditionRef.current?.prev();
    const nextPage = () => renditionRef.current?.next();

    return (
        <div className="h-screen flex flex-col bg-cream-50 overflow-hidden">
            <div className="bg-white border-b border-cream-200 px-6 py-1 flex justify-between items-center shadow-sm">
                <button 
                    onClick={() => router.push('/library')}
                    className="text-brown-900 font-bold flex items-center gap-1 hover:opacity-70 transition-opacity text-xs"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    Library
                </button>
                <h1 className="font-serif font-bold text-brown-900 truncate max-w-md text-center flex-1 text-sm">{title || 'Loading...'}</h1>
                <div className="w-24"></div>
            </div>

            <div className="flex-1 relative p-4 md:p-8 flex justify-center items-center overflow-hidden">
                <div 
                    ref={viewerRef} 
                    className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl border border-cream-200 h-full max-h-[80vh] overflow-hidden"
                >
                    {(!isLoaded || !isPaginated) && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-50">
                            <div className="animate-pulse text-brown-900/40 font-serif italic text-xl mb-4">
                                {!isPaginated ? 'Preparing pages...' : 'Opening book...'}
                            </div>
                        </div>
                    )}
                </div>

                <div className="absolute inset-y-0 left-0 w-10 md:w-12 flex items-center justify-center">
                    <button onClick={prevPage} className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-cream-200 flex items-center justify-center text-lg hover:bg-white transition-all hover:scale-110">‹</button>
                </div>
                <div className="absolute inset-y-0 right-0 w-10 md:w-12 flex items-center justify-center">
                    <button onClick={nextPage} className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-cream-200 flex items-center justify-center text-lg hover:bg-white transition-all hover:scale-110">›</button>
                </div>
            </div>

            <div className="bg-white border-t border-cream-200 py-1 px-4 flex flex-col items-center gap-0">
                <div className="flex justify-between w-full max-w-4xl px-8 text-[11px] font-serif font-bold text-brown-900/60">
                    <div className="flex-1 text-center">{leftPage > 0 ? leftPage : ''}</div>
                    <div className="flex-1 text-center">{rightPage > 0 ? rightPage : ''}</div>
                </div>
                {totalPages > 0 && (
                    <div className="text-[10px] font-black text-brown-800/20 uppercase tracking-[0.2em] mt-0.5">
                        Progress: {Math.round((currentPage / totalPages) * 100)}%
                    </div>
                )}
            </div>
        </div>
    );
}
