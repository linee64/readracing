"use client";

import React, { useState } from 'react';

interface AddBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (book: any) => void;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        totalPages: '',
        genre: 'Classic',
        description: '',
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({ ...formData, id: Math.random().toString(36).substr(2, 9), totalPages: Number(formData.totalPages) });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#3D2817]/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#F5F1E8] w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-serif text-[#3D2817]">Add New Book</h2>
                        <button onClick={onClose} className="text-[#8B7E6A] hover:text-[#3D2817]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 font-sans">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-[#8B7E6A]">Book Title</label>
                            <input
                                required
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full h-12 px-4 bg-white border border-[#E5DCC8] rounded-[12px] focus:outline-none focus:border-[#3D2817]"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-[#8B7E6A]">Author</label>
                            <input
                                required
                                type="text"
                                value={formData.author}
                                onChange={e => setFormData({ ...formData, author: e.target.value })}
                                className="w-full h-12 px-4 bg-white border border-[#E5DCC8] rounded-[12px] focus:outline-none focus:border-[#3D2817]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-[#8B7E6A]">Total Pages</label>
                                <input
                                    required
                                    type="number"
                                    value={formData.totalPages}
                                    onChange={e => setFormData({ ...formData, totalPages: e.target.value })}
                                    className="w-full h-12 px-4 bg-white border border-[#E5DCC8] rounded-[12px] focus:outline-none focus:border-[#3D2817]"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-[#8B7E6A]">Genre</label>
                                <select
                                    value={formData.genre}
                                    onChange={e => setFormData({ ...formData, genre: e.target.value })}
                                    className="w-full h-12 px-4 bg-white border border-[#E5DCC8] rounded-[12px] focus:outline-none focus:border-[#3D2817]"
                                >
                                    <option>Classic</option>
                                    <option>Modern Prose</option>
                                    <option>Sci-Fi</option>
                                    <option>Fantasy</option>
                                    <option>Mystery</option>
                                    <option>Romance</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-[#8B7E6A]">Description</label>
                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-[#E5DCC8] rounded-[12px] focus:outline-none focus:border-[#3D2817] resize-none"
                            />
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 h-12 border border-[#E5DCC8] text-[#8B7E6A] font-semibold rounded-[24px] hover:bg-[#E5DCC8] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 h-12 bg-[#3D2817] text-white font-semibold rounded-[24px] hover:bg-[#4D3827] transition-colors"
                            >
                                Add Book
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddBookModal;
