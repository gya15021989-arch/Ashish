import React from 'react';
import { Radio, Zap } from 'lucide-react';

interface FloatingLiveMatchButtonProps {
  onOpenLiveScore: () => void;
}

export const FloatingLiveMatchButton: React.FC<FloatingLiveMatchButtonProps> = ({ onOpenLiveScore }) => {
  return (
    <button
      onClick={onOpenLiveScore}
      className="fixed bottom-24 right-5 z-30 group flex items-center gap-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white px-4 py-2.5 rounded-full shadow-2xl shadow-red-500/30 border border-red-400/40 transition-all hover:scale-105"
      title="Live Race Scoring Console"
    >
      <div className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </div>

      <div className="text-left">
        <div className="flex items-center gap-1">
          <Radio className="w-3.5 h-3.5" />
          <span className="text-xs font-black tracking-wider uppercase">LIVE SCORING</span>
        </div>
        <span className="text-[10px] text-amber-100 font-medium block leading-none">
          36th State Trials
        </span>
      </div>
    </button>
  );
};
