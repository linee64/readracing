import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-brand-beige border-t border-brand-black/10 pt-16 pb-8 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="text-2xl font-bold italic font-serif text-brand-black">
                            ReadRacing
                        </Link>
                        <p className="text-brand-black/70 text-sm leading-relaxed max-w-xs italic mt-2">
                            Reading as a sport. Push your limits, track your progress, and join the elite league of readers.
                        </p>
                    </div>

                    {/* Quick Links / About Us */}
                    <div>
                        <h4 className="text-brand-black font-bold italic mb-6">About Us</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/" className="text-sm text-brand-black/70 hover:text-brand-black transition-colors italic">Our Mission</Link>
                            </li>
                            <li>
                                <Link to="/" className="text-sm text-brand-black/70 hover:text-brand-black transition-colors italic">Team</Link>
                            </li>
                            <li>
                                <Link to="/" className="text-sm text-brand-black/70 hover:text-brand-black transition-colors italic">Careers</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support / Contacts */}
                    <div>
                        <h4 className="text-brand-black font-bold italic mb-6">Contacts</h4>
                        <ul className="space-y-4">
                            <li>
                                <a href="mailto:support@readracing.com" className="text-sm text-brand-black/70 hover:text-brand-black transition-colors italic flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    support@readracing.com
                                </a>
                            </li>
                            <li>
                                <Link to="/" className="text-sm text-brand-black/70 hover:text-brand-black transition-colors italic flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Help Center
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h4 className="text-brand-black font-bold italic mb-6">Follow Us</h4>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full border border-brand-black/10 flex items-center justify-center text-brand-black/70 hover:bg-brand-black hover:text-brand-beige transition-all group" aria-label="Instagram">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.103.29 2.596.483a4.832 4.832 0 011.79 1.165 4.832 4.832 0 011.164 1.79c.192.492.422 1.23.483 2.597.058 1.266.069 1.645.069 4.849s-.011 3.584-.069 4.849c-.062 1.366-.29 2.103-.483 2.596a4.832 4.832 0 01-1.165 1.79 4.832 4.832 0 01-1.79 1.164c-.492.192-1.23.422-2.596.483-1.266.058-1.645.069-4.85.069s-3.584-.011-4.849-.069c-1.366-.062-2.103-.29-2.596-.483a4.832 4.832 0 01-1.79-1.165 4.832 4.832 0 01-1.164-1.79c-.192-.492-.422-1.23-.483-2.597C2.011 15.584 2 15.205 2 12s.011-3.584.069-4.849c.062-1.366.29-2.103.483-2.596a4.832 4.832 0 011.165-1.79 4.832 4.832 0 011.79-1.164c.492-.192 1.23-.422 2.597-.483 1.265-.058 1.644-.069 4.848-.069zm0-2.163C8.741 0 8.332.013 7.052.072 5.704.134 4.784.348 3.997.656a6.996 6.996 0 00-2.533 1.65 6.996 6.996 0 00-1.65 2.533C.134 5.784 0 6.703 0 8.052c0 1.28.013 1.689.072 2.969.06 1.348.274 2.268.582 3.055a6.996 6.996 0 001.65 2.533 6.996 6.996 0 002.533 1.65c.787.308 1.707.522 3.055.582 1.28.06 1.689.072 2.969.072s1.689-.013 2.969-.072c1.348-.06 2.268-.274 3.055-.582a6.996 6.996 0 002.533-1.65 6.996 6.996 0 001.65-2.533c.308-.787.522-1.707.582-3.055.06-1.28.072-1.689.072-2.969s-.013-1.689-.072-2.969c-.06-1.348-.274-2.268-.582-3.055a6.996 6.996 0 00-1.65-2.533 6.996 6.996 0 00-2.533-1.65c-.787-.308-1.707-.522-3.055-.582-1.28-.06-1.689-.072-2.969-.072z" />
                                    <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-brand-black/10 flex items-center justify-center text-brand-black/70 hover:bg-brand-black hover:text-brand-beige transition-all group" aria-label="Telegram">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.891 7.02l-1.912 9.03c-.145.648-.529.81-.174.459l-2.922-2.155-1.41 1.356c-.156.156-.288.288-.588.288l.21-2.982 5.43-4.905c.236-.209-.052-.325-.366-.117l-6.713 4.226-2.888-.903c-.627-.197-.641-.627.13-.927l11.285-4.349c.522-.197.979.117.835.867z" />
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-brand-black/10 flex items-center justify-center text-brand-black/70 hover:bg-brand-black hover:text-brand-beige transition-all group" aria-label="Twitter">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-brand-black/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-brand-black/50 text-xs italic">
                        © {new Date().getFullYear()} ReadRacing. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <Link to="/" className="text-xs text-brand-black/50 hover:text-brand-black transition-colors italic tracker-tighter uppercase font-bold">Terms of Service</Link>
                        <Link to="/" className="text-xs text-brand-black/50 hover:text-brand-black transition-colors italic tracker-tighter uppercase font-bold">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
