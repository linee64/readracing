
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
    const [userData, setUserData] = useState({ name: 'You', booksCount: 0, pagesCount: 0 });
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Get current user data
                const { data: { session } } = await supabase.auth.getSession();
                const user = session?.user;
                const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'You';

                const library = await get('readracing_library_v2') as Book[];
                let booksCount = 0;
                let pagesCount = 0;

                console.log('LeaderboardPreview: Fetched library from IDB:', library);

                if (library && library.length > 0) {
                    booksCount = library.filter(book =>
                        book.totalPages > 0 && (book.currentPage || 0) >= book.totalPages
                    ).length;
                    pagesCount = library.reduce((acc, book) => acc + (book.currentPage || 0), 0);
                }

                console.log('LeaderboardPreview: Calculated pages:', pagesCount);
                setUserData({ name: `${name} (You)`, booksCount, pagesCount });

                // Forced sync of current user progress to Supabase
                if (user) {
                    console.log('LeaderboardPreview: Syncing to Supabase:', pagesCount);
                    const { error: syncError } = await supabase
                        .from('profiles')
                        .upsert({
                            id: user.id,
                            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown Reader',
                            pages_read: pagesCount,
                            updated_at: new Date().toISOString()
                        });

                    if (syncError) {
                        console.error('Leaderboard sync error:', syncError.message);
                    } else {
                        console.log('LeaderboardPreview: Sync successful');
                    }
                }

                // 2. Get global leaderboard from Supabase
                const { data: profiles, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .gt('pages_read', 0)
                    .order('pages_read', { ascending: false });

                if (error) throw error;

                let finalBoard: LeaderboardEntry[] = [];

                // If we have 5 or more real users, use only them
                if (profiles && profiles.length >= 5) {
                    finalBoard = profiles.map((p, index) => ({
                        id: p.id,
                        userId: p.id,
                        userName: p.id === user?.id ? `${p.full_name} (You)` : p.full_name,
                        userAvatar: p.avatar_url,
                        booksCount: 0, // We don't track this in profiles yet
                        pagesCount: p.pages_read,
                        rank: index + 1
                    }));
                } else {
                    // Otherwise mix with bots
                    const realUsers = (profiles || []).map(p => ({
                        id: p.id,
                        userId: p.id,
                        userName: p.id === user?.id ? `${p.full_name} (You)` : p.full_name,
                        userAvatar: p.avatar_url,
                        booksCount: 0,
                        pagesCount: p.pages_read,
                        rank: 0
                    }));

                    // Filter out bots that might have same name as real users (optional but good)
                    const realUserIds = new Set(realUsers.map(u => u.id));
                    const remainingBots = mockLeaderboard.filter(bot => !realUserIds.has(bot.id));

                    finalBoard = [...realUsers, ...remainingBots]
                        .sort((a, b) => b.pagesCount - a.pagesCount)
                        .map((u, i) => ({ ...u, rank: i + 1 }));
                }

                setLeaderboard(finalBoard.slice(0, 5));
            } catch (e) {
                console.error('Failed to fetch leaderboard:', e);
                // Fallback to mock data on error
                setLeaderboard(mockLeaderboard);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-cream-200 flex flex-col h-full items-center justify-center">
                <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const sortedData = leaderboard;

    return (
        <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-cream-200 flex flex-col h-full relative overflow-hidden group/board">
            {/* Decorative Background Element */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-gold/5 rounded-full blur-3xl group-hover/board:bg-brand-gold/10 transition-colors duration-500"></div>

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-brown-900 leading-tight">Top Readers</h2>
                    <p className="text-xs text-brown-800/50 font-medium uppercase tracking-wider mt-1">Global Standings • This Week</p>
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
                                {user.userAvatar ? (
                                    <img src={user.userAvatar} alt={user.userName} className="w-full h-full object-cover" />
                                ) : isTop3 ? (
                                    <div className={`w-full h-full flex items-center justify-center text-white
                                        ${user.rank === 1 ? 'bg-brand-gold' : user.rank === 2 ? 'bg-slate-300' : 'bg-amber-600'}`}>
                                        {user.userName.charAt(0)}
                                    </div>
                                ) : (
                                    user.userName.charAt(0)
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className={`font-serif font-bold text-base transition-colors truncate ${isUser ? 'text-brown-900' : 'text-brown-800 group-hover:text-brown-900'}`}>
                                    {user.userName}
                                </div>
                                <div className="text-[10px] text-brown-800/40 uppercase font-black tracking-widest truncate">
                                    {user.rank === 1 ? 'Current Champion' : 'Reader'}
                                </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                                <div className="flex items-center gap-1 justify-end">
                                    <span className={`text-lg font-black ${isTop3 ? 'text-brown-900' : 'text-brown-800'}`}>
                                        {user.pagesCount.toLocaleString()}
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" className="text-brown-900/20"><path fill="currentColor" d="M13 13v8h8v-8zm6 6h-4v-4h4zm-6-7h8V4h-8zm2-6h4v4h-4zm-9 1h6v2H6v3h3v2H6v3h4v2H4V4h6v2H6z" /></svg>
                                </div>
                                <div className="text-[9px] text-brown-800/40 uppercase font-black tracking-tighter">Pages read</div>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="group-hover/btn:translate-x-1 transition-transform duration-300 text-brand-gold-dark"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14m-7-7l7 7l-7 7" /></svg>
            </Link>
        </div>
    );
}
