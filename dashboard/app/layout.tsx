'use client';

import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import MainContent from "@/components/MainContent";
import { Analytics } from "@vercel/analytics/next";
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = ['/login', '/signup', '/verify-email'].includes(pathname);

  // Clear IndexedDB when account changes or on first load if no user
  useEffect(() => {
    const syncUserAndStorage = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const lastUserId = localStorage.getItem('last_user_id');

      if (user) {
        if (lastUserId && lastUserId !== user.id) {
          // User changed! Clear local book storage
          console.log('User changed, clearing local storage...');
          const { del } = await import('idb-keyval');
          await del('readracing_library_v2');
          localStorage.removeItem('readracing_streak');
          // Also clear any other user-specific data if needed
        }
        localStorage.setItem('last_user_id', user.id);
      } else {
        // No user, clear last_user_id to ensure next login is fresh
        localStorage.removeItem('last_user_id');
      }
    };

    syncUserAndStorage();
  }, []);

  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <body className="font-sans text-brand-black bg-brand-beige antialiased">
        <Analytics />
        <SidebarProvider>
          {isAuthPage ? (
            <main className="min-h-screen">
              {children}
            </main>
          ) : (
            <div className="flex">
              <Sidebar />
              <MainContent>{children}</MainContent>
            </div>
          )}
        </SidebarProvider>
      </body>
    </html>
  );
}
