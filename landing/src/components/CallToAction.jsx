import React from 'react';

const CallToAction = () => {
    return (
        <section className="py-32 text-center px-4 bg-brand-black text-brand-beige">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                    Turn reading<br />into a habit.
                </h2>
                <p className="text-xl text-brand-beige/70 mb-12">
                    Start finishing books with AI.
                </p>
                <button className="bg-brand-beige text-brand-black px-10 py-5 text-xl font-bold rounded-sm hover:scale-[1.01] transition-transform duration-200">
                    Get early access
                </button>
            </div>
        </section>
    );
};

export default CallToAction;
