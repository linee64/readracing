import React from 'react';

const SkeletonCard = () => (
    <div className="bg-white border border-[#E5DCC8] rounded-[16px] p-5 shadow-sm overflow-hidden">
        <div className="aspect-[2/3] w-full rounded-lg bg-gradient-to-r from-[#E5DCC8] via-[#F5F1E8] to-[#E5DCC8] bg-[length:200%_100%] animate-pulse mb-4" />
        <div className="h-6 w-3/4 rounded bg-gradient-to-r from-[#E5DCC8] via-[#F5F1E8] to-[#E5DCC8] bg-[length:200%_100%] animate-pulse mb-2" />
        <div className="h-4 w-1/2 rounded bg-gradient-to-r from-[#E5DCC8] via-[#F5F1E8] to-[#E5DCC8] bg-[length:200%_100%] animate-pulse mb-4" />
        <div className="space-y-2">
            <div className="h-3 w-full rounded bg-gradient-to-r from-[#E5DCC8] via-[#F5F1E8] to-[#E5DCC8] bg-[length:200%_100%] animate-pulse" />
            <div className="h-3 w-5/6 rounded bg-gradient-to-r from-[#E5DCC8] via-[#F5F1E8] to-[#E5DCC8] bg-[length:200%_100%] animate-pulse" />
        </div>
        <div className="mt-6 h-12 w-full rounded-[24px] bg-gradient-to-r from-[#E5DCC8] via-[#F5F1E8] to-[#E5DCC8] bg-[length:200%_100%] animate-pulse" />
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
