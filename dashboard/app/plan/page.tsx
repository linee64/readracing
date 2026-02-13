
'use client';

import React, { useEffect, useState } from 'react';
import ReadingPlan from '@/components/ReadingPlan';
import DashboardHeader from '@/components/DashboardHeader';
import MonthlyCalendar from '@/components/MonthlyCalendar';
import { supabase } from '@/lib/supabase';
import { useReadingPlan } from '@/hooks/useReadingPlan';
import { useLanguage } from '@/context/LanguageContext';

export default function PlanPage() {
    const { t } = useLanguage();
    const [username, setUsername] = useState<string>('Reader');
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null);
    const { weeklyGoal, sessions, getWeeklyProgress, getWeeklyStats, logSession, resetProgress } = useReadingPlan();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Reader';
                setUsername(name);
            }
        });

        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Reader';
                setUsername(name);
            }
        };
        getUser();

        return () => subscription.unsubscribe();
    }, []);

    const dailyProgress = getWeeklyProgress();
    const stats = getWeeklyStats();

    const handleOptimize = () => {
        setIsOptimizing(true);
        setTimeout(() => {
            setIsOptimizing(false);
            setToast({ message: t.reading_plan.schedule_optimized, visible: true });
            setTimeout(() => setToast(null), 3000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-cream-50 animate-in fade-in duration-700 relative">
            <div className="max-w-7xl mx-auto p-4 md:p-8 pb-20">
                <DashboardHeader username={username} />
                
                <div className="mt-8 space-y-8 md:space-y-12">
                    {/* Main Plan Section */}
                    <section>
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-serif font-black text-brown-900">{t.reading_plan.title}</h1>
                                <p className="text-brown-800/60 mt-2 font-medium italic">{t.reading_plan.subtitle}</p>
                            </div>
                            <div className="bg-white p-2 rounded-2xl border border-cream-200 shadow-sm flex items-center gap-3 self-start md:self-auto">
                                <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center text-brand-gold-dark">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21.5c-1.35-.85-3.8-1.5-5.5-1.5c-1.65 0-3.35.3-4.75 1.05c-.1.05-.15.05-.25.05c-.25 0-.5-.25-.5-.5V6c.6-.45 1.25-.75 2-1c1.11-.35 2.33-.5 3.5-.5c1.95 0 4.05.4 5.5 1.5c1.45-1.1 3.55-1.5 5.5-1.5c1.17 0 2.39.15 3.5.5c.75.25 1.4.55 2 1v14.6c0 .25-.25.5-.5.5c-.1 0-.15 0-.25-.05c-1.4-.75-3.1-1.05-4.75-1.05c-1.7 0-4.15.65-5.5 1.5"/></svg>
                                </div>
                                <div className="pr-4">
                                    <p className="text-[10px] text-brown-800/40 font-black uppercase tracking-widest leading-none">{t.reading_plan.weekly_goal}</p>
                                    <p className="text-sm font-black text-brown-900 mt-1">{weeklyGoal} {t.reading_plan.pages}</p>
                                </div>
                            </div>
                        </div>
                        <ReadingPlan 
                            weeklyGoal={weeklyGoal} 
                            dailyProgress={dailyProgress} 
                            onMarkDone={logSession}
                            onReset={resetProgress}
                        />
                    </section>

                    {/* Monthly Calendar Section */}
                    <section className="overflow-x-auto">
                        <MonthlyCalendar sessions={sessions} />
                    </section>

                    {/* Weekly Breakdown */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-6 md:p-8 border border-cream-200 shadow-sm">
                            <h3 className="text-2xl font-serif font-bold text-brown-900 mb-6">{t.reading_plan.weekly_overview}</h3>
                            <div className="space-y-6">
                                {[
                                    { label: t.reading_plan.completion_rate, value: `${stats.completionRate}%`, color: 'bg-brand-gold' },
                                    { label: t.reading_plan.reading_speed, value: `${stats.readingSpeed} ${t.reading_plan.pgs_hr}`, color: 'bg-brown-900' },
                                    { label: t.reading_plan.focus_score, value: `${stats.focusScore}/100`, color: 'bg-brand-gold-dark' }
                                ].map((metric, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-sm font-black text-brown-800/60 uppercase tracking-widest">
                                            <span>{metric.label}</span>
                                            <span className="text-brown-900">{metric.value}</span>
                                        </div>
                                        <div className="h-3 w-full bg-cream-100 rounded-full overflow-hidden">
                                            <div className={`h-full ${metric.color} rounded-full`} style={{ width: metric.value.includes('%') ? metric.value : '75%' }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-brown-900 rounded-[2.5rem] p-8 text-cream-50 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-brand-gold/20 transition-colors"></div>
                            <h3 className="text-2xl font-serif font-bold mb-4 relative z-10">{t.reading_plan.ai_insights}</h3>
                            <p className="text-cream-50/70 text-sm leading-relaxed mb-6 relative z-10">
                                {t.reading_plan.ai_insights_desc.split('{time}')[0]}
                                <span className="text-brand-gold font-bold">{t.reading_plan.time_range}</span>
                                {t.reading_plan.ai_insights_desc.split('{time}')[1]}
                            </p>
                            <button 
                                onClick={handleOptimize}
                                disabled={isOptimizing}
                                className="w-full py-4 bg-brand-gold text-brown-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isOptimizing && (
                                    <svg className="animate-spin h-4 w-4 text-brown-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {isOptimizing ? t.reading_plan.optimizing : t.reading_plan.optimize_schedule}
                            </button>
                        </div>
                    </section>
                </div>
            </div>
            
            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 bg-[#2D7A4F] text-white px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom duration-300 font-sans">
                    <span className="font-semibold">{toast.message}</span>
                    <button
                        onClick={() => setToast(null)}
                        className="text-white/80 hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                    </button>
                </div>
            )}
        </div>
    );
}
