import React from 'react';

const ProblemSolution = () => {
    return (
        <section className="py-20 bg-brand-beige border-t border-brand-black/5">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 md:gap-24">
                {/* Problem */}
                <div className="md:text-right">
                    <h3 className="text-brand-gray uppercase tracking-widest text-sm font-semibold mb-6">The Problem</h3>
                    <ul className="space-y-4 text-xl md:text-2xl text-brand-gray/80 font-light">
                        <li className="leading-snug">Collecting books but never finishing them</li>
                        <li className="leading-snug">No reading system or discipline</li>
                        <li className="leading-snug">Relying on fleeting motivation</li>
                        <li className="leading-snug">Reading without retaining knowledge</li>
                    </ul>
                </div>

                {/* Solution */}
                <div>
                    <h3 className="text-brand-black uppercase tracking-widest text-sm font-semibold mb-6">ReadRacing Solution</h3>
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
