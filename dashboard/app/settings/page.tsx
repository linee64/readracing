'use client';

import React, { useState } from 'react';

export default function SettingsPage() {
    const [notifications, setNotifications] = useState(true);
    const [readingGoal, setReadingGoal] = useState('30');
    const [language, setLanguage] = useState('English');

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const user = {
        name: 'Alex',
        email: 'alex@readracing.com',
        isPro: true
    };

    return (
        <div className="min-h-screen bg-cream-50">
            <div className="max-w-4xl mx-auto p-8 pb-20">
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <div className="flex flex-col">
                        <h1 className="text-4xl font-serif font-bold text-brown-900 tracking-tight">
                            Settings
                        </h1>
                        <p className="text-lg text-brown-800/70 mt-2 font-medium">
                            Manage your account and app preferences
                        </p>
                    </div>
                    <div className="text-sm font-medium text-brown-800/60 bg-white px-4 py-2 rounded-full shadow-sm border border-cream-200">
                        {currentDate}
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Profile Section */}
                    <section className="bg-white rounded-3xl p-8 border border-cream-200 shadow-sm">
                        <h2 className="text-xl font-bold text-brown-900 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-brown-900 text-cream-50 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z" /></svg>
                            </span>
                            Profile Settings
                        </h2>
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-20 h-20 bg-cream-200 rounded-2xl flex items-center justify-center text-3xl font-bold text-brown-800 border-2 border-dashed border-brown-300">
                                {user.name.charAt(0)}
                            </div>
                            <button className="text-sm font-bold text-brown-900 bg-cream-100 px-6 py-2.5 rounded-xl hover:bg-cream-200 transition-colors border border-cream-300">
                                Change Avatar
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-brown-800/70 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    defaultValue={user.name}
                                    className="w-full bg-cream-50 border border-cream-200 rounded-2xl px-5 py-3 text-brown-900 font-medium focus:outline-none focus:ring-2 focus:ring-brown-900/10 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-brown-800/70 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    defaultValue={user.email}
                                    className="w-full bg-cream-50 border border-cream-200 rounded-2xl px-5 py-3 text-brown-900 font-medium focus:outline-none focus:ring-2 focus:ring-brown-900/10 transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Preferences Section */}
                    <section className="bg-white rounded-3xl p-8 border border-cream-200 shadow-sm">
                        <h2 className="text-xl font-bold text-brown-900 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-brown-900 text-cream-50 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17q-.425 0-.712-.288T2 16t.288-.712T3 15t.713.288T4 16t-.287.713T3 17m0-4q-.425 0-.712-.288T2 12t.288-.712T3 11t.713.288T4 12t-.287.713T3 13m0-4q-.425 0-.712-.288T2 8t.288-.712T3 7t.713.288T4 8t-.287.713T3 9m4 8q-.425 0-.712-.288T6 16t.288-.712T7 15h14q.425 0 .713.288T22 16t-.288.713T21 17zm0-4q-.425 0-.712-.288T6 12t.288-.712T7 11h14q.425 0 .713.288T22 12t-.288.713T21 13zm0-4q-.425 0-.712-.288T6 8t.288-.712T7 7h14q.425 0 .713.288T22 8t-.288.713T21 9z" /></svg>
                            </span>
                            Reading Preferences
                        </h2>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-cream-50 rounded-2xl border border-cream-100">
                                <div>
                                    <h3 className="font-bold text-brown-900 text-lg">Daily Reading Goal</h3>
                                    <p className="text-sm text-brown-800/60 font-medium">Minutes per day you want to read</p>
                                </div>
                                <select
                                    value={readingGoal}
                                    onChange={(e) => setReadingGoal(e.target.value)}
                                    className="bg-white border border-cream-200 rounded-xl px-4 py-2 text-brown-900 font-bold focus:outline-none"
                                >
                                    <option value="15">15 min</option>
                                    <option value="30">30 min</option>
                                    <option value="45">45 min</option>
                                    <option value="60">60 min</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-cream-50 rounded-2xl border border-cream-100">
                                <div>
                                    <h3 className="font-bold text-brown-900 text-lg">App Language</h3>
                                    <p className="text-sm text-brown-800/60 font-medium">Preferred language for the interface</p>
                                </div>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="bg-white border border-cream-200 rounded-xl px-4 py-2 text-brown-900 font-bold focus:outline-none"
                                >
                                    <option value="English">English</option>
                                    <option value="Russian">Russian</option>
                                    <option value="Kazakh">Kazakh</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Subscription Section */}
                    <section className="bg-brown-900 rounded-3xl p-8 shadow-xl text-cream-50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-serif font-bold mb-2 flex items-center gap-3">
                                        Subscription
                                        <span className="bg-brand-gold text-brown-900 text-[10px] uppercase font-black px-3 py-1 rounded-full tracking-wider">
                                            Pro Plan
                                        </span>
                                    </h2>
                                    <p className="text-cream-50/70 font-medium">
                                        Your subscription is active until December 31, 2026.
                                    </p>
                                </div>
                                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2L4.5 20.29l.71.71L12 18l6.79 3l.71-.71z" /></svg>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                    <p className="text-xs font-bold text-cream-50/40 uppercase mb-1">Status</p>
                                    <p className="font-bold text-lg">Active</p>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                    <p className="text-xs font-bold text-cream-50/40 uppercase mb-1">Billing</p>
                                    <p className="font-bold text-lg">Annual</p>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                    <p className="text-xs font-bold text-cream-50/40 uppercase mb-1">Next Payment</p>
                                    <p className="font-bold text-lg">$49.00 / year</p>
                                </div>
                            </div>
                            <button className="w-full md:w-auto bg-brand-gold text-brown-900 font-bold px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition-transform">
                                Manage Subscription
                            </button>
                        </div>
                    </section>

                    {/* App Settings */}
                    <section className="bg-white rounded-3xl p-8 border border-cream-200 shadow-sm">
                        <h2 className="text-xl font-bold text-brown-900 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-brown-900 text-cream-50 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 15q1.25 0 2.125-.875T15 12t-.875-2.125T12 9t-2.125.875T9 12t.875 2.125T12 15m0 2q-2.075 0-3.537-1.463T7 12t1.463-3.537T12 7t3.538 1.463T17 12t-1.462 3.538T12 17m-1-14h2l.45 2.525q.425.15.813.375t.737.5l2.425-1.025l1.425 2.45l-2.075 1.575q.075.225.1.463t.025.5t-.025.5t-.1.463l2.075 1.575l-1.425 2.45l-2.425-1.025q-.35.275-.737.5t-.813.375L13 21h-2l-.45-2.525q-.425-.15-.812-.375t-.738-.5l-2.425 1.025L5.15 16.175l2.075-1.575q-.075-.225-.1-.462t-.025-.5t.025-.5t.1-.462L5.15 7.825l1.425-2.45l2.425 1.025q.35-.275.738-.5t.812-.375z" /></svg>
                            </span>
                            App Settings
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 hover:bg-cream-50 rounded-2xl transition-colors cursor-pointer group" onClick={() => setNotifications(!notifications)}>
                                <div>
                                    <h3 className="font-bold text-brown-900">Push Notifications</h3>
                                    <p className="text-sm text-brown-800/60 font-medium">Daily reminders and achievement alerts</p>
                                </div>
                                <div className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-brown-900' : 'bg-cream-300'}`}>
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications ? 'left-7' : 'left-1'}`}></div>
                                </div>
                            </div>
                            <div className="border-t border-cream-100"></div>
                            <div className="flex items-center justify-between p-4">
                                <div>
                                    <h3 className="font-bold text-brown-900">Dark Mode</h3>
                                    <p className="text-sm text-brown-800/60 font-medium">Coming soon with the next update</p>
                                </div>
                                <span className="text-xs font-black text-brown-800/40 uppercase tracking-widest bg-cream-100 px-3 py-1 rounded-full">
                                    Locked
                                </span>
                            </div>
                        </div>
                    </section>

                    <div className="flex justify-end gap-4 mt-12">
                        <button className="text-sm font-bold text-brown-800/60 px-8 py-4 rounded-2xl hover:bg-cream-100 transition-colors">
                            Discard Changes
                        </button>
                        <button className="text-sm font-bold text-cream-50 bg-brown-900 px-10 py-4 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all">
                            Save All Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
