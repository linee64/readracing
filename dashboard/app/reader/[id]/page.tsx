'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ePub, { Rendition } from 'epubjs';
import { get, set } from 'idb-keyval';
import { Book } from '@/types';

export default function ReaderPage() {
    const { id } = useParams();
    const router = useRouter();
    const viewerRef = useRef<HTMLDivElement>(null);
    const bookRef = useRef<any>(null);
    const renditionRef = useRef<Rendition | null>(null);
    
    const [isLoaded, setIsLoaded] = useState(false);
    const [title, setTitle] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [leftPage, setLeftPage] = useState(0);
    const [rightPage, setRightPage] = useState(0);

    const updateLibraryProgress = async (curr: number, total: number, cfi?: string) => {
        try {
            const library = await get('readracing_library_v2') as Book[];
            if (library) {
                const updatedLibrary = library.map(b => {
                    if (b.id === id) {
                        return { 
                            ...b, 
                            currentPage: Math.max(b.currentPage, curr),
                            currentPageCfi: cfi || b.currentPageCfi,
                            totalPages: total > 0 ? total : b.totalPages 
                        };
                    }
                    return b;
                });
                await set('readracing_library_v2', updatedLibrary);
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
                // Clear previous rendition if it exists
                if (renditionRef.current) {
                    try {
                        renditionRef.current.destroy();
                    } catch (e) {
                        console.error('Error destroying previous rendition:', e);
                    }
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

                const rendition = book.renderTo(viewerRef.current, {
                    width: '100%',
                    height: '100%',
                    flow: 'paginated',
                    manager: 'default',
                    allowScriptedContent: true,
                    spread: 'always',
                    minSpreadWidth: 600, // Ensure spread only on reasonable widths
                });

                renditionRef.current = rendition;

                // Use ResizeObserver for more reliable resizing
                resizeObserver = new ResizeObserver(() => {
                    if (renditionRef.current && isLoaded) {
                        try {
                            renditionRef.current.resize();
                        } catch (e) {
                            console.warn('Resize failed:', e);
                        }
                    }
                });
                resizeObserver.observe(viewerRef.current);

                // Apply styles to ensure 2 columns and no overflow
                rendition.themes.default({
                    'body': {
                        'padding': '30px 40px !important',
                        'margin': '0 !important',
                        'font-size': '18px !important',
                        'line-height': '1.45 !important'
                    },
                    'img': {
                        'max-width': '100%',
                        'height': 'auto'
                    }
                });
                
                // Get saved progress
                const library = await get('readracing_library_v2') as Book[];
                const currentBook = library?.find(b => b.id === id);
                
                if (currentBook) {
                    // Pre-set pages if we have them in library to avoid lag
                    if (currentBook.currentPage) {
                        setCurrentPage(currentBook.currentPage);
                        setLeftPage(currentBook.currentPage);
                        setRightPage(currentBook.currentPage + 1 <= (currentBook.totalPages || 0) ? currentBook.currentPage + 1 : 0);
                    }
                    if (currentBook.totalPages) {
                        setTotalPages(currentBook.totalPages);
                    }
                }

                if (currentBook?.currentPageCfi) {
                    try {
                        if (isMounted) await rendition.display(currentBook.currentPageCfi);
                    } catch (e) {
                        console.error('Error displaying book at CFI:', e);
                        if (isMounted) await rendition.display();
                    }
                } else {
                    if (isMounted) await rendition.display();
                }
                
                if (!isMounted) return;

                // Force a resize after display to ensure correct layout
                setTimeout(() => {
                    if (renditionRef.current && isMounted) {
                        try {
                            renditionRef.current.resize();
                        } catch (e) {
                            console.warn('Initial resize failed:', e);
                        }
                    }
                }, 200);
                
                if (!isMounted) return;
                setIsLoaded(true);

                // Load total pages (locations)
                book.ready.then(() => {
                    if (!isMounted || !bookRef.current) return;
                    return book.locations.generate(1000);
                }).then(() => {
                    if (!isMounted || !bookRef.current) return;
                    const total = book.locations.length();
                    setTotalPages(total);
                    updateLibraryProgress(currentPage, total);
                }).catch(err => {
                    console.warn('Error generating locations:', err);
                });

                // Handle location changes
                rendition.on('relocated', async (relocatedLocation: any) => {
                    if (!isMounted || !bookRef.current) return;
                    const cfi = relocatedLocation.start.cfi;
                    if (bookRef.current.locations && bookRef.current.locations.length() > 0) {
                        const percent = bookRef.current.locations.percentageFromCfi(cfi);
                        const curr = Math.floor(percent * bookRef.current.locations.length());
                        setCurrentPage(curr);
                        
                        setLeftPage(curr);
                        setRightPage(curr + 1 <= bookRef.current.locations.length() ? curr + 1 : 0);

                        updateLibraryProgress(curr, bookRef.current.locations.length(), cfi);
                    }
                });

                // Add keyboard navigation inside the iframe
                rendition.on('keyup', (event: KeyboardEvent) => {
                    if (event.key === 'ArrowLeft') prevPage();
                    if (event.key === 'ArrowRight') nextPage();
                });

            } catch (error) {
                console.error('Error loading book:', error);
                if (isMounted) alert('Failed to load book');
            }
        };

        // Small delay to ensure container is ready
        const timer = setTimeout(loadBook, 100);

        return () => {
            isMounted = false;
            clearTimeout(timer);
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
            
            // Comprehensive cleanup
            if (renditionRef.current) {
                try {
                    renditionRef.current.destroy();
                } catch (e) {
                    // Ignore destruction errors
                }
                renditionRef.current = null;
            }

            if (bookRef.current) {
                try {
                    bookRef.current.destroy();
                } catch (e) {
                    // Ignore destruction errors
                }
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
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const prevPage = () => {
        if (renditionRef.current) {
            renditionRef.current.prev();
        }
    };
    
    const nextPage = () => {
        if (renditionRef.current) {
            renditionRef.current.next();
        }
    };

    return (
        <div className="h-screen flex flex-col bg-cream-50 overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-cream-200 px-6 py-1 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.push('/library')}
                        className="text-brown-900 font-bold flex items-center gap-1 hover:opacity-70 transition-opacity text-xs"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        Library
                    </button>
                </div>
                <h1 className="font-serif font-bold text-brown-900 truncate max-w-md text-center flex-1 text-sm">{title || 'Loading...'}</h1>
                <div className="w-24"></div> {/* Spacer for symmetry */}
            </div>

            <div className="flex-1 relative p-1 md:p-2 flex justify-center overflow-hidden">
                <div 
                    ref={viewerRef} 
                    className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl border border-cream-200 h-full overflow-hidden"
                >
                    {!isLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-pulse text-brown-900/40 font-serif italic text-xl">
                                Opening your book...
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Controls Overlay */}
                <div className="absolute inset-y-0 left-0 w-10 md:w-12 flex items-center justify-center">
                    <button 
                        onClick={prevPage}
                        className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-cream-200 flex items-center justify-center text-lg hover:bg-white transition-all hover:scale-110"
                    >
                        ‹
                    </button>
                </div>
                <div className="absolute inset-y-0 right-0 w-10 md:w-12 flex items-center justify-center">
                    <button 
                        onClick={nextPage}
                        className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-cream-200 flex items-center justify-center text-lg hover:bg-white transition-all hover:scale-110"
                    >
                        ›
                    </button>
                </div>
            </div>

            {/* Footer / Progress Bar */}
            <div className="bg-white border-t border-cream-200 py-1 px-4 flex flex-col items-center gap-0">
                <div className="flex justify-between w-full max-w-4xl px-8 text-[11px] font-serif font-bold text-brown-900/60">
                    <div className="flex-1 text-center">{leftPage > 0 ? leftPage : ''}</div>
                    <div className="flex-1 text-center">{rightPage > 0 ? rightPage : ''}</div>
                </div>
                <div className="flex items-center gap-4 text-[8px] font-black text-brown-800/10 uppercase tracking-[0.2em]">
                    <span>Use arrows or buttons to navigate</span>
                </div>
                {totalPages > 0 && (
                    <div className="text-[9px] font-serif font-bold text-brown-900/40">
                        {currentPage} / {totalPages}
                    </div>
                )}
            </div>
        </div>
    );
}
