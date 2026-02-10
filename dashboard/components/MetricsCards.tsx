
'use client';

import { useEffect, useState } from 'react';
import { get } from 'idb-keyval';
import { Book } from '@/types';

interface MetricCardProps {
    icon: string | React.ReactNode;
    number: string | React.ReactNode;
    subtitle: string;
    hasProgressBar?: boolean;
    progress?: number;
}

function MetricCard({ icon, number, subtitle, hasProgressBar, progress }: MetricCardProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-cream-200">
            <div className="flex items-center justify-between mb-3">
                {typeof icon === 'string' ? (
                    <span className="text-3xl" role="img" aria-label="metric icon">{icon}</span>
                ) : (
                    icon
                )}
            </div>
            <div className="text-3xl font-bold text-brown-900">{number}</div>
            <div className="text-sm text-brown-800/60 mt-1 font-medium">{subtitle}</div>

            {hasProgressBar && (
                <div className="w-full bg-cream-200 rounded-full h-2 mt-4 overflow-hidden">
                    <div
                        className="bg-brown-900 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            )}
        </div>
    );
}

export default function MetricsCards() {
    const [stats, setStats] = useState({ pagesCurrent: 0, pagesTotal: 0, booksCount: 0 });

    useEffect(() => {
        const loadStats = async () => {
            const library = await get('readracing_library_v2') as Book[];
            if (library && library.length > 0) {
                // Sum up pages from all books in library
                const totalCurrent = library.reduce((acc, book) => acc + (book.currentPage || 0), 0);
                const totalMax = library.reduce((acc, book) => acc + (book.totalPages || 0), 0);
                
                // Count only fully read books
                const completedBooksCount = library.filter(book => 
                    book.totalPages > 0 && (book.currentPage || 0) >= book.totalPages
                ).length;

                setStats({ 
                    pagesCurrent: totalCurrent, 
                    pagesTotal: totalMax,
                    booksCount: completedBooksCount
                });
            }
        };
        loadStats();
    }, []);

    const progressPercent = stats.pagesTotal > 0 
        ? Math.min(Math.round((stats.pagesCurrent / stats.pagesTotal) * 100), 100) 
        : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <MetricCard
                icon={
                    <span className="text-brown-900" role="img" aria-label="streak icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m12 12.9l-2.13 2.09c-.56.56-.87 1.29-.87 2.07C9 18.68 10.35 20 12 20s3-1.32 3-2.94c0-.78-.31-1.52-.87-2.07z"/><path fill="currentColor" d="m16 6l-.44.55C14.38 8.02 12 7.19 12 5.3V2S4 6 4 13c0 2.92 1.56 5.47 3.89 6.86c-.56-.79-.89-1.76-.89-2.8c0-1.32.52-2.56 1.47-3.5L12 10.1l3.53 3.47c.95.93 1.47 2.17 1.47 3.5c0 1.02-.31 1.96-.85 2.75c1.89-1.15 3.29-3.06 3.71-5.3c.66-3.55-1.07-6.9-3.86-8.52"/></svg>
                    </span>
                }
                number="12 days"
                subtitle="Keep it going!"
            />

            <MetricCard
                icon={
                    <div className="text-brown-900">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M14 2a8 8 0 0 0-8 8a8 8 0 0 0 8 8a8 8 0 0 0 8-8a8 8 0 0 0-8-8M4.93 5.82A8.01 8.01 0 0 0 2 12a8 8 0 0 0 8 8c.64 0 1.27-.08 1.88-.23c-1.76-.39-3.38-1.27-4.71-2.48A6 6 0 0 1 4 12c0-.3.03-.59.07-.89C4.03 10.74 4 10.37 4 10c0-1.44.32-2.87.93-4.18m13.16.26L19.5 7.5L13 14l-3.79-3.79l1.42-1.42L13 11.17"/></svg>
                    </div>
                }
                number={`${stats.booksCount} books`}
                subtitle="This year"
            />

            <MetricCard
                icon={
                    <div className="bg-cream-100 p-2 rounded-xl text-brown-900">
                        <span className="text-3xl" role="img" aria-label="metric icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21.5c-1.35-.85-3.8-1.5-5.5-1.5c-1.65 0-3.35.3-4.75 1.05c-.1.05-.15.05-.25.05c-.25 0-.5-.25-.5-.5V6c.6-.45 1.25-.75 2-1c1.11-.35 2.33-.5 3.5-.5c1.95 0 4.05.4 5.5 1.5c1.45-1.1 3.55-1.5 5.5-1.5c1.17 0 2.39.15 3.5.5c.75.25 1.4.55 2 1v14.6c0 .25-.25.5-.5.5c-.1 0-.15 0-.25-.05c-1.4-.75-3.1-1.05-4.75-1.05c-1.7 0-4.15.65-5.5 1.5m-1-14c-1.36-.6-3.16-1-4.5-1c-1.2 0-2.4.15-3.5.5v11.5c1.1-.35 2.3-.5 3.5-.5c1.34 0 3.14.4 4.5 1zM13 19c1.36-.6 3.16-1 4.5-1c1.2 0 2.4.15 3.5.5V7c-1.1-.35-2.3-.5-3.5-.5c-1.34 0-3.14.4-4.5 1z"/></svg>
                        </span>
                    </div>
                }
                number={<span>{stats.pagesCurrent} pages</span>}
                subtitle="Daily Goal: 60"
                hasProgressBar
                progress={progressPercent}
            />
        </div>
    );
}
