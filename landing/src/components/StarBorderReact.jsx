import React from 'react';

const StarBorderReact = ({
  as: Component = 'button',
  className = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  children,
  ...props
}) => {
  return (
    <Component
      className={`relative inline-block overflow-hidden !bg-transparent !border-none !rounded-[20px] cursor-pointer ${className}`}
      style={{ padding: `${thickness}px 0` }}
      {...props}
    >
      <div
        className="absolute w-[300%] h-[50%] opacity-100 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 20%)`,
          animationDuration: speed
        }}
      ></div>

      <div
        className="absolute w-[300%] h-[50%] opacity-100 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 20%)`,
          animationDuration: speed
        }}
      ></div>

      <div className="relative z-10 border border-brand-gold/30 bg-brand-black text-brand-beige text-[16px] font-bold text-center px-[64px] py-[24px] rounded-[20px] shadow-lg group-hover:bg-brand-black/90 transition-colors duration-300">
        {children}
      </div>
    </Component>
  );
};

export default StarBorderReact;
