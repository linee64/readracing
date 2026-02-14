import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

type Theme = 'auto' | 'light' | 'dark';
type HighlightColor = 'blue' | 'green' | 'yellow' | 'gray';

interface ReaderSettingsProps {
    isOpen: boolean;
    onClose: () => void;
    settings: {
        fontSize: number;
        fontFamily: string;
        theme: Theme;
        highlightColor: HighlightColor;
    };
    onUpdateSettings: (key: string, value: any) => void;
    isMobile: boolean;
}

export default function ReaderSettings({ 
    isOpen, 
    onClose, 
    settings, 
    onUpdateSettings,
    isMobile 
}: ReaderSettingsProps) {
    const { t } = useLanguage();

    if (!isOpen) return null;

    const fonts = [
        { label: 'Inter', value: 'Inter, sans-serif' },
        { label: 'Georgia', value: 'Georgia, serif' },
        { label: 'Arial', value: 'Arial, sans-serif' },
        { label: 'Times New Roman', value: '"Times New Roman", serif' },
    ];

    const highlights: { color: string; value: HighlightColor; label: string }[] = [
        { color: '#60a5fa', value: 'blue', label: t.reader.blue }, // blue-400
        { color: '#4ade80', value: 'green', label: t.reader.green }, // green-400
        { color: '#facc15', value: 'yellow', label: t.reader.yellow }, // yellow-400
        { color: '#9ca3af', value: 'gray', label: t.reader.gray }, // gray-400
    ];

    const isDark = settings.theme === 'dark' || (settings.theme === 'auto' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const Content = (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className={`text-xl font-serif font-bold ${isDark ? 'text-white' : 'text-[#4A3B32]'}`}>{t.reader.appearance}</h2>
                <button 
                    onClick={onClose} 
                    className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-[#EFE6D5] text-[#8C7B6C]'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>

            {/* Theme Selection - Icons */}
            <div className="space-y-3">
                <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-[#8C7B6C]'}`}>{t.reader.theme}</label>
                <div className={`flex p-1 rounded-xl border ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-[#F9F5F1] border-[#E8E1D5]'}`}>
                    {[
                        { value: 'auto', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>, label: t.reader.auto },
                        { value: 'light', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41-1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>, label: t.reader.light },
                        { value: 'dark', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>, label: t.reader.dark }
                    ].map((t) => (
                        <button
                            key={t.value}
                            onClick={() => onUpdateSettings('theme', t.value)}
                            className={`flex-1 flex flex-col items-center justify-center gap-2 py-3 rounded-lg transition-all duration-200 ${
                                settings.theme === t.value 
                                    ? (isDark ? 'bg-gray-800 text-white shadow-lg' : 'bg-white text-[#4A3B32] shadow-sm ring-1 ring-[#E8E1D5]') 
                                    : (isDark ? 'text-gray-500 hover:text-gray-300' : 'text-[#8C7B6C] hover:text-[#4A3B32]')
                            }`}
                        >
                            {t.icon}
                            <span className="text-[10px] font-medium">{t.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Font Family - Compact List */}
            <div className="space-y-3">
                <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-[#8C7B6C]'}`}>{t.reader.typeface}</label>
                <div className={`flex flex-col rounded-xl overflow-hidden border ${isDark ? 'border-gray-700 bg-gray-900/30' : 'border-[#E8E1D5] bg-[#F9F5F1]'}`}>
                    {fonts.map((f, i) => (
                        <button
                            key={f.value}
                            onClick={() => onUpdateSettings('fontFamily', f.value)}
                            className={`flex items-center justify-between px-4 py-3 text-left transition-colors relative
                                ${i !== fonts.length - 1 ? (isDark ? 'border-b border-gray-800' : 'border-b border-[#E8E1D5]') : ''}
                                ${settings.fontFamily === f.value 
                                    ? (isDark ? 'bg-gray-800 text-white' : 'bg-[#EFE6D5] text-[#4A3B32]') 
                                    : (isDark ? 'text-gray-400 hover:bg-gray-800/50' : 'text-[#5C4D44] hover:bg-[#EFE6D5]/50')}
                            `}
                        >
                            <span style={{ fontFamily: f.value }} className="text-sm">{f.label}</span>
                            {settings.fontFamily === f.value && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Font Size - Custom Slider */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-[#8C7B6C]'}`}>{t.reader.size}</label>
                    <span className={`text-xs font-mono ${isDark ? 'text-gray-400' : 'text-[#8C7B6C]'}`}>{settings.fontSize}px</span>
                </div>
                <div className={`flex items-center gap-4 p-2 rounded-xl border ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-[#F9F5F1] border-[#E8E1D5]'}`}>
                    <button 
                        onClick={() => onUpdateSettings('fontSize', Math.max(12, settings.fontSize - 1))}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-white hover:shadow-sm text-[#8C7B6C]'}`}
                    >
                        <span className="text-xs">A-</span>
                    </button>
                    <input
                        type="range"
                        min="12"
                        max="24"
                        step="1"
                        value={settings.fontSize}
                        onChange={(e) => onUpdateSettings('fontSize', parseInt(e.target.value))}
                        className={`flex-1 h-1.5 rounded-lg appearance-none cursor-pointer ${isDark ? 'bg-gray-700 accent-white' : 'bg-[#E8E1D5] accent-[#4A3B32]'}`}
                    />
                    <button 
                        onClick={() => onUpdateSettings('fontSize', Math.min(24, settings.fontSize + 1))}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-white hover:shadow-sm text-[#8C7B6C]'}`}
                    >
                        <span className="text-lg">A+</span>
                    </button>
                </div>
            </div>

            {/* Highlight Color - Circles */}
            <div className="space-y-3">
                <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-[#8C7B6C]'}`}>{t.reader.highlight_color}</label>
                <div className="flex items-center gap-4">
                    {highlights.map((h) => (
                        <button
                            key={h.value}
                            onClick={() => onUpdateSettings('highlightColor', h.value)}
                            className={`group relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                settings.highlightColor === h.value ? 'scale-110 ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-900' : 'hover:scale-105'
                            }`}
                            style={{ 
                                backgroundColor: h.color,
                                cursor: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%234A3B32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>') 0 20, pointer`
                            }}
                            title={h.label}
                        >
                            {settings.highlightColor === h.value && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black/50"><polyline points="20 6 9 17 4 12"/></svg>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6" onClick={onClose}>
                <div 
                    className={`w-full max-w-sm sm:max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-200 max-h-[85vh] overflow-y-auto
                    ${isDark ? 'bg-[#1a1a1a] text-gray-100' : 'bg-[#F9F5F1] text-[#4A3B32]'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {Content}
                </div>
            </div>
        );
    }

    return (
        <div className={`h-full w-80 border-l shadow-2xl overflow-y-auto transition-colors duration-300
            ${isDark ? 'bg-[#1a1a1a] border-gray-800' : 'bg-[#F9F5F1] border-[#E8E1D5]'}`}>
            <div className="p-8">
                {Content}
            </div>
        </div>
    );
}
