import React, { useRef, useEffect } from 'react';
import { 
  User, 
  Shield, 
  Trophy, 
  Award, 
  LogOut, 
  ChevronRight, 
  QrCode, 
  FileText, 
  CreditCard,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AccountDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export const AccountDropdown: React.FC<AccountDropdownProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { user, skater, isAdmin, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const displayName = skater 
    ? `${skater.firstName} ${skater.lastName}` 
    : user.name || (user.email.split('@')[0]);

  const displayEmail = skater?.email || user.email || 'athlete@uprsa.org';
  const skaterRegNo = skater?.registrationNumber || '';
  const isAthleteRole = user.role === 'skater' || !!skater;

  const handleItemClick = (page: string) => {
    onNavigate(page);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
    onNavigate('home');
  };

  return (
    <div 
      ref={dropdownRef}
      id="uprsa-account-dropdown"
      className="absolute right-0 top-full mt-3 w-80 sm:w-[340px] bg-[#0b1329] border border-amber-500/30 rounded-[20px] shadow-2xl shadow-black/90 text-white z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {/* Small top pointer arrow */}
      <div className="absolute right-6 -top-2 w-4 h-4 bg-[#0b1329] border-t border-l border-amber-500/30 rotate-45" />

      {/* Top Section: LOGGED IN AS */}
      <div className="p-4 sm:p-5 bg-gradient-to-b from-[#070e20] to-[#0b1329] border-b border-slate-800/80 relative">
        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block mb-1">
          LOGGED IN AS
        </span>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-indigo-700 p-0.5 shrink-0 shadow-md">
            {skater?.photoUrl ? (
              <img 
                src={skater.photoUrl} 
                alt={displayName} 
                className="w-full h-full object-cover rounded-[10px]"
              />
            ) : (
              <div className="w-full h-full bg-[#070d18] rounded-[10px] flex items-center justify-center text-amber-400 font-bold text-base">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="font-extrabold text-sm sm:text-base text-white truncate leading-tight">
              {displayName}
            </h4>
            <p className="text-[11px] text-slate-400 truncate leading-tight mt-0.5">
              {displayEmail}
            </p>
            {skaterRegNo && (
              <span className="inline-block mt-1 text-[10px] font-mono font-semibold text-amber-300/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {skaterRegNo}
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
          <span className="text-slate-400">Account Type:</span>
          <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] bg-[#070d18] px-2 py-0.5 rounded border border-amber-500/20">
            {isAdmin ? '🛡 State Official' : '⚡ Verified Athlete'}
          </span>
        </div>
      </div>

      {/* Menu Navigation Items */}
      <div className="p-2 space-y-1">
        {/* ITEM 1: Skater Dashboard */}
        {isAthleteRole && (
          <button
            type="button"
            id="menu-skater-dashboard"
            onClick={() => handleItemClick('skater_portal')}
            className="w-full p-2.5 rounded-xl hover:bg-slate-800/80 transition-all flex items-center justify-between group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                  My Skater Dashboard
                </p>
                <p className="text-[10px] text-slate-400">
                  Digital ID, Results & Certificates
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors shrink-0" />
          </button>
        )}

        {/* ITEM 2: Admin Portal - CRITICAL: Show ONLY if isAdmin */}
        {isAdmin && (
          <button
            type="button"
            id="menu-admin-portal"
            onClick={() => handleItemClick('admin')}
            className="w-full p-2.5 rounded-xl bg-indigo-950/30 hover:bg-indigo-950/70 border border-indigo-500/30 transition-all flex items-center justify-between group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Admin Portal
                </p>
                <p className="text-[10px] text-indigo-300/80">
                  State Officials Desk (CMS)
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        )}

        {/* Secondary Navigation Actions for Skater */}
        {isAthleteRole && (
          <>
            <button
              type="button"
              id="menu-tournament-entry"
              onClick={() => handleItemClick('tournament_entry')}
              className="w-full p-2.5 rounded-xl hover:bg-slate-800/80 transition-all flex items-center justify-between group cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    Tournament Entries
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Register for Upcoming State Races
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0" />
            </button>
          </>
        )}
      </div>

      {/* Logout Divider & Button */}
      <div className="p-2 pt-1 border-t border-slate-800/80 bg-[#070e20]">
        <button
          type="button"
          id="menu-logout-button"
          onClick={handleLogout}
          className="w-full p-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-transparent hover:border-red-500/30 transition-all flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>Sign Out ({isAdmin ? 'ADMIN' : 'SKATER'})</span>
        </button>
      </div>
    </div>
  );
};
