
interface MetricCardProps {
    icon: string | React.ReactNode;
    number: string;
    subtitle: string;
    hasProgressBar?: boolean;
    progress?: number;
}

function MetricCard({ icon, number, subtitle, hasProgressBar, progress }: MetricCardProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-cream-200">
            <div className="flex items-center justify-between mb-3">
                {typeof icon === 'string' ? (
                    <span className="text-3xl" role="img" aria-label="metric icon">{icon}</span>
                ) : (
                    icon
                )}
            </div>
            <div className="text-3xl font-bold text-brown-900">{number}</div>
            <div className="text-sm text-brown-800/60 mt-1 font-medium">{subtitle}</div>

            {hasProgressBar && (
                <div className="w-full bg-cream-200 rounded-full h-2 mt-4 overflow-hidden">
                    <div
                        className="bg-brown-900 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            )}
        </div>
    );
}

export default function MetricsCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <MetricCard
                icon="🔥"
                number="12 days"
                subtitle="Keep it going!"
            />

            <MetricCard
                icon={
                    <div className="bg-brown-900 text-cream-50 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                        ✓
                    </div>
                }
                number="8 books"
                subtitle="This year"
            />

            <MetricCard
                icon="📖"
                number="45 pages"
                subtitle="Daily Goal: 60"
                hasProgressBar
                progress={75}
            />
        </div>
    );
}
