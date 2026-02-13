
'use client';

import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { ReadingSession } from '@/hooks/useReadingPlan';
import { useLanguage } from '@/context/LanguageContext';

interface MonthlyCalendarProps {
    sessions: ReadingSession[];
}

export default function MonthlyCalendar({ sessions }: MonthlyCalendarProps) {
    const { t, language } = useLanguage();
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const locale = language === 'Russian' ? ru : enUS;

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth)
    });

    // Calculate padding days for the start of the month
    const startDay = getDay(startOfMonth(currentMonth));
    const paddingDays = Array.from({ length: startDay }, (_, i) => i);

    const getIntensity = (date: Date): 0 | 1 | 2 | 3 => {
        const dateSessions = sessions.filter(s => isSameDay(new Date(s.created_at), date));
        const pagesRead = dateSessions.reduce((sum, s) => sum + s.pages_read, 0);
        
        if (pagesRead === 0) return 0;
        if (pagesRead < 20) return 1;
        if (pagesRead < 50) return 2;
        return 3;
    };

    const getIntensityDots = (intensity: number) => {
        const dots = [];
        for (let i = 0; i < 3; i++) {
            dots.push(
                <div 
                    key={i} 
                    className={`w-0.5 h-0.5 rounded-full transition-all duration-500 ${
                        i < intensity 
                        ? (intensity === 3 ? 'bg-brown-900' : intensity === 2 ? 'bg-brand-gold' : 'bg-brand-gold/40') 
                        : 'bg-cream-200'
                    }`}
                />
            );
        }
        return dots;
    };

    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    return (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-cream-200 shadow-sm relative overflow-hidden group/cal">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-0">
                {/* Left Side: Calendar */}
                <div className="flex-1 lg:pr-16 lg:border-r lg:border-cream-100/50">
                    <div className="max-w-sm mx-auto lg:mx-0">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-serif font-black text-brown-900">{t.reading_plan.monthly_plan}</h3>
                                <p className="text-[10px] text-brown-800/40 font-black uppercase tracking-[0.2em] mt-1.5">
                                    {format(currentMonth, 'MMMM yyyy', { locale })}
                                </p>
                            </div>
                            <div className="flex gap-1.5">
                                <button 
                                    onClick={handlePrevMonth}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all text-brown-800/40 hover:bg-cream-50"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m15 18l-6-6l6-6"/></svg>
                                </button>
                                <button 
                                    onClick={handleNextMonth}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all text-brown-800/40 hover:bg-cream-50"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m9 18l6-6l-6-6"/></svg>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-y-4 mb-4">
                            {t.reading_plan.days_of_week.map(day => (
                                <div key={day} className="text-center text-[10px] font-black text-brown-800/20 uppercase tracking-widest">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-y-2">
                            {paddingDays.map(i => (
                                <div key={`pad-${i}`} />
                            ))}
                            
                            {daysInMonth.map((date, idx) => {
                                const intensity = getIntensity(date);
                                const isToday = isSameDay(date, new Date());
                                
                                return (
                                    <div key={idx} className="flex flex-col items-center group cursor-pointer relative">
                                        <div 
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 relative z-10 ${
                                                isToday
                                                ? 'bg-brown-900 text-cream-50 shadow-lg shadow-brown-900/20 scale-110'
                                                : intensity > 0 
                                                    ? 'text-brown-900 hover:bg-cream-50'
                                                    : 'text-brown-800/40 hover:bg-cream-50'
                                            }`}
                                        >
                                            {format(date, 'd')}
                                        </div>
                                        
                                        {/* Intensity Dots */}
                                        <div className="flex gap-0.5 mt-1 h-1">
                                            {getIntensityDots(intensity)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Side: Stats (Simplified or Removed if redundant) */}
                {/* Keeping the structure but maybe simplifying content since we have stats elsewhere */}
                <div className="hidden lg:flex flex-col justify-center pl-16 w-64">
                    <h4 className="font-serif font-bold text-brown-900 mb-6">{t.reading_plan.this_month}</h4>
                    <div className="space-y-6">
                         {/* Placeholder for monthly summary */}
                         <div className="p-4 bg-cream-50 rounded-2xl border border-cream-100">
                            <p className="text-xs text-brown-800/60 font-bold uppercase tracking-wider mb-1">{t.reading_plan.total_pages}</p>
                            <p className="text-2xl font-black text-brown-900">
                                {sessions
                                    .filter(s => isSameMonth(new Date(s.created_at), currentMonth))
                                    .reduce((sum, s) => sum + s.pages_read, 0)}
                            </p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
