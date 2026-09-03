import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Search, 
  Shield, 
  Sliders, 
  ArrowRight, 
  ExternalLink, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  Compass, 
  Zap, 
  Clock, 
  AlertTriangle,
  X,
  FileCheck,
  ChevronRight,
  Flame,
  Award,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ALL_14_OFFICIAL_DISCIPLINES, DetailedDiscipline } from '../../data/all14Disciplines';

interface ActivitiesProps {
  setCurrentView?: (view: string) => void;
  onNavigate?: (view: string) => void;
  onNavigateToTournaments?: () => void;
}

export const Activities: React.FC<ActivitiesProps> = ({ 
  setCurrentView, 
  onNavigate,
  onNavigateToTournaments 
}) => {
  const { lang, setLang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisciplineModal, setSelectedDisciplineModal] = useState<DetailedDiscipline | null>(null);

  const navigate = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    } else if (setCurrentView) {
      setCurrentView(view);
    } else if (view === 'tournaments' && onNavigateToTournaments) {
      onNavigateToTournaments();
    }
  };

  // Filter disciplines based on search query
  const filteredDisciplines = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return ALL_14_OFFICIAL_DISCIPLINES;

    return ALL_14_OFFICIAL_DISCIPLINES.filter((disc) => {
      const nameMatch = disc.name.toLowerCase().includes(q) || disc.hindiName.toLowerCase().includes(q);
      const descMatch = disc.description.toLowerCase().includes(q) || disc.hindiDescription.toLowerCase().includes(q);
      const eventMatch = disc.events.some((ev) => ev.toLowerCase().includes(q));
      const equipMatch = disc.equipmentSpecs.toLowerCase().includes(q);
      const badgeMatch = disc.recognitionBadge.toLowerCase().includes(q);
      return nameMatch || descMatch || eventMatch || equipMatch || badgeMatch;
    });
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#060b17] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* ==========================================
            1. PAGE HEADER - FEDERATION HERO SECTION
           ========================================== */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Small Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-blue-500/20 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-amber-500/10">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>🏆 WORLD SKATE & RSFI RECOGNIZED DISCIPLINES</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-tight">
            14 OFFICIAL ROLLER SPORTS DISCIPLINES
          </h1>

          {/* Subheading */}
          <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-normal">
            Technical regulations, equipment limits, rink standards, and championship events governed by UPRSA across all 75 districts of Uttar Pradesh.
          </p>

          {/* Language Selector + Professional Search Field */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            {/* Language Toggle */}
            <div className="inline-flex items-center p-1 bg-[#0b1329] border border-slate-700/80 rounded-xl shadow-inner shrink-0">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  lang === 'hi'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                हिन्दी (Hindi)
              </button>
            </div>

            {/* Search Input Field */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'hi' ? 'विधा या स्पर्धा खोजें...' : 'Search discipline or event...'}
                className="w-full bg-[#0b1329] border border-slate-700/80 focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 text-sm text-white placeholder-slate-400 rounded-xl pl-10 pr-10 py-2.5 outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Result Counter if searching */}
        {searchQuery && (
          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <span>
              Showing <strong className="text-amber-400">{filteredDisciplines.length}</strong> of 14 official disciplines matching &ldquo;{searchQuery}&rdquo;
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-amber-400 hover:underline font-semibold cursor-pointer"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* ==========================================
            2. DISCIPLINE LIST - LARGE HORIZONTAL CARDS
           ========================================== */}
        <div className="space-y-8">
          {filteredDisciplines.map((discipline) => {
            return (
              <div
                key={discipline.id}
                id={discipline.id}
                className="group bg-gradient-to-br from-[#0c162d] via-[#091224] to-[#060c1a] border border-amber-500/30 hover:border-amber-500/70 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-amber-500/10 flex flex-col lg:flex-row items-stretch"
              >
                {/* ------------------------------------------
                    LEFT SIDE: LARGE DISCIPLINE PHOTOGRAPH (40–45%)
                   ------------------------------------------ */}
                <div className="lg:w-[42%] relative overflow-hidden shrink-0 min-h-[280px] sm:min-h-[340px] lg:min-h-[420px] bg-[#040813]">
                  <img
                    src={discipline.imageUrl}
                    alt={discipline.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback image in case of network restriction
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  
                  {/* Subtle Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091224] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#091224]/30 lg:to-[#091224] pointer-events-none" />

                  {/* Top-Left Floating Federation Ribbon */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 bg-black/75 backdrop-blur-md border border-amber-500/40 text-amber-400 text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                      DISCIPLINE #{discipline.number}
                    </span>
                  </div>

                  {/* Bottom-Left Quick Watermark */}
                  <div className="absolute bottom-4 left-4 z-10 hidden sm:block">
                    <span className="text-[11px] font-mono tracking-widest text-slate-300/80 uppercase bg-slate-950/70 backdrop-blur-md px-2.5 py-0.5 rounded border border-slate-700/50">
                      UPRSA CODE • D-{discipline.number < 10 ? `0${discipline.number}` : discipline.number}
                    </span>
                  </div>
                </div>

                {/* ------------------------------------------
                    RIGHT SIDE: COMPLETE TECHNICAL INFORMATION
                   ------------------------------------------ */}
                <div className="lg:w-[58%] p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  
                  {/* Top Badges and Title */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-950/80 text-cyan-300 border border-cyan-500/40">
                        {discipline.recognitionBadge}
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> RSFI SANCTIONED
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight group-hover:text-amber-400 transition-colors">
                        {discipline.name}
                      </h2>
                      {lang === 'hi' && (
                        <p className="text-sm font-semibold text-amber-300/90">
                          {discipline.hindiName}
                        </p>
                      )}
                    </div>

                    {/* Short Description */}
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                      {lang === 'hi' ? discipline.hindiDescription : discipline.description}
                    </p>
                  </div>

                  {/* ------------------------------------------
                      EQUIPMENT SPECS & RINK STANDARD BOXES
                     ------------------------------------------ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    {/* Equipment Specs Box */}
                    <div className="bg-[#070e1e] border border-blue-900/50 rounded-2xl p-4 space-y-1.5 shadow-inner">
                      <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider">
                        <Sliders className="w-3.5 h-3.5" />
                        <span>EQUIPMENT SPECS</span>
                      </div>
                      <p className="text-slate-200 text-xs leading-snug font-medium">
                        {discipline.equipmentSpecs}
                      </p>
                    </div>

                    {/* Rink Standard Box */}
                    <div className="bg-[#070e1e] border border-blue-900/50 rounded-2xl p-4 space-y-1.5 shadow-inner">
                      <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
                        <Compass className="w-3.5 h-3.5" />
                        <span>RINK STANDARD</span>
                      </div>
                      <p className="text-slate-200 text-xs leading-snug font-medium">
                        {discipline.rinkStandard}
                      </p>
                    </div>
                  </div>

                  {/* ------------------------------------------
                      OFFICIAL STATE CHAMPIONSHIP EVENTS
                     ------------------------------------------ */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-300 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>OFFICIAL STATE CHAMPIONSHIP EVENTS</span>
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400">
                        {discipline.events.length} Events
                      </span>
                    </div>

                    {/* Event Pills */}
                    <div className="flex flex-wrap gap-2">
                      {discipline.events.map((eventName, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#0b162c] text-slate-200 border border-slate-700/80 hover:border-amber-500/50 hover:text-white transition-colors"
                        >
                          {eventName}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ------------------------------------------
                      ACTION BUTTONS & LINKS
                     ------------------------------------------ */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Primary Orange Registration Button */}
                    <button
                      type="button"
                      onClick={() => navigate('register')}
                      className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                    >
                      <span>REGISTER IN {discipline.name} →</span>
                    </button>

                    {/* Secondary Navigation & Rulebook Links */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => navigate('tournaments')}
                        className="text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>View Upcoming Trials</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-slate-700 hidden sm:inline">•</span>

                      <button
                        type="button"
                        onClick={() => setSelectedDisciplineModal(discipline)}
                        className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>View Discipline Rules →</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* No Results Message */}
        {filteredDisciplines.length === 0 && (
          <div className="text-center py-16 bg-[#0c162d] border border-slate-800 rounded-3xl p-8 space-y-4">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
            <h3 className="text-xl font-black text-white">No Disciplines Found</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              No roller sports discipline matched your query &ldquo;{searchQuery}&rdquo;. Try searching for &lsquo;Speed&rsquo;, &lsquo;Artistic&rsquo;, &lsquo;Hockey&rsquo;, or &lsquo;Slalom&rsquo;.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl cursor-pointer"
            >
              Reset Search Filter
            </button>
          </div>
        )}

        {/* ==========================================
            3. DISCIPLINE TECHNICAL RULES MODAL
           ========================================== */}
        {selectedDisciplineModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#091224] border border-amber-500/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedDisciplineModal(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 p-2 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="space-y-2 pr-10">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Shield className="w-3 h-3 text-amber-400" />
                  DISCIPLINE #{selectedDisciplineModal.number} • OFFICIAL TECHNICAL CODE
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase">
                  {selectedDisciplineModal.name}
                </h3>
                <p className="text-xs text-slate-400">
                  Governed by {selectedDisciplineModal.rules.governingBody}
                </p>
              </div>

              {/* Technical Matrix */}
              <div className="space-y-4 text-xs">
                <div className="bg-[#060c18] border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      Permitted Wheel Sizes & Limits
                    </span>
                    <span className="text-slate-200 font-medium text-xs">
                      {selectedDisciplineModal.rules.wheelLimit}
                    </span>
                  </div>

                  <div className="border-t border-slate-800/80 pt-2.5">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                      Eligible Age Divisions
                    </span>
                    <span className="text-slate-200 font-medium text-xs">
                      {selectedDisciplineModal.rules.ageCategories}
                    </span>
                  </div>

                  <div className="border-t border-slate-800/80 pt-2.5">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                      Mandatory Safety Gear Compliance
                    </span>
                    <span className="text-slate-200 font-medium text-xs">
                      {selectedDisciplineModal.rules.safetyGear}
                    </span>
                  </div>

                  <div className="border-t border-slate-800/80 pt-2.5">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      Official Timing & Scoring Protocols
                    </span>
                    <span className="text-slate-200 font-medium text-xs">
                      {selectedDisciplineModal.rules.scoringFormat}
                    </span>
                  </div>
                </div>

                {/* Important Federation Notice */}
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-amber-300 text-[11px] leading-relaxed">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    All skaters participating in official UPRSA state championship heats and district selection trials must present their equipment for mandatory technical gear inspection prior to entering the staging calling area.
                  </span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDisciplineModal(null);
                    navigate('register');
                  }}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Register in this Discipline →
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDisciplineModal(null)}
                  className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Close Rulebook
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
