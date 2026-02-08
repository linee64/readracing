'use client';

import ReadingPlan from '@/components/ReadingPlan';
import DashboardHeader from '@/components/DashboardHeader';
import MonthlyCalendar from '@/components/MonthlyCalendar';

export default function PlanPage() {
    return (
        <div className="min-h-screen bg-cream-50 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto p-8 pb-20">
                <DashboardHeader username="Alex" />
                
                <div className="mt-8 space-y-12">
                    {/* Main Plan Section */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-4xl font-serif font-black text-brown-900">Reading Plan</h1>
                                <p className="text-brown-800/60 mt-2 font-medium italic">Your strategy for consistent growth.</p>
                            </div>
                            <div className="hidden md:flex bg-white p-2 rounded-2xl border border-cream-200 shadow-sm items-center gap-3">
                                <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center text-brand-gold-dark">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21.5c-1.35-.85-3.8-1.5-5.5-1.5c-1.65 0-3.35.3-4.75 1.05c-.1.05-.15.05-.25.05c-.25 0-.5-.25-.5-.5V6c.6-.45 1.25-.75 2-1c1.11-.35 2.33-.5 3.5-.5c1.95 0 4.05.4 5.5 1.5c1.45-1.1 3.55-1.5 5.5-1.5c1.17 0 2.39.15 3.5.5c.75.25 1.4.55 2 1v14.6c0 .25-.25.5-.5.5c-.1 0-.15 0-.25-.05c-1.4-.75-3.1-1.05-4.75-1.05c-1.7 0-4.15.65-5.5 1.5"/></svg>
                                </div>
                                <div className="pr-4">
                                    <p className="text-[10px] text-brown-800/40 font-black uppercase tracking-widest leading-none">Weekly Goal</p>
                                    <p className="text-sm font-black text-brown-900 mt-1">150 Pages</p>
                                </div>
                            </div>
                        </div>
                        <ReadingPlan />
                    </section>

                    {/* Monthly Calendar Section */}
                    <section>
                        <MonthlyCalendar />
                    </section>

                    {/* Weekly Breakdown */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-cream-200 shadow-sm">
                            <h3 className="text-2xl font-serif font-bold text-brown-900 mb-6">Weekly Overview</h3>
                            <div className="space-y-6">
                                {[
                                    { label: 'Completion Rate', value: '85%', color: 'bg-brand-gold' },
                                    { label: 'Reading Speed', value: '45 pgs/hr', color: 'bg-brown-900' },
                                    { label: 'Focus Score', value: '92/100', color: 'bg-brand-gold-dark' }
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
                            <h3 className="text-2xl font-serif font-bold mb-4 relative z-10">AI Insights</h3>
                            <p className="text-cream-50/70 text-sm leading-relaxed mb-6 relative z-10">
                                You are most productive between <span className="text-brand-gold font-bold">8 PM and 9 PM</span>. Reading just 5 more pages tonight will put you ahead of your monthly target!
                            </p>
                            <button className="w-full py-4 bg-brand-gold text-brown-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-colors duration-300">
                                Optimize Schedule
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
