import React from 'react';

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
    if (!isOpen) return null;

    const fonts = [
        { label: 'Inter', value: 'Inter, sans-serif' },
        { label: 'Georgia', value: 'Georgia, serif' },
        { label: 'Arial', value: 'Arial, sans-serif' },
        { label: 'Times New Roman', value: '"Times New Roman", serif' },
    ];

    const themes: { label: string; value: Theme }[] = [
        { label: 'Auto', value: 'auto' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
    ];

    const highlights: { color: string; value: HighlightColor; label: string }[] = [
        { color: '#bfdbfe', value: 'blue', label: 'Blue' },
        { color: '#bbf7d0', value: 'green', label: 'Green' },
        { color: '#fef08a', value: 'yellow', label: 'Yellow' },
        { color: '#e5e7eb', value: 'gray', label: 'Gray' },
    ];

    const Content = (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-brown-900">Theme settings</h2>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>

            {/* Global Theme */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-brown-900">Global theme</label>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {themes.map((t) => (
                        <button
                            key={t.value}
                            onClick={() => onUpdateSettings('theme', t.value)}
                            className={`flex-1 py-1.5 text-sm rounded-md transition-all ${
                                settings.theme === t.value 
                                    ? 'bg-white shadow-sm text-brown-900 font-medium' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Font Family */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-brown-900">Player font</label>
                <select
                    value={settings.fontFamily}
                    onChange={(e) => onUpdateSettings('fontFamily', e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-brown-900 focus:outline-none focus:ring-2 focus:ring-brown-500/20"
                >
                    {fonts.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                </select>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-brown-900">Player font size: {settings.fontSize}px</label>
                <input
                    type="range"
                    min="12"
                    max="24"
                    step="1"
                    value={settings.fontSize}
                    onChange={(e) => onUpdateSettings('fontSize', parseInt(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brown-600"
                />
            </div>

            {/* Highlight Theme */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-brown-900">Player highlight theme</label>
                <div className="grid grid-cols-2 gap-3">
                    {highlights.map((h) => (
                        <button
                            key={h.value}
                            onClick={() => onUpdateSettings('highlightColor', h.value)}
                            className={`relative p-3 rounded-lg border text-left transition-all ${
                                settings.highlightColor === h.value
                                    ? 'border-brown-500 ring-1 ring-brown-500'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <div className="text-sm leading-tight text-gray-800">
                                In a world where <span style={{ backgroundColor: h.color }} className="px-0.5 rounded-sm font-medium">melodies</span> dance
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl animate-in slide-in-from-bottom-10 fade-in duration-200">
                    {Content}
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-80 bg-white border-l border-gray-200 p-6 shadow-xl overflow-y-auto">
            {Content}
        </div>
    );
}
