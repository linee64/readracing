import React from 'react';
import { MessageSquare, Plus, Trash2, X } from 'lucide-react';
import { ChatMessage } from '@/services/geminiService';

export interface ChatSession {
    id: string;
    title: string;
    timestamp: number;
    messages: ChatMessage[];
}

interface ChatHistorySidebarProps {
    isOpen: boolean;
    onClose: () => void;
    sessions: ChatSession[];
    currentSessionId: string | null;
    onSelectSession: (session: ChatSession) => void;
    onNewChat: () => void;
    onDeleteSession: (e: React.MouseEvent, sessionId: string) => void;
    isDark?: boolean;
}

export const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
    isOpen,
    onClose,
    sessions,
    currentSessionId,
    onSelectSession,
    onNewChat,
    onDeleteSession,
    isDark = false
}) => {
    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full w-[280px] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                ${isDark ? 'bg-[#1a1a1a] border-r border-[#333]' : 'bg-[#FDFBF7] border-r border-[#E8E1D5]'}
            `}>
                {/* Header */}
                <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-[#333]' : 'border-[#E8E1D5]'}`}>
                    <h2 className={`font-serif font-bold text-xl ${isDark ? 'text-white' : 'text-[#3D1C0B]'}`}>
                        History
                    </h2>
                    <button 
                        onClick={onClose}
                        className={`p-2 rounded-full hover:bg-black/5 transition-colors ${isDark ? 'text-gray-400' : 'text-[#8C7B6C]'}`}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* New Chat Button */}
                <div className="p-4">
                    <button
                        onClick={() => {
                            onNewChat();
                            if (window.innerWidth < 1024) onClose();
                        }}
                        className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all duration-300
                            ${isDark 
                                ? 'bg-[#333] hover:bg-[#444] text-white border border-[#444]' 
                                : 'bg-white hover:bg-[#F5EFE6] text-[#3D1C0B] border border-[#E8E1D5] shadow-sm hover:shadow-md hover:border-[#D6C8B4]'}
                        `}
                    >
                        <Plus size={18} className={isDark ? 'text-white' : 'text-[#8B6F47]'} />
                        <span>New Chat</span>
                    </button>
                </div>

                {/* Sessions List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                    {sessions.length === 0 ? (
                        <div className={`flex flex-col items-center justify-center py-10 opacity-60 ${isDark ? 'text-gray-600' : 'text-[#8C7B6C]'}`}>
                            <MessageSquare size={32} strokeWidth={1.5} className="mb-2 opacity-50" />
                            <p className="text-sm font-medium">No history yet</p>
                        </div>
                    ) : (
                        sessions.map(session => (
                            <div
                                key={session.id}
                                onClick={() => {
                                    onSelectSession(session);
                                    if (window.innerWidth < 1024) onClose();
                                }}
                                className={`group relative p-3.5 rounded-xl cursor-pointer transition-all border
                                    ${currentSessionId === session.id
                                        ? (isDark ? 'bg-[#333] border-[#8B6F47] text-white' : 'bg-white border-[#8B6F47] text-[#3D1C0B] shadow-md ring-1 ring-[#8B6F47]/10')
                                        : (isDark ? 'hover:bg-[#252525] border-transparent text-gray-300' : 'hover:bg-white border-transparent hover:border-[#E8E1D5] text-[#6D5638] hover:shadow-sm')
                                    }
                                `}
                            >
                                <div className="flex items-start gap-3">
                                    <MessageSquare size={16} className={`mt-1 flex-shrink-0 transition-colors ${currentSessionId === session.id ? 'text-[#8B6F47]' : 'opacity-40 group-hover:opacity-70'}`} />
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-medium text-sm truncate pr-6 ${currentSessionId === session.id ? 'font-semibold' : ''}`}>
                                            {session.title || 'New Conversation'}
                                        </h3>
                                        <p className="text-[10px] opacity-50 mt-1 font-medium">
                                            {new Date(session.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => onDeleteSession(e, session.id)}
                                    className={`absolute right-2 top-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all
                                        ${isDark ? 'hover:bg-[#444] text-gray-400 hover:text-red-400' : 'hover:bg-[#F5EFE6] text-[#8C7B6C] hover:text-red-500'}
                                    `}
                                    title="Delete chat"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};
