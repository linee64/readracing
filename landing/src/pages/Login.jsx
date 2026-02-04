import React from 'react';
import CornerAccent from '../components/CornerAccent';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
            <div className="relative w-full max-w-md bg-brand-beige p-8 md:p-12 border border-brand-black/5 shadow-sm">
                <CornerAccent />
                <h2 className="text-3xl font-bold mb-8 text-center italic">Welcome Back</h2>

                <form className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium uppercase tracking-wide opacity-70">Email</label>
                        <input
                            type="email"
                            className="bg-transparent border-b border-brand-black/20 py-2 focus:outline-none focus:border-brand-gold transition-colors font-sans text-lg"
                            placeholder="reader@example.com"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium uppercase tracking-wide opacity-70">Password</label>
                        <input
                            type="password"
                            className="bg-transparent border-b border-brand-black/20 py-2 focus:outline-none focus:border-brand-gold transition-colors font-sans text-lg"
                            placeholder="••••••••"
                        />
                    </div>

                    <button className="bg-brand-black text-brand-beige py-4 font-bold mt-4 hover:opacity-90 transition-opacity font-sans">
                        Log In
                    </button>
                </form>

                <p className="mt-8 text-center text-sm opacity-60 font-sans">
                    Don't have an account? <Link to="/signup" className="border-b border-brand-black pb-0.5 hover:text-brand-gold transition-colors">Join ReadRacing</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
