import React, { useState, useEffect } from 'react';
import { Radio, ExternalLink, ChevronRight, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { TickerItem } from '../../types';

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

  const handleItemClick = (link?: string) => {
    if (!link || !onNavigate) return;
    onNavigate(link);
  };

  return (
    <div 
      className="w-full bg-[#050b18] border-b border-amber-500/20 text-xs py-1.5 px-3 sm:px-6 flex items-center overflow-hidden z-30 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center gap-3">
        {/* Live Indicator Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/20 border border-red-500/50 text-red-400 shrink-0 font-black tracking-wider uppercase text-[10px]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <Radio className="w-3 h-3 text-red-400" />
          <span className="leading-none">LIVE NOW</span>
        </div>

        {/* Scrolling Strip Container */}
        <div className="flex-1 overflow-hidden relative">
          <div 
            className={`flex items-center gap-8 whitespace-nowrap transition-transform ${
              isPaused ? '' : 'animate-marquee'
            }`}
            style={{
              animationDuration: `${Math.max(items.length * 12, 30)}s`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite'
            }}
          >
            {/* Duplicated list to create a seamless infinite loop */}
            {[...items, ...items].map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => handleItemClick(item.link)}
                className={`inline-flex items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer group py-0.5`}
              >
                <span className="text-[10px] font-black font-mono uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-400 group-hover:border-amber-500/50">
                  {item.tag}
                </span>
                <span className="font-medium text-slate-200 group-hover:text-amber-300 transition-colors text-[11px] sm:text-xs">
                  {item.title}
                </span>
                <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-colors" />
                <span className="text-slate-700 mx-2">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Quick Link */}
        <button
          onClick={() => onNavigate && onNavigate('live_score')}
          className="hidden md:flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 shrink-0 bg-slate-900/90 border border-amber-500/30 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
        >
          <span>Scoreboard</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
