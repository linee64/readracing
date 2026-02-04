import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="sticky top-0 z-50 bg-brand-beige border-b border-brand-black/5 flex items-center justify-between px-6 py-4 w-full transition-all duration-300">
            {/* Left: Logo */}
            <Link to="/" className="text-xl font-bold tracking-tight text-brand-black italic font-serif hover:opacity-80 transition-opacity">
                ReadRacing
            </Link>

            {/* Center: Home */}
            <nav className="hidden md:block">
                <Link to="/" className="font-medium text-brand-black/80 hover:text-brand-black transition-colors italic">
                    Home
                </Link>
            </nav>

            {/* Right: Auth Buttons */}
            <div className="flex items-center gap-4">
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
