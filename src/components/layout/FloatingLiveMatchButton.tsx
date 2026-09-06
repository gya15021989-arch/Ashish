import React from 'react';
import { Radio, ExternalLink } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

interface FloatingLiveMatchButtonProps {
  onOpenLiveScore?: (targetPage?: string) => void;
}

export const FloatingLiveMatchButton: React.FC<FloatingLiveMatchButtonProps> = ({ onOpenLiveScore }) => {
  const { settings } = useSiteSettings();
  const widget = settings?.liveScoreWidget;

  // Check if disabled by Admin in CMS
  if (widget && widget.enabled === false) {
    return null;
  }

  const title = widget?.title || 'LIVE SCORING';
  const subtitle = widget?.subtitle || '36th State Trials';
  const badge = widget?.badge || 'LIVE NOW';
  const isExternal = widget?.actionType === 'external' && !!widget?.externalUrl;
  const positionClass = widget?.position === 'bottom-left' 
    ? 'fixed bottom-24 left-5' 
    : 'fixed bottom-24 right-5';
  const mobileClass = widget?.showOnMobile === false ? 'hidden sm:flex' : 'flex';
  const isPulse = widget?.pulseAnimation !== false;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isExternal && widget?.externalUrl) {
      const url = widget.externalUrl.startsWith('http') 
        ? widget.externalUrl 
        : `https://${widget.externalUrl}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (onOpenLiveScore) {
      onOpenLiveScore(widget?.targetPage || 'live_score');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${positionClass} ${mobileClass} z-30 group items-center gap-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white px-4 py-2.5 rounded-full shadow-2xl shadow-red-500/40 border border-red-400/50 transition-all duration-300 hover:scale-105 cursor-pointer active:scale-95`}
      title={`${title} • ${subtitle}`}
      id="floating-live-score-btn"
    >
      {isPulse && (
        <div className="relative flex h-3 w-3 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </div>
      )}

      <div className="text-left">
        <div className="flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
          <span className="text-xs font-black tracking-wider uppercase">
            {title}
          </span>
          {badge && (
            <span className="bg-white/20 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-tight">
              {badge}
            </span>
          )}
          {isExternal && <ExternalLink className="w-3 h-3 text-amber-200" />}
        </div>
        {subtitle && (
          <span className="text-[10px] text-amber-100 font-medium block leading-tight max-w-[170px] truncate">
            {subtitle}
          </span>
        )}
      </div>
    </button>
  );
};
