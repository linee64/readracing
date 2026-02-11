'use client';

import React, { useEffect, useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import MetricsCards from '@/components/MetricsCards';
import CurrentBook from '@/components/CurrentBook';
import ReadingPlan from '@/components/ReadingPlan';
import RecentHighlights from '@/components/RecentHighlights';
import LeaderboardPreview from '@/components/LeaderboardPreview';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
    const [username, setUsername] = useState<string>('Reader');

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Reader';
                setUsername(name);
            }
        });

        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Reader';
                setUsername(name);
            }
        };
        getUser();

        return () => subscription.unsubscribe();
    }, []);

    return (
        <div className="min-h-screen bg-cream-50">
            <div className="max-w-7xl mx-auto p-4 md:p-8 pb-20">
                <DashboardHeader username={username} />
                <MetricsCards />
                <CurrentBook />
                <ReadingPlan />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    <RecentHighlights />
                    <LeaderboardPreview />
                </div>
            </div>
        </div>
    );
}
