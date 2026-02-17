'use client';

import React from 'react';

interface GlobalChatButtonProps {
    onClick: () => void;
}

export const GlobalChatButton: React.FC<GlobalChatButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 z-50 p-4 bg-[#8B6F47] hover:bg-[#6D5638] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group flex items-center gap-2"
            title="Open AI Assistant"
        >
            <div className="relative">
                <span className="text-2xl">✨</span>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-gold"></span>
                </span>
            </div>
            <span className="font-bold pr-1 hidden group-hover:inline-block animate-in fade-in slide-in-from-right-2 duration-300 whitespace-nowrap">
                AI Assistant
            </span>
        </button>
    );
};
