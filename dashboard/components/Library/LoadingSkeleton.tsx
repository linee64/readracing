import React from 'react';

const SkeletonCard = () => (
    <div className="bg-white border-2 border-cream-200 rounded-[24px] p-6 shadow-sm overflow-hidden">
        <div className="aspect-[2/3] w-full rounded-xl bg-gradient-to-r from-cream-200 via-cream-100 to-cream-200 bg-[length:200%_100%] animate-pulse mb-6" />
        <div className="h-7 w-3/4 rounded-lg bg-gradient-to-r from-cream-200 via-cream-100 to-cream-200 bg-[length:200%_100%] animate-pulse mb-3" />
        <div className="h-5 w-1/2 rounded-lg bg-gradient-to-r from-cream-200 via-cream-100 to-cream-200 bg-[length:200%_100%] animate-pulse mb-6" />
        <div className="space-y-3">
            <div className="h-3 w-full rounded bg-gradient-to-r from-cream-200 via-cream-100 to-cream-200 bg-[length:200%_100%] animate-pulse" />
            <div className="h-3 w-5/6 rounded bg-gradient-to-r from-cream-200 via-cream-100 to-cream-200 bg-[length:200%_100%] animate-pulse" />
        </div>
        <div className="mt-8 h-[52px] w-full rounded-full bg-gradient-to-r from-cream-200 via-cream-100 to-cream-200 bg-[length:200%_100%] animate-pulse" />
    </div>
);

const LoadingSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
};

export default LoadingSkeleton;
