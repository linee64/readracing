import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const TextTypeReact = ({
    text,
    className = '',
    showCursor = true,
    cursorCharacter = '|',
    typingSpeed = 50,
    pauseDuration = 2000,
    loop = true,
    startOnVisible = true
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isVisible, setIsVisible] = useState(!startOnVisible);
    const containerRef = useRef(null);
    const cursorRef = useRef(null);
    const textArray = Array.isArray(text) ? text : [text];

    useEffect(() => {
        if (showCursor && cursorRef.current) {
            gsap.to(cursorRef.current, {
                opacity: 0,
                duration: 0.5,
                repeat: -1,
                yoyo: true,
                ease: 'power2.inOut'
            });
        }
    }, [showCursor]);

    useEffect(() => {
        if (startOnVisible && containerRef.current) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setIsVisible(true);
                },
                { threshold: 0.1 }
            );
            observer.observe(containerRef.current);
            return () => observer.disconnect();
        }
    }, [startOnVisible]);

    useEffect(() => {
        if (!isVisible) return;

        const currentFullText = textArray[currentTextIndex];
        let timeout;

        if (isDeleting) {
            if (displayedText === '') {
                setIsDeleting(false);
                setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
                timeout = setTimeout(() => {}, pauseDuration);
            } else {
                timeout = setTimeout(() => {
                    setDisplayedText(displayedText.slice(0, -1));
                }, typingSpeed / 2);
            }
        } else {
            if (displayedText.length < currentFullText.length) {
                timeout = setTimeout(() => {
                    setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
                }, typingSpeed);
            } else if (textArray.length > 1 || loop) {
                timeout = setTimeout(() => {
                    setIsDeleting(true);
                }, pauseDuration);
            }
        }

        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, currentTextIndex, isVisible, textArray, typingSpeed, pauseDuration, loop]);

    return (
        <div ref={containerRef} className={`relative inline-block ${className}`}>
            {/* Ghost text to reserve space and prevent layout shifts */}
            <div className="invisible pointer-events-none select-none" aria-hidden="true">
                {/* Find the text that takes the most space (height/width) */}
                {textArray.reduce((longest, current) => current.length > longest.length ? current : longest, "")}
                {showCursor && <span className="ml-1 inline-block">{cursorCharacter}</span>}
            </div>
            
            {/* The actual animated text - absolutely positioned to follow the ghost's dimensions */}
            <div className="absolute inset-0">
                <span>{displayedText}</span>
                {showCursor && (
                    <span ref={cursorRef} className="ml-1 inline-block">
                        {cursorCharacter}
                    </span>
                )}
            </div>
        </div>
    );
};

export default TextTypeReact;
