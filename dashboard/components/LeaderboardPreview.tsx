
'use client';

import React, { useEffect, useState } from 'react';
import { LeaderboardEntry, Book } from '@/types';
import { supabase } from '@/lib/supabase';
import { get } from 'idb-keyval';
import Link from 'next/link';

const mockLeaderboard: LeaderboardEntry[] = [
    { id: '1', userId: '101', userName: 'Sarah Jenkins', booksCount: 24, pagesCount: 12450, rank: 1 },
    { id: '2', userId: '102', userName: 'Michael Ross', booksCount: 21, pagesCount: 10200, rank: 2 },
    { id: '3', userId: '103', userName: 'Emma Wilson', booksCount: 19, pagesCount: 9800, rank: 3 },
    { id: '4', userId: '104', userName: 'David Chen', booksCount: 15, pagesCount: 7500, rank: 4 },
];

export default function LeaderboardPreview() {
    const [metric, setMetric] = useState<'books' | 'pages'>('books');
    const [userData, setUserData] = useState({ name: 'You', booksCount: 0, pagesCount: 0 });

    useEffect(() => {
        const fetchUserData = async () => {
            // Get real user from Supabase
            const { data: { user } } = await supabase.auth.getUser();
            const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'You';

            // Get real stats from IndexedDB
            const library = await get('readracing_library_v2') as Book[];
            let booksCount = 0;
            let pagesCount = 0;

            if (library && library.length > 0) {
                booksCount = library.length;
                pagesCount = library.reduce((acc, book) => acc + (book.currentPage || 0), 0);
            }

            setUserData({ name: `${name} (You)`, booksCount, pagesCount });
        };

        fetchUserData();
    }, []);

    const fullLeaderboard = [
        ...mockLeaderboard,
        { 
            id: 'current-user', 
            userId: 'current-user', 
            userName: userData.name, 
            booksCount: userData.booksCount, 
            pagesCount: userData.pagesCount, 
            rank: 5 
        }
    ];

    const sortedData = [...fullLeaderboard].sort((a, b) => 
        metric === 'books' ? b.booksCount - a.booksCount : b.pagesCount - a.pagesCount
    ).map((user, index) => ({ ...user, rank: index + 1 }));

    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-cream-200 flex flex-col h-full relative overflow-hidden group/board">
            {/* Decorative Background Element */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-gold/5 rounded-full blur-3xl group-hover/board:bg-brand-gold/10 transition-colors duration-500"></div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-brown-900 leading-tight">Top Readers</h2>
                    <p className="text-xs text-brown-800/50 font-medium uppercase tracking-wider mt-1">Global Standings • This Week</p>
                </div>
                <div className="flex bg-cream-100 p-1 rounded-xl border border-cream-200 shadow-inner">
                    <button 
                        onClick={() => setMetric('books')}
                        className={`p-1.5 rounded-lg transition-all ${metric === 'books' ? 'bg-white shadow-sm text-brand-gold-dark' : 'text-brown-800/40 hover:text-brown-800'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21.5c-1.35-.85-3.8-1.5-5.5-1.5c-1.65 0-3.35.3-4.75 1.05c-.1.05-.15.05-.25.05c-.25 0-.5-.25-.5-.5V6c.6-.45 1.25-.75 2-1c1.11-.35 2.33-.5 3.5-.5c1.95 0 4.05.4 5.5 1.5c1.45-1.1 3.55-1.5 5.5-1.5c1.17 0 2.39.15 3.5.5c.75.25 1.4.55 2 1v14.6c0 .25-.25.5-.5.5c-.1 0-.15 0-.25-.05c-1.4-.75-3.1-1.05-4.75-1.05c-1.7 0-4.15.65-5.5 1.5"/></svg>
                    </button>
                    <button 
                        onClick={() => setMetric('pages')}
                        className={`p-1.5 rounded-lg transition-all ${metric === 'pages' ? 'bg-white shadow-sm text-brand-gold-dark' : 'text-brown-800/40 hover:text-brown-800'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M13 13v8h8v-8zm6 6h-4v-4h4zm-6-7h8V4h-8zm2-6h4v4h-4zm-9 1h6v2H6v3h3v2H6v3h4v2H4V4h6v2H6z"/></svg>
                    </button>
                </div>
            </div>

            <div className="space-y-3 flex-1 relative z-10">
                {sortedData.map((user, index) => {
                    const isTop3 = user.rank <= 3;
                    const isUser = user.userName.includes('(You)');
                    
                    const rankStyles = {
                        1: 'bg-gradient-to-br from-brand-gold to-brand-gold-dark text-white shadow-lg shadow-brand-gold/20 ring-4 ring-brand-gold/10',
                        2: 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-800 shadow-md ring-4 ring-slate-100',
                        3: 'bg-gradient-to-br from-amber-600 to-amber-700 text-amber-50 shadow-md ring-4 ring-amber-50',
                        default: 'bg-cream-200 text-brown-800'
                    };

                    const borderStyles = {
                        1: 'border-brand-gold/30 bg-brand-gold/[0.03]',
                        2: 'border-slate-200 bg-slate-50/30',
                        3: 'border-amber-100 bg-amber-50/30',
                        default: 'border-cream-100 bg-cream-50/30'
                    };

                    return (
                        <div 
                            key={user.id} 
                            style={{ animationDelay: `${index * 100}ms` }}
                            className={`flex items-center gap-4 p-3.5 rounded-2xl border transition-all duration-300 group hover:scale-[1.02] hover:shadow-md animate-in fade-in slide-in-from-right-4 
                                ${isUser ? 'ring-2 ring-brown-900/5 bg-white shadow-sm' : ''} 
                                ${borderStyles[user.rank as keyof typeof borderStyles] || borderStyles.default}
                                hover:border-brand-gold/20`}
                        >
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black transition-transform group-hover:rotate-12 
                                ${rankStyles[user.rank as keyof typeof rankStyles] || rankStyles.default}`}>
                                {user.rank}
                            </div>

                            <div className={`w-11 h-11 rounded-full flex-shrink-0 border-2 shadow-sm overflow-hidden flex items-center justify-center font-serif font-bold text-lg
                                ${isTop3 ? 'border-white' : 'border-cream-200 bg-cream-100 text-brown-800'}`}>
                                {isTop3 ? (
                                    <div className={`w-full h-full flex items-center justify-center text-white
                                        ${user.rank === 1 ? 'bg-brand-gold' : user.rank === 2 ? 'bg-slate-300' : 'bg-amber-600'}`}>
                                        {user.userName.charAt(0)}
                                    </div>
                                ) : (
                                    user.userName.charAt(0)
                                )}
                            </div>

                            <div className="flex-1">
                                <div className={`font-serif font-bold text-base transition-colors ${isUser ? 'text-brown-900' : 'text-brown-800 group-hover:text-brown-900'}`}>
                                    {user.userName}
                                </div>
                                <div className="text-[10px] text-brown-800/40 uppercase font-black tracking-widest">
                                    {user.rank === 1 ? 'Current Champion' : 'Reader'}
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="flex items-center gap-1 justify-end">
                                    <span className={`text-lg font-black ${isTop3 ? 'text-brown-900' : 'text-brown-800'}`}>
                                        {user.booksCount}
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" className="text-brown-900/20"><path fill="currentColor" d="M12 21.5c-1.35-.85-3.8-1.5-5.5-1.5c-1.65 0-3.35.3-4.75 1.05c-.1.05-.15.05-.25.05c-.25 0-.5-.25-.5-.5V6c.6-.45 1.25-.75 2-1c1.11-.35 2.33-.5 3.5-.5c1.95 0 4.05.4 5.5 1.5c1.45-1.1 3.55-1.5 5.5-1.5c1.17 0 2.39.15 3.5.5c.75.25 1.4.55 2 1v14.6c0 .25-.25.5-.5.5c-.1 0-.15 0-.25-.05c-1.4-.75-3.1-1.05-4.75-1.05c-1.7 0-4.15.65-5.5 1.5"/></svg>
                                </div>
                                <span className="text-[9px] text-brown-800/40 uppercase font-black tracking-tighter">Books read</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Link 
                href="/leaderboard"
                className="mt-8 py-4 px-6 bg-cream-50 hover:bg-white border border-cream-200 rounded-2xl text-sm font-bold text-brown-900 shadow-sm transition-all duration-300 flex items-center justify-center gap-3 group/btn hover:border-brand-gold/30 hover:shadow-md active:scale-95"
            >
                <span className="relative z-10">View Full Global Board</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="group-hover/btn:translate-x-1 transition-transform duration-300 text-brand-gold-dark"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14m-7-7l7 7l-7 7"/></svg>
            </Link>
        </div>
    );
}
