import React from 'react';
import CornerAccent from './CornerAccent';

const ProblemSolution = () => {
    return (
        <section className="py-20 bg-brand-beige border-t border-brand-black/5">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 md:gap-24">
                {/* Problem */}
                <div className="relative p-8 md:text-right border border-brand-black/5 md:border-none">
                    <div className="md:hidden"><CornerAccent /></div>
                    <h3 className="text-brand-black/50 uppercase tracking-widest text-sm font-semibold mb-6">The Problem</h3>
                    <ul className="space-y-4 text-xl md:text-2xl text-brand-black/60 font-light italic">
                        <li className="leading-snug">Collecting books but never finishing them</li>
                        <li className="leading-snug">No reading system or discipline</li>
                        <li className="leading-snug">Relying on fleeting motivation</li>
                        <li className="leading-snug">Reading without retaining knowledge</li>
                    </ul>
                </div>

                {/* Solution */}
                <div className="relative p-8 border border-brand-gold/20 md:border-none">
                    <div className="md:hidden"><CornerAccent /></div>
                    <h3 className="text-brand-gold-dark uppercase tracking-widest text-sm font-bold mb-6">ReadRacing Solution</h3>
                    <ul className="space-y-4 text-xl md:text-2xl text-brand-black font-medium">
                        <li className="leading-snug">Actionable step-by-step reading plan</li>
                        <li className="leading-snug">AI accountability partner</li>
                        <li className="leading-snug">Gamified progress tracking</li>
                        <li className="leading-snug">Your personal digital library</li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default ProblemSolution;
