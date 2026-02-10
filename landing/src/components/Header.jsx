import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BlurTextReact from './BlurTextReact';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const isAuthPage = false; // We don't have auth pages in landing anymore

    const dashboardUrl = "https://readracing-dash.vercel.app/dashboard";
    const loginUrl = "https://readracing-dash.vercel.app/login";
    const signupUrl = "https://readracing-dash.vercel.app/signup";

    // Body scroll lock when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const scrollToSection = (e, id) => {
        if (e) e.preventDefault();
        
        // If we're on another page, we might need to navigate first, 
        // but for now assuming we're on Home.
        
        setIsMenuOpen(false);
        
        // Small delay to allow menu closing animation to start/finish 
        // or at least not conflict with scroll
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                const headerOffset = 80; 
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            } else if (id === 'home') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }, 300);
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-[110] bg-brand-beige/95 backdrop-blur-sm border-b border-brand-black/5 px-4 md:px-6 py-3 md:py-4 w-full transition-all duration-300">
                <div className="max-w-7xl mx-auto flex items-center justify-between relative">
                    {/* Left: Logo */}
                    <div className="flex-1">
                        <Link to="/" onClick={(e) => scrollToSection(e, 'home')} className="flex items-center gap-3 group">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl shadow-sm border border-brand-black/5 flex items-center justify-center p-1.5 group-hover:shadow-md group-hover:-translate-y-0.5 transition-all duration-300">
                                <img 
                                    src="/landing-logo.png" 
                                    alt="ReadRacing Logo" 
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="text-base md:text-xl font-bold tracking-tight text-brand-black italic font-serif group-hover:opacity-80 transition-opacity whitespace-nowrap">
                                ReadRacing
                            </span>
                        </Link>
                    </div>

                    {/* Center: Navigation (Desktop) */}
                    {!isAuthPage && (
                        <nav className="hidden md:flex items-center gap-10 px-4">
                            <Link to="/" onClick={(e) => scrollToSection(e, 'home')} className="text-sm font-bold text-brand-black italic hover:text-brand-gold transition-colors">
                                Home
                            </Link>
                            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-sm font-bold text-brand-black italic hover:text-brand-gold transition-colors">
                                Features
                            </a>
                            <a href="#try-free" onClick={(e) => scrollToSection(e, 'try-free')} className="text-sm font-bold text-brand-black italic hover:text-brand-gold transition-colors">
                                Try Free
                            </a>
                        </nav>
                    )}

                    {/* Right: Auth Buttons & Mobile Toggle */}
                    <div className="flex-1 flex items-center justify-end gap-1.5 md:gap-4 relative z-[120]">
                        {!isAuthPage && (
                            <>
                                {!user ? (
                                    <>
                                        <a href={loginUrl} className="hidden sm:block text-sm font-medium text-brand-black/70 hover:text-brand-black transition-colors italic">
                                            Log In
                                        </a>
                                        <a href={signupUrl} className="bg-brand-black text-brand-beige px-2.5 md:px-4 py-1.5 md:py-2 text-[10px] md:text-sm font-medium rounded-sm hover:opacity-90 transition-opacity italic">
                                            Sign In
                                        </a>
                                    </>
                                ) : (
                                    <a 
                                        href={dashboardUrl} 
                                        className="bg-brand-black text-brand-beige px-4 py-2 text-sm font-medium rounded-sm hover:opacity-90 transition-opacity italic"
                                    >
                                        Dashboard
                                    </a>
                                )}
                            </>
                        )}
                        
                        {/* Mobile Menu Toggle - Higher z-index to stay above overlay */}
                        {!isAuthPage && (
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2 -mr-2 text-brand-black focus:outline-none relative z-[130]"
                                aria-label="Toggle menu"
                            >
                                <div className="w-6 h-5 relative flex flex-col justify-between items-center">
                                    <span className={`w-6 h-0.5 bg-brand-black transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-[9px]' : ''}`}></span>
                                    {!isMenuOpen && <span className="w-6 h-0.5 bg-brand-black transition-opacity duration-300"></span>}
                                    <span className={`w-6 h-0.5 bg-brand-black transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-[9px]' : ''}`}></span>
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Overlay - Full Screen, no borders */}
            <div className={`fixed inset-0 bg-brand-beige z-[100] md:hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div className="flex flex-col h-full pt-32 px-6 overflow-y-auto">
                    <div className="flex flex-col gap-12">
                        <div className="space-y-4">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-black/30 font-bold ml-1">Navigation</p>
                            <div className="flex flex-col gap-2">
                                <Link to="/" onClick={(e) => scrollToSection(e, 'home')} className="group flex items-center justify-between py-2">
                                    <BlurTextReact 
                                        text="Home"
                                        tag="span"
                                        className="text-4xl font-bold text-brand-black italic font-serif group-hover:text-brand-gold transition-colors"
                                        delay={50}
                                        animateBy="letters"
                                        animate={isMenuOpen}
                                    />
                                    <svg className="w-5 h-5 text-brand-black/20 group-hover:text-brand-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                                <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="group flex items-center justify-between py-2">
                                    <BlurTextReact 
                                        text="Features"
                                        tag="span"
                                        className="text-4xl font-bold text-brand-black italic font-serif group-hover:text-brand-gold transition-colors"
                                        delay={50}
                                        animateBy="letters"
                                        animate={isMenuOpen}
                                    />
                                    <svg className="w-5 h-5 text-brand-black/20 group-hover:text-brand-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                                <a href="#try-free" onClick={(e) => scrollToSection(e, 'try-free')} className="group flex items-center justify-between py-2">
                                    <BlurTextReact 
                                        text="Try Free"
                                        tag="span"
                                        className="text-4xl font-bold text-brand-black italic font-serif group-hover:text-brand-gold transition-colors"
                                        delay={50}
                                        animateBy="letters"
                                        animate={isMenuOpen}
                                    />
                                    <svg className="w-5 h-5 text-brand-black/20 group-hover:text-brand-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-black/30 font-bold ml-1">Account</p>
                            <div className="flex flex-col gap-4">
                                {!user ? (
                                    <>
                                        <a href={loginUrl} className="w-full py-5 text-center font-bold text-brand-black italic bg-white border border-brand-black/5 rounded-xl hover:bg-brand-black hover:text-white transition-all shadow-sm">
                                            Log In
                                        </a>
                                        <a href={signupUrl} className="w-full py-5 text-center font-bold text-brand-beige italic bg-brand-black rounded-xl hover:opacity-90 transition-all shadow-lg">
                                            Get Started
                                        </a>
                                    </>
                                ) : (
                                    <a 
                                        href={dashboardUrl} 
                                        className="w-full py-5 text-center font-bold text-brand-beige italic bg-brand-black rounded-xl hover:opacity-90 transition-all shadow-lg"
                                    >
                                        Dashboard
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer info */}
                    <div className="mt-auto pb-12 pt-12">
                        <div className="flex items-center gap-3 mb-4 opacity-20">
                            <div className="w-8 h-8 bg-brand-black rounded-lg p-1.5">
                                <img src="/landing-logo.png" alt="" className="w-full h-full object-contain invert" />
                            </div>
                            <span className="text-sm font-bold font-serif italic tracking-tight">ReadRacing</span>
                        </div>
                        <p className="text-xs text-brand-black/20 tracking-wide">© 2026 ReadRacing. Designed for speed.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
