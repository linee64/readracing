import React from 'react';
import CornerAccent from '../components/CornerAccent';
import { Link } from 'react-router-dom';

const VerifyEmail = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-20">
            <div className="w-full max-w-md mb-6 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-gold/10 rounded-full mb-6">
                    <svg className="w-10 h-10 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold mb-4 italic">Check Your Email</h2>
                <p className="text-brand-black/60 text-lg leading-relaxed mb-8">
                    We've sent a verification link to your email address. Please confirm your email to access the dashboard.
                </p>
                
                <div className="relative w-full bg-brand-beige p-8 border border-brand-black/5 shadow-sm">
                    <CornerAccent />
                    <p className="text-sm font-medium mb-6">Didn't receive the email?</p>
                    <div className="flex flex-col gap-4">
                        <Link 
                            to="/login" 
                            className="bg-brand-black text-brand-beige py-4 font-bold hover:opacity-90 transition-opacity font-sans"
                        >
                            Return to Login
                        </Link>
                        <Link 
                            to="/" 
                            className="text-brand-black/60 hover:text-brand-black transition-colors text-sm font-medium underline underline-offset-4"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
