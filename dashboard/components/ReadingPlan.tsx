
"use client";

import React, { useState } from 'react';

export default function ReadingPlan() {
    const [isDone, setIsDone] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const initialDays = [
        { day: 'M', completed: true },
        { day: 'T', completed: true },
        { day: 'W', completed: true },
        { day: 'T', current: true },
        { day: 'F' },
        { day: 'S' },
        { day: 'S' },
    ];

    const [days, setDays] = useState(initialDays);

    const handleMarkAsDone = () => {
        if (isDone) return;
        
        setIsSyncing(true);
        // Simulate sync with calendar
        setTimeout(() => {
            setIsDone(true);
            setDays(prev => prev.map(d => d.current ? { ...d, completed: true, current: false } : d));
            setIsSyncing(false);
        }, 800);
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm mt-8 border border-cream-200 relative overflow-hidden group/plan">
            {/* Decorative Background Element */}
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl group-hover/plan:bg-brand-gold/10 transition-colors duration-700"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-6 max-w-xl">
                    <div>
                        <h2 className="text-3xl font-serif font-black text-brown-900 leading-tight">Today's Reading Plan</h2>
                        <p className="text-xs text-brown-800/50 font-black uppercase tracking-[0.2em] mt-2">Personalized Schedule • Feb 08</p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-4 bg-brand-gold/10 p-4 rounded-[1.5rem] border border-brand-gold/20 w-fit group/time hover:bg-brand-gold/15 transition-colors duration-300">
                            <span className="text-brand-gold-dark scale-110 transition-transform group-hover/time:rotate-12">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="currentColor" d="M12 20c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8zm0-18c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2zM12.5 7V12l4.5 2.7-.8 1.2L11 13V7h1.5z"/></svg>
                            </span>
                            <div>
                                <p className="text-brown-900 font-black text-sm uppercase tracking-wide">Best time: 8:00 PM - 9:00 PM</p>
                                <p className="text-[10px] text-brown-800/60 font-bold uppercase tracking-tighter">Synchronized with your focus hours</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-[1.5rem] border border-cream-200 bg-cream-50/50">
                            <p className="text-brown-800/80 font-serif font-medium text-lg italic leading-relaxed">
                                {isDone ? (
                                    <span className="text-brand-gold-dark font-black not-italic">Daily goal achieved! Excellent work.</span>
                                ) : (
                                    <>Read <span className="text-brown-900 font-black not-italic border-b-2 border-brand-gold/40 pb-0.5">25 pages</span> to stay on track.</>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-6">
                    <div className="flex gap-2.5 sm:gap-5">
                        {days.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-3 group/day">
                                <div
                                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-sm font-black transition-all duration-700 relative ${item.completed
                                            ? 'bg-brown-900 text-cream-50 shadow-xl shadow-brown-900/30 ring-2 ring-brown-900/5'
                                            : item.current
                                                ? 'bg-[#e9c46a] text-white scale-110 shadow-[0_10px_30px_rgba(233,196,106,0.4)] ring-4 ring-[#e9c46a]/20'
                                                : 'bg-cream-100/50 text-brown-800/20 hover:bg-cream-200/50 hover:text-brown-800/40 border border-cream-200/30'
                                        }`}
                                >
                                    {item.completed ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" className="animate-in fade-in zoom-in duration-500"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="m5 12l5 5L20 7"/></svg>
                                    ) : (
                                        <span className={item.current ? 'text-white' : ''}>{item.day}</span>
                                    )}
                                    {item.current && (
                                        <div className="absolute -top-1.5 -right-1.5">
                                            <div className="relative">
                                                <div className="absolute inset-0 animate-ping rounded-full bg-white opacity-40"></div>
                                                <div className="w-4 h-4 rounded-full bg-white border-[3px] border-[#e9c46a] relative z-10 shadow-sm"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-[0.15em] transition-colors duration-300 ${item.current ? 'text-[#e9c46a] font-black' : 'text-brown-800/30 group-hover/day:text-brown-800/50'}`}>
                                    {item.day}
                                </span>
                            </div>
                        ))}
                    </div>
                    
                    <button 
                        onClick={handleMarkAsDone}
                        disabled={isDone || isSyncing}
                        className={`relative group/btn overflow-hidden px-12 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.25em] active:scale-[0.97] transition-all duration-500 w-full md:w-auto mt-2 ${
                            isDone 
                            ? 'bg-cream-100 text-brown-800/40 cursor-default border border-cream-200' 
                            : 'bg-brown-900 text-cream-50 hover:shadow-2xl hover:shadow-brown-900/40'
                        }`}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            {isSyncing ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-brand-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Syncing with Calendar...
                                </>
                            ) : isDone ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="m5 12l5 5L20 7"/></svg>
                                    Done for Today
                                </>
                            ) : (
                                'Mark as Done'
                            )}
                        </span>
                        {!isDone && !isSyncing && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite]"></div>
                        )}
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}
