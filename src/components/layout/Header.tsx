import React, { useState } from 'react';
import { 
  Shield, 
  Award, 
  Calendar, 
  Trophy, 
  Radio, 
  User, 
  LogIn, 
  Menu, 
  X, 
  Globe, 
  CheckCircle2, 
  MapPin, 
  Users, 
  Sparkles,
  Search,
  Activity,
  ChevronDown,
  Key,
  ArrowRight,
  Phone,
  FileText
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { AccountDropdown } from './AccountDropdown';
import { UprsaLogo } from './UprsaLogo';
import { LiveTicker } from './LiveTicker';

interface HeaderProps {
  currentView?: string;
  activePage?: string;
  setCurrentView?: (view: string) => void;
  onNavigate?: (view: string) => void;
  onOpenLogin?: () => void;
  onOpenAdminLogin?: () => void;
  onOpenSkaterLogin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  activePage,
  setCurrentView,
  onNavigate,
  onOpenLogin,
  onOpenAdminLogin,
  onOpenSkaterLogin
}) => {
  const active = activePage || currentView || 'home';
  const navigate = (view: string) => {
    if (onNavigate) onNavigate(view);
    if (setCurrentView) setCurrentView(view);
  };

  const handleOpenLogin = () => {
    if (onOpenLogin) onOpenLogin();
    else if (onOpenSkaterLogin) onOpenSkaterLogin();
    else navigate('skater_login');
  };

  const handleOpenAdmin = () => {
    if (onOpenAdminLogin) onOpenAdminLogin();
    else if (onOpenLogin) onOpenLogin();
    else navigate('admin_login');
  };

  const { lang, setLang, t } = useLanguage();
  const { user, skater, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const displayName = skater 
    ? `${skater.firstName} ${skater.lastName}`
    : user?.name || (user?.email ? user.email.split('@')[0] : 'Athlete');

  interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
    alias?: string;
    badge?: string;
  }

  const navItems: NavItem[] = [
    { id: 'home', label: 'HOME', icon: Shield },
    { id: 'about', label: 'ABOUT US', icon: Award },
    { id: 'activities', label: 'DISCIPLINES', icon: Activity },
    { id: 'districts', label: 'DISTRICTS', icon: MapPin },
    { id: 'clubs', label: 'CLUBS', icon: Users },
    { id: 'tournaments', label: 'TOURNAMENTS', icon: Calendar },
    { id: 'results', label: 'RESULTS & LIVE', icon: Trophy },
    { id: 'rankings', label: 'RANKINGS', icon: Award },
    { id: 'register', label: 'REGISTRATION', icon: Shield, badge: '2026–27' },
    { id: 'skater_portal', label: 'SKATER PORTAL', icon: User },
    { id: 'news_gallery', alias: 'news-gallery', label: 'NEWS', icon: Sparkles },
    { id: 'contact', label: 'CONTACT', icon: Phone }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070d18] text-white shadow-2xl border-b border-amber-500/20">
      {/* 0. LIVE STREAMING / BREAKING RESULTS TICKER */}
      <LiveTicker onNavigate={navigate} />
      
      {/* ========================================================================= */}
      {/* 1. TOP BRANDING BAR (Organization Identity + RSFI Tag + Quick Actions) */}
      {/* ========================================================================= */}
      <div className="w-full bg-[#040811] border-b border-slate-800/90 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          
          {/* Left: Organization Authority Brand */}
          <div 
            onClick={() => navigate('home')}
            className="flex items-center gap-3.5 cursor-pointer group select-none w-full md:w-auto justify-between md:justify-start"
          >
            <div className="flex items-center gap-3">
              <UprsaLogo size="md" />

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-base sm:text-lg lg:text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors uppercase leading-none">
                    UTTAR PRADESH ROLLER SPORTS ASSOCIATION
                  </h1>
                </div>
                <p className="text-[11px] sm:text-xs text-amber-400/95 font-semibold tracking-wide mt-0.5 leading-tight">
                  STATE GOVERNING BODY FOR ROLLER SPORTS IN UTTAR PRADESH
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 hidden sm:flex">
                  <span className="text-emerald-400 font-bold">● RSFI AFFILIATED</span>
                  <span>•</span>
                  <span>ESTD. 1988</span>
                  <span>•</span>
                  <span>REG. UP/S/294</span>
                </div>
              </div>
            </div>

            {/* Mobile quick menu button right inside top bar */}
            <div className="flex xl:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-800/80 text-slate-200 hover:text-white hover:bg-slate-700 focus:outline-none cursor-pointer border border-slate-700"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {/* Verify Athlete ID */}
            <button
              onClick={() => navigate('verify_athlete')}
              className="text-slate-300 hover:text-amber-400 flex items-center gap-1.5 transition-colors text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-slate-900 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Verify Athlete ID</span>
            </button>

            <span className="text-slate-700">|</span>

            {/* Verify Certificate */}
            <button
              onClick={() => navigate('verify_cert')}
              className="text-slate-300 hover:text-emerald-400 flex items-center gap-1.5 transition-colors text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-slate-900 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verify Certificate</span>
            </button>

            <span className="text-slate-700">|</span>

            {/* Language Switch */}
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-xs">
              <Globe className="w-3 h-3 text-slate-400 ml-1.5 mr-1" />
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                  lang === 'en' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                  lang === 'hi' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Authentication Buttons */}
            {isAuthenticated ? (
              <div className="relative pl-2 border-l border-slate-800">
                <button
                  id="header-user-account-btn"
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="bg-[#0b1329] hover:bg-[#0f1b3b] text-white font-bold px-3 py-1.5 rounded-xl text-xs border border-amber-500/40 hover:border-amber-500 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-black">
                    <User className="w-3 h-3" />
                  </div>
                  <span className="text-amber-300 truncate max-w-[110px] text-xs">
                    {displayName}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-amber-400 transition-transform ${accountDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AccountDropdown
                  isOpen={accountDropdownOpen}
                  onClose={() => setAccountDropdownOpen(false)}
                  onNavigate={navigate}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <button
                  onClick={handleOpenLogin}
                  className="bg-[#0b1329] hover:bg-slate-800 text-slate-200 hover:text-white font-semibold px-3 py-1.5 rounded-lg text-xs border border-slate-700/80 hover:border-amber-500/40 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>Skater Sign In</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SECOND NAVIGATION BAR (All 12 Major State Routes + Register CTA) */}
      {/* ========================================================================= */}
      <div className="w-full bg-[#070d18] border-b border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14">
          
          {/* Main Desktop Navigation Items */}
          <nav className="hidden xl:flex items-center gap-1.5 flex-1 overflow-x-auto no-scrollbar py-1">
            {navItems.map((item) => {
              const isCurrent = active === item.id || (item.alias && active === item.alias);
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`relative px-3 py-2 rounded-lg text-xs font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isCurrent 
                      ? 'text-amber-400 bg-amber-500/10 border-b-2 border-amber-500 font-extrabold' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase leading-none">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Compact Nav for Large Screens (1024px to 1279px) */}
          <nav className="hidden lg:flex xl:hidden items-center gap-1 flex-1 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'home', label: 'HOME' },
              { id: 'about', label: 'ABOUT' },
              { id: 'activities', label: 'DISCIPLINES' },
              { id: 'districts', label: 'DISTRICTS' },
              { id: 'tournaments', label: 'TOURNAMENTS' },
              { id: 'results', label: 'RESULTS' },
              { id: 'rankings', label: 'RANKINGS' },
              { id: 'register', label: 'REGISTRATION' },
              { id: 'skater_portal', label: 'PORTAL' },
              { id: 'news_gallery', label: 'NEWS' }
            ].map((item) => {
              const isCurrent = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`relative px-2.5 py-1.5 rounded-md text-xs font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                    isCurrent 
                      ? 'text-amber-400 bg-amber-500/10 border-b-2 border-amber-500' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTA: REGISTER SKATER */}
          <div className="flex items-center gap-2.5 shrink-0 pl-3">
            <button
              id="header-register-skater-btn"
              onClick={() => navigate('register')}
              className="bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-4 sm:px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>REGISTER AS SKATER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MOBILE DRAWER MENU */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="xl:hidden w-full bg-[#070d18] border-b border-amber-500/30 px-4 pt-3 pb-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200">
          
          {/* Fast Navigation Grid */}
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isCurrent = active === item.id || (item.alias && active === item.alias);
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isCurrent 
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm' 
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Actions in Mobile Drawer */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={() => {
                navigate('register');
                setMobileMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>REGISTER AS SKATER (2026–27)</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  navigate('verify_athlete');
                  setMobileMenuOpen(false);
                }}
                className="bg-[#0b1329] text-slate-200 border border-amber-500/30 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Verify Athlete</span>
              </button>

              <button
                onClick={() => {
                  navigate('verify_cert');
                  setMobileMenuOpen(false);
                }}
                className="bg-[#0b1329] text-slate-200 border border-slate-700 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verify Cert</span>
              </button>
            </div>

            {isAuthenticated ? (
              <div className="p-3 bg-[#0b1329] border border-amber-500/30 rounded-2xl space-y-2">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{displayName}</p>
                    <p className="text-[10px] text-amber-400">{isAdmin ? 'State Admin' : 'Verified State Athlete'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      navigate('skater_portal');
                      setMobileMenuOpen(false);
                    }}
                    className="bg-amber-500 text-slate-950 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1"
                  >
                    <span>My Dashboard</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-red-400 bg-red-950/40 border border-red-500/20 py-2 rounded-xl text-xs font-bold"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  handleOpenLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#0b1329] text-slate-200 border border-slate-700 hover:border-amber-500/40 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Key className="w-4 h-4 text-amber-400" />
                <span>Skater Sign In / Portal</span>
              </button>
            )}
          </div>

        </div>
      )}

    </header>
  );
};
