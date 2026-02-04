import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

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
        <header className="sticky top-0 z-50 bg-brand-beige/95 backdrop-blur-sm border-b border-brand-black/5 px-4 md:px-6 py-3 md:py-4 w-full transition-all duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between relative">
                {/* Left: Logo */}
                <div className="flex-1 z-50">
                    <Link to="/" onClick={(e) => scrollToSection(e, 'home')} className="text-base md:text-xl font-bold tracking-tight text-brand-black italic font-serif hover:opacity-80 transition-opacity whitespace-nowrap">
                        ReadRacing
                    </Link>
                </div>

                {/* Center: Navigation (Desktop) */}
                <nav className="hidden md:flex items-center gap-10 z-[60] px-4">
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

                {/* Right: Auth Buttons & Mobile Toggle */}
                <div className="flex-1 flex items-center justify-end gap-1.5 md:gap-4 z-50">
                    <Link to="/login" className="hidden sm:block text-sm font-medium text-brand-black/70 hover:text-brand-black transition-colors italic">
                        Log In
                    </Link>
                    <Link to="/signup" className="bg-brand-black text-brand-beige px-2.5 md:px-4 py-1.5 md:py-2 text-[10px] md:text-sm font-medium rounded-sm hover:opacity-90 transition-opacity italic">
                        Sign In
                    </Link>
                    
                    {/* Mobile Menu Toggle */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 -mr-2 text-brand-black focus:outline-none z-[60]"
                        aria-label="Toggle menu"
                    >
                        <div className="w-6 h-5 relative flex flex-col justify-between items-center">
                            <span className={`w-6 h-0.5 bg-current transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-[9px]' : ''}`}></span>
                            <span className={`w-6 h-0.5 bg-current transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`w-6 h-0.5 bg-current transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-[9px]' : ''}`}></span>
                        </div>
                    </button>
                </div>

                {/* Mobile Navigation Overlay */}
                <div className={`fixed inset-0 bg-brand-beige/98 backdrop-blur-md z-[55] md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    <nav className="flex flex-col items-center justify-center h-full gap-8 text-2xl">
                        <Link to="/" onClick={(e) => scrollToSection(e, 'home')} className="font-bold text-brand-black italic hover:text-brand-gold transition-colors">
                            Home
                        </Link>
                        <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="font-bold text-brand-black italic hover:text-brand-gold transition-colors">
                            Features
                        </a>
                        <a href="#try-free" onClick={(e) => scrollToSection(e, 'try-free')} className="font-bold text-brand-black italic hover:text-brand-gold transition-colors">
                            Try Free
                        </a>
                        <div className="w-16 h-px bg-brand-black/10 my-2"></div>
                        <Link to="/login" className="font-bold text-brand-black/60 italic hover:text-brand-black transition-colors">
                            Log In
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
