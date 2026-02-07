'use client';

import { useSidebar } from "@/context/SidebarContext";

export default function MainContent({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar();
    
    return (
        <main className={`flex-1 transition-all duration-300 min-h-screen ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
            {children}
        </main>
    );
}
