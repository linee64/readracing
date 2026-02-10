'use client';

import React, { useState } from 'react';
import CornerAccent from '@/components/CornerAccent';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (loginError) throw loginError;
            
            if (data.user) {
                if (!data.user.email_confirmed_at) {
                    await supabase.auth.signOut();
                    router.push('/verify-email');
                    return;
                }
                // Redirect to dashboard
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-brand-beige">
            <div className="w-full max-w-md mb-6">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-brand-black/60 hover:text-brand-black transition-colors group">
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Home
                </Link>
            </div>
            <div className="relative w-full max-w-md bg-brand-beige p-8 md:p-12 border border-brand-black/5 shadow-sm">
                <CornerAccent />
                <h2 className="text-3xl font-bold mb-8 text-center italic">Welcome Back</h2>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded font-sans">
                        {error}
                    </div>
                )}

                <form className="flex flex-col gap-6" onSubmit={handleLogin}>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium uppercase tracking-wide opacity-70">Email</label>
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-transparent border-b border-brand-black/20 py-2 focus:outline-none focus:border-brand-gold transition-colors font-sans text-lg text-brand-black"
                            placeholder="reader@example.com"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium uppercase tracking-wide opacity-70">Password</label>
                        <input
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-transparent border-b border-brand-black/20 py-2 focus:outline-none focus:border-brand-gold transition-colors font-sans text-lg text-brand-black"
                            placeholder="••••••••"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="bg-brand-black text-brand-beige py-4 font-bold mt-4 hover:opacity-90 transition-opacity font-sans disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Logging In...' : 'Log In'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm opacity-60 font-sans text-brand-black">
                    Don't have an account? <Link href="/signup" className="border-b border-brand-black pb-0.5 hover:text-brand-gold transition-colors">Join ReadRacing</Link>
                </p>
            </div>
        </div>
    );
}
