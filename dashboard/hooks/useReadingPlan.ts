
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, subWeeks } from 'date-fns';

export interface ReadingSession {
    id: string;
    pages_read: number;
    duration_seconds: number;
    created_at: string;
}

export interface DailyProgress {
    date: Date;
    dayName: string; // 'M', 'T', 'W', etc.
    pagesRead: number;
    isToday: boolean;
    isFuture: boolean;
    completed: boolean;
}

export interface WeeklyStats {
    completionRate: number;
    readingSpeed: number; // pages/hour
    focusScore: number; // 0-100
    totalPages: number;
}

export function useReadingPlan() {
    const [weeklyGoal, setWeeklyGoal] = useState(150);
    const [sessions, setSessions] = useState<ReadingSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch goal
            const { data: profile } = await supabase
                .from('profiles')
                .select('weekly_goal')
                .eq('id', user.id)
                .single();
            
            if (profile) {
                setWeeklyGoal(profile.weekly_goal || 150);
            }

            // Fetch sessions for this month (plus a bit more for context if needed)
            // Actually, for streak we need more history, maybe last 60 days?
            // Or just fetch all sessions? Fetching all might be heavy if lots of sessions.
            // Let's fetch last 60 days.
            const sixtyDaysAgo = new Date();
            sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

            const { data: sessionData } = await supabase
                .from('reading_sessions')
                .select('*')
                .eq('user_id', user.id)
                .gte('created_at', sixtyDaysAgo.toISOString())
                .order('created_at', { ascending: false });

            if (sessionData) {
                setSessions(sessionData);
                calculateStreak(sessionData);
            }
        } catch (error) {
            console.error('Error fetching reading plan data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStreak = (sessions: ReadingSession[]) => {
        if (!sessions || sessions.length === 0) {
            setStreak(0);
            return;
        }

        const uniqueDates = new Set(
            sessions.map(s => format(new Date(s.created_at), 'yyyy-MM-dd'))
        );
        
        const today = format(new Date(), 'yyyy-MM-dd');
        const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');
        
        let currentStreak = 0;
        let checkDate = new Date();

        // Check if streak is active (read today or yesterday)
        if (!uniqueDates.has(today) && !uniqueDates.has(yesterday)) {
            setStreak(0);
            return;
        }

        // If read today, start checking from today. If not, start from yesterday.
        if (!uniqueDates.has(today)) {
            checkDate.setDate(checkDate.getDate() - 1);
        }

        while (true) {
            const dateStr = format(checkDate, 'yyyy-MM-dd');
            if (uniqueDates.has(dateStr)) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        
        setStreak(currentStreak);
        // Also save to localStorage for other components to use immediately if needed
        localStorage.setItem('readracing_streak', currentStreak.toString());
    };


    const getWeeklyProgress = (): DailyProgress[] => {
        const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
        const end = endOfWeek(new Date(), { weekStartsOn: 1 });
        const days = eachDayOfInterval({ start, end });

        return days.map(day => {
            const isToday = isSameDay(day, new Date());
            const isFuture = day > new Date();
            
            // Sum pages for this day
            const pagesRead = sessions
                .filter(s => isSameDay(new Date(s.created_at), day))
                .reduce((sum, s) => sum + s.pages_read, 0);

            // Determine if completed (simple logic: read anything = completed, or check against daily target)
            // For now, if they read > 0 pages, it's "completed"
            const completed = pagesRead > 0;

            return {
                date: day,
                dayName: format(day, 'EEEEE'), // 'M', 'T', etc.
                pagesRead,
                isToday,
                isFuture,
                completed
            };
        });
    };

    const getWeeklyStats = (): WeeklyStats => {
        const progress = getWeeklyProgress();
        const totalPages = progress.reduce((sum, d) => sum + d.pagesRead, 0);
        
        // Completion rate: (Total Read / Goal) * 100
        const completionRate = Math.min(100, Math.round((totalPages / weeklyGoal) * 100));

        // Reading speed: (Total Pages / Total Duration in Hours)
        // Need to sum duration from sessions
        const start = startOfWeek(new Date(), { weekStartsOn: 1 });
        const weekSessions = sessions.filter(s => new Date(s.created_at) >= start);
        const totalSeconds = weekSessions.reduce((sum, s) => sum + s.duration_seconds, 0);
        const totalHours = totalSeconds / 3600;
        const readingSpeed = totalHours > 0 ? Math.round(totalPages / totalHours) : 0;

        // Focus Score: Arbitrary calc based on consistency?
        // Let's say: 100 - (days missed * 10)
        const daysPassed = progress.filter(d => !d.isFuture).length;
        const daysRead = progress.filter(d => !d.isFuture && d.pagesRead > 0).length;
        const focusScore = daysPassed > 0 ? Math.round((daysRead / daysPassed) * 100) : 100;

        return {
            completionRate,
            readingSpeed,
            focusScore,
            totalPages
        };
    };

    const logSession = async (pages: number, durationSeconds: number = 0) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from('reading_sessions').insert({
            user_id: user.id,
            pages_read: pages,
            duration_seconds: durationSeconds
        });

        if (!error) {
            fetchData(); // Refresh data
        } else {
            console.error('Error logging session:', error);
        }
    };

    const resetProgress = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('reading_sessions')
            .delete()
            .eq('user_id', user.id);

        if (!error) {
            fetchData();
        } else {
            console.error('Error resetting progress:', error);
        }
    };

    return {
        weeklyGoal,
        setWeeklyGoal, // To be implemented: update DB
        sessions,
        loading,
        streak,
        getWeeklyProgress,
        getWeeklyStats,
        logSession,
        resetProgress
    };
}
