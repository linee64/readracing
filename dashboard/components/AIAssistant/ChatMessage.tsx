
import React from 'react';
import { ChatMessage as IChatMessage } from '@/services/geminiService';
import { useLanguage } from '@/context/LanguageContext';

interface ChatMessageProps {
    message: IChatMessage;
    isDark: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isDark }) => {
    const isUser = message.role === 'user';
    const { t } = useLanguage();

    return (
        <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-sm relative group
                    ${isUser
                        ? (isDark ? 'bg-[#8B6F47] text-white rounded-br-none' : 'bg-[#8B6F47] text-white rounded-br-none')
                        : (isDark ? 'bg-[#333] text-gray-200 rounded-bl-none border border-[#444]' : 'bg-white text-[#4A3B32] rounded-bl-none border border-[#E8E1D5]')}
                `}
            >
                <div className="flex items-center gap-2 mb-1 opacity-70 text-[10px] uppercase tracking-wider font-bold">
                    <span>{isUser ? t.reader.you || 'You' : t.reader.ai_assistant?.title || 'AI Assistant'}</span>
                </div>

                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.text}
                </div>

                {!isUser && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => navigator.clipboard.writeText(message.text)}
                            className={`p-1.5 rounded-full hover:bg-black/10 transition-colors ${isDark ? 'text-gray-400' : 'text-[#8C7B6C]'}`}
                            title={t.reader.ai_assistant?.copy || "Copy"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
