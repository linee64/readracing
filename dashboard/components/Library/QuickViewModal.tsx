"use client";

import React, { useState } from 'react';
import { Book } from '../../types';

interface QuickViewModalProps {
    book: Book | null;
    isOpen: boolean;
    onClose: () => void;
    onAdd: (id: string) => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ book, isOpen, onClose, onAdd }) => {
    const [activeTab, setActiveTab] = useState<'Description' | 'Reviews' | 'Details'>('Description');

    if (!isOpen || !book) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#3D2817]/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                    {/* Left: Cover */}
                    <div className="md:w-2/5 relative bg-[#F5F1E8]">
                        <img
                            src={book.coverUrl || 'https://via.placeholder.com/400x600'}
                            alt={book.title}
                            className="w-full h-full object-contain p-8 md:p-12 drop-shadow-2xl"
                        />
                        <button
                            onClick={onClose}
                            className="absolute top-6 left-6 w-10 h-10 bg-white border border-[#E5DCC8] text-[#3D2817] rounded-full flex items-center justify-center shadow-lg hover:bg-[#F5F1E8] transition-colors md:hidden"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Right: Info */}
                    <div className="md:w-3/5 p-8 md:p-12 flex flex-col overflow-y-auto">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-3xl font-serif font-bold text-[#2C2416] mb-2">{book.title}</h2>
                                <p className="text-xl text-[#8B7E6A] font-sans italic">by {book.author}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="hidden md:flex w-10 h-10 bg-[#F5F1E8] text-[#3D2817] rounded-full items-center justify-center hover:bg-[#E5DCC8] transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex gap-8 border-b border-[#E5DCC8] mb-8 font-sans">
                            {(['Description', 'Reviews', 'Details'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 text-sm font-semibold transition-all relative ${activeTab === tab ? 'text-[#3D2817]' : 'text-[#8B7E6A]'
                                        }`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3D2817]" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 text-[#2C2416] leading-relaxed mb-8 font-sans">
                            {activeTab === 'Description' && (
                                <p>{book.description || 'No description available.'}</p>
                            )}
                            {activeTab === 'Reviews' && (
                                <div className="space-y-4">
                                    <div className="p-4 bg-[#F5F1E8] rounded-xl border border-[#E5DCC8]">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-[#3D2817] text-white text-[10px] flex items-center justify-center">JD</div>
                                            <span className="font-semibold text-sm">John Doe</span>
                                            <span className="text-yellow-500 text-xs ml-auto">★★★★★</span>
                                        </div>
                                        <p className="text-sm text-[#8B7E6A]">Absolutely loved this book! A modern classic.</p>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'Details' && (
                                <div className="grid grid-cols-2 gap-y-4 text-sm">
                                    <span className="text-[#8B7E6A]">Genre</span>
                                    <span className="font-semibold">{book.genre}</span>
                                    <span className="text-[#8B7E6A]">Pages</span>
                                    <span className="font-semibold">{book.totalPages}</span>
                                    <span className="text-[#8B7E6A]">Language</span>
                                    <span className="font-semibold">{book.language || 'N/A'}</span>
                                    <span className="text-[#8B7E6A]">Rating</span>
                                    <span className="font-semibold flex items-center gap-1">
                                        <span className="text-yellow-500">★</span> {book.rating || 'N/A'}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 font-sans">
                            <button
                                onClick={() => { onAdd(book.id); onClose(); }}
                                className="flex-1 bg-[#3D2817] text-white h-14 rounded-full font-bold shadow-lg hover:bg-[#4D3827] transition-all"
                            >
                                Add to My Books
                            </button>
                            <button
                                onClick={onClose}
                                className="px-8 border border-[#E5DCC8] text-[#8B7E6A] font-bold rounded-full hover:bg-[#F5F1E8] transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickViewModal;
