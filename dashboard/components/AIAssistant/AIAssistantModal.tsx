
import React, { useEffect, useRef } from 'react';
import { useAIChat } from '@/hooks/useAIChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useLanguage } from '@/context/LanguageContext';
import { BookContext } from '@/services/geminiService';

interface AIAssistantModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookContext: BookContext;
    isDark: boolean;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose, bookContext, isDark }) => {
    const { t, language } = useLanguage();
    const { messages, sendMessage, isLoading, error, clearHistory } = useAIChat(bookContext, language);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    if (!isOpen) return null;

    const quickSuggestions = [
        t.reader.suggestions?.explain_chapter || "Explain this chapter",
        t.reader.suggestions?.character_list || "Character list",
        t.reader.suggestions?.key_themes || "Key themes",
        t.reader.suggestions?.historical_context || "Historical context"
    ];

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Slide-in Panel */}
            <div className={`relative w-full max-w-md h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out animate-in slide-in-from-right
                ${isDark ? 'bg-[#1a1a1a] text-gray-200' : 'bg-[#F9F5F1] text-[#4A3B32]'}`}>

                {/* Header */}
                <div className={`flex items-center justify-between py-3 px-4 border-b ${isDark ? 'border-[#333]' : 'border-[#E8E1D5]'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-[#333] text-[#F5E6D3]' : 'bg-[#4A3728] text-[#F5E6D3]'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /><path d="M12 8v-2" /><path d="M12 16v2" /><path d="M16 12h2" /><path d="M8 12H6" /><path d="M19.07 4.93 17.65 6.35" /><path d="M19.07 19.07 17.65 17.65" /><path d="M4.93 19.07 6.35 17.65" /><path d="M4.93 4.93 6.35 6.35" /></svg>
                        </div>
                        <div>
                            <h2 className="font-serif font-bold text-lg leading-tight">{t.reader.ai_assistant?.title || "AI Assistant"}</h2>
                            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-[#8C7B6C]'}`}>
                                {t.reader.ai_assistant?.asking_about || "Asking about"} "{bookContext.title}"
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                clearHistory();
                            }}
                            className={`p-2 rounded-full transition-colors hover:bg-black/5 ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-[#8C7B6C] hover:text-[#4A3B32]'}`}
                            title={t.reader.ai_assistant?.clear_history || "Clear History"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                        </button>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-full transition-colors hover:bg-black/5 ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-[#8C7B6C] hover:text-[#4A3B32]'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className={`flex-1 overflow-y-auto p-4 custom-scrollbar`}>
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-60 text-center px-8">
                            <div className={`w-16 h-16 rounded-2xl mb-4 flex items-center justify-center ${isDark ? 'bg-[#333] text-gray-500' : 'bg-[#E8E1D5] text-[#8C7B6C]'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                            </div>
                            <h3 className="font-serif font-bold text-lg mb-2">{t.reader.ai_assistant?.how_can_help || "How can I help you read?"}</h3>
                            <p className="text-sm mb-8 max-w-[240px]">
                                {t.reader.ai_assistant?.help_desc || "Ask me about characters, plot points, or meanings of specific terms."}
                            </p>

                            <div className="grid grid-cols-1 gap-2 w-full">
                                {quickSuggestions.map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => sendMessage(suggestion)}
                                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all text-left
                                            ${isDark
                                                ? 'bg-[#222] hover:bg-[#333] text-gray-300'
                                                : 'bg-white hover:bg-white text-[#5C4D44] hover:text-[#4A3B32] shadow-sm hover:shadow-md'}`}
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg) => (
                                <ChatMessage key={msg.id} message={msg} isDark={isDark} />
                            ))}
                            {isLoading && (
                                <div className="flex justify-start mb-4">
                                    <div className={`p-4 rounded-2xl rounded-bl-none ${isDark ? 'bg-[#333]' : 'bg-white border border-[#E8E1D5]'}`}>
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 rounded-full bg-[#8B6F47] animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 rounded-full bg-[#8B6F47] animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 rounded-full bg-[#8B6F47] animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {error && (
                                <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl mb-4 text-center border border-red-100">
                                    {error}
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input Area */}
                <ChatInput onSend={sendMessage} isLoading={isLoading} isDark={isDark} />
            </div>
        </div>
    );
};
