"use client";

import React, { useState } from 'react';
import { Book } from '../../types';

interface BookCardProps {
    book: Book;
    onAdd: (bookId: string) => void;
    onPreview: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onAdd, onPreview }) => {
    const [isAdded, setIsAdded] = useState(false);

    const handleAdd = () => {
        setIsAdded(true);
        onAdd(book.id);
    };

    return (
        <div className="group bg-white border border-[#E5DCC8] rounded-[16px] p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
            <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden mb-4">
                <img
                    src={book.coverUrl || 'https://via.placeholder.com/280x420?text=No+Cover'}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                        onClick={() => onPreview(book)}
                        className="bg-white text-[#3D2817] px-6 py-2 rounded-full font-medium shadow-lg hover:bg-[#F5F1E8] transition-colors font-sans"
                    >
                        Preview
                    </button>
                </div>
            </div>

            <div className="space-y-1 mb-4">
                <h3 className="font-serif text-lg font-bold text-[#2C2416] line-clamp-1">{book.title}</h3>
                <p className="text-[#8B7E6A] text-sm font-sans">by {book.author}</p>
                <div className="flex items-center gap-3 mt-2 font-sans">
                    <span className="flex items-center text-xs text-[#8B7E6A]">
                        <span className="text-yellow-500 mr-1">★</span> {book.rating || 'N/A'}
                    </span>
                    <span className="text-xs text-[#8B7E6A]">•</span>
                    <span className="text-xs text-[#8B7E6A]">{book.totalPages} pages</span>
                </div>
                <p className="text-[#8B7E6A] text-sm line-clamp-2 mt-2 leading-relaxed font-sans">
                    {book.description}
                </p>
            </div>

            <button
                onClick={handleAdd}
                disabled={isAdded}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-[24px] font-semibold transition-all duration-200 font-sans ${isAdded
                        ? 'bg-[#2D7A4F] text-white cursor-default'
                        : 'bg-[#3D2817] text-white hover:bg-[#4D3827]'
                    }`}
            >
                {isAdded ? (
                    '✓ Added'
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Add to My Books
                    </>
                )}
            </button>
        </div>
    );
};

export default BookCard;
