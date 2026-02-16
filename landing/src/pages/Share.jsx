import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Share() {
  const [searchParams] = useSearchParams();
  const rank = parseInt(searchParams.get('rank')) || 0;
  const pages = parseInt(searchParams.get('pages')) || 0;
  const rawName = searchParams.get('name') || 'Reader';
  const name = decodeURIComponent(rawName);

  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('full_name, pages_read, avatar_url')
          .order('pages_read', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching leaderboard:', error);
        } else {
          setLeaderboard(profiles || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Helper to determine what to show for each rank position
  const getRankData = (position) => {
    // 1. Try to get real data from Supabase first
    const realEntry = leaderboard[position - 1];
    
    if (realEntry) {
      return {
        rank: position,
        name: realEntry.full_name || 'Anonymous',
        pages: realEntry.pages_read || 0,
        avatar_url: realEntry.avatar_url,
        isSharer: position === rank // It's the sharer if ranks match
      };
    }

    // 2. If no real data but it's the sharer's rank, use URL params
    if (position === rank) {
      return {
        rank: position,
        name: name,
        pages: pages,
        avatar_url: null, // URL doesn't carry avatar
        isSharer: true
      };
    }

    // 3. Fallback for empty slots (shouldn't happen often if DB has users)
    return {
      rank: position,
      name: `Reader ${position}`,
      pages: Math.max(0, pages - (position - rank) * 10),
      avatar_url: null,
      isSharer: false
    };
  };

  const renderRankRow = (position) => {
    const data = getRankData(position);
    
    // Different styling for top 3
    let badgeColor = 'bg-[#f0f0f0] text-[#666]'; // Default
    if (data.rank === 1) badgeColor = 'bg-[#e9c46a] text-white';
    if (data.rank === 2) badgeColor = 'bg-[#d5d5d5] text-[#666]';
    if (data.rank === 3) badgeColor = 'bg-[#cd7f32] text-white';

    return (
      <div key={position} className="flex items-center py-2 border-b border-[#3d1c0b]/5 last:border-0">
        <div className="w-6 font-bold text-[#d5941d]">{data.rank}</div>
        
        {/* Avatar or Initials */}
        <div className={`w-9 h-9 rounded-full mx-3 flex items-center justify-center overflow-hidden shrink-0 ${!data.avatar_url ? badgeColor : ''}`}>
          {data.avatar_url ? (
            <img src={data.avatar_url} alt={data.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-bold">{data.name.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div className="flex-1 text-left font-medium flex items-center min-w-0">
          <span className="truncate">{data.name}</span>
          {data.isSharer && <span className="text-[0.65rem] bg-[#e9c46a]/20 px-1.5 py-0.5 rounded ml-2 text-[#3d1c0b] shrink-0">YOU</span>}
        </div>
        <div className="font-bold whitespace-nowrap ml-2">{data.pages} <span className="font-normal text-xs text-[#5c3a2a] ml-1">pgs</span></div>
      </div>
    );
  };

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
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="w-6 h-6 border-2 border-[#e9c46a] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <>
                    {/* Always show Top 1-5 (or fewer if DB is small) */}
                    {[1, 2, 3, 4, 5].map(pos => {
                       // Only show if we have data or if it's the sharer's rank
                       if (leaderboard[pos-1] || pos === rank) {
                         return renderRankRow(pos);
                       }
                       return null;
                    })}

                    {/* If sharer is outside Top 5, show divider and sharer row */}
                    {rank > 5 && (
                      <>
                        <div className="flex justify-center py-2 opacity-50 text-[#d5941d]">•••</div>
                        {renderRankRow(rank)}
                      </>
                    )}
                  </>
                )}
            </div>
        </div>

        {/* CTA */}
        <div className="animate-slide-up delay-300">
            <Link 
                to="/"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
