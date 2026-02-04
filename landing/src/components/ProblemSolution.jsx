import React from 'react';
import CornerAccent from './CornerAccent';

const ProblemSolution = () => {
    return (
        <section className="py-20 md:py-32 px-4 bg-brand-beige overflow-hidden">
            <div className="max-w-6xl mx-auto relative">
                {/* Book cover container - brown realistic leather/cardboard */}
                <div className="relative p-3 sm:p-4 md:p-8 bg-[#6d4c41] rounded-[1.5rem] md:rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4),inset_0_2px_10px_rgba(255,255,255,0.1)] border-b-4 md:border-b-8 border-r-2 md:border-r-4 border-[#4e342e]">
                    
                    {/* Lighting & Texture effects on cover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20 rounded-[1.3rem] md:rounded-[1.8rem] pointer-events-none"></div>
                    
                    {/* Debossed gold frame on cover */}
                    <div className="absolute inset-3 sm:inset-4 md:inset-6 border border-brand-gold/15 rounded-lg md:rounded-xl pointer-events-none z-30 shadow-[inset_0_1px_3px_rgba(0,0,0,0.3),0_1px_1px_rgba(255,255,255,0.1)]"></div>

                    {/* Book body - paper pages */}
                    <div className="relative flex flex-col md:flex-row bg-[#FDFCF8] rounded-sm shadow-[inset_0_0_60px_rgba(0,0,0,0.1),0_10px_30px_rgba(0,0,0,0.2)] border border-brand-black/5 min-h-[400px] md:min-h-[500px] overflow-hidden">
                    
                        {/* Central spine/binding (visible only on desktop) */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 z-20 bg-gradient-to-r from-black/10 via-transparent to-black/10 pointer-events-none"></div>
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 z-20 bg-black/5"></div>

                        {/* Left Page: The Problem */}
                        <div className="flex-1 p-6 sm:p-8 md:p-12 relative border-b md:border-b-0 md:border-r border-brand-black/5">
                            <div className="absolute top-4 left-6 text-[10px] md:text-xs font-serif text-brand-black/30 tracking-widest uppercase">PAGE 01</div>
                            <h3 className="text-3xl md:text-4xl font-serif font-bold text-brand-black mb-8 italic flex items-center gap-4">
                                The Problem
                                <span className="h-[1px] flex-1 bg-brand-black/10"></span>
                            </h3>
                            <ul className="space-y-6 md:space-y-8">
                                <li className="flex gap-4">
                                    <span className="text-brand-black/40 font-serif italic">—</span>
                                    <p className="text-lg md:text-xl text-brand-black/70 font-serif leading-relaxed italic">
                                        Starting books but never reaching the last page.
                                    </p>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-brand-black/40 font-serif italic">—</span>
                                    <p className="text-lg md:text-xl text-brand-black/70 font-serif leading-relaxed italic">
                                        Distractions winning over the quiet joy of reading.
                                    </p>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-brand-black/40 font-serif italic">—</span>
                                    <p className="text-lg md:text-xl text-brand-black/70 font-serif leading-relaxed italic">
                                        Forgetting key ideas as soon as you close the book.
                                    </p>
                                </li>
                            </ul>
                        </div>

                        {/* Right Page: ReadRacing Solution */}
                        <div className="flex-1 p-6 sm:p-8 md:p-12 bg-white/30 relative">
                            <div className="absolute top-4 right-6 text-[10px] md:text-xs font-serif text-brand-black/30 tracking-widest uppercase">PAGE 02</div>
                            <h3 className="text-3xl md:text-4xl font-bold text-brand-black mb-8 flex items-center gap-4">
                                <span className="text-brand-gold">ReadRacing</span>
                                <span className="h-[1px] flex-1 bg-brand-gold/20"></span>
                            </h3>
                            <div className="space-y-6 md:space-y-8">
                                <div className="p-4 md:p-6 rounded-xl bg-brand-gold/5 border border-brand-gold/10 hover:bg-brand-gold/10 transition-colors duration-300">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0">
                                            <div className="w-2 h-2 rounded-full bg-brand-gold"></div>
                                        </div>
                                        <p className="text-lg md:text-xl text-brand-black font-medium leading-relaxed">
                                            AI-driven habits that turn 10 minutes into 30 pages.
                                        </p>
                                    </div>
                                </div>
                                <div className="p-4 md:p-6 rounded-xl bg-brand-gold/5 border border-brand-gold/10 hover:bg-brand-gold/10 transition-colors duration-300">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0">
                                            <div className="w-2 h-2 rounded-full bg-brand-gold"></div>
                                        </div>
                                        <p className="text-lg md:text-xl text-brand-black font-medium leading-relaxed">
                                            Gamified progress that keeps you coming back daily.
                                        </p>
                                    </div>
                                </div>
                                <div className="p-4 md:p-6 rounded-xl bg-brand-gold/5 border border-brand-gold/10 hover:bg-brand-gold/10 transition-colors duration-300">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0">
                                            <div className="w-2 h-2 rounded-full bg-brand-gold"></div>
                                        </div>
                                        <p className="text-lg md:text-xl text-brand-black font-medium leading-relaxed">
                                            Deep insights and retention through active recall.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    
                    {/* Realistic page stack effect at the bottom */}
                    <div className="absolute -bottom-2 left-6 right-6 h-2 bg-white/90 rounded-b-sm shadow-md z-0"></div>
                    <div className="absolute -bottom-4 left-8 right-8 h-2 bg-white/70 rounded-b-sm shadow-sm z-0"></div>
                </div>
            </div>
        </section>
    );
};

export default ProblemSolution;
