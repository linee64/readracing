import React from 'react';

const Hero = () => {
    return (
        <section className="bg-brand-beige min-h-[90vh] flex flex-col justify-center items-center text-center px-4 max-w-7xl mx-auto pt-20 pb-16">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-brand-black mb-6 leading-[1.1]">
                Finish every book<br /> you start.
            </h1>
            <p className="text-xl md:text-2xl text-brand-gray max-w-2xl mb-10 leading-relaxed">
                AI platform that helps you read regularly, understand deeply, and reach the last page.
            </p>
            <div className="flex flex-col items-center gap-4">
                <button className="bg-brand-black text-white px-8 py-4 text-lg font-medium rounded-sm hover:opacity-90 transition-opacity">
                    Start reading smarter
                </button>
                <span className="text-sm text-brand-gray/80">Free for early users</span>
            </div>
        </section>
    );
};

export default Hero;
