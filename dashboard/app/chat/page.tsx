'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAIChat } from '@/hooks/useAIChat';
// Correct import paths based on file structure
import { ChatMessage as ChatMessageComponent } from '@/components/AIAssistant/ChatMessage';
import { ChatInput } from '@/components/AIAssistant/ChatInput';
import { ChatHistorySidebar, ChatSession } from '@/components/AIAssistant/ChatHistorySidebar';
import { UserContext, ChatMessage } from '@/services/geminiService';
import { bookService } from '@/services/bookService';
import { Calendar, Activity, BookOpen, PieChart, Sparkles, History } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ChatPage() {
    const { t, language } = useLanguage();
    const [username, setUsername] = useState<string>('Reader');
    const [library, setLibrary] = useState<any[]>([]);
    const [availableBooks, setAvailableBooks] = useState<any[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    
    // History State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

    // Fetch user data and library
    useEffect(() => {
        const loadData = async () => {
            setIsLoadingData(true);
            try {
                // 1. Get User
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Reader';
                    setUsername(name);

                    // 2. Get Library (from Supabase)
                    const { data: books, error } = await supabase
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

                // 3. Get Available Books (for recommendations)
                const allBooks = bookService.getAllBooks();
                setAvailableBooks(allBooks.map(b => ({
                    title: b.title,
                    author: b.author,
                    genre: b.genre
                })));

            } catch (error) {
                console.error('Error loading chat context:', error);
            } finally {
                setIsLoadingData(false);
            }
        };

        loadData();
        
        // Load sessions from local storage
        const saved = localStorage.getItem('chat_sessions');
        if (saved) {
            try {
                setSessions(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse sessions', e);
            }
        }
    }, []);

    // AI Chat Hook
    const userContext: UserContext = {
        username,
        library,
        availableBooks
    };

    const { messages, setMessages, isLoading, error, sendMessage, clearHistory } = useAIChat(userContext, language);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-save session
    useEffect(() => {
        if (messages.length === 0) return;
        
        let activeId = currentSessionId;
        if (!activeId) {
            activeId = Date.now().toString();
            setCurrentSessionId(activeId);
        }
        
        setSessions(prev => {
            const now = Date.now();
            const existingIndex = prev.findIndex(s => s.id === activeId);
            
            let newSessions = [...prev];
            
            if (existingIndex !== -1) {
                 newSessions[existingIndex] = {
                    ...newSessions[existingIndex],
                    messages,
                    timestamp: now,
                    title: newSessions[existingIndex].title === 'New Conversation' && messages.length > 0 
                            ? messages[0].text.slice(0, 30) + (messages[0].text.length > 30 ? '...' : '')
                            : newSessions[existingIndex].title
                 };
            } else {
                newSessions = [{
                    id: activeId!,
                    title: messages[0]?.text.slice(0, 30) + (messages[0]?.text.length > 30 ? '...' : '') || 'New Conversation',
                    timestamp: now,
                    messages
                }, ...newSessions];
            }
            
            localStorage.setItem('chat_sessions', JSON.stringify(newSessions));
            return newSessions;
        });
    }, [messages]); 


    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleNewChat = () => {
        clearHistory();
        setCurrentSessionId(null);
        setIsSidebarOpen(false);
    };

    const handleSelectSession = (session: ChatSession) => {
        setMessages(session.messages);
        setCurrentSessionId(session.id);
        setIsSidebarOpen(false);
    };

    const handleDeleteSession = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const newSessions = sessions.filter(s => s.id !== id);
        setSessions(newSessions);
        localStorage.setItem('chat_sessions', JSON.stringify(newSessions));
        if (currentSessionId === id) {
            clearHistory();
            setCurrentSessionId(null);
        }
    };

    const handleQuickAction = (action: string) => {
        let text = '';
        const isRussian = language === 'Russian';

        switch (action) {
            case 'plan':
                text = isRussian 
                    ? "Создай мне план чтения. Учитывай мой темп (страниц в день), лучшее время для чтения и когда делать перерывы."
                    : "Create a reading plan for me. Consider my pace (pages per day), the best time to read, and when to take breaks.";
                break;
            case 'habit_analysis':
                text = isRussian
                    ? "Проанализируй моё чтение. Если я застрял на какой-то странице или главе, предложи книги с быстрым и захватывающим началом."
                    : "Analyze my reading habits. If I'm stuck on a page or chapter, suggest books with a fast and gripping start.";
                break;
            case 'similar_books':
                text = isRussian
                    ? "Собери библиотеку похожих книг на основе тех, что я уже прочитал (по сути или жанру)."
                    : "Curate a library of similar books based on what I've already read (by essence or genre).";
                break;
            case 'full_analysis':
                text = isRussian
                    ? "Сделай полный анализ моего чтения: прогресс, скорость, предпочтения и рекомендации."
                    : "Do a full analysis of my reading: progress, speed, preferences, and recommendations.";
                break;
            default:
                return;
        }
        sendMessage(text);
    };

    return (
        <div className="min-h-screen bg-[#F9F5F1]">
            <ChatHistorySidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
                sessions={sessions}
                currentSessionId={currentSessionId}
                onSelectSession={handleSelectSession}
                onNewChat={handleNewChat}
                onDeleteSession={handleDeleteSession}
                isDark={false}
            />

            <div className="max-w-7xl mx-auto p-4 md:p-8 pb-20 flex flex-col h-screen">
                
                <div className="flex-1 flex flex-col bg-white rounded-3xl border border-[#E8E1D5] shadow-sm overflow-hidden relative">
                    
                    {/* Header */}
                    <div className="p-4 border-b border-[#E8E1D5] flex items-center justify-between bg-[#FDFBF7]">
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 rounded-xl hover:bg-[#E8E1D5]/50 text-[#8C7B6C] transition-colors lg:hidden"
                            >
                                <History size={20} />
                            </button>
                            <div className="w-8 h-8 bg-[#8B6F47] rounded-lg flex items-center justify-center text-white shadow-sm">
                                <Sparkles size={18} fill="currentColor" />
                            </div>
                            <h1 className="font-serif font-bold text-lg text-[#3D1C0B] hidden sm:block">AI Reading Companion</h1>
                        </div>
                        
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-[#E8E1D5]/30 text-[#8C7B6C] hover:text-[#3D1C0B] transition-colors font-medium text-sm"
                        >
                            <History size={18} />
                            <span>History</span>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar">
                        {messages.length === 0 ? (
                            <div className="min-h-full flex flex-col items-center justify-start pt-10 text-center">
                                <div className="w-20 h-20 bg-[#8B6F47]/5 rounded-full flex items-center justify-center mb-6">
                                    <Sparkles size={40} className="text-[#8B6F47]" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-serif text-[#3D1C0B] mb-3">
                                    {t.ai_chat_page?.hello.replace('{name}', username) || `Hello, ${username}!`}
                                </h3>
                                <p className="text-[#8C7B6C] max-w-md mb-10 leading-relaxed">
                                    {t.ai_chat_page?.intro || "I can help you create reading plans, analyze your habits, or suggest your next favorite book."}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                                    <button 
                                        onClick={() => handleQuickAction('plan')}
                                        className="p-5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7] hover:bg-[#F5EFE6] hover:border-[#D6C8B4] transition-all text-left group"
                                    >
                                        <div className="mb-3 text-[#8B6F47] group-hover:scale-110 transition-transform origin-left">
                                            <Calendar size={32} strokeWidth={1.5} />
                                        </div>
                                        <div className="font-bold text-[#3D1C0B] mb-1">{t.ai_chat_page?.actions.plan.title || "Reading Plan"}</div>
                                        <div className="text-xs text-[#8C7B6C]">{t.ai_chat_page?.actions.plan.desc || "Personalized schedule"}</div>
                                    </button>
                                    
                                    <button 
                                        onClick={() => handleQuickAction('habit_analysis')}
                                        className="p-5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7] hover:bg-[#F5EFE6] hover:border-[#D6C8B4] transition-all text-left group"
                                    >
                                        <div className="mb-3 text-[#8B6F47] group-hover:scale-110 transition-transform origin-left">
                                            <Activity size={32} strokeWidth={1.5} />
                                        </div>
                                        <div className="font-bold text-[#3D1C0B] mb-1">{t.ai_chat_page?.actions.habit.title || "Habit Analysis"}</div>
                                        <div className="text-xs text-[#8C7B6C]">{t.ai_chat_page?.actions.habit.desc || "Overcome slumps"}</div>
                                    </button>
                                    
                                    <button 
                                        onClick={() => handleQuickAction('similar_books')}
                                        className="p-5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7] hover:bg-[#F5EFE6] hover:border-[#D6C8B4] transition-all text-left group"
                                    >
                                        <div className="mb-3 text-[#8B6F47] group-hover:scale-110 transition-transform origin-left">
                                            <BookOpen size={32} strokeWidth={1.5} />
                                        </div>
                                        <div className="font-bold text-[#3D1C0B] mb-1">{t.ai_chat_page?.actions.similar.title || "Similar Books"}</div>
                                        <div className="text-xs text-[#8C7B6C]">{t.ai_chat_page?.actions.similar.desc || "Recommendations"}</div>
                                    </button>

                                    <button 
                                        onClick={() => handleQuickAction('full_analysis')}
                                        className="p-5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7] hover:bg-[#F5EFE6] hover:border-[#D6C8B4] transition-all text-left group"
                                    >
                                        <div className="mb-3 text-[#8B6F47] group-hover:scale-110 transition-transform origin-left">
                                            <PieChart size={32} strokeWidth={1.5} />
                                        </div>
                                        <div className="font-bold text-[#3D1C0B] mb-1">{t.ai_chat_page?.actions.analysis.title || "Full Analysis"}</div>
                                        <div className="text-xs text-[#8C7B6C]">{t.ai_chat_page?.actions.analysis.desc || "Deep dive"}</div>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {messages.map((msg) => (
                                    <ChatMessageComponent key={msg.id} message={msg} isDark={false} />
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
                    <div className="p-4 bg-white border-t border-[#E8E1D5]">
                        <div className="max-w-3xl mx-auto">
                            <ChatInput 
                                onSend={sendMessage} 
                                isLoading={isLoading} 
                                isDark={false} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
