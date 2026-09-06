import React, { useState } from 'react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useLanguage } from '../../context/LanguageContext';

interface UprsaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  inverted?: boolean;
  logoUrl?: string;
  logoShape?: 'shield' | 'circle' | 'rounded';
}

export const UprsaLogo: React.FC<UprsaLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  inverted = false,
  logoUrl: propLogoUrl,
  logoShape: propLogoShape
}) => {
  const { settings } = useSiteSettings();
  const { lang } = useLanguage();
  const isHindi = lang === 'hi';
  const [imageError, setImageError] = useState(false);

  const currentLogoUrl = propLogoUrl !== undefined ? propLogoUrl : settings?.logoUrl;
  const currentShape = propLogoShape || settings?.logoShape || 'shield';

  const sizeMap = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const displayName = isHindi 
    ? (settings?.organizationNameHindi || settings?.organizationName || 'उत्तर प्रदेश रोलर स्पोर्ट्स एसोसिएशन')
    : (settings?.organizationName || 'Uttar Pradesh Roller Sports Association');

  const displayTagline = isHindi
    ? (settings?.taglineHindi || settings?.tagline || 'स्टेट गवर्निंग बॉडी ऑफ रोलर स्पोर्ट्स इन उत्तर प्रदेश')
    : (settings?.tagline || 'State Governing Body for Roller Sports in Uttar Pradesh');

  const shapeClasses = {
    shield: 'rounded-2xl',
    circle: 'rounded-full',
    rounded: 'rounded-xl'
  };

  const innerShapeClasses = {
    shield: 'rounded-[14px]',
    circle: 'rounded-full',
    rounded: 'rounded-lg'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Association Logo Container */}
      <div className={`relative ${sizeMap[size]} shrink-0 select-none group`}>
        {/* Outer Golden/Amber Ring with Glow */}
        <div className={`absolute inset-0 ${shapeClasses[currentShape]} bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-[2px] shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform overflow-hidden`}>
          {/* Inner Navy Canvas */}
          <div className={`w-full h-full bg-[#070d18] ${innerShapeClasses[currentShape]} flex flex-col items-center justify-center p-1 relative overflow-hidden border border-amber-500/30`}>
            {/* Subtle Tricolor Arch Ribbon on Top */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-500 opacity-90 z-10" />
            
            {/* Custom Uploaded Logo Image */}
            {currentLogoUrl && !imageError ? (
              <img
                src={currentLogoUrl}
                alt={displayName}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-contain p-0.5"
              />
            ) : (
              /* High-Performance Official Roller Skate & Speed Wheel Vector Shield */
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
                
                {/* Central Bold Short Name */}
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
                  {settings?.shortName || 'UP'}
                </text>
              </svg>
            )}
          </div>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-white font-sans">
              {settings?.shortName || 'UPRSA'}
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded border border-amber-500/40 uppercase tracking-widest">
              2026–27
            </span>
          </div>
          <span className="text-xs font-bold text-slate-200 leading-tight">
            {displayName}
          </span>
          <span className="text-[10px] text-slate-400 font-medium leading-tight">
            {displayTagline}
          </span>
        </div>
      )}
    </div>
  );
};
