
import DashboardHeader from '@/components/DashboardHeader';
import MetricsCards from '@/components/MetricsCards';
import CurrentBook from '@/components/CurrentBook';
import ReadingPlan from '@/components/ReadingPlan';
import RecentHighlights from '@/components/RecentHighlights';
import LeaderboardPreview from '@/components/LeaderboardPreview';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-cream-50">
            <div className="max-w-7xl mx-auto p-8 pb-20">
                <DashboardHeader username="Alex" />
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
