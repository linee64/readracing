'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Book } from '@/types';

interface Highlight {
    id: string;
    quote: string;
    book_title: string;
    page_number: number;
    color: string;
    created_at: string;
}
const COLORS = [
    'bg-brand-gold/20',
    'bg-cream-200',
    'bg-brown-100',
    'bg-green-100/50',
    'bg-blue-100/50'
];

export default function RecentHighlights() {
    const router = useRouter();
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userBooks, setUserBooks] = useState<Book[]>([]);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Form state
    const [quote, setQuote] = useState('');
    const [bookTitle, setBookTitle] = useState('');
    const [pageNumber, setPageNumber] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchHighlights();
        fetchUserBooks();
    }, []);

    const fetchUserBooks = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data } = await supabase
                .from('books')
                .select('*')
                .eq('user_id', user.id)
                .order('title', { ascending: true });
            if (data) setUserBooks(data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const fetchHighlights = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('highlights')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(3);

            if (data) {
                setHighlights(data);
            }
        } catch (error) {
            console.error('Error fetching highlights:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddHighlight = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

            const { error } = await supabase.from('highlights').insert({
                user_id: user.id,
                quote,
                book_title: bookTitle,
                page_number: parseInt(pageNumber) || 0,
                color: randomColor
            });

            if (!error) {
                setQuote('');
                setBookTitle('');
                setPageNumber('');
                setIsModalOpen(false);
                fetchHighlights();
            }
        } catch (error) {
            console.error('Error adding highlight:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-cream-200 shadow-sm flex flex-col h-full relative">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-serif font-bold text-brown-900">Recent Highlights</h3>
                <button 
                    onClick={() => router.push('/highlights')}
                    className="text-sm font-bold text-brown-800/60 hover:text-brown-900 uppercase tracking-widest transition-colors"
                >
                    View All
                </button>
            </div>

            <div className="flex-1 space-y-4">
                {loading ? (
                    <div className="animate-pulse space-y-4">
                        <div className="h-32 bg-cream-100 rounded-3xl"></div>
                        <div className="h-32 bg-cream-100 rounded-3xl"></div>
                    </div>
                ) : highlights.length > 0 ? (
                    highlights.map((highlight) => (
                        <div key={highlight.id} className={`p-6 rounded-3xl ${highlight.color} group hover:scale-[1.02] transition-transform duration-300 cursor-pointer`}>
                            <p className="font-serif text-lg text-brown-900 leading-relaxed italic mb-4">
                                "{highlight.quote}"
                            </p>
                            <div className="flex justify-between items-center text-xs font-black text-brown-800/40 uppercase tracking-widest">
                                <span>{highlight.book_title}</span>
                                <span>Page {highlight.page_number}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-brown-800/40 italic">
                        No highlights yet. Add your first one!
                    </div>
                )}
                
                <div 
                    onClick={() => setIsModalOpen(true)}
                    className="p-6 rounded-3xl border-2 border-dashed border-cream-200 flex items-center justify-center text-brown-800/40 font-bold hover:bg-cream-50 hover:border-cream-300 transition-all cursor-pointer group"
                >
                    <span className="group-hover:scale-110 transition-transform">+ Add New Highlight</span>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-[2.5rem]" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-md p-6 rounded-3xl shadow-2xl border border-cream-200 relative z-10 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-serif font-bold text-brown-900 mb-4">Add Highlight</h3>
                        <form onSubmit={handleAddHighlight} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-brown-800/60 uppercase tracking-widest mb-1">Quote</label>
                                <textarea 
                                    value={quote}
                                    onChange={(e) => setQuote(e.target.value)}
                                    className="w-full p-3 bg-cream-50 rounded-xl border border-cream-200 focus:outline-none focus:border-brown-900 min-h-[100px]"
                                    placeholder="Enter the quote..."
                                    required
                                />
                            </div>
                            <div className="relative">
                                <label className="block text-xs font-bold text-brown-800/60 uppercase tracking-widest mb-1">Book Title</label>
                                {userBooks.length > 0 ? (
                                    <>
                                        <div 
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="w-full p-3 bg-cream-50 rounded-xl border border-cream-200 cursor-pointer flex justify-between items-center hover:bg-cream-100 transition-colors group"
                                        >
                                            <span className={`font-medium ${!bookTitle ? 'text-brown-800/40' : 'text-brown-900'}`}>
                                                {bookTitle || 'Select a book...'}
                                            </span>
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                width="20" 
                                                height="20" 
                                                viewBox="0 0 24 24"
                                                className={`text-brown-800/40 transition-transform duration-200 group-hover:text-brown-800 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                            >
                                                <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6l-6-6l1.41-1.41z"/>
                                            </svg>
                                        </div>
                                        
                                        {isDropdownOpen && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                                                <div className="absolute z-20 w-full mt-2 bg-white rounded-xl border border-cream-200 shadow-xl max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                                                    {userBooks.map(book => (
                                                        <div 
                                                            key={book.id} 
                                                            onClick={() => {
                                                                setBookTitle(book.title);
                                                                setIsDropdownOpen(false);
                                                            }}
                                                            className="p-3 hover:bg-cream-50 cursor-pointer transition-colors border-b border-cream-50 last:border-0"
                                                        >
                                                            <div className="font-bold text-brown-900 text-sm truncate">{book.title}</div>
                                                            <div className="text-xs text-brown-800/40 font-medium truncate">{book.author}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <input 
                                        type="text"
                                        value={bookTitle}
                                        onChange={(e) => setBookTitle(e.target.value)}
                                        className="w-full p-3 bg-cream-50 rounded-xl border border-cream-200 focus:outline-none focus:border-brown-900"
                                        placeholder="e.g. Steve Jobs"
                                        required
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brown-800/60 uppercase tracking-widest mb-1">Page Number</label>
                                <input 
                                    type="number"
                                    min="0"
                                    value={pageNumber}
                                    onChange={(e) => setPageNumber(e.target.value)}
                                    className="w-full p-3 bg-cream-50 rounded-xl border border-cream-200 focus:outline-none focus:border-brown-900"
                                    placeholder="e.g. 124"
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 font-bold text-brown-800/60 hover:bg-cream-100 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 font-bold text-cream-50 bg-brown-900 hover:bg-brown-800 rounded-xl shadow-lg transition-all disabled:opacity-70"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
