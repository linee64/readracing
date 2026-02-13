"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface EmptyStateProps {
    onAddManual: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddManual }) => {
    const { t } = useLanguage();
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-6 opacity-30">📚</div>
            <h2 className="text-2xl font-serif text-[#2C2416] mb-2">{t.library.empty.title}</h2>
            <p className="text-[#8B7E6A] mb-8 max-w-md font-sans">
                {t.library.empty.desc}
            </p>
            <button
                onClick={onAddManual}
                className="bg-[#3D2817] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#4D3827] transition-colors shadow-sm font-sans"
            >
                {t.library.empty.add_manual}
            </button>
        </div>
    );
};

export default EmptyState;
