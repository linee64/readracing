"use client";

import React from 'react';

interface AddBookButtonProps {
    onClick: () => void;
}

const AddBookButton: React.FC<AddBookButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed right-8 bottom-8 md:bottom-8 bottom-20 z-[100] flex items-center gap-3 bg-[#3D2817] text-white px-6 h-14 rounded-full shadow-[0_4px_12px_rgba(61,40,23,0.3)] hover:scale-105 hover:shadow-[0_6px_16px_rgba(61,40,23,0.4)] px-6 py-2 rounded-full font-medium transition-all duration-200"
        >
            <span className="text-2xl">+</span>
            <span className="hidden md:inline font-semibold">Add New Book</span>
        </button>
    );
};

export default AddBookButton;
