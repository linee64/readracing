'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ePub, { Rendition } from 'epubjs';
import { get, set } from 'idb-keyval';
import { Book } from '@/types';
import { supabase } from '@/lib/supabase';
import ReaderSettings from '@/components/ReaderSettings';
import { useLanguage } from '@/context/LanguageContext';

type Theme = 'auto' | 'light' | 'dark';
type HighlightColor = 'blue' | 'green' | 'yellow' | 'gray';

interface Highlight {
    cfiRange: string;
    color: string;
    created_at: number;
}

const HIGHLIGHT_COLORS = {
    blue: '#93c5fd',
    green: '#86efac',
    yellow: '#fde047',
    gray: '#d1d5db'
};

export default function ReaderPage() {
    const { t } = useLanguage();
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

    // Settings State
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({
        fontSize: 16,
        fontFamily: 'Georgia, serif',
        theme: 'auto' as Theme,
        highlightColor: 'yellow' as HighlightColor
    });
    const [isMobile, setIsMobile] = useState(false);
    
    // Context Menu State
    const [selectionMenu, setSelectionMenu] = useState<{
        x: number;
        y: number;
        cfiRange: string;
        text: string;
    } | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [explanationText, setExplanationText] = useState('');

    const lastLoggedPageRef = useRef(0);
    const lastLogTimeRef = useRef(Date.now());
    
    const settingsRef = useRef(settings);
    const highlightsRef = useRef<Highlight[]>([]);
    
    // Selection state refs
    const isMouseUpRef = useRef(true);
    const pendingSelectionRef = useRef<{
        cfiRange: string;
        text: string;
        rect: DOMRect;
        iframeRect: DOMRect;
    } | null>(null);

    // Theme configuration
    const applyTheme = (rendition: Rendition) => {
        const { theme, fontFamily, fontSize } = settings;
        const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        const mobile = window.innerWidth < 1024;
        
        // Base styles
        const styles = {
            'body': {
                'padding': mobile ? '20px 20px !important' : '40px 160px !important', // Измените 160px на желаемое значение отступов
                'margin': '0 !important',
                'font-size': `${mobile ? Math.max(12, fontSize - 2) : fontSize}px !important`,
                'line-height': '1.6 !important',
                'font-family': `${fontFamily} !important`,
                'color': isDark ? '#e5e5e5 !important' : '#2C2416 !important',
                'background-color': isDark ? '#1a1a1a !important' : '#ffffff !important',
                'max-width': mobile ? '100% !important' : '800px !important',
                'margin-left': mobile ? '0 !important' : 'auto !important',
                'margin-right': mobile ? '0 !important' : 'auto !important',
                'box-sizing': 'border-box !important'
            },
            'img': {
                'max-width': '100% !important',
                'height': 'auto !important'
            }
        };

        rendition.themes.default(styles);
    };

    // Update settings when they change
    useEffect(() => {
        settingsRef.current = settings;
        if (renditionRef.current) {
            applyTheme(renditionRef.current);
        }
    }, [settings]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const updateLibraryProgress = async (curr: number, total: number, cfi?: string) => {
        try {
            console.log('Attempting to update progress:', { curr, total });
            
            // Log reading session if progress made
            const delta = curr - lastLoggedPageRef.current;
            const now = Date.now();
            const timeDiff = (now - lastLogTimeRef.current) / 1000; // seconds

            if (delta > 0) {
                // Only log if it seems like reasonable reading (or at least positive progress)
                // We'll log it to Supabase 'reading_sessions'
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    await supabase.from('reading_sessions').insert({
                        user_id: session.user.id,
                        book_id: id as string,
                        pages_read: delta,
                        duration_seconds: Math.round(timeDiff)
                    });
                }
                lastLoggedPageRef.current = curr;
                lastLogTimeRef.current = now;
            } else if (delta < 0) {
                // If went back, just update ref so we don't double count when they go forward again
                lastLoggedPageRef.current = curr;
                lastLogTimeRef.current = now;
            }

            const library = await get('readracing_library_v2') as Book[];
            if (library) {
                const updatedLibrary = library.map(b => {
                    if (b.id === id) {
                        const newPage = Math.max(b.currentPage || 0, curr);
                        return { 
                            ...b, 
                            currentPage: newPage,
                            currentPageCfi: cfi || b.currentPageCfi,
                            totalPages: total > 0 ? total : b.totalPages,
                            lastReadAt: Date.now()
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
                    
                    // Update user profile
                    await supabase
                        .from('profiles')
                        .upsert({ 
                            id: user.id, 
                            full_name: name, 
                            pages_read: totalPagesRead,
                            updated_at: new Date().toISOString()
                        });

                    // Sync book progress to 'books' table
                    await supabase
                        .from('books')
                        .upsert({
                            id: id,
                            user_id: user.id,
                            current_page: curr,
                            current_page_cfi: cfi,
                            total_pages: total > 0 ? total : undefined,
                            last_read_at: new Date().toISOString()
                        }, { onConflict: 'id' });
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
                    spread: 'none',
                });

                renditionRef.current = rendition;

                // Load and apply highlights
                const savedHighlights = await get(`highlights_${id}`) as Highlight[] || [];
                highlightsRef.current = savedHighlights;

                const addHighlightAnnotation = (cfiRange: string, color: string) => {
                    rendition.annotations.add('highlight', cfiRange, {}, (e: any) => {
                        // Simple click to remove for now
                        rendition.annotations.remove(cfiRange, 'highlight');
                        highlightsRef.current = highlightsRef.current.filter(h => h.cfiRange !== cfiRange);
                        set(`highlights_${id}`, highlightsRef.current);
                    }, 'hl', { fill: color, 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply' });
                };

                savedHighlights.forEach(h => {
                    addHighlightAnnotation(h.cfiRange, h.color);
                });

                rendition.on('mousedown', () => {
                    isMouseUpRef.current = false;
                    setSelectionMenu(null);
                    pendingSelectionRef.current = null;
                });

                rendition.on('mouseup', () => {
                    isMouseUpRef.current = true;
                    if (pendingSelectionRef.current) {
                        const { cfiRange, text, rect, iframeRect } = pendingSelectionRef.current;
                        const x = iframeRect.left + rect.left + (rect.width / 2);
                        const y = iframeRect.top + rect.top;

                        setSelectionMenu({
                            x,
                            y,
                            cfiRange,
                            text
                        });
                        pendingSelectionRef.current = null;
                    }
                });

                rendition.on('selected', (cfiRange: string, contents: any) => {
                    const selection = contents.window.getSelection();
                    if (!selection || selection.rangeCount === 0) return;

                    const range = selection.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    const iframe = viewerRef.current?.querySelector('iframe');
                    
                    if (iframe) {
                        const iframeRect = iframe.getBoundingClientRect();
                        const text = selection.toString();

                        if (isMouseUpRef.current) {
                            const x = iframeRect.left + rect.left + (rect.width / 2);
                            const y = iframeRect.top + rect.top;
                            setSelectionMenu({
                                x,
                                y,
                                cfiRange,
                                text
                            });
                        } else {
                            pendingSelectionRef.current = {
                                cfiRange,
                                text,
                                rect,
                                iframeRect
                            };
                        }
                    }
                });

                rendition.on('click', () => {
                    // setSelectionMenu(null);
                });
                
                rendition.on('relocated', () => {
                    setSelectionMenu(null);
                    pendingSelectionRef.current = null;
                });

                // Apply initial styles
                // Need to use the values from closure or current settings ref if possible, 
                // but for now relying on default settings
                // The useEffect([settings]) will trigger shortly after and re-apply correctly.
                // However, let's try to apply defaults right away to avoid flash.
                const mobile = window.innerWidth < 1024;
                rendition.themes.default({
                    'body': {
                        'padding': mobile ? '20px 20px !important' : '40px 160px !important',
                        'margin': '0 !important',
                        'font-size': mobile ? '14px !important' : '16px !important',
                        'line-height': '1.45 !important',
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
                    if (currentBook.currentPage) {
                        setCurrentPage(currentBook.currentPage);
                        lastLoggedPageRef.current = currentBook.currentPage;
                    }
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
                        const actualTotal = total > 0 ? total : bookRef.current.spine.length;
                        updateLibraryProgress(curr, actualTotal, cfi);
                    }
                });

                resizeObserver = new ResizeObserver(() => {
                    if (renditionRef.current && isMounted) {
                        try { 
                            (renditionRef.current as any).resize();
                            // Re-apply styles on resize via the settings effect or re-call applyTheme here?
                            // Actually the useEffect([settings]) handles updates, but resize needs responsive updates.
                            // We can trigger a re-apply of theme.
                            // But applyTheme depends on 'settings' state which might be stale in this callback?
                            // Use a ref for settings if needed, but for now simple re-render is okay.
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

    const handleHighlight = async (colorKey: HighlightColor) => {
        if (!selectionMenu || !renditionRef.current) return;
        
        const color = HIGHLIGHT_COLORS[colorKey];
        const { cfiRange, text } = selectionMenu;

        // Add annotation
        renditionRef.current.annotations.add('highlight', cfiRange, {}, (e: any) => {
            renditionRef.current?.annotations.remove(cfiRange, 'highlight');
            highlightsRef.current = highlightsRef.current.filter(h => h.cfiRange !== cfiRange);
            set(`highlights_${id}`, highlightsRef.current);
        }, 'hl', { fill: color, 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply' });

        // Save to state/storage (local for rendering)
        const newHighlight = { cfiRange, color, created_at: Date.now() };
        highlightsRef.current = [...highlightsRef.current, newHighlight];
        set(`highlights_${id}`, highlightsRef.current);

        // Map color key to dashboard class
        const dashboardColorMap: Record<HighlightColor, string> = {
            blue: 'bg-blue-100/50',
            green: 'bg-green-100/50',
            yellow: 'bg-brand-gold/20',
            gray: 'bg-cream-200'
        };
        const dashboardColor = dashboardColorMap[colorKey] || 'bg-cream-200';

        // Save to Supabase 'highlights' table for Dashboard Recent Highlights
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user && text) {
                await supabase.from('highlights').insert({
                    user_id: user.id,
                    quote: text,
                    book_title: title || 'Unknown Book',
                    page_number: currentPage || 0,
                    color: dashboardColor,
                    cfi_range: cfiRange,
                    book_id: id
                });
            }
        } catch (err) {
            console.error('Error saving highlight to database:', err);
        }

        setSelectionMenu(null);
        
        const contents = renditionRef.current.getContents() as any;
        if (contents && (contents.length > 0 || Array.isArray(contents))) {
            const content = Array.isArray(contents) ? contents[0] : contents;
            if (content && content.window) {
                content.window.getSelection()?.removeAllRanges();
            }
        }
    };

    const handleExplainAI = () => {
        if (!selectionMenu) return;
        setExplanationText(selectionMenu.text);
        setShowExplanation(true);
        setSelectionMenu(null);
    };

    const isDark = settings.theme === 'dark' || (settings.theme === 'auto' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <div className={`h-[100dvh] w-full max-w-[100vw] flex flex-row overflow-hidden ${isDark ? 'bg-[#1a1a1a]' : 'bg-cream-50'}`}>
            {/* Context Menu */}
            {selectionMenu && (
                <div 
                    className={`fixed z-50 flex flex-col min-w-[180px] rounded-xl shadow-2xl transform -translate-x-1/2 -translate-y-full mb-3 overflow-hidden
                        ${isDark ? 'bg-[#2a2a2a] border border-[#444] text-gray-200' : 'bg-[#F9F5F1] border border-[#E8E1D5] text-[#4A3B32]'}`}
                    style={{ 
                        left: selectionMenu.x, 
                        top: selectionMenu.y - 10,
                        animation: 'fadeIn 0.2s ease-out'
                    }}
                >
                    {/* Menu Items List */}
                    <div className="flex flex-col py-1">
                        <button
                            onClick={handleExplainAI}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-left group
                                ${isDark ? 'hover:bg-[#333]' : 'hover:bg-[#EFE6D5]'}`}
                        >
                            <div className={`p-1.5 rounded-md ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-[#E8E1D5] text-[#8C7B6C] group-hover:text-[#4A3B32]'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 3v4"/><path d="M3 5h4"/><path d="M3 9h4"/></svg>
                            </div>
                            {t.reader.explain_ai}
                        </button>
                        
                        <div className={`h-px mx-4 my-1 ${isDark ? 'bg-[#444]' : 'bg-[#E8E1D5]'}`} />
                        
                        <div className="px-4 py-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider mb-2 block ${isDark ? 'text-gray-500' : 'text-[#8C7B6C]'}`}>
                                {t.reader.highlight}
                            </span>
                            <div className="flex items-center gap-2 justify-between">
                                {(['blue', 'green', 'yellow', 'gray'] as HighlightColor[]).map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => handleHighlight(color)}
                                        className={`w-6 h-6 rounded-full border transition-transform hover:scale-110 relative group
                                            ${isDark ? 'border-transparent' : 'border-[#E8E1D5]'}`}
                                        style={{ 
                                            backgroundColor: HIGHLIGHT_COLORS[color],
                                            cursor: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%234A3B32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>') 0 20, pointer`
                                        }}
                                        title={`Highlight ${color}`}
                                    >
                                        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 bg-black transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Explanation Modal */}
            {showExplanation && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative
                        ${isDark ? 'bg-[#1a1a1a] text-gray-100 border border-[#333]' : 'bg-[#F9F5F1] text-[#4A3B32] border border-[#E8E1D5]'}`}>
                        <button 
                            onClick={() => setShowExplanation(false)}
                            className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-[#EFE6D5] text-[#8C7B6C]'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                        
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-3 rounded-xl ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-[#E8E1D5] text-[#8C7B6C]'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                            </div>
                            <h3 className="text-lg font-bold font-serif">{t.reader.ai_explanation}</h3>
                        </div>

                        <div className={`p-4 rounded-xl mb-4 text-sm italic border ${isDark ? 'bg-[#222] border-[#333] text-gray-400' : 'bg-white/50 border-[#E8E1D5] text-[#5C4D44]'}`}>
                            "{explanationText}"
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm leading-relaxed opacity-80">
                                {t.reader.ai_placeholder}
                            </p>
                            <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-[#333]' : 'bg-[#E8E1D5]'}`}>
                                <div className={`h-full w-2/3 animate-pulse ${isDark ? 'bg-purple-500' : 'bg-[#8C7B6C]'}`}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className={`flex flex-col flex-1 h-full min-w-0 transition-all duration-300 relative overflow-hidden`}>
                <div className={`${isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-cream-200'} border-b px-4 py-2 flex justify-between items-center shadow-sm z-10 shrink-0 w-full max-w-full overflow-hidden`}>
                    <button 
                        onClick={() => router.push('/library')}
                        className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-brown-900'} font-bold flex items-center gap-1 hover:opacity-70 transition-opacity text-xs`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        {t.reader.library}
                    </button>
                    <h1 className={`font-serif font-bold truncate max-w-[50%] text-center flex-1 text-sm ${isDark ? 'text-gray-200' : 'text-brown-900'}`}>{title || 'Loading...'}</h1>
                    
                    {/* Settings Button in Header */}
                    <button 
                        onClick={() => setShowSettings(!showSettings)}
                        className={`p-2 rounded-full transition-colors
                            ${isDark ? 'text-gray-400 hover:bg-[#333] hover:text-white' : 'text-brown-900/60 hover:bg-cream-100 hover:text-brown-900'}`}
                        title={t.sidebar.settings}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                    </button>
                </div>

                <div className="flex-1 relative p-2 md:p-8 flex justify-center items-center overflow-hidden w-full max-w-[100vw]">
                    <div 
                        ref={viewerRef} 
                        className={`w-full max-w-2xl shadow-2xl rounded-lg border h-full max-h-[85vh] overflow-hidden transition-colors duration-300
                            ${isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-cream-200'}`}
                    >
                        {!isLoaded && (
                            <div className={`absolute inset-0 flex flex-col items-center justify-center z-50 ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
                                <div className={`animate-pulse font-serif italic text-xl mb-4 ${isDark ? 'text-gray-400' : 'text-brown-900/40'}`}>
                                    {t.reader.opening_book}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="absolute inset-y-0 left-0 w-10 md:w-12 flex items-center justify-center z-10 pointer-events-none">
                        <button onClick={prevPage} className={`pointer-events-auto w-8 h-8 rounded-full shadow-lg border flex items-center justify-center text-lg transition-all hover:scale-110 active:scale-95
                            ${isDark ? 'bg-[#333] border-[#444] text-gray-200 hover:bg-[#444]' : 'bg-white/80 backdrop-blur-sm border-cream-200 hover:bg-white text-brown-900'}`}>‹</button>
                    </div>
                    <div className="absolute inset-y-0 right-0 w-10 md:w-12 flex items-center justify-center z-10 pointer-events-none">
                        <button onClick={nextPage} className={`pointer-events-auto w-8 h-8 rounded-full shadow-lg border flex items-center justify-center text-lg transition-all hover:scale-110 active:scale-95
                            ${isDark ? 'bg-[#333] border-[#444] text-gray-200 hover:bg-[#444]' : 'bg-white/80 backdrop-blur-sm border-cream-200 hover:bg-white text-brown-900'}`}>›</button>
                    </div>
                </div>

                <div className={`${isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-cream-200'} border-t py-2 px-4 flex flex-col items-center gap-0 relative shrink-0 w-full max-w-full overflow-hidden`}>
                    <div className={`flex justify-center w-full max-w-4xl px-8 text-[11px] font-serif font-bold ${isDark ? 'text-gray-400' : 'text-brown-900/60'}`}>
                        <div className="text-center">{currentPage > 0 ? currentPage : ''}</div>
                    </div>
                    {totalPages > 0 && (
                        <div className={`text-[10px] font-black uppercase tracking-[0.2em] mt-0.5 ${isDark ? 'text-gray-600' : 'text-brown-800/20'}`}>
                            {t.reader.progress}: {Math.round((currentPage / totalPages) * 100)}%
                        </div>
                    )}
                </div>
            </div>

            <ReaderSettings
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                settings={settings}
                onUpdateSettings={(key, value) => setSettings(prev => ({ ...prev, [key]: value }))}
                isMobile={isMobile}
            />
        </div>
    );
}
