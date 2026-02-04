import React from 'react';
import TextTypeReact from './TextTypeReact';
import StarBorderReact from './StarBorderReact';

const CallToAction = () => {
    return (
        <section id="try-free" className="py-32 px-4 bg-brand-black text-brand-beige overflow-hidden">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div className="relative order-last md:order-first flex items-center justify-center transition-transform duration-500 hover:scale-105">
                    {/* Decorative Background Elements - Inspired by ProfileCard holographic/glass effect */}
                    <div className="absolute w-[100%] aspect-square bg-gradient-to-tr from-brand-gold/20 via-purple-500/10 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                    
                    <div className="absolute w-[70%] md:w-[75%] aspect-square border border-brand-gold/30 rounded-[2rem] rotate-12 backdrop-blur-[2px] bg-white/5 shadow-[0_0_30px_rgba(233,196,106,0.15)]"></div>
                    <div className="absolute w-[70%] md:w-[75%] aspect-square border border-brand-gold/20 rounded-[2rem] -rotate-6 backdrop-blur-[1px] bg-white/5"></div>
                    
                    {/* Main Image with drop shadow and slight tilt effect */}
                    <img 
                        src="/landing-2pic.png" 
                        alt="ReadRacing Community" 
                        className="w-[70%] md:w-[75%] h-auto relative z-10 drop-shadow-[0_15px_40px_rgba(0,0,0,0.4)] transform hover:rotate-1 transition-transform duration-300"
                    />
                    
                    {/* Glassy overlay accent */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent z-20 pointer-events-none rounded-[2rem]"></div>
                </div>
                <div className="text-left md:text-right">
                    <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                        <TextTypeReact 
                            text={["Turn reading into a habit.", "Start finishing books with us."]}
                            typingSpeed={60}
                            pauseDuration={2500}
                        />
                    </h2>
                    <div className="relative group inline-block md:float-right clear-both mb-12">
                        {/* ProfileCard inspired effects for p */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-brand-gold/20 via-purple-500/10 to-blue-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative p-4 rounded-xl border border-transparent group-hover:border-white/10 group-hover:bg-white/5 group-hover:backdrop-blur-sm transition-all duration-500">
                            <p className="text-xl text-brand-beige/70 leading-relaxed font-sans not-italic">
                                Start finishing books with AI.
                            </p>
                        </div>
                    </div>
                    <div className="clear-both">
                        <StarBorderReact 
                            color="#e9c46a"
                            speed="4s"
                            className="hover:scale-[1.02] transition-transform"
                        >
                            Get early access
                        </StarBorderReact>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
