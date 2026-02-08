"use client";

import React from 'react';

interface EmptyStateProps {
    onAddManual: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddManual }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-6 opacity-30">📚</div>
            <h2 className="text-2xl font-serif text-[#2C2416] mb-2">Books not found</h2>
            <p className="text-[#8B7E6A] mb-8 max-w-md font-sans">
                Try changing your search query or add a book manually.
            </p>
            <button
                onClick={onAddManual}
                className="bg-[#3D2817] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#4D3827] transition-colors shadow-sm font-sans"
            >
                Add book manually
            </button>
        </div>
    );
};

export default EmptyState;
