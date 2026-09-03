import React from 'react';

interface UprsaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  inverted?: boolean;
}

export const UprsaLogo: React.FC<UprsaLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  inverted = false
}) => {
  const sizeMap = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official UPRSA Shield Emblem Badge */}
      <div className={`relative ${sizeMap[size]} shrink-0 select-none group`}>
        {/* Outer Golden/Amber Ring with Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-[2px] shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
          {/* Inner Navy Shield Canvas */}
          <div className="w-full h-full bg-[#070d18] rounded-[14px] flex flex-col items-center justify-center p-1 relative overflow-hidden border border-amber-500/30">
            {/* Subtle Tricolor Arch Ribbon on Top */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-500 opacity-90" />
            
            {/* Roller Skate & Speed Wheel Vector */}
            <svg 
              viewBox="0 0 48 48" 
              className="w-full h-full drop-shadow-sm" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background Shield Outline */}
              <path 
                d="M24 4L38 9V22C38 31.5 32 39.5 24 43C16 39.5 10 31.5 10 22V9L24 4Z" 
                fill="#0a1428" 
                stroke="#f59e0b" 
                strokeWidth="1.5"
              />
              {/* Golden Speed Wing Lines */}
              <path 
                d="M14 18L24 13L34 18M16 23L24 19L32 23M18 28L24 25L30 28" 
                stroke="#fbbf24" 
                strokeWidth="1.2" 
                strokeLinecap="round"
              />
              {/* High-Performance 4 Inline Racing Wheels */}
              <circle cx="16" cy="33" r="2.8" fill="#f59e0b" stroke="#ffffff" strokeWidth="0.8" />
              <circle cx="21.3" cy="33" r="2.8" fill="#f59e0b" stroke="#ffffff" strokeWidth="0.8" />
              <circle cx="26.7" cy="33" r="2.8" fill="#f59e0b" stroke="#ffffff" strokeWidth="0.8" />
              <circle cx="32" cy="33" r="2.8" fill="#f59e0b" stroke="#ffffff" strokeWidth="0.8" />
              
              {/* Central Bold "UP" Monogram */}
              <text 
                x="24" 
                y="22" 
                fill="#ffffff" 
                fontSize="9" 
                fontWeight="900" 
                fontFamily="sans-serif" 
                textAnchor="middle"
                letterSpacing="0.5"
              >
                UP
              </text>
            </svg>
          </div>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-white font-sans">
              UPRSA
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded border border-amber-500/40 uppercase tracking-widest">
              2026–27
            </span>
          </div>
          <span className="text-xs font-bold text-slate-200 leading-tight">
            Uttar Pradesh Roller Sports Association
          </span>
          <span className="text-[10px] text-slate-400 font-medium leading-tight">
            State Governing Body for Roller Sports in Uttar Pradesh
          </span>
        </div>
      )}
    </div>
  );
};
