'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ePub, { Rendition } from 'epubjs';
import { get } from 'idb-keyval';

export default function ReaderPage() {
    const { id } = useParams();
    const router = useRouter();
    const viewerRef = useRef<HTMLDivElement>(null);
    const bookRef = useRef<any>(null);
    const renditionRef = useRef<Rendition | null>(null);
    
    const [isLoaded, setIsLoaded] = useState(false);
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState<string | null>(null);

    useEffect(() => {
        const loadBook = async () => {
            if (!id || !viewerRef.current) return;

            try {
                const data = await get(id as string);
                if (!data) {
                    alert('Book not found in local storage');
                    router.push('/library');
                    return;
                }

                const book = ePub(data);
                bookRef.current = book;

                const metadata = await book.loaded.metadata;
                setTitle(metadata.title);

                const rendition = book.renderTo(viewerRef.current, {
                    width: '100%',
                    height: '100%',
                    flow: 'paginated',
                    manager: 'default',
                });

                renditionRef.current = rendition;
                await rendition.display();
                
                setIsLoaded(true);

                // Handle location changes to save progress (optional but good)
                rendition.on('relocated', (location: any) => {
                    setLocation(location.start.cfi);
                    // Update progress in localStorage if needed
                });

            } catch (error) {
                console.error('Error loading book:', error);
                alert('Failed to load book');
            }
        };

        loadBook();

        return () => {
            if (bookRef.current) {
                bookRef.current.destroy();
            }
        };
    }, [id, router]);

    const prevPage = () => renditionRef.current?.prev();
    const nextPage = () => renditionRef.current?.next();

    return (
        <div className="h-screen flex flex-col bg-cream-50 overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-cream-200 px-6 py-4 flex justify-between items-center shadow-sm">
                <button 
                    onClick={() => router.push('/library')}
                    className="text-brown-900 font-bold flex items-center gap-2 hover:opacity-70"
                >
                    <span>←</span> Library
                </button>
                <h1 className="font-serif font-bold text-brown-900 truncate max-w-md">{title || 'Loading...'}</h1>
                <div className="w-20"></div> {/* Spacer */}
            </div>

            {/* Viewer */}
            <div className="flex-1 relative p-4 md:p-8 flex justify-center">
                <div 
                    ref={viewerRef} 
                    className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl border border-cream-200 h-full"
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
                <div className="absolute inset-y-0 left-0 w-16 md:w-24 flex items-center justify-center">
                    <button 
                        onClick={prevPage}
                        className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-cream-200 flex items-center justify-center text-2xl hover:bg-white transition-all hover:scale-110"
                    >
                        ‹
                    </button>
                </div>
                <div className="absolute inset-y-0 right-0 w-16 md:w-24 flex items-center justify-center">
                    <button 
                        onClick={nextPage}
                        className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-cream-200 flex items-center justify-center text-2xl hover:bg-white transition-all hover:scale-110"
                    >
                        ›
                    </button>
                </div>
            </div>

            {/* Footer / Progress Bar */}
            <div className="bg-white border-t border-cream-200 p-4 flex justify-center gap-8 items-center text-xs font-black text-brown-800/40 uppercase tracking-widest">
                <span>Use arrows or buttons to navigate</span>
            </div>
        </div>
    );
}
