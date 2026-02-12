import React from 'react';
import TextTypeReact from './TextTypeReact';
import StarBorderReact from './StarBorderReact';
import ShinyText from './ShinyText';
import { useAuth } from '../context/AuthContext';

const CallToAction = () => {
    const { user } = useAuth();
    const dashboardUrl = "http://readracing-dash.vercel.app/dashboard";
    const signupUrl = "http://readracing-dash.vercel.app/signup";

    return (
        <section id="try-free" className="py-16 md:py-32 px-4 bg-brand-black text-brand-beige overflow-hidden">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div className="relative order-last md:order-first flex items-center justify-center transition-transform duration-500 hover:scale-105">
                    {/* Decorative Background Elements */}
                    <div className="absolute w-[70%] md:w-[75%] aspect-square border border-brand-gold/30 rounded-[1.5rem] rotate-12 backdrop-blur-[2px] bg-white/5 shadow-[0_0_30px_rgba(233,196,106,0.15)]"></div>
                    <div className="absolute w-[70%] md:w-[75%] aspect-square border border-brand-gold/20 rounded-[2rem] -rotate-6 backdrop-blur-[1px] bg-white/5"></div>

                    {/* Main Image with drop shadow and slight tilt effect */}
                    <img
                        src="/landing-2pic.png"
                        alt="ReadRacing Community"
                        className="w-[65%] sm:w-[70%] md:w-[75%] h-auto relative z-10 drop-shadow-[0_15px_40px_rgba(0,0,0,0.4)] transform hover:rotate-1 transition-transform duration-300"
                    />
                </div>
                <div className="text-center md:text-right">
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        <TextTypeReact
                            text={["Turn reading into a habit.", "Start finishing books with us."]}
                            typingSpeed={60}
                            pauseDuration={2500}
                        />
                    </h2>
                    <div className="inline-block md:float-right clear-both mb-8 md:mb-12">
                        <ShinyText
                            text="Start finishing books with AI."
                            disabled={false}
                            speed={3}
                            className="text-lg md:text-xl text-brand-beige/70 leading-relaxed font-sans not-italic"
                        />
                    </div>
                    <div className="clear-both flex justify-center md:justify-end">
                        <StarBorderReact
                            as="a"
                            href={user ? dashboardUrl : signupUrl}
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
