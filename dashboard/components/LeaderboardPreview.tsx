
import { LeaderboardEntry } from '@/types';

const mockLeaderboard: LeaderboardEntry[] = [
    { id: '1', userId: '101', userName: 'Sarah Jenkins', booksCount: 24, rank: 1 },
    { id: '2', userId: '102', userName: 'Michael Ross', booksCount: 21, rank: 2 },
    { id: '3', userId: '103', userName: 'Emma Wilson', booksCount: 19, rank: 3 },
    { id: '4', userId: '104', userName: 'David Chen', booksCount: 15, rank: 4 },
    { id: '5', userId: '105', userName: 'Alex (You)', booksCount: 8, rank: 5 },
];

export default function LeaderboardPreview() {
    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-cream-200 flex flex-col h-full">
            <h2 className="text-2xl font-serif font-semibold mb-6 text-brown-900 italic">Top Readers This Week</h2>

            <div className="space-y-4 flex-1">
                {mockLeaderboard.map((user) => (
                    <div key={user.id} className="flex items-center gap-4 bg-cream-50/50 p-3 rounded-2xl border border-cream-100 hover:border-cream-200 transition-colors group">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${user.rank === 1 ? 'bg-yellow-500 text-white' :
                                user.rank === 2 ? 'bg-slate-300 text-slate-700' :
                                    user.rank === 3 ? 'bg-amber-600 text-amber-50' :
                                        'bg-brown-900 text-cream-50'
                            }`}>
                            {user.rank}
                        </div>

                        <div className="w-10 h-10 bg-cream-200 rounded-full flex-shrink-0 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center font-bold text-brown-800">
                            {user.userName.charAt(0)}
                        </div>

                        <div className="flex-1">
                            <span className={`font-bold text-sm ${user.userName.includes('(You)') ? 'text-brown-900' : 'text-brown-800'}`}>
                                {user.userName}
                            </span>
                        </div>

                        <div className="text-right">
                            <span className="text-xs font-black text-brown-900 block">{user.booksCount} books</span>
                            <span className="text-[10px] text-brown-800/40 uppercase font-black">Record</span>
                        </div>
                    </div>
                ))}
            </div>

            <button className="mt-8 text-sm font-bold text-brown-900 group flex items-center justify-center gap-2 hover:underline">
                View Full Global Board
                <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
        </div>
    );
}
