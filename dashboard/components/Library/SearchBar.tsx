"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface SearchBarProps {
    query: string;
    onQueryChange: (query: string) => void;
    filters: { genre: string; language: string };
    onFilterChange: (filters: { genre?: string; language?: string }) => void;
    onReset: () => void;
    totalResults: number;
}

const GENRES = ['All', 'Classic', 'Fantasy', 'Detectives', 'Romance'];
const LANGUAGES = ['All', 'Russian', 'English'];

const CustomDropdown = ({ 
    label, 
    value, 
    options, 
    onChange, 
    icon,
    t,
    type
}: { 
    label: string, 
    value: string, 
    options: string[], 
    onChange: (val: string) => void,
    icon?: React.ReactNode,
    t: any,
    type: 'genre' | 'language'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const getLabel = (opt: string) => {
        const key = opt.toLowerCase();
        if (type === 'genre') {
            return t.library.genres[key as keyof typeof t.library.genres] || opt;
        }
        return t.library.languages[key as keyof typeof t.library.languages] || opt;
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`h-[50px] md:h-[60px] px-4 md:px-6 bg-white border-2 rounded-[20px] text-brown-900 transition-all font-sans font-bold flex items-center justify-between gap-4 min-w-[140px] md:min-w-[160px] hover:border-brown-900/30 shadow-sm ${isOpen ? 'border-brown-900 ring-4 ring-brown-900/5' : 'border-cream-200'}`}
            >
                <div className="flex items-center gap-2">
                    {icon && <span className="text-brown-800/40">{icon}</span>}
                    <span>{value === 'All' ? t.library[`all_${type}s` as keyof typeof t.library] : getLabel(value)}</span>
                </div>
                <svg 
                    className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brown-900' : 'text-brown-800/40'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-cream-200 rounded-[20px] shadow-2xl py-3 z-50 animate-in fade-in zoom-in duration-200">
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => {
                                    onChange(opt);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-6 py-3 text-sm font-bold transition-colors flex items-center justify-between ${value === opt ? 'bg-cream-100 text-brown-900' : 'text-brown-800/60 hover:bg-cream-50 hover:text-brown-900'}`}
                            >
                                {opt === 'All' ? t.library[`all_${type}s` as keyof typeof t.library] : getLabel(opt)}
                                {value === opt && (
                                    <span className="text-brown-900">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const SearchBar: React.FC<SearchBarProps> = ({
    query,
    onQueryChange,
    filters,
    onFilterChange,
    onReset,
    totalResults
}) => {
    const { t } = useLanguage();
    return (
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative w-full lg:max-w-[700px] group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-brown-800/40 group-focus-within:text-brown-900 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        placeholder={t.library.search_placeholder}
                        className="w-full h-[60px] pl-14 pr-12 bg-white border-2 border-cream-200 rounded-[20px] text-lg placeholder-brown-800/30 text-brown-900 focus:outline-none focus:border-brown-900/20 focus:ring-4 focus:ring-brown-900/5 transition-all font-sans shadow-sm hover:border-cream-300"
                    />
                    {query && (
                        <button
                            onClick={() => onQueryChange('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream-100 text-brown-800/40 hover:text-brown-900 transition-all font-sans"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full lg:w-auto font-sans">
                    <CustomDropdown 
                        label={t.library.all_genres} 
                        value={filters.genre} 
                        options={GENRES} 
                        onChange={(val) => onFilterChange({ genre: val })}
                        t={t}
                        type="genre"
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M2 16.5C2 19.54 4.46 22 7.5 22s5.5-2.46 5.5-5.5V10H2zm5.5 2C6.12 18.5 5 17.83 5 17h5c0 .83-1.12 1.5-2.5 1.5M10 13c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1m-5 0c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1"/>
                                <path fill="currentColor" d="M11 3v6h3v2.5c0-.83 1.12-1.5 2.5-1.5s2.5.67 2.5 1.5h-5v2.89c.75.38 1.6.61 2.5.61c3.04 0 5.5-2.46 5.5-5.5V3zm3 5.08c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1c0 .56-.45 1-1 1m5 0c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1c0 .56-.45 1-1 1"/>
                            </svg>
                        }
                    />

                    <CustomDropdown 
                        label={t.library.all_languages} 
                        value={filters.language} 
                        options={LANGUAGES} 
                        onChange={(val) => onFilterChange({ language: val })}
                        t={t}
                        type="language"
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12 22q-2.05 0-3.875-.788t-3.187-2.15t-2.15-3.187T2 12q0-2.075.788-3.887t2.15-3.175t3.187-2.15T12 2q2.075 0 3.888.788t3.174 2.15t2.15 3.175T22 12q0 2.05-.788 3.875t-2.15 3.188t-3.175 2.15T12 22m0-2.05q.65-.9 1.125-1.875T13.9 16h-3.8q.3 1.1.775 2.075T12 19.95m-2.6-.4q-.45-.825-.787-1.713T8.05 16H5.1q.725 1.25 1.813 2.175T9.4 19.55m5.2 0q1.4-.45 2.488-1.375T18.9 16h-2.95q-.225.95-.562 1.838T14.6 19.55M4.25 14h3.4q-.075-.5-.112-.987T7.5 12t.038-1.012T7.65 10h-3.4q-.125.5-.187.988T4 12t.063 1.013t.187.987m5.4 0h4.7q.075-.5.113-.987T14.5 12t-.038-1.012T14.35 10h-4.7q-.075.5-.112.988T9.5 12t.038 1.013t.112.987m6.7 0h3.4q.125-.5.188-.987T20 12t-.062-1.012T19.75 10h-3.4q.075.5.113.988T16.5 12t-.038 1.013t-.112.987m-.4-6h2.95q-.725-1.25-1.812-2.175T14.6 4.45q.45.825.788 1.713T15.95 8M10.1 8h3.8q-.3-1.1-.775-2.075T12 4.05q-.65.9-1.125 1.875T10.1 8m-5 0h2.95q.225-.95.563-1.838T9.4 4.45Q8 4.9 6.912 5.825T5.1 8"/>
                            </svg>
                        }
                    />

                    <button
                        onClick={onReset}
                        className="h-[50px] md:h-[60px] px-6 md:px-8 bg-brown-900/5 text-brown-900 font-black hover:bg-brown-900/10 rounded-[20px] transition-all border-2 border-transparent active:scale-95 flex items-center gap-2 group"
                    >
                        <svg 
                            className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {t.library.reset}
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-wrap items-center gap-3 font-sans">
                    <span className="text-brown-800/40 text-sm font-bold uppercase tracking-wider mr-2">{t.library.popular}</span>
                    {GENRES.filter(g => g !== 'All').map(genre => (
                        <button
                            key={genre}
                            onClick={() => onFilterChange({ genre })}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all border-2 ${filters.genre === genre
                                    ? 'bg-brown-900 border-brown-900 text-cream-50 shadow-md transform scale-105'
                                    : 'bg-white border-cream-200 text-brown-800/60 hover:border-brown-900/30 hover:text-brown-900'
                                }`}
                        >
                            {t.library.genres[genre.toLowerCase() as keyof typeof t.library.genres] || genre}
                        </button>
                    ))}
                </div>

                <div className="text-brown-800/50 text-sm font-medium font-sans bg-cream-100/50 px-4 py-2 rounded-lg border border-cream-200/50">
                    {t.library.found} <span className="text-brown-900 font-black">{totalResults}</span> {totalResults === 1 ? t.library.book : t.library.books}
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
