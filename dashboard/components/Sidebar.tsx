'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@/types';

const navItems = [
    { name: 'Dashboard', icon: '📊', href: '/dashboard' },
    { name: 'My Books', icon: '📚', href: '/books' },
    { name: 'Reading Plan', icon: '📅', href: '/plan' },
    { name: 'AI Chat', icon: '💬', href: '/chat' },
    { name: 'Leaderboard', icon: '🏆', href: '/leaderboard' },
    { name: 'Library', icon: '📖', href: '/library' },
    { name: 'Settings', icon: '⚙️', href: '/settings' },
];

const mockUser: User = {
    id: '1',
    name: 'Alex',
    isPro: true,
};

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 w-60 h-screen bg-cream-100 flex flex-col border-r border-cream-200">
            {/* Logo Section */}
            <div className="p-8 flex items-center gap-3">
                <span className="text-2xl" role="img" aria-label="book">📖</span>
                <h1 className="text-xl font-serif font-extrabold text-brown-900 tracking-tight">ReadRacing</h1>
            </div>

            {/* Navigation section */}
            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${pathname === item.href
                                ? 'bg-brown-900 text-cream-50 rounded-xl shadow-sm'
                                : 'text-brown-800 hover:bg-cream-200 rounded-xl'
                            }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        {item.name}
                    </Link>
                ))}
            </nav>

            {/* User profile card */}
            <div className="p-4 border-t border-cream-200 mt-auto">
                <div className="bg-white/50 p-4 rounded-2xl flex items-center gap-3 border border-cream-200 shadow-sm">
                    <div className="w-10 h-10 bg-cream-200 rounded-full flex items-center justify-center font-bold text-brown-800">
                        {mockUser.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm text-brown-900">{mockUser.name}</span>
                        {mockUser.isPro && (
                            <span className="bg-brown-900 text-cream-50 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full w-fit">
                                Pro
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}
