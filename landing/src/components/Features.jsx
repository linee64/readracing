import React from 'react';
import CornerAccent from './CornerAccent';

const Features = () => {
    const features = [
        {
            title: "Personal Reading Plan",
            description: "AI adapts to your pace: tells you how many pages to read, when to read, and when to pause."
        },
        {
            title: "Chat with your Book",
            description: "Ask questions while you read: 'Explain this simply', 'How can I apply this?', 'Summarize this chapter'."
        },
        {
            title: "Gamification",
            description: "Leaderboards, book completion streaks, and daily page reading records to keep you competitive."
        },
        {
            title: "Smart Library",
            description: "Track your history, get AI recommendations based on meaning, and build your digital bookshelf."
        }
    ];

    return (
        <section id="features" className="py-24 bg-white/0">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-brand-black italic">Core Features</h2>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    {features.map((feature, index) => (
                        <div key={index} className="relative p-8 bg-brand-beige border border-brand-black/10 rounded-sm hover:border-brand-gold hover:shadow-sm transition-all duration-300 group">
                            <CornerAccent />
                            <h3 className="text-2xl font-bold mb-4 text-brand-black">{feature.title}</h3>
                            <p className="text-lg text-brand-black/70 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
