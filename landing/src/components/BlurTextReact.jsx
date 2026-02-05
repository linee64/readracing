import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const BlurTextReact = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words', // 'words' | 'letters'
  direction = 'top', // 'top' | 'bottom'
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = 'easeOut',
  onAnimationComplete,
  stepDuration = 0.25,
  tag = 'p',
  animate = true,
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [completedCount, setCompletedCount] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: threshold, margin: rootMargin });

  const shouldAnimate = animate && isInView;

  const defaultFrom = direction === 'top' 
    ? { filter: 'blur(10px)', opacity: 0, y: -50 } 
    : { filter: 'blur(10px)', opacity: 0, y: 50 };

  const defaultTo = [
    {
      filter: 'blur(5px)',
      opacity: 0.5,
      y: direction === 'top' ? 5 : -5,
    },
    {
      filter: 'blur(0px)',
      opacity: 1,
      y: 0,
    },
  ];

  const fromSnapshot = animationFrom || defaultFrom;
  const toSnapshots = animationTo || defaultTo;

  const handleAnimationComplete = () => {
    setCompletedCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (completedCount === elements.length && onAnimationComplete) {
      onAnimationComplete();
    }
  }, [completedCount, elements.length, onAnimationComplete]);

  const getAnimate = () => {
    const keyframes = {};
    const keys = new Set([...Object.keys(fromSnapshot), ...toSnapshots.flatMap(s => Object.keys(s))]);
    
    keys.forEach(key => {
      keyframes[key] = [fromSnapshot[key], ...toSnapshots.map(s => s[key])];
    });
    
    return keyframes;
  };

  const Component = motion[tag] || motion.p;

  return (
    <Component ref={containerRef} className={`blur-text flex flex-wrap ${className}`}>
      {elements.map((element, index) => (
        <motion.span
          key={index}
          initial={fromSnapshot}
          animate={shouldAnimate ? getAnimate() : fromSnapshot}
          transition={{
            duration: stepDuration * toSnapshots.length,
            delay: (index * delay) / 1000,
            ease: easing,
          }}
          onAnimationComplete={handleAnimationComplete}
          style={{
            display: 'inline-block',
            willChange: 'transform, filter, opacity',
          }}
        >
          {element === ' ' ? '\u00A0' : element}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </Component>
  );
};

export default BlurTextReact;
