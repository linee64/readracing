
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
        <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col">
                <h1 className="text-4xl font-serif font-bold text-brown-900 tracking-tight">
                    Welcome back, {username}!
                </h1>
                <p className="text-lg text-brown-800/70 mt-2 font-medium">
                    Let's continue your reading journey
                </p>
            </div>
            <div className="text-sm font-medium text-brown-800/60 bg-white px-4 py-2 rounded-full shadow-sm border border-cream-200">
                {currentDate}
            </div>
        </div>
    );
}
