'use client';

import { useSidebar } from '@/context/SidebarContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@/types';
import Image from 'next/image';

const navItems = [
    { 
        name: 'Dashboard', 
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Z"/>
            </svg>
        ), 
        href: '/dashboard' 
    },
    { 
        name: 'My Books', 
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M4.727 2.712c.306-.299.734-.494 1.544-.6C7.105 2.002 8.209 2 9.793 2h4.414c1.584 0 2.688.002 3.522.112c.81.106 1.238.301 1.544.6c.305.3.504.72.613 1.513c.112.817.114 1.899.114 3.45v7.839H7.346c-.903 0-1.519-.001-2.047.138c-.472.124-.91.326-1.299.592V7.676c0-1.552.002-2.634.114-3.451c.109-.793.308-1.213.613-1.513m2.86 3.072a.82.82 0 0 0-.828.81c0 .448.37.811.827.811h8.828a.82.82 0 0 0 .827-.81a.82.82 0 0 0-.827-.811zm-.828 4.594c0-.447.37-.81.827-.81h5.517a.82.82 0 0 1 .828.81a.82.82 0 0 1-.828.811H7.586a.82.82 0 0 1-.827-.81" clipRule="evenodd"/><path fill="currentColor" d="M7.473 17.135c-1.079 0-1.456.007-1.746.083a2.46 2.46 0 0 0-1.697 1.538q.023.571.084 1.019c.109.793.308 1.213.613 1.513c.306.299.734.494 1.544.6c.834.11 1.938.112 3.522.112h4.414c1.584 0 2.688-.002 3.522-.111c.81-.107 1.238-.302 1.544-.601c.216-.213.38-.486.495-.91H7.586a.82.82 0 0 1-.827-.81c0-.448.37-.811.827-.811H19.97c.02-.466.027-1 .03-1.622z"/></svg>
        ), 
        href: '/library',
        alias: '/reader'
    },
    { 
        name: 'Library', 
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M8.51 2h6.98c.232 0 .41 0 .566.015c1.108.109 2.015.775 2.4 1.672H5.544c.385-.897 1.292-1.563 2.4-1.672C8.098 2 8.276 2 8.51 2m-2.2 2.723c-1.39 0-2.53.84-2.91 1.954l-.024.07c.398-.12.813-.2 1.232-.253c1.08-.139 2.446-.139 4.032-.139h6.892c1.586 0 2.951 0 4.032.139c.42.054.834.132 1.232.253l-.023-.07c-.38-1.114-1.52-1.954-2.911-1.954z"/><path fill="currentColor" fillRule="evenodd" d="M8.672 7.542h6.656c3.374 0 5.062 0 6.01.987s.724 2.511.278 5.56l-.422 2.892c-.35 2.391-.525 3.587-1.422 4.303s-2.22.716-4.867.716h-5.81c-2.646 0-3.97 0-4.867-.716s-1.072-1.912-1.422-4.303l-.422-2.891c-.447-3.05-.67-4.574.278-5.561s2.636-.987 6.01-.987M8 18c0-.414.373-.75.833-.75h6.334c.46 0 .833.336.833.75s-.373.75-.833.75H8.833c-.46 0-.833-.336-.833-.75" clipRule="evenodd"/></svg>
        ), 
        href: '/books' 
    },
    { 
        name: 'Reading Plan', 
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-560H200v560Zm80-80h400v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm-80 400v-560 560Z"/>
            </svg>
        ), 
        href: '/plan' 
    },
    { 
        name: 'AI Chat', 
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                <path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/>
            </svg>
        ), 
        href: '/chat' 
    },
    { 
        name: 'Leaderboard', 
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                <path d="M400-320h160v-400H400v400Zm-240 0h160v-240H160v240Zm480 0h160v-480H640v480ZM120-240v-80h720v80H120Z"/>
            </svg>
        ), 
        href: '/leaderboard' 
    },
    { 
        name: 'Settings', 
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M14.279 2.152C13.909 2 13.439 2 12.5 2s-1.408 0-1.779.152a2 2 0 0 0-1.09 1.083c-.094.223-.13.484-.145.863a1.62 1.62 0 0 1-.796 1.353a1.64 1.64 0 0 1-1.579.008c-.338-.178-.583-.276-.825-.308a2.03 2.03 0 0 0-1.49.396c-.318.242-.553.646-1.022 1.453c-.47.807-.704 1.21-.757 1.605c-.07.526.074 1.058.4 1.479c.148.192.357.353.68.555c.477.297.783.803.783 1.361s-.306 1.064-.782 1.36c-.324.203-.533.364-.682.556a2 2 0 0 0-.399 1.479c.053.394.287.798.757 1.605s.704 1.21 1.022 1.453c.424.323.96.465 1.49.396c.242-.032.487-.13.825-.308a1.64 1.64 0 0 1 1.58.008c.486.28.774.795.795 1.353c.015.38.051.64.145.863c.204.49.596.88 1.09 1.083c.37.152.84.152 1.779.152s1.409 0 1.779-.152a2 2 0 0 0 1.09-1.083c.094-.223.13-.483.145-.863c.02-.558.309-1.074.796-1.353a1.64 1.64 0 0 1 1.579-.008c.338.178.583.276.825.308c.53.07 1.066-.073 1.49-.396c.318-.242.553-.646 1.022-1.453c.47-.807.704-1.21.757-1.605a2 2 0 0 0-.4-1.479c-.148-.192-.357-.353-.68-.555c-.477-.297-.783-.803-.783-1.361s.306-1.064.782-1.36c.324-.203.533-.364.682-.556a2 2 0 0 0 .399-1.479c-.053-.394-.287-.798-.757-1.605s-.704-1.21-1.022-1.453a2.03 2.03 0 0 0-1.49-.396c-.242.032-.487.13-.825.308a1.64 1.64 0 0 1-1.58-.008a1.62 1.62 0 0 1-.795-1.353c-.015-.38-.051-.64-.145-.863a2 2 0 0 0-1.09-1.083M12.5 15c1.67 0 3.023-1.343 3.023-3S14.169 9 12.5 9s-3.023 1.343-3.023 3s1.354 3 3.023 3" clipRule="evenodd"/></svg>
        ), 
        href: '/settings' 
    },
];

const mockUser: User = {
    id: '1',
    name: 'Alex',
    isPro: true,
};

export default function Sidebar() {
    const pathname = usePathname();
    const { isCollapsed, setIsCollapsed } = useSidebar();

    return (
        <aside className={`fixed left-0 top-0 h-screen bg-cream-100 flex flex-col border-r border-cream-200 transition-all duration-300 z-[100] ${isCollapsed ? 'w-20' : 'w-64'}`}>
            {/* Logo Section */}
            <div className={`relative flex items-center gap-3 transition-all duration-300 ${isCollapsed ? 'p-4 justify-center' : 'p-8'}`}>
                <div className="relative w-10 h-10 flex-shrink-0 bg-white rounded-xl shadow-sm border border-cream-200 p-1.5 flex items-center justify-center">
                    <Image 
                        src="/landing-logo.png" 
                        alt="ReadRacing Logo" 
                        fill
                        className="object-contain p-1"
                    />
                </div>
                {!isCollapsed && (
                    <h1 className="text-xl font-serif font-extrabold text-brown-900 tracking-tight whitespace-nowrap">
                        ReadRacing
                    </h1>
                )}

                {/* Toggle Button */}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 bg-brown-900 text-cream-50 w-6 h-6 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-[110]"
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <span className="text-xs">{isCollapsed ? '→' : '←'}</span>
                </button>
            </div>

            {/* Navigation section */}
            <nav className={`flex-1 space-y-1 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href) || (item.alias && pathname.startsWith(item.alias));
                    const isLeaderboard = item.name === 'Leaderboard';
                    
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 py-3 text-sm font-medium transition-all duration-300 ${isCollapsed ? 'px-0 justify-center' : 'px-4'} ${isActive
                                    ? 'bg-brown-900 text-cream-50 rounded-xl shadow-md ring-2 ring-brand-gold/20'
                                    : isLeaderboard 
                                        ? 'text-brown-800 hover:bg-brand-gold/10 hover:text-brand-gold-dark rounded-xl border border-transparent hover:border-brand-gold/30'
                                        : 'text-brown-800 hover:bg-cream-200 rounded-xl'
                                } group relative`}
                            title={isCollapsed ? item.name : ''}
                        >
                            <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'} ${isLeaderboard && !isActive ? 'text-brand-gold-dark/80' : ''}`}>
                                {item.icon}
                            </span>
                            {!isCollapsed && (
                                <span className={`whitespace-nowrap overflow-hidden ${isLeaderboard && !isActive ? 'font-bold' : ''}`}>
                                    {item.name}
                                </span>
                            )}
                            {isLeaderboard && !isCollapsed && (
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold"></span>
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User profile card */}
            <div className={`border-t border-cream-200 mt-auto transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-4'}`}>
                <div className={`bg-white/50 rounded-2xl flex items-center gap-3 border border-cream-200 shadow-sm transition-all duration-300 ${isCollapsed ? 'p-2 justify-center' : 'p-4'}`}>
                    <div className="w-10 h-10 bg-cream-200 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-brown-800">
                        {mockUser.name.charAt(0)}
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col overflow-hidden">
                            <span className="font-semibold text-sm text-brown-900 truncate">{mockUser.name}</span>
                            {mockUser.isPro && (
                                <span className="bg-brown-900 text-cream-50 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full w-fit">
                                    Pro
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
