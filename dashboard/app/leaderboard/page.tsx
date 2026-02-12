'use client';

import { LeaderboardEntry, Book } from '@/types';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { get } from 'idb-keyval';

const mockFullLeaderboard: LeaderboardEntry[] = [
    { id: '1', userId: '101', userName: 'Sarah Jenkins', booksCount: 24, pagesCount: 12450, rank: 1 },
    { id: '2', userId: '102', userName: 'Michael Ross', booksCount: 21, pagesCount: 10200, rank: 2 },
    { id: '3', userId: '103', userName: 'Emma Wilson', booksCount: 19, pagesCount: 9800, rank: 3 },
    { id: '4', userId: '104', userName: 'David Chen', booksCount: 15, pagesCount: 7500, rank: 4 },
    { id: '6', userId: '106', userName: 'Jessica Lee', booksCount: 7, pagesCount: 3800, rank: 6 },
    { id: '7', userId: '107', userName: 'Ryan Thompson', booksCount: 6, pagesCount: 3100, rank: 7 },
    { id: '8', userId: '108', userName: 'Sophia Garcia', booksCount: 5, pagesCount: 2900, rank: 8 },
    { id: '9', userId: '109', userName: 'Liam Wright', booksCount: 4, pagesCount: 2100, rank: 9 },
    { id: '10', userId: '110', userName: 'Olivia Brown', booksCount: 3, pagesCount: 1500, rank: 10 },
];

export default function LeaderboardPage() {
    const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'all-time'>('weekly');
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

                if (library && library.length > 0) {
                    booksCount = library.filter(book =>
                        book.totalPages > 0 && (book.currentPage || 0) >= book.totalPages
                    ).length;
                    pagesCount = library.reduce((acc, book) => acc + (book.currentPage || 0), 0);
                }

                setUserData({ name: `${name} (You)`, booksCount, pagesCount });

                // Forced sync of current user progress to Supabase
                if (user) {
                    const { error: syncError } = await supabase
                        .from('profiles')
                        .upsert({
                            id: user.id,
                            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown Reader',
                            pages_read: pagesCount,
                            updated_at: new Date().toISOString()
                        });

                    if (syncError) {
                        console.error('Leaderboard page sync error:', syncError.message);
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
                        booksCount: 0,
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

                    const realUserIds = new Set(realUsers.map(u => u.id));
                    const remainingBots = mockFullLeaderboard.filter(bot => !realUserIds.has(bot.id));

                    finalBoard = [...realUsers, ...remainingBots]
                        .sort((a, b) => b.pagesCount - a.pagesCount)
                        .map((u, i) => ({ ...u, rank: i + 1 }));
                }

                setLeaderboard(finalBoard);
            } catch (e) {
                console.error('Failed to fetch leaderboard:', e);
                setLeaderboard(mockFullLeaderboard);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const sortedData = leaderboard;
    const top3 = sortedData.slice(0, 3);
    const others = sortedData.slice(3);

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12 px-4 md:px-0">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif font-black text-brown-900">Global Leaderboard</h1>
                    <p className="text-brown-800/60 mt-2 font-medium">Celebrate the most dedicated readers in the community.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Timeframe Toggle */}
                    <div className="flex bg-cream-200/50 p-1.5 rounded-2xl border border-cream-200 overflow-x-auto">
                        {(['weekly', 'monthly', 'all-time'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTimeframe(t)}
                                className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 capitalize whitespace-nowrap ${timeframe === t
                                        ? 'bg-brown-900 text-cream-50 shadow-md'
                                        : 'text-brown-800/60 hover:text-brown-900'
                                    }`}
                            >
                                {t.replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Podium Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end pt-10 pb-4">
                {/* 1st Place (Mobile: First) */}
                <div className="order-1 md:order-2 group">
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-brand-gold animate-bounce">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="currentColor" d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14z" /></svg>
                            </div>
                            <div className="w-32 h-32 rounded-full bg-brand-gold/10 border-4 border-brand-gold shadow-2xl shadow-brand-gold/20 overflow-hidden flex items-center justify-center text-4xl font-serif font-bold text-brand-gold-dark group-hover:scale-110 transition-transform duration-500 relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/20 to-transparent animate-pulse"></div>
                                {top3[0].userAvatar ? (
                                    <img src={top3[0].userAvatar} alt={top3[0].userName} className="w-full h-full object-cover" />
                                ) : (
                                    top3[0].userName.charAt(0)
                                )}
                            </div>
                            <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center text-white text-xl font-black shadow-lg border-4 border-white">
                                1
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <h3 className="font-serif font-bold text-2xl text-brown-900">{top3[0].userName}</h3>
                            <p className="text-brand-gold-dark font-black text-base uppercase tracking-widest">
                                {top3[0].pagesCount.toLocaleString()} pages
                            </p>
                        </div>
                        <div className="w-full h-44 bg-gradient-to-b from-brand-gold/20 to-transparent mt-4 rounded-t-3xl border-x border-t border-brand-gold/30 relative overflow-hidden hidden md:block">
                            <div className="absolute top-0 left-0 w-full h-1 bg-brand-gold"></div>
                        </div>
                    </div>
                </div>

                {/* 2nd Place */}
                <div className="order-2 md:order-1 group">
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-slate-300 shadow-xl overflow-hidden flex items-center justify-center text-3xl font-serif font-bold text-slate-500 group-hover:scale-110 transition-transform duration-500">
                                {top3[1].userAvatar ? (
                                    <img src={top3[1].userAvatar} alt={top3[1].userName} className="w-full h-full object-cover" />
                                ) : (
                                    top3[1].userName.charAt(0)
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center text-white font-black shadow-lg border-2 border-white">
                                2
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <h3 className="font-serif font-bold text-xl text-brown-900">{top3[1].userName}</h3>
                            <p className="text-slate-500 font-black text-sm uppercase tracking-tighter">
                                {top3[1].pagesCount.toLocaleString()} pages
                            </p>
                        </div>
                        <div className="w-full h-32 bg-gradient-to-b from-slate-200/50 to-transparent mt-4 rounded-t-3xl border-x border-t border-slate-200 hidden md:block"></div>
                    </div>
                </div>

                {/* 3rd Place */}
                <div className="order-3 group">
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-amber-50 border-4 border-amber-600/30 shadow-lg overflow-hidden flex items-center justify-center text-2xl font-serif font-bold text-amber-700 group-hover:scale-110 transition-transform duration-500">
                                {top3[2].userAvatar ? (
                                    <img src={top3[2].userAvatar} alt={top3[2].userName} className="w-full h-full object-cover" />
                                ) : (
                                    top3[2].userName.charAt(0)
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-black shadow-lg border-2 border-white text-sm">
                                3
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <h3 className="font-serif font-bold text-lg text-brown-900">{top3[2].userName}</h3>
                            <p className="text-amber-700/60 font-black text-xs uppercase tracking-tighter">
                                {top3[2].pagesCount.toLocaleString()} pages
                            </p>
                        </div>
                        <div className="w-full h-24 bg-gradient-to-b from-amber-100/40 to-transparent mt-4 rounded-t-3xl border-x border-t border-amber-200/50 hidden md:block"></div>
                    </div>
                </div>
            </div>

            {/* List Section */}
            <div className="bg-white rounded-[2.5rem] p-4 md:p-8 shadow-sm border border-cream-200 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-cream-200 to-transparent opacity-30"></div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-3 min-w-[600px] md:min-w-0">
                        <thead>
                            <tr className="text-brown-800/40 text-[10px] uppercase font-black tracking-widest">
                                <th className="px-4 md:px-6 py-2">Rank</th>
                                <th className="px-4 md:px-6 py-2">Reader</th>
                                <th className="px-4 md:px-6 py-2 text-right">Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {others.map((user) => {
                                const isUser = user.userName.includes('(You)');
                                return (
                                    <tr
                                        key={user.id}
                                        className={`group transition-all duration-300 hover:scale-[1.01] ${isUser ? 'bg-cream-50/80' : 'hover:bg-cream-50/50'}`}
                                    >
                                        <td className="px-4 md:px-6 py-4 first:rounded-l-2xl">
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${isUser ? 'bg-brown-900 text-cream-50' : 'bg-cream-100 text-brown-800'}`}>
                                                {user.rank}
                                            </span>
                                        </td>
                                        <td className="px-4 md:px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center font-serif font-bold text-brown-800 border-2 border-white shadow-sm overflow-hidden">
                                                    {user.userAvatar ? (
                                                        <img src={user.userAvatar} alt={user.userName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        user.userName.charAt(0)
                                                    )}
                                                </div>
                                                <div>
                                                    <div className={`font-serif font-bold text-base ${isUser ? 'text-brown-900' : 'text-brown-800'}`}>
                                                        {user.userName}
                                                    </div>
                                                    <div className="text-[10px] text-brown-800/40 font-black uppercase tracking-wider">
                                                        Joined 2 months ago
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 text-right last:rounded-r-2xl">
                                            <div className="flex flex-col items-end">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-lg font-black text-brown-900">
                                                        {user.pagesCount.toLocaleString()}
                                                    </span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="text-brown-900/20"><path fill="currentColor" d="M13 13v8h8v-8zm6 6h-4v-4h4zm-6-7h8V4h-8zm2-6h4v4h-4zm-9 1h6v2H6v3h3v2H6v3h4v2H4V4h6v2H6z" /></svg>
                                                </div>
                                                <div className="text-[9px] text-brown-800/30 font-black uppercase tracking-tighter">
                                                    Pages Read
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Personal Stats Banner */}
            <div className="bg-brown-900 rounded-[2.5rem] p-6 md:p-8 text-cream-50 flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-brown-900/20 relative overflow-hidden group gap-6 md:gap-0 text-center md:text-left">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/10 transition-colors duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
                    <div className="w-20 h-20 bg-brand-gold rounded-full flex items-center justify-center text-brown-900 text-3xl font-black shadow-lg border-4 border-brown-800">
                        #{sortedData.find(u => u.userName.includes('(You)'))?.rank}
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif font-bold">You're doing great, {userData.name.split(' ')[0]}!</h2>
                        <p className="text-cream-50/60 font-medium">
                            Only {(sortedData[3].pagesCount - sortedData[4].pagesCount + 100).toLocaleString()} pages away from overtaking {sortedData[3].userName}.
                        </p>
                    </div>
                </div>
                <button className="relative z-10 w-full md:w-auto px-8 py-4 bg-brand-gold hover:bg-brand-gold-dark text-brown-900 font-bold rounded-2xl transition-all duration-300 shadow-lg active:scale-95">
                    Share Progress
                </button>
            </div>
        </div>
    );
}
