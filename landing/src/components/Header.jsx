import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const scrollToSection = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 80; // approximate header height
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
    };

    return (
        <header className="sticky top-0 z-50 bg-brand-beige border-b border-brand-black/5 flex items-center justify-between px-6 py-4 w-full transition-all duration-300">
            {/* Left: Logo - wrapped to allow absolute centering of nav */}
            <div className="flex-1">
                <Link to="/" onClick={(e) => scrollToSection(e, 'home')} className="text-xl font-bold tracking-tight text-brand-black italic font-serif hover:opacity-80 transition-opacity whitespace-nowrap">
                    ReadRacing
                </Link>
            </div>

            {/* Center: Navigation - absolutely centered relative to the header */}
            <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                <Link to="/" onClick={(e) => scrollToSection(e, 'home')} className="font-medium text-brand-black/80 hover:text-brand-black transition-colors italic">
                    Home
                </Link>
                <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="font-medium text-brand-black/80 hover:text-brand-black transition-colors italic">
                    Features
                </a>
                <a href="#try-free" onClick={(e) => scrollToSection(e, 'try-free')} className="font-medium text-brand-black/80 hover:text-brand-black transition-colors italic">
                    Try Free
                </a>
            </nav>

            {/* Right: Auth Buttons - wrapped to allow absolute centering of nav */}
            <div className="flex-1 flex items-center justify-end gap-4">
                <Link to="/login" className="text-sm font-medium text-brand-black/70 hover:text-brand-black transition-colors italic">
                    Log In
                </Link>
                <Link to="/signup" className="bg-brand-black text-brand-beige px-4 py-2 text-sm font-medium rounded-sm hover:opacity-90 transition-opacity italic">
                    Sign In
                </Link>
            </div>
        </header>
    );
};

export default Header;
