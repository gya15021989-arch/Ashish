import React, { useState, useEffect } from 'react';
import { Radio, ExternalLink, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';
import { TickerItem } from '../../types';
import { useSiteSettings } from '../../context/SiteSettingsContext';

interface LiveTickerProps {
  onNavigate?: (page: string) => void;
}

const DEFAULT_TICKER_ITEMS: TickerItem[] = [
  {
    id: 'tick-1',
    tag: 'LIVE RESULT',
    title: '36th UP State Championship: Heat 3 Sub-Junior 500m Speed — Abhishek Verma leads with 00:48.32',
    link: 'live_score',
    isActive: true,
    priority: 1
  },
  {
    id: 'tick-2',
    tag: 'REGISTRATION',
    title: 'Official RSFI Skater Affiliation & Digital Athlete ID registration for 2026–27 season is now OPEN across all 75 Districts.',
    link: 'register',
    isActive: true,
    priority: 2
  },
  {
    id: 'tick-3',
    tag: 'STATE TRIALS',
    title: 'Selection Trials for 63rd RSFI Nationals: Banked Track Speed & Freestyle Slalom at LDA Banked Track Arena, Lucknow.',
    link: 'tournaments',
    isActive: true,
    priority: 3
  },
  {
    id: 'tick-4',
    tag: 'CIRCULAR',
    title: 'RSFI Age Cut-off 2026 Mandate: District associations must authenticate birth certificates per official age brackets.',
    link: 'news_gallery',
    isActive: true,
    priority: 4
  }
];

export const LiveTicker: React.FC<LiveTickerProps> = ({ onNavigate }) => {
  const { settings } = useSiteSettings();
  const topConfig = settings?.topTickerConfig;

  const [items, setItems] = useState<TickerItem[]>(DEFAULT_TICKER_ITEMS);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    loadTicker();
  }, []);

  const loadTicker = async () => {
    try {
      const res = await api.getTickerItems();
      if (res.success && res.data && res.data.length > 0) {
        const active = res.data.filter(i => i.isActive);
        if (active.length > 0) {
          setItems(active);
        }
      }
    } catch (err) {
      // keep fallback
    }
  };

  // Check if top ticker is disabled in CMS
  if (topConfig && topConfig.enabled === false) {
    return null;
  }

  const badgeText = topConfig?.badgeText || 'LIVE NOW';
  const isBadgePulse = topConfig?.badgePulse !== false;
  const isBadgeExternal = topConfig?.badgeActionType === 'external' && !!topConfig?.badgeExternalUrl;

  const handleBadgeClick = () => {
    if (isBadgeExternal && topConfig?.badgeExternalUrl) {
      const url = topConfig.badgeExternalUrl.startsWith('http') 
        ? topConfig.badgeExternalUrl 
        : `https://${topConfig.badgeExternalUrl}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (onNavigate) {
      onNavigate(topConfig?.badgeTargetPage || 'live_score');
    }
  };

  const handleItemClick = (link?: string) => {
    if (!link) return;
    if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('www.')) {
      const url = link.startsWith('www.') ? `https://${link}` : link;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (onNavigate) {
      onNavigate(link);
    }
  };

  // Speed calculation
  const speed = topConfig?.scrollSpeed || 'medium';
  let speedMultiplier = 12;
  if (speed === 'slow') speedMultiplier = 18;
  if (speed === 'fast') speedMultiplier = 7;
  const animDuration = Math.max(items.length * speedMultiplier, speed === 'fast' ? 18 : 28);

  const pauseOnHover = topConfig?.pauseOnHover !== false;

  return (
    <div 
      className="w-full bg-[#050b18] border-b border-amber-500/20 text-xs py-1.5 px-3 sm:px-6 flex items-center overflow-hidden z-30 select-none"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      onTouchStart={() => pauseOnHover && setIsPaused(true)}
      onTouchEnd={() => pauseOnHover && setIsPaused(false)}
      id="top-live-ticker-strip"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center gap-3">
        {/* Live Indicator Badge (Clickable with Custom Link & Tooltip) */}
        <button
          type="button"
          onClick={handleBadgeClick}
          className="flex items-center gap-1.5 px-2.5 py-0.8 rounded-full bg-gradient-to-r from-red-600/30 via-rose-600/20 to-red-600/30 hover:from-red-600 hover:to-rose-600 border border-red-500/60 hover:border-red-400 text-red-400 hover:text-white shrink-0 font-black tracking-wider uppercase text-[10px] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-red-500/30 active:scale-95 group"
          title={`क्लिक करें: ${isBadgeExternal ? (topConfig?.badgeExternalUrl || 'External Live Link') : (topConfig?.badgeTargetPage || 'live_score')}`}
          id="top-live-now-badge-btn"
        >
          {isBadgePulse && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 group-hover:bg-white"></span>
            </span>
          )}
          <Radio className="w-3 h-3 text-red-400 group-hover:text-white" />
          <span className="leading-none">{badgeText}</span>
          {isBadgeExternal && <ExternalLink className="w-2.5 h-2.5 opacity-80" />}
        </button>

        {/* Scrolling Strip Container */}
        <div className="flex-1 overflow-hidden relative">
          <div 
            className={`flex items-center gap-8 whitespace-nowrap transition-transform ${
              isPaused ? '' : 'animate-marquee'
            }`}
            style={{
              animationDuration: `${animDuration}s`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite'
            }}
          >
            {/* Duplicated list to create a seamless infinite loop */}
            {[...items, ...items].map((item, idx) => {
              const isExt = item.link && (item.link.startsWith('http') || item.link.startsWith('www.'));
              return (
                <div
                  key={`${item.id}-${idx}`}
                  onClick={() => handleItemClick(item.link)}
                  className={`inline-flex items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer group py-0.5`}
                  title={`लिंक खोलें: ${item.link || 'Internal View'}`}
                >
                  <span className="text-[10px] font-black font-mono uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-400 group-hover:border-amber-500/50">
                    {item.tag || 'LIVE NOW'}
                  </span>
                  <span className="font-medium text-slate-200 group-hover:text-amber-300 transition-colors text-[11px] sm:text-xs">
                    {item.title}
                  </span>
                  {isExt ? (
                    <ExternalLink className="w-3 h-3 text-amber-400 opacity-80 group-hover:opacity-100" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-colors" />
                  )}
                  <span className="text-slate-700 mx-2">•</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
