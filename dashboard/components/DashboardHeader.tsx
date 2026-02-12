
'use client';

import React from 'react';

export default function DashboardHeader({ username }: { username: string }) {
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="sticky top-0 z-30 bg-cream-50/95 backdrop-blur-sm -mx-4 px-4 py-4 md:static md:bg-transparent md:mx-0 md:px-0 md:py-0 flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8 transition-all">
            <div className="flex flex-col">
                <h1 className="text-xl md:text-4xl font-serif font-bold text-brown-900 tracking-tight">
                    Welcome back, {username}!
                </h1>
                <p className="text-sm md:text-lg text-brown-800/70 mt-1 md:mt-2 font-medium">
                    Let's continue your reading journey
                </p>
            </div>
            <div className="self-start md:self-auto text-xs md:text-sm font-medium text-brown-800/60 bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm border border-cream-200">
                {currentDate}
            </div>
        </div>
    );
}
