
'use client';

import React from 'react';

export default function RecentHighlights() {
    return (
        <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-cream-200 shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-serif font-bold text-brown-900">Recent Highlights</h3>
                <button className="text-sm font-bold text-brown-800/60 hover:text-brown-900 uppercase tracking-widest transition-colors">
                    View All
                </button>
            </div>

            <div className="flex-1 space-y-4">
                {[
                    {
                        text: "The only way to do great work is to love what you do.",
                        book: "Steve Jobs",
                        page: 124,
                        color: "bg-brand-gold/20"
                    },
                    {
                        text: "It does not matter how slowly you go as long as you do not stop.",
                        book: "Confucius",
                        page: 45,
                        color: "bg-cream-200"
                    }
                ].map((highlight, i) => (
                    <div key={i} className={`p-6 rounded-3xl ${highlight.color} group hover:scale-[1.02] transition-transform duration-300 cursor-pointer`}>
                        <p className="font-serif text-lg text-brown-900 leading-relaxed italic mb-4">
                            "{highlight.text}"
                        </p>
                        <div className="flex justify-between items-center text-xs font-black text-brown-800/40 uppercase tracking-widest">
                            <span>{highlight.book}</span>
                            <span>Page {highlight.page}</span>
                        </div>
                    </div>
                ))}
                
                <div className="p-6 rounded-3xl border-2 border-dashed border-cream-200 flex items-center justify-center text-brown-800/40 font-bold hover:bg-cream-50 hover:border-cream-300 transition-all cursor-pointer group">
                    <span className="group-hover:scale-110 transition-transform">+ Add New Highlight</span>
                </div>
            </div>
        </div>
    );
}
