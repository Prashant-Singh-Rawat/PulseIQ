import React from 'react';

const Logo = ({ size = "text-2xl", iconSize = 24, showText = true }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className={`flex items-center justify-center animate-heartbeat shadow-[0_0_15px_rgba(0,255,255,0.4)] rounded-xl overflow-hidden`} style={{ width: iconSize * 1.5, height: iconSize * 1.5 }}>
        <img src="/logo.jpg" alt="Priocardix AI Logo" className="w-full h-full object-cover" />
      </div>
      {showText && <span className={`${size} font-heading font-bold tracking-wider text-white`}>Priocardix AI</span>}
    </div>
  );
};

export default Logo;
