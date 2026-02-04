import React from 'react';
import CornerAccent from './CornerAccent';
import ShinyText from './ShinyText';

const Hero = () => {
    return (
        <section className="bg-brand-beige min-h-[90vh] flex flex-col justify-center items-center text-center px-4 max-w-7xl mx-auto pt-20 pb-16 relative">
            <div className="relative p-8 md:p-12">
                <CornerAccent />
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-brand-black mb-6 leading-[1.1] italic">
                    Finish every book<br /> you start.
                </h1>
                <ShinyText
                    text="AI platform that helps you read regularly, understand deeply, and reach the last page."
                    disabled={false}
                    speed={3}
                    className="text-xl md:text-2xl text-brand-black/70 max-w-2xl mb-10 leading-relaxed mx-auto font-sans not-italic"
                />
                <div className="flex flex-col items-center gap-4">
                    <button className="bg-brand-gold text-brand-black px-8 py-4 text-lg font-bold rounded-sm hover:bg-brand-gold-dark transition-colors font-sans not-italic">
                        Start reading smarter
                    </button>
                    <span className="text-sm text-brand-black/60 font-sans not-italic">Free for early users</span>
                </div>
            </div>
        </section>
    );
};

export default Hero;
