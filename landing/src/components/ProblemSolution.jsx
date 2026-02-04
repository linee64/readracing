import React from 'react';
import CornerAccent from './CornerAccent';

const ProblemSolution = () => {
    return (
        <section className="py-24 bg-brand-beige border-t border-brand-black/5 overflow-hidden">
            <div className="max-w-6xl mx-auto px-6">
                {/* Book Wrapper with Cover */}
                <div className="relative p-4 md:p-8 bg-[#6d4c41] rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4),inset_0_2px_10px_rgba(255,255,255,0.1)] border-b-8 border-r-4 border-[#4e342e]">
                    {/* Cover Texture & Lighting */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20 rounded-[1.8rem] pointer-events-none"></div>
                    
                    {/* Debossed Golden Frame */}
                    <div className="absolute inset-4 md:inset-6 border-2 border-brand-gold/15 rounded-xl pointer-events-none z-30 shadow-[inset_0_1px_3px_rgba(0,0,0,0.3),0_1px_1px_rgba(255,255,255,0.1)]"></div>
                    
                    {/* Book Container (Pages) */}
                    <div className="relative flex flex-col md:flex-row bg-[#FDFCF8] rounded-sm shadow-[inset_0_0_60px_rgba(0,0,0,0.1),0_10px_30px_rgba(0,0,0,0.2)] border border-brand-black/5 min-h-[500px] overflow-hidden">
                    
                    {/* Spine / Binding (Desktop Only) */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-brand-black/10 z-20"></div>
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-black/[0.04] to-transparent z-10"></div>
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-black/[0.06] to-transparent z-10"></div>

                    {/* Page Edges Effect (Stack of pages) */}
                    <div className="absolute -bottom-2 -right-2 w-full h-full bg-white border border-brand-black/5 -z-10 rounded-sm"></div>
                    <div className="absolute -bottom-4 -right-4 w-full h-full bg-white/50 border border-brand-black/5 -z-20 rounded-sm"></div>

                    {/* Left Page: Problem */}
                    <div className="flex-1 p-10 md:p-16 border-b md:border-b-0 md:border-r border-brand-black/5 relative">
                        <div className="absolute top-8 left-8 opacity-10 pointer-events-none">
                            <span className="text-8xl font-serif">?</span>
                        </div>
                        
                        <h3 className="text-brand-black/40 uppercase tracking-[0.2em] text-xs font-bold mb-10 font-sans">The Problem</h3>
                        
                        <div className="space-y-8">
                            <ul className="space-y-6">
                                {[
                                    "Collecting books but never finishing them",
                                    "No reading system or discipline",
                                    "Relying on fleeting motivation",
                                    "Reading without retaining knowledge"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-4 group">
                                        <span className="text-brand-black/30 mt-1 font-serif text-xl">—</span>
                                        <p className="text-xl md:text-2xl text-brand-black/70 font-serif italic leading-tight group-hover:text-brand-black transition-colors">
                                            {item}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Page Number Look-alike */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-brand-black/20 font-serif tracking-widest">
                            PAGE 01
                        </div>
                    </div>

                    {/* Right Page: Solution */}
                    <div className="flex-1 p-10 md:p-16 bg-white/40 relative">
                        <div className="absolute top-8 right-8 opacity-10 pointer-events-none">
                            <span className="text-8xl font-serif text-brand-gold">!</span>
                        </div>

                        <h3 className="text-brand-gold-dark uppercase tracking-[0.2em] text-xs font-bold mb-10 font-sans">ReadRacing Solution</h3>
                        
                        <div className="space-y-8">
                            <ul className="space-y-6">
                                {[
                                    "Actionable step-by-step reading plan",
                                    "AI accountability partner",
                                    "Gamified progress tracking",
                                    "Your personal digital library"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-4 group">
                                        <span className="bg-brand-gold/10 p-1 rounded-full mt-1 group-hover:bg-brand-gold/20 transition-colors">
                                            <svg className="w-4 h-4 text-brand-gold-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                        <p className="text-xl md:text-2xl text-brand-black font-semibold leading-tight tracking-tight">
                                            {item}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Page Number Look-alike */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-brand-black/20 font-serif tracking-widest">
                            PAGE 02
                        </div>
                    </div>
                </div>
                </div>

                {/* Decorative Elements around the book */}
                <div className="mt-12 text-center">
                    <p className="text-brand-black/30 text-sm font-light italic">
                        Turn your reading habit into a competitive advantage.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ProblemSolution;
