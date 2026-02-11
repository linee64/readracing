'use client';

import { useSidebar } from "@/context/SidebarContext";

export default function MainContent({ children }: { children: React.ReactNode }) {
    const { isCollapsed, setIsMobileOpen } = useSidebar();
    
    return (
        <main className={`flex-1 transition-all duration-300 min-h-screen ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} ml-0`}>
            {/* Mobile Header Bar */}
            <div className="md:hidden sticky top-0 z-40 bg-cream-50/80 backdrop-blur-md border-b border-cream-200 px-4 py-3 flex items-center justify-between">
                <button 
                    onClick={() => setIsMobileOpen(true)}
                    className="p-2 -ml-2 text-brown-900 rounded-lg hover:bg-cream-200"
                    aria-label="Open sidebar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
                <span className="font-serif font-bold text-brown-900">ReadRacing</span>
                <div className="w-8"></div> {/* Spacer for centering */}
            </div>
            {children}
        </main>
    );
}
