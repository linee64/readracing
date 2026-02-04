import React from 'react';

const ShinyText = ({ text, disabled = false, speed = 5, className = '' }) => {
    const animationDuration = `${speed}s`;

    return (
        <div
            className={`relative inline-block ${className}`}
            style={{
                display: 'inline-block', // Ensures wrapping matches inline behavior if needed, though className might override
            }}
        >
            {/* Base Text - inherits color from className */}
            <span className="relative z-10">{text}</span>

            {/* Overlay Text - Shine Effect */}
            <span
                className={`absolute top-0 left-0 z-20 bg-clip-text text-transparent ${disabled ? '' : 'animate-shine'}`}
                style={{
                    backgroundImage: 'linear-gradient(120deg, transparent 40%, rgba(255, 255, 255, 0.8) 50%, transparent 60%)',
                    backgroundSize: '200% 100%',
                    WebkitBackgroundClip: 'text',
                    animationDuration: animationDuration,
                }}
                aria-hidden="true"
            >
                {text}
            </span>
        </div>
    );
};

export default ShinyText;
