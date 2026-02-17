'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAIChat } from '@/hooks/useAIChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useLanguage } from '@/context/LanguageContext';
import { UserContext } from '@/services/geminiService';
import { supabase } from '@/lib/supabase';
import { bookService } from '@/services/bookService';
import { Sparkles } from 'lucide-react';

interface GlobalAIChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const GlobalAIChatModal: React.FC<GlobalAIChatModalProps> = ({ isOpen, onClose }) => {
    const { t, language } = useLanguage();
    const [username, setUsername] = useState<string>('Reader');
    const [library, setLibrary] = useState<any[]>([]);
    const [availableBooks, setAvailableBooks] = useState<any[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch data when modal opens
    useEffect(() => {
        if (isOpen) {
            const loadData = async () => {
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Reader';
                        setUsername(name);

                        const { data: books } = await supabase
                            .from('books')
                            .select('*')
                            .eq('user_id', user.id);
                        
                        if (books) {
                            setLibrary(books.map(b => ({
                                title: b.title,
                                author: b.author,
                                currentPage: b.current_page,
                                totalPages: b.total_pages,
                                lastReadAt: b.last_read_at
                            })));
                        }
                    }

                    const allBooks = bookService.getAllBooks();
                    setAvailableBooks(allBooks.map(b => ({
                        title: b.title,
                        author: b.author,
                        genre: b.genre
                    })));

                } catch (error) {
                    console.error('Error loading chat context:', error);
                }
            };
            loadData();
        }
    }, [isOpen]);

    const userContext: UserContext = {
        username,
        library,
        availableBooks
    };

    const { messages, sendMessage, isLoading, error, clearHistory } = useAIChat(userContext, language);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    if (!isOpen) return null;

    const handleQuickAction = (action: string) => {
        let text = '';
        switch (action) {
            case 'plan':
                text = "Создай мне план чтения. Учитывай мой темп (страниц в день), лучшее время для чтения и когда делать перерывы.";
                break;
            case 'habit_analysis':
                text = "Проанализируй моё чтение. Если я застрял на какой-то странице или главе, предложи книги с быстрым и захватывающим началом.";
                break;
            case 'similar_books':
                text = "Собери библиотеку похожих книг на основе тех, что я уже прочитал (по сути или жанру).";
                break;
            case 'full_analysis':
                text = "Сделай полный анализ моего чтения: прогресс, скорость, предпочтения и рекомендации.";
                break;
            default:
                return;
        }
        sendMessage(text);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
                onClick={onClose}
            />

            {/* Modal Window */}
            <div className="relative w-full max-w-5xl h-[85vh] bg-[#F9F5F1] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-[#E8E1D5]">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-[#E8E1D5] bg-[#FDFBF7]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#8B6F47] rounded-xl flex items-center justify-center text-white shadow-md">
                            <Sparkles size={20} fill="currentColor" />
                        </div>
                        <div>
                            <h2 className="font-serif font-bold text-xl text-[#3D1C0B]">AI Reading Companion</h2>
                            <p className="text-sm text-[#8C7B6C] hidden md:block">Your personal literary guide</p>
                        </div>
                        <div className="hidden md:block text-xs px-3 py-1 bg-[#8B6F47]/10 text-[#8B6F47] rounded-full font-medium ml-2">
                            Beta
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={clearHistory}
                            className="p-2 rounded-full hover:bg-[#E8E1D5]/50 text-[#8C7B6C] transition-colors"
                            title="Clear History"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-red-50 text-[#8C7B6C] hover:text-red-500 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-0 animate-in fade-in duration-700 fill-mode-forwards" style={{ animationDelay: '0.2s' }}>
                            <div className="w-24 h-24 bg-[#8B6F47]/5 rounded-full flex items-center justify-center mb-6">
                                <span className="text-5xl">💬</span>
                            </div>
                            <h3 className="text-2xl font-serif text-[#3D1C0B] mb-3">
                                Hello, {username}!
                            </h3>
                            <p className="text-[#8C7B6C] max-w-md mb-10 leading-relaxed text-lg">
                                I can help you create reading plans, analyze your habits, or suggest your next favorite book.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
                                <button 
                                    onClick={() => handleQuickAction('plan')}
                                    className="p-6 rounded-2xl border border-[#E8E1D5] bg-[#FDFBF7] hover:bg-[#F5EFE6] hover:border-[#D6C8B4] transition-all text-left group shadow-sm hover:shadow-md"
                                >
                                    <div className="mb-4 text-3xl group-hover:scale-110 transition-transform origin-left">📅</div>
                                    <div className="font-bold text-[#3D1C0B] mb-1 text-lg">План чтения</div>
                                    <div className="text-sm text-[#8C7B6C]">Персональный график и ритм</div>
                                </button>
                                
                                <button 
                                    onClick={() => handleQuickAction('habit_analysis')}
                                    className="p-6 rounded-2xl border border-[#E8E1D5] bg-[#FDFBF7] hover:bg-[#F5EFE6] hover:border-[#D6C8B4] transition-all text-left group shadow-sm hover:shadow-md"
                                >
                                    <div className="mb-4 text-3xl group-hover:scale-110 transition-transform origin-left">⚡</div>
                                    <div className="font-bold text-[#3D1C0B] mb-1 text-lg">Анализ привычек</div>
                                    <div className="text-sm text-[#8C7B6C]">Как преодолеть "застой"</div>
                                </button>
                                
                                <button 
                                    onClick={() => handleQuickAction('similar_books')}
                                    className="p-6 rounded-2xl border border-[#E8E1D5] bg-[#FDFBF7] hover:bg-[#F5EFE6] hover:border-[#D6C8B4] transition-all text-left group shadow-sm hover:shadow-md"
                                >
                                    <div className="mb-4 text-3xl group-hover:scale-110 transition-transform origin-left">📚</div>
                                    <div className="font-bold text-[#3D1C0B] mb-1 text-lg">Похожие книги</div>
                                    <div className="text-sm text-[#8C7B6C]">Подборка по вкусам</div>
                                </button>

                                <button 
                                    onClick={() => handleQuickAction('full_analysis')}
                                    className="p-6 rounded-2xl border border-[#E8E1D5] bg-[#FDFBF7] hover:bg-[#F5EFE6] hover:border-[#D6C8B4] transition-all text-left group shadow-sm hover:shadow-md"
                                >
                                    <div className="mb-4 text-3xl group-hover:scale-110 transition-transform origin-left">📊</div>
                                    <div className="font-bold text-[#3D1C0B] mb-1 text-lg">Полный анализ</div>
                                    <div className="text-sm text-[#8C7B6C]">Все о твоем чтении</div>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 max-w-4xl mx-auto">
                            {messages.map((msg) => (
                                <ChatMessage key={msg.id} message={msg} isDark={false} />
                            ))}
                            {isLoading && (
                                <div className="flex justify-start mb-4">
                                    <div className="bg-[#F5EFE6] rounded-2xl rounded-bl-none p-4 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-[#8B6F47] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-[#8B6F47] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-[#8B6F47] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            )}
                            {error && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm border border-red-100">
                                    {error}
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 bg-white border-t border-[#E8E1D5]">
                    <div className="max-w-4xl mx-auto">
                        <ChatInput 
                            onSend={sendMessage} 
                            isLoading={isLoading} 
                            isDark={false} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
