'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
    const [notifications, setNotifications] = useState(true);
    const [readingGoal, setReadingGoal] = useState('30');
    const [language, setLanguage] = useState('English');
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isGoalOpen, setIsGoalOpen] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [user, setUser] = useState({
        name: 'User',
        email: 'user@example.com',
        isPro: false
    });
    const [newName, setNewName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user: supabaseUser } } = await supabase.auth.getUser();
            if (supabaseUser) {
                const name = supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User';
                setUser({
                    name,
                    email: supabaseUser.email || '',
                    isPro: true
                });
                setNewName(name);
            }
        };
        fetchUser();
    }, []);

    const handleSaveName = async () => {
        if (!newName.trim() || newName === user.name) return;
        
        setIsSaving(true);
        try {
            const { data, error } = await supabase.auth.updateUser({
                data: { full_name: newName }
            });
            
            if (error) throw error;
            
            setUser(prev => ({ ...prev, name: newName }));
            alert('Name updated successfully!');
        } catch (error: any) {
            alert('Error updating name: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const languages = ['English', 'Russian'];
    const goals = [
        { value: '15', label: '15 min' },
        { value: '30', label: '30 min' },
        { value: '45', label: '45 min' },
        { value: '60', label: '60 min' },
    ];

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (avatarUrl) URL.revokeObjectURL(avatarUrl);
            const url = URL.createObjectURL(file);
            setAvatarUrl(url);
        }
    };

    const removeAvatar = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (avatarUrl) URL.revokeObjectURL(avatarUrl);
        setAvatarUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSave = () => {
        // In a real app, this would persist settings to a database
        alert('Settings saved successfully!');
    };

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

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
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-brown-900 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-brown-900 text-cream-50 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z" /></svg>
                                </span>
                                Profile Settings
                            </h2>
                            <button
                                onClick={handleSaveName}
                                disabled={isSaving || !newName.trim() || newName === user.name}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                    newName !== user.name && newName.trim()
                                    ? 'bg-brown-900 text-cream-50 hover:bg-brown-800 shadow-md'
                                    : 'bg-cream-100 text-brown-800/30 cursor-not-allowed'
                                }`}
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-6 mb-8">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleAvatarUpload}
                            />
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-24 h-24 bg-cream-100 rounded-2xl flex items-center justify-center text-4xl font-bold text-brown-800 border-2 border-dashed border-brown-300 cursor-pointer hover:bg-cream-200 hover:border-brown-400 transition-all relative group overflow-hidden"
                            >
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
                                ) : (
                                    user.name.charAt(0)
                                )}
                                
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                </div>

                                {avatarUrl && (
                                    <button 
                                        onClick={removeAvatar}
                                        className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10"
                                        title="Remove photo"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <p className="text-brown-900 font-bold text-lg">{user.name}</p>
                                <p className="text-brown-800/60 font-medium">{user.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-brown-800/70 ml-1">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="w-full bg-cream-50/50 border border-cream-200 rounded-2xl px-5 py-3 text-brown-900 font-medium focus:outline-none focus:ring-2 focus:ring-brown-900/10 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-brown-800/70 ml-1">Email Address</label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        value={user.email}
                                        readOnly
                                        className="w-full bg-cream-50/30 border border-cream-200 rounded-2xl px-5 py-3 text-brown-800/40 font-medium cursor-not-allowed select-none"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-black text-brown-800/30 uppercase tracking-widest">Read Only</span>
                                    </div>
                                </div>
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
                                <div className="relative">
                                    <button
                                        onClick={() => setIsGoalOpen(!isGoalOpen)}
                                        className="bg-white border border-cream-200 rounded-xl px-5 py-2.5 text-brown-900 font-bold focus:outline-none flex items-center gap-3 min-w-[140px] justify-between hover:border-brown-900/20 transition-all shadow-sm"
                                    >
                                        {goals.find(g => g.value === readingGoal)?.label}
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            width="20" 
                                            height="20" 
                                            viewBox="0 0 24 24"
                                            className={`transition-transform duration-200 ${isGoalOpen ? 'rotate-180' : ''}`}
                                        >
                                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 9l6 6l6-6"/>
                                        </svg>
                                    </button>
                                    
                                    {isGoalOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsGoalOpen(false)}></div>
                                            <div className="absolute right-0 mt-2 w-full bg-white border border-cream-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 animate-in fade-in zoom-in duration-200">
                                                {goals.map((goal) => (
                                                    <button
                                                        key={goal.value}
                                                        onClick={() => {
                                                            setReadingGoal(goal.value);
                                                            setIsGoalOpen(false);
                                                        }}
                                                        className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors flex items-center justify-between ${
                                                            readingGoal === goal.value 
                                                            ? 'bg-brown-900 text-cream-50' 
                                                            : 'text-brown-900 hover:bg-cream-50'
                                                        }`}
                                                    >
                                                        {goal.label}
                                                        {readingGoal === goal.value && (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                                                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="m5 12l5 5L20 7"/>
                                                            </svg>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-cream-50 rounded-2xl border border-cream-100">
                                <div>
                                    <h3 className="font-bold text-brown-900 text-lg">App Language</h3>
                                    <p className="text-sm text-brown-800/60 font-medium">Preferred language for the interface</p>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsLangOpen(!isLangOpen)}
                                        className="bg-white border border-cream-200 rounded-xl px-5 py-2.5 text-brown-900 font-bold focus:outline-none flex items-center gap-3 min-w-[140px] justify-between hover:border-brown-900/20 transition-all shadow-sm"
                                    >
                                        {language}
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            width="20" 
                                            height="20" 
                                            viewBox="0 0 24 24"
                                            className={`transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`}
                                        >
                                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 9l6 6l6-6"/>
                                        </svg>
                                    </button>
                                    
                                    {isLangOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsLangOpen(false)}></div>
                                            <div className="absolute right-0 mt-2 w-full bg-white border border-cream-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 animate-in fade-in zoom-in duration-200">
                                                {languages.map((lang) => (
                                                    <button
                                                        key={lang}
                                                        onClick={() => {
                                                            setLanguage(lang);
                                                            setIsLangOpen(false);
                                                        }}
                                                        className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors flex items-center justify-between ${
                                                            language === lang 
                                                            ? 'bg-brown-900 text-cream-50' 
                                                            : 'text-brown-900 hover:bg-cream-50'
                                                        }`}
                                                    >
                                                        {lang}
                                                        {language === lang && (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                                                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="m5 12l5 5L20 7"/>
                                                            </svg>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
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
                                        {user.isPro && (
                                            <span className="bg-brand-gold text-brown-900 text-[10px] uppercase font-black px-3 py-1 rounded-full tracking-wider">
                                                Pro Plan
                                            </span>
                                        )}
                                    </h2>
                                    <p className="text-cream-50/70 font-medium">
                                        {user.isPro ? 'Your subscription is active until December 31, 2026.' : 'You are currently on the Free plan.'}
                                    </p>
                                </div>
                                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2L4.5 20.29l.71.71L12 18l6.79 3l.71-.71z" /></svg>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                    <p className="text-xs font-bold text-cream-50/40 uppercase mb-1">Status</p>
                                    <p className="font-bold text-lg">{user.isPro ? 'Active' : 'Free'}</p>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                    <p className="text-xs font-bold text-cream-50/40 uppercase mb-1">Billing</p>
                                    <p className="font-bold text-lg">{user.isPro ? 'Annual' : 'N/A'}</p>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                    <p className="text-xs font-bold text-cream-50/40 uppercase mb-1">Next Payment</p>
                                    <p className="font-bold text-lg">{user.isPro ? '$49.00 / year' : 'Upgrade for Pro features'}</p>
                                </div>
                            </div>
                            <button className="w-full md:w-auto bg-brand-gold text-brown-900 font-bold px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition-transform">
                                {user.isPro ? 'Manage Subscription' : 'Upgrade to Pro'}
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
