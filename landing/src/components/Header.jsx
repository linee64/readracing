import React from 'react';

const Header = () => {
    return (
        <header className="sticky top-0 z-50 bg-brand-beige border-b border-brand-black/5 flex items-center justify-between px-6 py-4 w-full transition-all duration-300">
            {/* Left: Logo */}
            <div className="text-xl font-bold tracking-tight text-brand-black italic font-serif">
                ReadRacing
            </div>

            {/* Center: Home */}
            <nav className="hidden md:block">
                <a href="#" className="font-medium text-brand-black/80 hover:text-brand-black transition-colors italic">
                    Home
                </a>
            </nav>

            {/* Right: Auth Buttons */}
            <div className="flex items-center gap-4">
                <button className="text-sm font-medium text-brand-black/70 hover:text-brand-black transition-colors italic">
                    Log In
                </button>
                <button className="bg-brand-black text-brand-beige px-4 py-2 text-sm font-medium rounded-sm hover:opacity-90 transition-opacity italic">
                    Sign In
                </button>
            </div>
        </header>
    );
};

export default Header;
