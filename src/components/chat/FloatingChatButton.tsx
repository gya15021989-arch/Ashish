import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface FloatingChatButtonProps {
  onClick?: () => void;
  onOpen?: () => void;
  isOpen?: boolean;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick, onOpen, isOpen = false }) => {
  const handleClick = () => {
    if (onClick) onClick();
    else if (onOpen) onOpen();
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-6 right-5 z-40 group flex items-center gap-2 p-3.5 rounded-full shadow-2xl transition-all duration-300 cursor-pointer ${
        isOpen
          ? 'bg-slate-800 text-white border border-slate-700'
          : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-white shadow-blue-500/30 hover:scale-105 border border-white/20'
      }`}
      aria-label="UPRSA AI Assistant & Chat"
    >
      <div className="relative">
        <Bot className="w-6 h-6 text-white" />
        <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1 -right-1 animate-spin" />
      </div>
      <span className="hidden sm:inline font-bold text-xs pr-1">
        {isOpen ? 'Close' : 'AI Assistant'}
      </span>
    </button>
  );
};
