'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import { supabase } from '@/lib/supabase';

interface Highlight {
    id: string;
    quote: string;
    book_title: string;
    page_number: number;
    color: string;
    created_at: string;
}

export default function HighlightsPage() {
    const router = useRouter();
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('Reader');

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUsername(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Reader');
                fetchHighlights(user.id);
            }
        };
        getUser();
    }, []);

    const fetchHighlights = async (userId: string) => {
        const { data, error } = await supabase
            .from('highlights')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        if (data) setHighlights(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this highlight?')) return;
        
        const { error } = await supabase.from('highlights').delete().eq('id', id);
        if (!error) {
            setHighlights(prev => prev.filter(h => h.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-cream-50">
            <div className="max-w-7xl mx-auto p-4 md:p-8 pb-20">
                <DashboardHeader username={username} />
                
                <div className="mt-8">
                    <div className="flex items-center gap-4 mb-8">
                        <button 
                            onClick={() => router.back()}
                            className="w-10 h-10 rounded-full bg-white border border-cream-200 flex items-center justify-center text-brown-900 hover:bg-cream-50 transition-colors shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20z"/></svg>
                        </button>
                        <h1 className="text-3xl font-serif font-bold text-brown-900">Your Highlights</h1>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                             <div className="animate-spin w-8 h-8 border-4 border-brown-900 border-t-transparent rounded-full mx-auto"></div>
                        </div>
                    ) : highlights.length === 0 ? (
                        <div className="text-center py-20 text-brown-800/40">
                            <p className="text-xl font-serif italic mb-4">No highlights yet</p>
                            <button 
                                onClick={() => router.push('/dashboard')}
                                className="text-sm font-bold text-brown-900 underline"
                            >
                                Go back to add some
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {highlights.map(highlight => (
                                <div key={highlight.id} className={`p-8 rounded-[2.5rem] ${highlight.color} relative group transition-transform hover:scale-[1.02] duration-300 shadow-sm`}>
                                    <button 
                                        onClick={() => handleDelete(highlight.id)}
                                        className="absolute top-6 right-6 text-brown-800/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Delete highlight"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                                    </button>
                                    <p className="font-serif text-xl text-brown-900 leading-relaxed italic mb-6">
                                        "{highlight.quote}"
                                    </p>
                                    <div className="flex justify-between items-center text-xs font-black text-brown-800/40 uppercase tracking-widest border-t border-brown-900/5 pt-4">
                                        <span>{highlight.book_title}</span>
                                        <span>Page {highlight.page_number}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
