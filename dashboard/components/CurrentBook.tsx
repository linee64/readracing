'use client';

import { Book } from '@/types';
import { useEffect, useState } from 'react';
import { get } from 'idb-keyval';
import { useRouter } from 'next/navigation';

export default function CurrentBook() {
    const [book, setBook] = useState<Book | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadLastBook = async () => {
            try {
                const library = await get('readracing_library_v2') as Book[];
                if (library && library.length > 0) {
                    // Находим книгу с максимальным прогрессом или последнюю измененную
                    // Для простоты возьмем первую из списка, если нет явного флага "последняя"
                    // Но лучше взять ту, где currentPage > 0
                    const inProgress = library.filter(b => b.currentPage > 0);
                    if (inProgress.length > 0) {
                        // Сортируем по ID (так как там Date.now()) чтобы найти последнюю добавленную/измененную
                        const last = inProgress.sort((a, b) => b.id.localeCompare(a.id))[0];
                        setBook(last);
                    } else {
                        setBook(library[0]);
                    }
                }
            } catch (e) {
                console.error('Failed to load last book:', e);
            } finally {
                setIsLoading(false);
            }
        };

        loadLastBook();
    }, []);

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl p-8 shadow-sm mt-8 border border-cream-200 animate-pulse">
                <div className="h-8 bg-cream-100 w-48 mb-6 rounded-lg"></div>
                <div className="flex gap-8">
                    <div className="w-40 h-60 bg-cream-100 rounded-xl"></div>
                    <div className="flex-1 space-y-4">
                        <div className="h-10 bg-cream-100 w-3/4 rounded-lg"></div>
                        <div className="h-6 bg-cream-100 w-1/2 rounded-lg"></div>
                        <div className="h-20 bg-cream-100 w-full rounded-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="bg-white rounded-2xl p-8 shadow-sm mt-8 border border-cream-200 text-center">
                <h2 className="text-2xl font-serif font-semibold mb-2 text-brown-900 italic">No book reading yet</h2>
                <p className="text-brown-800/40 mb-6">Go to your library to start your reading journey!</p>
                <button 
                    onClick={() => router.push('/library')}
                    className="bg-brown-900 text-cream-50 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-brown-800 transition-all"
                >
                    Go to Library
                </button>
            </div>
        );
    }

    const percentage = book.totalPages > 0 ? Math.round((book.currentPage / book.totalPages) * 100) : 0;

    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm mt-8 border border-cream-200">
            <h2 className="text-2xl font-serif font-semibold mb-6 text-brown-900 italic">Currently Reading</h2>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Book Cover */}
                <div className="w-40 h-60 bg-cream-100 rounded-xl flex items-center justify-center shadow-inner border border-cream-200 flex-shrink-0 relative group overflow-hidden">
                    <span className="text-5xl opacity-20 group-hover:scale-110 transition-transform duration-500">📖</span>
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

                <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-3xl font-serif font-bold text-brown-900">{book.title}</h3>
                    <p className="text-lg text-brown-800/60 mt-2 font-medium">by {book.author}</p>

                    <div className="mt-8">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-bold text-brown-800/70">{book.currentPage} / {book.totalPages || '?'} pages</span>
                            <span className="text-xs font-black text-brown-800/40 uppercase tracking-widest">{percentage}% Completed</span>
                        </div>
                        <div className="w-full bg-cream-100 rounded-full h-3 border border-cream-200 overflow-hidden">
                            <div
                                className="bg-brown-900 h-full rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-8">
                        <button 
                            onClick={() => router.push(`/reader/${book.id}`)}
                            className="bg-brown-900 text-cream-50 px-8 py-3.5 rounded-full font-bold shadow-lg hover:bg-brown-800 hover:scale-[1.02] active:scale-95 transition-all duration-200"
                        >
                            Continue Reading
                        </button>
                        <button className="border-2 border-brown-900 text-brown-900 px-8 py-3.5 rounded-full font-bold hover:bg-cream-100 active:scale-95 transition-all duration-200">
                            Ask AI Assistant
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
