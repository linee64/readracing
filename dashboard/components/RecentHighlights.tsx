
import { Highlight } from '@/types';

const mockHighlights: Highlight[] = [
    {
        id: '1',
        text: "The loneliness of the city is the most intense loneliness of all, for it is shared by millions of people who all feel exactly the same way.",
        bookTitle: "The Great Gatsby",
        page: 45
    },
    {
        id: '2',
        text: "So we beat on, boats against the current, borne back ceaselessly into the past.",
        bookTitle: "The Great Gatsby",
        page: 180
    },
    {
        id: '3',
        text: "I hope she'll be a fool—that's the best thing a girl can be in this world, a beautiful little fool.",
        bookTitle: "The Great Gatsby",
        page: 17
    }
];

export default function RecentHighlights() {
    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-cream-200 flex flex-col h-full">
            <h2 className="text-2xl font-serif font-semibold mb-6 text-brown-900 italic">Your Highlights</h2>

            <div className="space-y-6 flex-1">
                {mockHighlights.map((highlight, index) => (
                    <div key={highlight.id}>
                        <div className="relative">
                            <span className="absolute -left-2 -top-2 text-4xl text-cream-200 font-serif opacity-50">"</span>
                            <p className="italic text-brown-900 text-lg leading-relaxed relative z-10 pl-2">
                                {highlight.text}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 mt-3 pl-2">
                            <span className="text-xs font-black text-brown-800/40 uppercase tracking-widest">
                                {highlight.bookTitle} • Page {highlight.page}
                            </span>
                        </div>
                        {index < mockHighlights.length - 1 && (
                            <div className="border-t border-cream-100 mt-6"></div>
                        )}
                    </div>
                ))}
            </div>

            <button className="mt-8 text-sm font-bold text-brown-900 bg-cream-50 hover:bg-cream-100 py-3 rounded-xl transition-colors border border-cream-200">
                View All Highlights
            </button>
        </div>
    );
}
