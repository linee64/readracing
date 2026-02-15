'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Book } from '@/types';
import { get, set } from 'idb-keyval';
import { useLanguage } from './LanguageContext';

interface DownloadContextType {
    downloadBook: (book: Book) => Promise<void>;
    isDownloading: boolean;
}

const DownloadContext = createContext<DownloadContextType | undefined>(undefined);

export const DownloadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { t } = useLanguage();
    const [isDownloading, setIsDownloading] = useState(false);
    const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null);

    const showToast = useCallback((message: string) => {
        setToast({ message, visible: true });
        setTimeout(() => {
            setToast(null);
        }, 3000);
    }, []);

    const downloadBook = async (bookToAdd: Book) => {
        const bookId = bookToAdd.id;
        
        try {
            const currentLibrary = await get('readracing_library_v2') as Book[] || [];
            
            if (currentLibrary.some(b => b.id === bookId)) {
                showToast(t.library.toast.already_in_library);
                return;
            }

            // If the book has an epubUrl, download it and save to IndexedDB
            if (bookToAdd.epubUrl) {
                setIsDownloading(true);
                showToast(t.library.toast.downloading);
                
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
                            showToast(t.library.toast.local_not_found);
                            setIsDownloading(false);
                            return;
                        }
                    } else {
                        // For external URLs, use the proxy rotation system
                        const proxies = [
                            (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
                            (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
                            (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
                        ];

                        // Try direct fetch first (some servers might have CORS enabled)
                        try {
                            const controller = new AbortController();
                            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
                            const response = await fetch(bookToAdd.epubUrl!, { signal: controller.signal });
                            clearTimeout(timeoutId);
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
                                    const controller = new AbortController();
                                    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s for proxies
                                    
                                    const response = await fetch(targetUrl, { signal: controller.signal });
                                    clearTimeout(timeoutId);

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
                        
                        // Re-fetch library to ensure we have the latest state before appending
                        const latestLibrary = await get('readracing_library_v2') as Book[] || [];
                        await set('readracing_library_v2', [...latestLibrary, bookWithEpub]);
                        
                        showToast(t.library.toast.download_success);
                    } catch (err) {
                        console.error('Failed to save EPUB to IDB:', err);
                        showToast(t.library.toast.save_error);
                    }
                } else {
                    showToast(t.library.toast.download_failed);
                }
                setIsDownloading(false);
            } else {
                // Regular mock book without EPUB
                const latestLibrary = await get('readracing_library_v2') as Book[] || [];
                await set('readracing_library_v2', [...latestLibrary, bookToAdd]);
                showToast(t.library.toast.added);
            }
        } catch (err) {
            console.error('Failed to add book:', err);
            setIsDownloading(false);
        }
    };

    return (
        <DownloadContext.Provider value={{ downloadBook, isDownloading }}>
            {children}
            {/* Global Toast */}
            {toast && (
                <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 bg-[#2D7A4F] text-white px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-top duration-300 font-sans">
                    <span className="font-semibold">{toast.message}</span>
                    <button
                        onClick={() => setToast(null)}
                        className="text-white/80 hover:text-white text-sm font-bold ml-4 border-l border-white/20 pl-4"
                    >
                        {t.library.undo}
                    </button>
                </div>
            )}
        </DownloadContext.Provider>
    );
};

export const useDownload = () => {
    const context = useContext(DownloadContext);
    if (context === undefined) {
        throw new Error('useDownload must be used within a DownloadProvider');
    }
    return context;
};
