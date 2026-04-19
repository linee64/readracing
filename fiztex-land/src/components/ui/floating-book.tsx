import React, { type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface FloatingBookProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
  rotateZ?: number;
  delay?: number;
  duration?: number;
  flapDuration?: number;
}

const FloatingBook: React.FC<FloatingBookProps> = ({
  width = 160,
  height = 120, // Open books are wider than tall typically, but let's keep it somewhat book-shaped
  color = '#e9c46a', // brand-accent
  className,
  style,
  rotateZ = 0,
  delay = 0,
  duration = 6,
  flapDuration = 0.8,
}) => {
  const containerStyle: CSSProperties = {
    ...style,
    width: `${width}px`,
    height: `${height}px`,
    perspective: '1000px',
  } as CSSProperties;

  const bookStyle = {
    '--rot-z': `${rotateZ}deg`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  } as React.CSSProperties;

  const flapStyle = {
    animationDuration: `${flapDuration}s`,
    animationDelay: `${delay}s`,
  } as React.CSSProperties;

  return (
    <div className={cn("absolute pointer-events-none z-0 book-container", className)} style={containerStyle}>
      <div className="flying-book animate-float-flying" style={bookStyle}>
        
        {/* Spine */}
        <div 
            className="book-spine"
            style={{ backgroundColor: `color-mix(in srgb, ${color}, black 30%)` }}
        ></div>

        {/* Left Wing */}
        <div className="book-wing book-wing-left animate-flap-left" style={{ ...flapStyle, backgroundColor: color }}>
            <div className="wing-pages wing-pages-left"></div>
            {/* Inner cover detail */}
            <div className="absolute inset-2 border border-black/10 rounded-l-sm"></div>
        </div>

        {/* Right Wing */}
        <div className="book-wing book-wing-right animate-flap-right" style={{ ...flapStyle, backgroundColor: color }}>
            <div className="wing-pages wing-pages-right"></div>
            {/* Inner cover detail */}
            <div className="absolute inset-2 border border-black/10 rounded-r-sm"></div>
        </div>

      </div>
    </div>
  );
};

export default FloatingBook;
