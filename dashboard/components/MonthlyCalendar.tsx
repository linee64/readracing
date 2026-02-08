'use client';

import React, { useState } from 'react';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['February 2026', 'March 2026'];

interface CalendarDay {
    day: number;
    intensity: 0 | 1 | 2 | 3; // 0: none, 1: low, 2: medium, 3: high
    goal?: string;
    isToday?: boolean;
    isCurrentMonth?: boolean;
}

export default function MonthlyCalendar() {
    const [currentMonthIdx, setCurrentMonthIdx] = useState(0);

    const februaryDays: CalendarDay[] = [
        { day: 26, intensity: 0, isCurrentMonth: false },
        { day: 27, intensity: 0, isCurrentMonth: false },
        { day: 28, intensity: 0, isCurrentMonth: false },
        { day: 29, intensity: 0, isCurrentMonth: false },
        { day: 30, intensity: 0, isCurrentMonth: false },
        { day: 31, intensity: 0, isCurrentMonth: false },
        { day: 1, intensity: 1, isCurrentMonth: true },
        { day: 2, intensity: 2, isCurrentMonth: true },
        { day: 3, intensity: 3, isCurrentMonth: true, goal: 'Finish Part 1' },
        { day: 4, intensity: 2, isCurrentMonth: true },
        { day: 5, intensity: 1, isCurrentMonth: true },
        { day: 6, intensity: 2, isCurrentMonth: true },
        { day: 7, intensity: 3, isCurrentMonth: true, goal: 'Weekly Review' },
        { day: 8, intensity: 2, isCurrentMonth: true, isToday: true },
        { day: 9, intensity: 1, isCurrentMonth: true },
        { day: 10, intensity: 2, isCurrentMonth: true, goal: 'Chapter 12' },
        { day: 11, intensity: 0, isCurrentMonth: true },
        { day: 12, intensity: 1, isCurrentMonth: true },
        { day: 13, intensity: 2, isCurrentMonth: true },
        { day: 14, intensity: 0, isCurrentMonth: true },
        { day: 15, intensity: 3, isCurrentMonth: true, goal: 'Big Reading Day' },
        { day: 16, intensity: 1, isCurrentMonth: true },
        { day: 17, intensity: 1, isCurrentMonth: true },
        { day: 18, intensity: 2, isCurrentMonth: true },
        { day: 19, intensity: 1, isCurrentMonth: true },
        { day: 20, intensity: 0, isCurrentMonth: true },
        { day: 21, intensity: 0, isCurrentMonth: true },
        { day: 22, intensity: 1, isCurrentMonth: true },
        { day: 23, intensity: 2, isCurrentMonth: true },
        { day: 24, intensity: 3, isCurrentMonth: true },
        { day: 25, intensity: 1, isCurrentMonth: true },
        { day: 26, intensity: 2, isCurrentMonth: true },
        { day: 27, intensity: 1, isCurrentMonth: true },
        { day: 28, intensity: 2, isCurrentMonth: true },
        { day: 1, intensity: 0, isCurrentMonth: false },
    ];

    const chartData = [
        { day: 'W1', pages: 45 },
        { day: 'W2', pages: 120 },
        { day: 'W3', pages: 85 },
        { day: 'W4', pages: 150 },
    ];

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

    return (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-cream-200 shadow-sm relative overflow-hidden group/cal">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-0">
                {/* Left Side: Calendar */}
                <div className="flex-1 lg:pr-16 lg:border-r lg:border-cream-100/50">
                    <div className="max-w-sm mx-auto lg:mx-0">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-serif font-black text-brown-900">Monthly Plan</h3>
                                <p className="text-[10px] text-brown-800/40 font-black uppercase tracking-[0.2em] mt-1.5">{MONTHS[currentMonthIdx]}</p>
                            </div>
                            <div className="flex gap-1.5">
                                <button 
                                    onClick={() => setCurrentMonthIdx(0)}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${currentMonthIdx === 0 ? 'bg-cream-100 text-brown-900' : 'text-brown-800/40 hover:bg-cream-50'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m15 18l-6-6l6-6"/></svg>
                                </button>
                                <button 
                                    onClick={() => setCurrentMonthIdx(1)}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${currentMonthIdx === 1 ? 'bg-cream-100 text-brown-900' : 'text-brown-800/40 hover:bg-cream-50'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m9 18l6-6l-6-6"/></svg>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1.5">
                            {DAYS_OF_WEEK.map(day => (
                                <div key={day} className="text-center text-[9px] font-black text-brown-800/20 uppercase tracking-[0.15em] mb-4">
                                    {day[0]}
                                </div>
                            ))}
                            {februaryDays.map((item, idx) => (
                                <div 
                                    key={idx}
                                    className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-300 group/day cursor-pointer border ${!item.isCurrentMonth ? 'opacity-5 pointer-events-none border-transparent' : 'border-cream-100/50 hover:border-brand-gold/30 hover:bg-cream-50/50 shadow-sm shadow-transparent hover:shadow-cream-100/50'} ${item.isToday ? 'bg-brand-gold/5 border-brand-gold/40 shadow-brand-gold/10' : ''}`}
                                >
                                    {item.isToday && (
                                        <div className="absolute inset-0 border-[1.5px] border-brand-gold/30 rounded-xl bg-brand-gold/[0.02] scale-105 animate-pulse-slow"></div>
                                    )}
                                    <span className={`text-[13px] font-mono relative z-10 ${item.isToday ? 'text-brand-gold-dark font-black scale-110' : 'text-brown-800/50 font-light'}`}>
                                        {item.day}
                                    </span>
                                    <div className="flex gap-0.5 mt-1 relative z-10">
                                        {getIntensityDots(item.intensity)}
                                    </div>
                                    {item.goal && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-28 p-2.5 bg-brown-900 text-cream-50 rounded-xl text-[9px] font-bold uppercase tracking-wider opacity-0 group-hover/day:opacity-100 transition-all duration-300 pointer-events-none z-20 shadow-xl text-center translate-y-2 group-hover/day:translate-y-0">
                                            {item.goal}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-brown-900"></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Progress Chart */}
                <div className="flex-1 lg:pl-16 mt-12 lg:mt-0 flex flex-col justify-center">
                    <div className="mb-8">
                        <h3 className="text-2xl font-serif font-black text-brown-900 leading-tight">Reading Stats</h3>
                        <p className="text-[10px] text-brown-800/40 font-black uppercase tracking-[0.2em] mt-1.5">Weekly Performance</p>
                    </div>

                    <div className="relative bg-cream-50/30 rounded-[2rem] p-6 border border-cream-100/50 shadow-inner-sm">
                        {/* Background Grid Lines */}
                        <div className="absolute inset-x-6 inset-y-6 flex flex-col justify-between pointer-events-none opacity-40">
                            {[0, 1, 2, 3].map((line) => (
                                <div key={line} className="w-full border-t border-cream-200 border-dashed"></div>
                            ))}
                        </div>

                        <div className="flex items-end gap-6 h-40 relative z-10 pt-4">
                            {/* Current Progress Line */}
                            <div className="absolute left-[37.5%] top-0 bottom-0 border-l-2 border-dashed border-brand-gold/40 z-0">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                    <span className="bg-brand-gold/10 text-brand-gold-dark text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-brand-gold/20 backdrop-blur-sm">
                                        Current Week
                                    </span>
                                </div>
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-gold shadow-[0_0_10px_rgba(180,145,95,0.5)]"></div>
                            </div>

                            {chartData.map((data, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar h-full z-10">
                                    <div className="relative w-full flex flex-col items-center justify-end h-full">
                                        {/* Page Count Tooltip */}
                                        <div className="absolute -top-8 opacity-100 lg:opacity-0 lg:group-hover/bar:opacity-100 transition-opacity duration-300 bg-brown-900 text-cream-50 text-[10px] font-black px-2 py-1 rounded-md shadow-lg z-10">
                                            {data.pages} pg
                                        </div>
                                        {/* The Bar */}
                                        <div 
                                            className="w-full bg-brand-gold/20 rounded-t-lg transition-all duration-700 group-hover/bar:bg-brand-gold relative overflow-hidden shadow-sm"
                                            style={{ height: `${(data.pages / 150) * 100}%` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                                            {/* Animation highlight */}
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/bar:translate-y-0 transition-transform duration-500"></div>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-black text-brown-800/30 uppercase tracking-widest">{data.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 bg-white border border-cream-100 rounded-3xl p-5 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-[10px] text-brown-800/40 font-black uppercase tracking-widest leading-none mb-2">Total for Month</p>
                            <p className="text-2xl font-serif font-black text-brown-900">450 <span className="text-sm font-medium text-brown-800/60 font-sans italic">pages</span></p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-brown-800/40 font-black uppercase tracking-widest leading-none mb-2">Daily Average</p>
                            <p className="text-2xl font-serif font-black text-brown-900">16.2 <span className="text-sm font-medium text-brown-800/60 font-sans italic">pg/d</span></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Intensity Legend (Global for both) */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-cream-100/50">
                <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                        <div className="w-1 h-1 rounded-full bg-brown-900"></div>
                        <div className="w-1 h-1 rounded-full bg-brown-900"></div>
                        <div className="w-1 h-1 rounded-full bg-brown-900"></div>
                    </div>
                    <span className="text-[9px] font-black text-brown-800/30 uppercase tracking-[0.2em]">Intense</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                        <div className="w-1 h-1 rounded-full bg-brand-gold"></div>
                        <div className="w-1 h-1 rounded-full bg-brand-gold"></div>
                        <div className="w-1 h-1 rounded-full bg-cream-200"></div>
                    </div>
                    <span className="text-[9px] font-black text-brown-800/30 uppercase tracking-[0.2em]">Medium</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                        <div className="w-1 h-1 rounded-full bg-brand-gold/40"></div>
                        <div className="w-1 h-1 rounded-full bg-cream-200"></div>
                        <div className="w-1 h-1 rounded-full bg-cream-200"></div>
                    </div>
                    <span className="text-[9px] font-black text-brown-800/30 uppercase tracking-[0.2em]">Light</span>
                </div>
            </div>
        </div>
    );
}
