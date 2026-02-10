'use client';

import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ChatPage() {
    const [username, setUsername] = useState<string>('Reader');

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Reader';
                setUsername(name);
            }
        });

        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Reader';
                setUsername(name);
            }
        };
        getUser();

        return () => subscription.unsubscribe();
    }, []);

    return (
        <div className="min-h-screen bg-cream-50">
            <div className="max-w-7xl mx-auto p-8 pb-20">
                <DashboardHeader username={username} />
                
                <div className="bg-white rounded-3xl p-12 border border-cream-200 shadow-sm flex flex-col items-center justify-center text-center mt-10">
                    <div className="w-24 h-24 bg-brown-900/5 rounded-full flex items-center justify-center mb-8 relative">
                        <span className="text-5xl animate-bounce">💬</span>
                        <div className="absolute -top-2 -right-2 bg-brand-gold text-brown-900 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                            Soon
                        </div>
                    </div>
                    
                    <h2 className="text-3xl font-serif font-bold text-brown-900 mb-4 italic">
                        AI Reading Assistant
                    </h2>
                    
                    <p className="text-lg text-brown-800/60 max-w-md font-medium leading-relaxed mb-10">
                        We are building a powerful AI that will help you analyze your books, answer complex questions, and find hidden meanings.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
                        <div className="bg-cream-50 p-6 rounded-2xl border border-cream-100 flex flex-col items-center">
                            <span className="text-2xl mb-3">🧐</span>
                            <h4 className="font-bold text-brown-900 text-sm mb-1">Analyze</h4>
                            <p className="text-xs text-brown-800/50">Deep character and plot analysis</p>
                        </div>
                        <div className="bg-cream-50 p-6 rounded-2xl border border-cream-100 flex flex-col items-center">
                            <span className="text-2xl mb-3">❓</span>
                            <h4 className="font-bold text-brown-900 text-sm mb-1">Ask</h4>
                            <p className="text-xs text-brown-800/50">Get answers to any book question</p>
                        </div>
                        <div className="bg-cream-50 p-6 rounded-2xl border border-cream-100 flex flex-col items-center">
                            <span className="text-2xl mb-3">📝</span>
                            <h4 className="font-bold text-brown-900 text-sm mb-1">Summarize</h4>
                            <p className="text-xs text-brown-800/50">Quick recaps of key concepts</p>
                        </div>
                    </div>

                    <div className="mt-12 flex items-center gap-2 px-6 py-3 bg-brown-900 text-cream-50 rounded-full font-bold text-sm shadow-lg opacity-80">
                        <span className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></span>
                        Development in progress
                    </div>
                </div>
            </div>
        </div>
    );
}
