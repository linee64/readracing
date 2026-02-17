
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
        <form
            onSubmit={handleSubmit}
            className={`w-full relative flex items-end gap-2 rounded-3xl border p-2 shadow-sm transition-all duration-200 ease-in-out
                ${isDark 
                    ? 'bg-[#222] border-[#444] focus-within:ring-1 focus-within:ring-[#8B6F47]/50' 
                    : 'bg-white border-[#E8E1D5] hover:border-[#D6C8B4] focus-within:border-[#8B6F47] focus-within:ring-1 focus-within:ring-[#8B6F47]/20 focus-within:shadow-md'
                }`}
        >
            <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder={t.reader.ai_assistant?.input_placeholder || "Ask a question..."}
                className={`flex-1 bg-transparent resize-none border-none focus:ring-0 p-3 pl-4 max-h-[120px] text-sm leading-relaxed
                    ${isDark ? 'text-gray-200 placeholder-gray-500' : 'text-[#4A3B32] placeholder-[#8C7B6C]/60'}`}
                disabled={isLoading}
            />

            <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`p-2.5 rounded-full transition-all duration-200 flex-shrink-0
                    ${!input.trim() || isLoading
                        ? (isDark ? 'bg-[#333] text-gray-500 cursor-not-allowed' : 'bg-[#F5F2EF] text-[#D6C8B4] cursor-not-allowed')
                        : 'bg-[#8B6F47] text-white hover:bg-[#6D5638] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0'
                    }`}
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                )}
            </button>
        </form>
    );
};
