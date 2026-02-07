import React from 'react';
import { Book } from '../../types';
import BookCard from './BookCard';

interface BookGridProps {
    books: Book[];
    onAdd: (id: string) => void;
    onPreview: (book: Book) => void;
}

const BookGrid: React.FC<BookGridProps> = ({ books, onAdd, onPreview }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-700">
            {books.map((book) => (
                <BookCard
                    key={book.id}
                    book={book}
                    onAdd={onAdd}
                    onPreview={onPreview}
                />
            ))}
        </div>
    );
};

export default BookGrid;
