
export default function ReadingPlan() {
    const days = [
        { day: 'M', completed: true },
        { day: 'T', completed: true },
        { day: 'W', completed: true },
        { day: 'T', current: true },
        { day: 'F' },
        { day: 'S' },
        { day: 'S' },
    ];

    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm mt-8 border border-cream-200">
            <h2 className="text-2xl font-serif font-semibold mb-6 text-brown-900 italic">Today's Reading Plan</h2>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-cream-50 p-4 rounded-xl border border-cream-200 w-fit">
                        <span className="text-brown-900">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 20c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8zm0-18c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2zM12.5 7V12l4.5 2.7-.8 1.2L11 13V7h1.5z"/></svg>
                        </span>
                        <div>
                            <p className="text-brown-900 font-bold">Best time: 8:00 PM - 9:00 PM</p>
                            <p className="text-xs text-brown-800/60 font-medium">Synchronized with your peak focus hours</p>
                        </div>
                    </div>
                    <p className="text-brown-800/80 font-medium text-lg leading-relaxed">
                        Read <span className="text-brown-900 font-extrabold underline decoration-cream-200 decoration-4 underline-offset-4">25 pages</span> to stay on track for your weekly goal.
                    </p>
                </div>

                <div className="flex flex-col items-center md:items-end gap-3">
                    <div className="flex gap-3">
                        {days.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${item.completed
                                            ? 'bg-brown-900 text-cream-50 shadow-md'
                                            : item.current
                                                ? 'border-2 border-brown-900 text-brown-900 scale-110 shadow-sm'
                                                : 'bg-cream-100 text-brown-800/30'
                                        }`}
                                >
                                    {item.completed ? '✓' : item.day}
                                </div>
                                <span className="text-[10px] font-black text-brown-800/40 uppercase tracking-tighter">{item.day}</span>
                            </div>
                        ))}
                    </div>
                    <button className="bg-brown-900 text-cream-50 px-10 py-3.5 rounded-xl font-bold hover:bg-brown-800 hover:shadow-xl active:scale-95 transition-all duration-200 mt-2 w-full md:w-auto">
                        Mark as Done
                    </button>
                </div>
            </div>
        </div>
    );
}
