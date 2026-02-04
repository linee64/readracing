import React from 'react';
import CornerAccent from './CornerAccent';
import ShinyText from './ShinyText';
import TextTypeReact from './TextTypeReact';
import StarBorderReact from './StarBorderReact';

const Hero = () => {
    return (
        <section className="bg-brand-beige min-h-[90vh] flex flex-col justify-center px-4 max-w-7xl mx-auto pt-5 pb-11 relative">
            <div className="grid md:grid-cols-2 gap-12 items-center relative p-8 md:p-12">
                <CornerAccent />
                <div className="text-left">
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-brand-black mb-6 leading-[1.1] italic">
                        <TextTypeReact 
                            text={["Turn reading into a habit.", "Finish every book you start."]} 
                            typingSpeed={70}
                            pauseDuration={3000}
                        />
                    </h2>
                    <div className="relative group max-w-2xl mb-10">
                        {/* ProfileCard inspired effects for p */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-brand-gold/20 via-purple-500/10 to-blue-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative p-4 rounded-xl border border-transparent group-hover:border-white/20 group-hover:bg-white/5 group-hover:backdrop-blur-sm transition-all duration-500">
                            <ShinyText
                                text="AI platform that helps you read regularly, understand deeply, and reach the last page."
                                disabled={false}
                                speed={3}
                                className="text-xl md:text-2xl text-brand-black/70 leading-relaxed font-sans not-italic block"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-4">
                        <StarBorderReact 
                            color="#e9c46a"
                            speed="4s"
                            className="hover:scale-[1.02] transition-transform"
                        >
                            Start reading smarter
                        </StarBorderReact>
                        <span className="text-sm text-brand-black/60 font-sans not-italic ml-2">Free for early users</span>
                    </div>
                </div>
                <div className="relative mt-12 md:mt-0 order-last md:order-none flex items-center justify-center transition-transform duration-500 hover:scale-105">
                    {/* Decorative Background Elements - Glass & Holographic effects */}
                    <div className="absolute w-[110%] md:w-[120%] aspect-square bg-gradient-to-tr from-brand-gold/20 via-purple-500/10 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                    
                    <div className="absolute w-[85%] md:w-[90%] aspect-square bg-brand-gold rounded-full z-0 shadow-[0_0_40px_rgba(233,196,106,0.3)]"></div>
                    
                    <div className="absolute w-[80%] md:w-[85%] aspect-square border border-white/20 rounded-full rotate-12 backdrop-blur-[2px] bg-white/5"></div>
                    <div className="absolute w-[80%] md:w-[85%] aspect-square border border-white/10 rounded-full -rotate-6 backdrop-blur-[1px]"></div>
                    
                    <img
                        src="/landing-pic.png"
                        alt="ReadRacing App Interface"
                        className="w-[70%] md:text-[75%] h-auto relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] transform hover:rotate-1 transition-transform duration-300"
                    />

                    {/* Glassy overlay accent */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent z-20 pointer-events-none rounded-full"></div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
