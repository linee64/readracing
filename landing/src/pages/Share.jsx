import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function Share() {
  const [searchParams] = useSearchParams();
  const rank = searchParams.get('rank') || '0';
  const pages = searchParams.get('pages') || '0';
  const rawName = searchParams.get('name') || 'Reader';
  const name = decodeURIComponent(rawName);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f5e9] p-4 font-serif text-[#3d1c0b]">
      <div className="w-full max-w-[500px] bg-[#f9f5e9] relative p-6 md:p-10 text-center">
        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#e9c46a]/80 rounded-tl pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#e9c46a]/80 rounded-tr pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#e9c46a]/80 rounded-bl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#e9c46a]/80 rounded-br pointer-events-none"></div>

        <div className="font-bold text-xl mb-8 tracking-tight animate-fade-in">ReadRacing</div>

        {/* Hero */}
        <div className="mb-10 relative animate-slide-up delay-100">
            <div className="inline-flex flex-col items-center justify-center w-[120px] h-[120px] rounded-full border border-[#e9c46a]/50 bg-gradient-to-br from-[#fffcf5] to-[#f9f5e9] shadow-[0_0_30px_rgba(233,196,106,0.3)] mb-6 relative">
                {/* SVG Wreath */}
                <svg className="absolute inset-0 w-full h-full opacity-60 animate-spin-slow" viewBox="0 0 100 100" fill="none" stroke="#e9c46a" strokeWidth="1.5">
                    <circle cx="50" cy="50" r="45" strokeDasharray="4 6" />
                </svg>
                <div className="text-[3.5rem] font-bold leading-none text-[#3d1c0b] relative z-10">{rank}</div>
                <div className="text-xs uppercase tracking-widest text-[#d5941d] mt-1 font-semibold">Rank</div>
            </div>
            
            <h1 className="text-[2rem] leading-tight font-semibold mb-3">
                I read more than<br/>
                <span className="text-[#d5941d] italic">98%</span> of people
            </h1>
            <p className="text-lg text-[#5c3a2a] italic mb-8">
                {pages} pages read this week
            </p>
        </div>

        {/* Leaderboard Preview */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-10 border border-[#e9c46a]/20 animate-slide-up delay-200">
            <div className="text-sm uppercase tracking-widest mb-4 text-[#5c3a2a] font-semibold border-b border-[#3d1c0b]/5 pb-2">
                Global Top
            </div>
            
            <div className="space-y-3">
                {/* Rank 1 (Mock or You) */}
                <div className="flex items-center py-2 border-b border-[#3d1c0b]/5 last:border-0">
                    <div className="w-6 font-bold text-[#d5941d]">1</div>
                    <div className="w-9 h-9 rounded-full bg-[#e9c46a] mx-3 flex items-center justify-center text-xs font-bold text-white">
                        {rank === '1' ? name.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div className="flex-1 text-left font-medium flex items-center">
                         {rank === '1' ? name : 'aidar'} 
                         {rank === '1' && <span className="text-[0.65rem] bg-[#e9c46a]/20 px-1.5 py-0.5 rounded ml-2 text-[#3d1c0b]">YOU</span>}
                    </div>
                    <div className="font-bold">{rank === '1' ? pages : '16'} <span className="font-normal text-xs text-[#5c3a2a] ml-1">pgs</span></div>
                </div>
                
                {/* Rank 2 */}
                <div className="flex items-center py-2 border-b border-[#3d1c0b]/5 last:border-0">
                    <div className="w-6 font-bold text-[#d5941d]">2</div>
                    <div className="w-9 h-9 rounded-full bg-[#d5d5d5] text-[#666] mx-3 flex items-center justify-center text-xs font-bold">
                        {rank === '2' ? name.charAt(0).toUpperCase() : 'P'}
                    </div>
                    <div className="flex-1 text-left font-medium flex items-center">
                        {rank === '2' ? name : 'Pups'}
                        {rank === '2' && <span className="text-[0.65rem] bg-[#e9c46a]/20 px-1.5 py-0.5 rounded ml-2 text-[#3d1c0b]">YOU</span>}
                    </div>
                    <div className="font-bold">{rank === '2' ? pages : '13'} <span className="font-normal text-xs text-[#5c3a2a] ml-1">pgs</span></div>
                </div>

                 {/* Rank 3 or User Rank if > 3 */}
                 <div className="flex items-center py-2 border-b border-[#3d1c0b]/5 last:border-0">
                    <div className="w-6 font-bold text-[#d5941d]">{parseInt(rank) > 2 ? rank : '3'}</div>
                    <div className="w-9 h-9 rounded-full bg-[#cd7f32] text-white mx-3 flex items-center justify-center text-xs font-bold">
                        {parseInt(rank) > 2 ? name.charAt(0).toUpperCase() : 'D'}
                    </div>
                    <div className="flex-1 text-left font-medium flex items-center">
                        {parseInt(rank) > 2 ? name : 'Daniyal'}
                        {parseInt(rank) > 2 && <span className="text-[0.65rem] bg-[#e9c46a]/20 px-1.5 py-0.5 rounded ml-2 text-[#3d1c0b]">YOU</span>}
                    </div>
                    <div className="font-bold">{parseInt(rank) > 2 ? pages : '10'} <span className="font-normal text-xs text-[#5c3a2a] ml-1">pgs</span></div>
                </div>
            </div>
        </div>

        {/* CTA */}
        <div className="animate-slide-up delay-300">
            <Link 
                to="/"
                className="block w-full bg-[#e9c46a] text-[#3d1c0b] py-4 rounded-lg font-semibold text-lg hover:bg-[#f0cd7d] transition-all shadow-[0_4px_12px_rgba(233,196,106,0.3)] hover:shadow-[0_6px_16px_rgba(233,196,106,0.4)] hover:-translate-y-0.5"
            >
                Start Reading Smarter
            </Link>
            
            <div className="flex justify-center gap-6 mt-8">
                <a href="#" className="flex items-center gap-2 text-[#5c3a2a] hover:text-[#d5941d] transition-colors text-sm font-medium group">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-0.5 transition-transform"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    Telegram
                </a>
                <a href="#" className="flex items-center gap-2 text-[#5c3a2a] hover:text-[#d5941d] transition-colors text-sm font-medium group">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-0.5 transition-transform"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                    Twitter
                </a>
            </div>
        </div>
      </div>
    </div>
  );
}
