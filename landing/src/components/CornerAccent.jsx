import React from 'react';

const CornerAccent = () => {
    return (
        <>
            {/* Top Left */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand-gold/50 rounded-tl-sm pointer-events-none"></div>
            {/* Top Right */}
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-brand-gold/50 rounded-tr-sm pointer-events-none"></div>
            {/* Bottom Left */}
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-brand-gold/50 rounded-bl-sm pointer-events-none"></div>
            {/* Bottom Right */}
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand-gold/50 rounded-br-sm pointer-events-none"></div>
        </>
    );
};

export default CornerAccent;
