
import { Book } from '@/types';

const currentBook: Book = {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    totalPages: 320,
    currentPage: 156,
};

export default function CurrentBook() {
    const percentage = Math.round((currentBook.currentPage / currentBook.totalPages) * 100);

    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm mt-8 border border-cream-200">
            <h2 className="text-2xl font-serif font-semibold mb-6 text-brown-900 italic">Currently Reading</h2>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Book Cover Placeholder */}
                <div className="w-40 h-60 bg-cream-100 rounded-xl flex items-center justify-center shadow-inner border border-cream-200 flex-shrink-0 relative group overflow-hidden">
                    <span className="text-5xl opacity-20 group-hover:scale-110 transition-transform duration-500">📖</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-brown-900/10 to-transparent"></div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-3xl font-serif font-bold text-brown-900">{currentBook.title}</h3>
                    <p className="text-lg text-brown-800/60 mt-2 font-medium">by {currentBook.author}</p>

                    <div className="mt-8">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-bold text-brown-800/70">{currentBook.currentPage} / {currentBook.totalPages} pages</span>
                            <span className="text-xs font-black text-brown-800/40 uppercase tracking-widest">{percentage}% Completed</span>
                        </div>
                        <div className="w-full bg-cream-100 rounded-full h-3 border border-cream-200 overflow-hidden">
                            <div
                                className="bg-brown-900 h-full rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-8">
                        <button className="bg-brown-900 text-cream-50 px-8 py-3.5 rounded-full font-bold shadow-lg hover:bg-brown-800 hover:scale-[1.02] active:scale-95 transition-all duration-200">
                            Continue Reading
                        </button>
                        <button className="border-2 border-brown-900 text-brown-900 px-8 py-3.5 rounded-full font-bold hover:bg-cream-100 active:scale-95 transition-all duration-200">
                            Ask AI Assistant
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
