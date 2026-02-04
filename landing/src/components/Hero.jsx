import React from 'react';
import CornerAccent from './CornerAccent';
import ShinyText from './ShinyText';
import TextTypeReact from './TextTypeReact';
import StarBorderReact from './StarBorderReact';

const Hero = () => {
    return (
        <section className="bg-brand-beige min-h-[85vh] md:min-h-[90vh] flex flex-col justify-center px-4 max-w-7xl mx-auto pt-4 md:pt-5 pb-8 md:pb-11 relative overflow-hidden md:overflow-visible">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center relative p-2 sm:p-8 md:p-12">
                <CornerAccent />
                <div className="text-center md:text-left z-30 flex flex-col items-center md:items-start">
                    <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-brand-black mb-4 md:mb-6 leading-[1.2] md:leading-[1.1] italic min-h-[4.2em] md:min-h-auto">
                        <TextTypeReact 
                            text={["Turn reading into a habit.", "Finish every book you start."]} 
                            typingSpeed={70}
                            pauseDuration={3000}
                        />
                    </h2>
                    <div className="max-w-2xl mb-8 md:mb-10 w-full">
                        <ShinyText
                            text="AI platform that helps you read regularly, understand deeply, and reach the last page."
                            disabled={false}
                            speed={3}
                            className="text-base sm:text-xl md:text-2xl text-brand-black/70 leading-relaxed font-sans not-italic block"
                        />
                    </div>
                    <div className="flex flex-col items-center md:items-start gap-3 w-full sm:w-auto">
                        <StarBorderReact 
                            color="#e9c46a"
                            speed="4s"
                            className="hover:scale-[1.02] transition-transform w-full sm:w-auto"
                        >
                            <span className="px-6 md:px-[64px] py-1 md:py-0 block text-sm md:text-base">Start reading smarter</span>
                        </StarBorderReact>
                        <span className="text-[10px] md:text-sm text-brand-black/60 font-sans not-italic">Free for early users</span>
                    </div>
                </div>
                <div className="relative mt-4 md:mt-0 order-last md:order-none flex items-center justify-center transition-transform duration-500 hover:scale-105 px-2">
                    {/* Decorative Background Elements */}
                    <div className="absolute w-[85%] md:w-[90%] aspect-square bg-brand-gold rounded-full z-0 shadow-[0_0_30px_rgba(233,196,106,0.2)] md:shadow-[0_0_40px_rgba(233,196,106,0.3)]"></div>
                    
                    <div className="absolute w-[80%] md:w-[85%] aspect-square border border-white/20 rounded-full rotate-12 backdrop-blur-[1px] md:backdrop-blur-[2px] bg-white/5"></div>
                    <div className="absolute w-[80%] md:w-[85%] aspect-square border border-white/10 rounded-full -rotate-6 backdrop-blur-[1px]"></div>
                    
                    <img
                        src="/landing-pic.png"
                        alt="ReadRacing App Interface"
                        className="w-[80%] sm:w-[70%] md:w-[75%] h-auto relative z-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.2)] md:drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] transform hover:rotate-1 transition-transform duration-300"
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;
