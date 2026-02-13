
"use client";
import React, { useState } from 'react';
import { DailyProgress } from '@/hooks/useReadingPlan';
import { useLanguage } from '@/context/LanguageContext';

interface ReadingPlanProps {
    weeklyGoal: number;
    dailyProgress: DailyProgress[];
    onMarkDone: (pages: number) => void;
    onReset?: () => void;
}

export default function ReadingPlan({ weeklyGoal, dailyProgress = [], onMarkDone, onReset }: ReadingPlanProps) {
    const { t } = useLanguage();
    const [isMarking, setIsMarking] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    
    // Calculate pages left
    const safeDailyProgress = Array.isArray(dailyProgress) ? dailyProgress : [];
    const pagesReadThisWeek = safeDailyProgress.reduce((sum, d) => sum + d.pagesRead, 0);
    const pagesLeft = Math.max(0, weeklyGoal - pagesReadThisWeek);
    
    // Calculate today's target
    // If we have 3 days left (including today), split remaining pages
    const todayIndex = safeDailyProgress.findIndex(d => d.isToday);
    const daysLeft = 7 - (todayIndex >= 0 ? todayIndex : 0);
    const dailyTarget = daysLeft > 0 ? Math.ceil(pagesLeft / daysLeft) : 0;
    
    // If today is done (read >= target), show "Done" or "Bonus"
    const todayProgress = safeDailyProgress.find(d => d.isToday);
    const isTodayDone = ((todayProgress?.pagesRead || 0) >= dailyTarget && dailyTarget > 0) || pagesLeft === 0;

    const handleMarkAsDone = () => {
        if (isTodayDone) return;
        setIsMarking(true);
        // Default to target, or 25 if target is 0/weird
        const amount = dailyTarget > 0 ? dailyTarget : 25;
        onMarkDone(amount);
        setTimeout(() => setIsMarking(false), 1000);
    };

    const handleReset = async () => {
        if (onReset && confirm(t.reading_plan.reset_confirm)) {
            setIsResetting(true);
            await onReset();
            setIsResetting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm mt-8 border border-cream-200 relative group">
            {onReset && (
                <button
                    onClick={handleReset}
                    disabled={isResetting}
                    className="absolute top-4 right-4 text-xs text-brown-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    title={t.reading_plan.reset_history}
                >
                    {isResetting ? t.reading_plan.resetting : t.reading_plan.reset_history}
                </button>
            )}
            <h2 className="text-2xl font-serif font-semibold mb-6 text-brown-900 italic">{t.dashboard.todays_plan}</h2>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-cream-50 p-4 rounded-xl border border-cream-200 w-fit">
                        <span className="text-brown-900">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 20c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8zm0-18c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2zM12.5 7V12l4.5 2.7-.8 1.2L11 13V7h1.5z"/></svg>
                        </span>
                        <div>
                            <p className="text-brown-900 font-bold">{t.dashboard.best_time}</p>
                            <p className="text-xs text-brown-800/60 font-medium">{t.dashboard.peak_focus}</p>
                        </div>
                    </div>
                    <p className="text-brown-800/80 font-medium text-lg leading-relaxed">
                        {pagesLeft > 0 ? (
                            <>
                                {t.dashboard.read} <span className="text-brown-900 font-extrabold underline decoration-cream-200 decoration-4 underline-offset-4">{dailyTarget} {t.dashboard.pages}</span> {t.dashboard.pages_to_track}
                            </>
                        ) : (
                            <span className="text-green-700 font-bold">{t.dashboard.goal_reached}</span>
                        )}
                    </p>
                </div>

                <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
                    <div className="flex justify-between w-full md:w-auto md:gap-3">
                        {safeDailyProgress.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2">
                                <div
                                    className={`w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-300 ${item.completed
                                            ? 'bg-brown-900 text-cream-50 shadow-md'
                                            : item.isToday
                                                ? 'border-2 border-brown-900 text-brown-900 scale-110 shadow-sm'
                                                : 'bg-cream-100 text-brown-800/30'
                                        }`}
                                >
                                    {item.completed ? '✓' : item.dayName}
                                </div>
                                <span className="text-[10px] font-black text-brown-800/40 uppercase tracking-tighter">{item.dayName}</span>
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={handleMarkAsDone}
                        disabled={isMarking || isTodayDone}
                        className={`px-10 py-3.5 rounded-xl font-bold transition-all duration-200 mt-2 w-full md:w-auto ${
                            isTodayDone 
                                ? 'bg-green-100 text-green-800 cursor-default border border-green-200' 
                                : 'bg-brown-900 text-cream-50 hover:bg-brown-800 hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed'
                        }`}
                    >
                        {isMarking ? t.dashboard.saving : isTodayDone ? t.dashboard.completed_today : t.dashboard.mark_done}
                    </button>
                </div>
            </div>
        </div>
    );
}
