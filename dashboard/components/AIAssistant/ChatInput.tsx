
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface ChatInputProps {
    onSend: (text: string) => void;
    isLoading: boolean;
    isDark: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, isDark }) => {
    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { t } = useLanguage();

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        onSend(input);
        setInput('');

        // Reset height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [input]);

    return (
        <div className={`p-4 border-t ${isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-[#F9F5F1] border-[#E8E1D5]'}`}>
            <form
                onSubmit={handleSubmit}
                className={`relative flex items-end gap-2 rounded-xl border p-2 shadow-sm transition-colors focus-within:ring-1 focus-within:ring-[#8B6F47]/50
                    ${isDark ? 'bg-[#222] border-[#444]' : 'bg-white border-[#E8E1D5]'}`}
            >
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder={t.reader.ai_assistant?.input_placeholder || "Ask a question..."}
                    className={`flex-1 bg-transparent resize-none border-none focus:ring-0 p-2 max-h-[120px] text-sm
                        ${isDark ? 'text-gray-200 placeholder-gray-500' : 'text-[#4A3B32] placeholder-[#8C7B6C]/60'}`}
                    disabled={isLoading}
                />

                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className={`p-2.5 rounded-lg transition-all duration-200
                        ${!input.trim() || isLoading
                            ? (isDark ? 'bg-[#333] text-gray-500 cursor-not-allowed' : 'bg-[#F0EAE4] text-[#C0B4A8] cursor-not-allowed')
                            : 'bg-[#8B6F47] text-white hover:bg-[#6D5638] shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    )}
                </button>
            </form>
            <div className={`text-[10px] text-center mt-2 ${isDark ? 'text-gray-600' : 'text-[#8C7B6C]/60'}`}>
                {t.reader.ai_disclaimer || "AI uses Gemini Flash 2.5. Answers may be inaccurate."}
            </div>
        </div>
    );
};
