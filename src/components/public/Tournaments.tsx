import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Trophy, 
  Download, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Radio, 
  Tag, 
  Users,
  ShieldCheck,
  FileText,
  Search,
  Building2,
  AlertCircle,
  ExternalLink,
  Phone,
  User,
  X,
  Flame,
  Award,
  ChevronRight
} from 'lucide-react';
import { Tournament, TournamentEvent } from '../../types';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { OFFICIAL_UPRSA_TOURNAMENTS } from '../../data/allTournamentsData';

interface TournamentsProps {
  setCurrentView?: (view: string) => void;
  onNavigate?: (view: string) => void;
  onOpenLiveScore?: () => void;
  onSelectTournamentForEntry?: (t: Tournament) => void;
  onEnterTournament?: (t?: Tournament) => void;
  onViewResults?: (tournamentId?: string) => void;
}

export const Tournaments: React.FC<TournamentsProps> = ({ 
  setCurrentView, 
  onNavigate,
  onOpenLiveScore,
  onSelectTournamentForEntry,
  onEnterTournament,
  onViewResults
}) => {
  const { lang, setLang } = useLanguage();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTournamentForModal, setSelectedTournamentForModal] = useState<Tournament | null>(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedDiscipline, setSelectedDiscipline] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const navigate = (view: string) => {
    if (onNavigate) onNavigate(view);
    if (setCurrentView) setCurrentView(view);
  };

  const handleOpenLive = () => {
    if (onOpenLiveScore) onOpenLiveScore();
    else navigate('live_score');
  };

  const handleResultsClick = (tournamentId?: string) => {
    if (onViewResults) {
      onViewResults(tournamentId);
    } else {
      navigate('results');
    }
  };

  const handleRegisterClick = (t: Tournament) => {
    if (onSelectTournamentForEntry) {
      onSelectTournamentForEntry(t);
    }
    if (onEnterTournament) {
      onEnterTournament(t);
    } else {
      navigate('tournament_entry');
    }
  };

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      const res = await api.getTournaments();
      if (res.success && res.data && res.data.length > 0) {
        // Merge API data with rich official mock dataset
        const merged = OFFICIAL_UPRSA_TOURNAMENTS.map(offT => {
          const apiMatch = res.data.find(t => t.id === offT.id || t.title.toLowerCase() === offT.title.toLowerCase());
          return apiMatch ? { ...offT, ...apiMatch } : offT;
        });

        // Add any additional DB tournaments not in official default list
        res.data.forEach(dbT => {
          if (!merged.some(m => m.id === dbT.id || m.title.toLowerCase() === dbT.title.toLowerCase())) {
            merged.push({
              ...dbT,
              category: dbT.category || 'DISTRICT CHAMPIONSHIP',
              year: dbT.year || new Date(dbT.startDate || '2026-01-01').getFullYear()
            });
          }
        });
        setTournaments(merged);
      } else {
        setTournaments(OFFICIAL_UPRSA_TOURNAMENTS);
      }
    } catch (e) {
      console.error('Failed to load tournaments:', e);
      setTournaments(OFFICIAL_UPRSA_TOURNAMENTS);
    } finally {
      setLoading(false);
    }
  };

  // Distinct Filter options
  const years = ['All', '2026', '2025'];
  
  const districts = ['All', ...Array.from(new Set(tournaments.map(t => t.district).filter(Boolean)))];

  const disciplineOptions = [
    'All',
    'Speed Skating (Inline)',
    'Speed Skating (Quad)',
    'Inline Freestyle',
    'Roller Hockey',
    'Artistic Skating',
    'Skateboarding'
  ];

  const statusOptions = [
    { value: 'All', label: 'All Status' },
    { value: 'open', label: 'Open for Registration' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'completed', label: 'Completed' }
  ];

  // Filter application
  const filtered = tournaments.filter(t => {
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || 
      t.title.toLowerCase().includes(q) ||
      (t.hindiTitle && t.hindiTitle.toLowerCase().includes(q)) ||
      t.district.toLowerCase().includes(q) ||
      t.venue.toLowerCase().includes(q) ||
      (t.category && t.category.toLowerCase().includes(q)) ||
      (t.organizer && t.organizer.toLowerCase().includes(q)) ||
      (t.contactPerson && t.contactPerson.toLowerCase().includes(q));

    const tYear = t.year ? String(t.year) : (t.startDate ? t.startDate.slice(0, 4) : '2026');
    const matchesYear = selectedYear === 'All' || tYear === selectedYear;

    const matchesDistrict = selectedDistrict === 'All' || t.district === selectedDistrict;

    const matchesDiscipline = selectedDiscipline === 'All' || 
      (t.disciplinesList && t.disciplinesList.some(d => d.toLowerCase().includes(selectedDiscipline.toLowerCase()))) ||
      (t.events && t.events.some(ev => ev.discipline.toLowerCase().includes(selectedDiscipline.toLowerCase())));

    const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;

    return matchesSearch && matchesYear && matchesDistrict && matchesDiscipline && matchesStatus;
  });

  const upcomingTournaments = filtered.filter(t => t.status === 'open' || t.status === 'upcoming' || t.status === 'in_progress');
  const pastTournaments = filtered.filter(t => t.status === 'completed' || t.status === 'cancelled');

  return (
    <div className="min-h-screen bg-[#050b18] text-slate-100 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ================================================== */}
        {/* 1. PAGE HEADER                                     */}
        {/* ================================================== */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          {/* Small Orange Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500/15 text-amber-400 px-4 py-1.5 rounded-full border border-amber-500/30 text-xs font-extrabold uppercase tracking-widest shadow-sm">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>OFFICIAL UPRSA TOURNAMENT CALENDAR</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-tight drop-shadow-sm">
            TOURNAMENTS &amp;<br className="hidden sm:inline" /> COMPETITIONS
          </h1>

          {/* Subheading */}
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto font-normal">
            Official state, district and championship competitions conducted under UPRSA across Uttar Pradesh.
          </p>

          {/* Language Switcher */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={() => setLang('en')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
                  : 'bg-[#0c162d] text-slate-300 hover:bg-[#132247] border border-blue-900/60'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                lang === 'hi'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
                  : 'bg-[#0c162d] text-slate-300 hover:bg-[#132247] border border-blue-900/60'
              }`}
            >
              हिन्दी (Hindi)
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* 2. FILTER / SEARCH BAR                             */}
        {/* ================================================== */}
        <div className="bg-[#0c162d] border border-blue-900/50 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
            {/* Search input with search icon */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tournaments, championships, venues..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#050b18] border border-blue-900/60 focus:border-amber-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5">
              {/* YEAR */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase hidden sm:inline">YEAR:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full sm:w-28 bg-[#050b18] border border-blue-900/60 focus:border-amber-500 rounded-xl px-2.5 py-2.5 text-xs text-slate-100 font-semibold focus:outline-none cursor-pointer"
                >
                  {years.map(y => (
                    <option key={y} value={y} className="bg-[#050b18] text-white">
                      {y === 'All' ? 'All Years' : y}
                    </option>
                  ))}
                </select>
              </div>

              {/* DISTRICT */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase hidden sm:inline">DISTRICT:</span>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full sm:w-40 bg-[#050b18] border border-blue-900/60 focus:border-amber-500 rounded-xl px-2.5 py-2.5 text-xs text-slate-100 font-semibold focus:outline-none cursor-pointer"
                >
                  {districts.map(d => (
                    <option key={d} value={d} className="bg-[#050b18] text-white">
                      {d === 'All' ? 'All Districts' : d}
                    </option>
                  ))}
                </select>
              </div>

              {/* DISCIPLINE */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase hidden sm:inline">DISCIPLINE:</span>
                <select
                  value={selectedDiscipline}
                  onChange={(e) => setSelectedDiscipline(e.target.value)}
                  className="w-full sm:w-44 bg-[#050b18] border border-blue-900/60 focus:border-amber-500 rounded-xl px-2.5 py-2.5 text-xs text-slate-100 font-semibold focus:outline-none cursor-pointer"
                >
                  {disciplineOptions.map(disc => (
                    <option key={disc} value={disc} className="bg-[#050b18] text-white">
                      {disc === 'All' ? 'All Disciplines' : disc}
                    </option>
                  ))}
                </select>
              </div>

              {/* STATUS */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase hidden sm:inline">STATUS:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full sm:w-36 bg-[#050b18] border border-blue-900/60 focus:border-amber-500 rounded-xl px-2.5 py-2.5 text-xs text-slate-100 font-semibold focus:outline-none cursor-pointer"
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-[#050b18] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter summary */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-blue-950/60">
            <span>
              Showing <strong className="text-amber-400">{filtered.length}</strong> official championships
            </span>
            {(search || selectedYear !== 'All' || selectedDistrict !== 'All' || selectedDiscipline !== 'All' || selectedStatus !== 'All') && (
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedYear('All');
                  setSelectedDistrict('All');
                  setSelectedDiscipline('All');
                  setSelectedStatus('All');
                }}
                className="text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="text-center py-24 space-y-3">
            <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-400 text-sm font-medium">Loading official championship calendar...</p>
          </div>
        ) : (
          <div className="space-y-12">

            {/* ================================================== */}
            {/* 9. UPCOMING TOURNAMENTS SECTION                     */}
            {/* ================================================== */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-blue-900/60 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                    UPCOMING TOURNAMENTS
                  </h2>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                  {upcomingTournaments.length} Upcoming Events
                </span>
              </div>

              {upcomingTournaments.length === 0 ? (
                <div className="bg-[#0c162d] border border-blue-900/40 rounded-2xl p-8 text-center text-slate-400 text-sm">
                  No upcoming championships match the selected filter criteria.
                </div>
              ) : (
                <div className="space-y-6">
                  {upcomingTournaments.map(t => renderTournamentCard(t))}
                </div>
              )}
            </div>

            {/* ================================================== */}
            {/* 10. COMPLETED / PAST TOURNAMENTS SECTION           */}
            {/* ================================================== */}
            <div className="space-y-6 pt-6">
              <div className="flex items-center justify-between border-b border-blue-900/60 pb-3">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                    PAST TOURNAMENTS &amp; RESULTS
                  </h2>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
                  {pastTournaments.length} Completed Championships
                </span>
              </div>

              {pastTournaments.length === 0 ? (
                <div className="bg-[#0c162d] border border-blue-900/40 rounded-2xl p-8 text-center text-slate-400 text-sm">
                  No past tournaments match the selected filter criteria.
                </div>
              ) : (
                <div className="space-y-6">
                  {pastTournaments.map(t => renderTournamentCard(t, true))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ================================================== */}
      {/* TOURNAMENT DETAILS MODAL                           */}
      {/* ================================================== */}
      {selectedTournamentForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0c162d] border border-blue-800/80 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative">
            <button
              onClick={() => setSelectedTournamentForModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase">
                  {selectedTournamentForModal.category || 'STATE CHAMPIONSHIP'}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {selectedTournamentForModal.edition}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {selectedTournamentForModal.title}
              </h2>
              {selectedTournamentForModal.hindiTitle && (
                <p className="text-sm text-slate-400 font-medium mt-1">
                  {selectedTournamentForModal.hindiTitle}
                </p>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#050b18] p-4 rounded-2xl border border-blue-900/40 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] font-bold uppercase">Dates</span>
                <span className="font-bold text-white text-xs">{selectedTournamentForModal.startDate}</span>
                <span className="text-[10px] text-slate-400 block">to {selectedTournamentForModal.endDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-bold uppercase">Registration</span>
                <span className="font-bold text-amber-400 text-xs">{selectedTournamentForModal.registrationDeadline}</span>
                <span className="text-[10px] text-slate-400 block">Strict cut-off</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-bold uppercase">Base Entry Fee</span>
                <span className="font-bold text-emerald-400 text-xs">₹{selectedTournamentForModal.entryFeeBase}</span>
                <span className="text-[10px] text-slate-400 block">Per Skater</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-bold uppercase">District</span>
                <span className="font-bold text-white text-xs">{selectedTournamentForModal.district}</span>
                <span className="text-[10px] text-slate-400 block">Uttar Pradesh</span>
              </div>
            </div>

            {/* Description & Overview */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                Overview &amp; Regulations
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-[#060e22] p-4 rounded-xl border border-blue-950">
                {selectedTournamentForModal.description}
              </p>
            </div>

            {/* Venue & Organizer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#060e22] p-4 rounded-xl border border-blue-950 space-y-1.5">
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">
                  VENUE &amp; TRACK
                </span>
                <p className="text-slate-200 font-semibold">{selectedTournamentForModal.venue}</p>
                <p className="text-slate-400 text-[11px]">{selectedTournamentForModal.district}, Uttar Pradesh</p>
              </div>

              <div className="bg-[#060e22] p-4 rounded-xl border border-blue-950 space-y-1.5">
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">
                  ORGANIZING COMMITTEE
                </span>
                <p className="text-slate-200 font-semibold">{selectedTournamentForModal.organizer}</p>
                <p className="text-slate-300 text-[11px] flex items-center gap-1.5">
                  <User className="w-3 h-3 text-slate-500" />
                  {selectedTournamentForModal.contactPerson}
                </p>
                <p className="text-amber-400 text-[11px] flex items-center gap-1.5 font-mono">
                  <Phone className="w-3 h-3 text-amber-400" />
                  {selectedTournamentForModal.contactPhone}
                </p>
              </div>
            </div>

            {/* Events / Brackets if available */}
            {selectedTournamentForModal.events && selectedTournamentForModal.events.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                  Events &amp; Age Categories ({selectedTournamentForModal.events.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {selectedTournamentForModal.events.map((ev, i) => (
                    <div key={ev.id || i} className="p-3 bg-[#050b18] rounded-xl border border-blue-900/40 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white block">{ev.eventName}</span>
                        <span className="text-[10px] text-slate-400">{ev.discipline} • {ev.ageCategory} ({ev.gender})</span>
                      </div>
                      <span className="font-mono text-amber-400 font-bold text-[11px]">₹{ev.entryFee}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenLive}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                  <span>Live Scoreboard</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedTournamentForModal(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 cursor-pointer"
                >
                  Close
                </button>
                {selectedTournamentForModal.status === 'open' ? (
                  <button
                    onClick={() => {
                      const t = selectedTournamentForModal;
                      setSelectedTournamentForModal(null);
                      handleRegisterClick(t);
                    }}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-6 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Register Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedTournamentForModal(null);
                      handleResultsClick(selectedTournamentForModal.id);
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View Results</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  {/* ================================================== */}
  {/* 3, 4, 5, 6, 7, 8. LARGE HORIZONTAL TOURNAMENT CARD  */}
  {/* ================================================== */}
  function renderTournamentCard(t: Tournament, isPast = false) {
    const isRegistrationOpen = t.status === 'open';
    const isUpcoming = t.status === 'upcoming';
    const isCompleted = t.status === 'completed' || isPast;

    const categoryBadge = t.category || (t.edition?.toLowerCase().includes('state') ? 'UPRSA STATE CHAMPIONSHIP' : 'DISTRICT CHAMPIONSHIP');
    
    // Status formatting
    let statusText = 'UPCOMING';
    let statusClasses = 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    if (isRegistrationOpen) {
      statusText = 'OPEN FOR REGISTRATION';
      statusClasses = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    } else if (isCompleted) {
      statusText = 'COMPLETED';
      statusClasses = 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }

    const disciplines = t.disciplinesList && t.disciplinesList.length > 0
      ? t.disciplinesList
      : (t.events && t.events.length > 0 
          ? Array.from(new Set(t.events.map(e => e.discipline))) 
          : ['Speed Skating (Inline)', 'Speed Skating (Quad)']);

    const ageGroups = t.ageGroups && t.ageGroups.length > 0
      ? t.ageGroups.join(' • ')
      : 'Cadet, Sub-Junior, Junior, Senior';

    return (
      <div
        key={t.id}
        className={`bg-gradient-to-r from-[#0e1a38] via-[#0b1630] to-[#081126] border ${
          isRegistrationOpen ? 'border-blue-800/80 hover:border-amber-500/60' : 'border-blue-900/40 hover:border-blue-700/60'
        } rounded-3xl p-5 sm:p-6 shadow-2xl transition-all duration-300 hover:shadow-blue-950/80 flex flex-col lg:flex-row gap-6 items-stretch justify-between`}
      >
        {/* ================================================== */}
        {/* LEFT: TOURNAMENT POSTER / IMAGE (approx 30-35%)    */}
        {/* ================================================== */}
        <div className="w-full lg:w-[32%] shrink-0 h-48 sm:h-56 lg:h-auto min-h-[200px] lg:min-h-[230px] rounded-2xl overflow-hidden bg-[#060c1d] border border-blue-950 relative group">
          {t.bannerUrl ? (
            <img
              src={t.bannerUrl}
              alt={t.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = parent.querySelector('.tour-fallback-banner');
                  if (fallback) fallback.classList.remove('hidden');
                }
              }}
            />
          ) : null}

          {/* Neutral Federation Fallback Poster */}
          <div className={`tour-fallback-banner w-full h-full flex flex-col items-center justify-center p-5 bg-gradient-to-br from-[#0e214d] to-[#060e22] text-center ${t.bannerUrl ? 'hidden' : ''}`}>
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3 shadow-inner">
              <Trophy className="w-7 h-7 text-amber-400" />
            </div>
            <span className="text-xs font-black text-white uppercase tracking-wider">UPRSA OFFICIAL CHAMPIONSHIP</span>
            <span className="text-[10px] text-slate-400 mt-1">Accredited State Championship Rink</span>
          </div>

          {/* Overlay Edition / Year Tag */}
          <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md border border-slate-700/60 px-2.5 py-1 rounded-lg text-[10px] font-extrabold text-slate-200">
            {t.year || 2026} CALENDAR
          </div>
        </div>

        {/* ================================================== */}
        {/* MIDDLE: TOURNAMENT INFORMATION                     */}
        {/* ================================================== */}
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            {/* TOP LEFT: CATEGORY BADGE & STATUS BADGE */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wide">
                {categoryBadge}
              </span>
              <span className={`border px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wide flex items-center gap-1 ${statusClasses}`}>
                {isRegistrationOpen && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                {isRegistrationOpen && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                <span>{statusText}</span>
              </span>
            </div>

            {/* TOURNAMENT NAME */}
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-snug tracking-tight hover:text-amber-400 transition-colors cursor-pointer"
                onClick={() => setSelectedTournamentForModal(t)}
              >
                {t.title}
              </h3>
              {t.hindiTitle && (
                <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
                  {t.hindiTitle}
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed font-normal">
              {t.description}
            </p>

            {/* Structured Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 pt-2 border-t border-slate-800/80 text-xs">
              {/* 📅 DATE */}
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong className="text-white font-semibold">{t.startDate}</strong> to <strong className="text-white font-semibold">{t.endDate}</strong>
                </span>
              </div>

              {/* 📍 VENUE */}
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">{t.venue}</span>
              </div>

              {/* 🏙 DISTRICT */}
              <div className="flex items-center gap-2 text-slate-300">
                <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>District: <strong className="text-white">{t.district}</strong></span>
              </div>

              {/* 👥 AGE GROUP */}
              <div className="flex items-center gap-2 text-slate-300">
                <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="truncate">Ages: <strong className="text-white">{ageGroups}</strong></span>
              </div>
            </div>

            {/* 🏆 DISCIPLINES */}
            <div className="pt-1.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mr-1">
                DISCIPLINES:
              </span>
              {disciplines.map((d, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-blue-950/90 text-cyan-300 border border-blue-800/60 px-2 py-0.5 rounded font-medium"
                >
                  {String(d)}
                </span>
              ))}
            </div>
          </div>

          {/* 7. REGISTRATION DEADLINE BAR */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <Clock className={`w-3.5 h-3.5 ${isRegistrationOpen ? 'text-amber-400' : 'text-slate-500'}`} />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                REGISTRATION DEADLINE:
              </span>
              <span className={`font-mono font-bold text-xs ${isRegistrationOpen ? 'text-amber-300' : 'text-slate-400'}`}>
                {t.registrationDeadline || 'Closed'}
              </span>
            </div>

            {t.totalAthletes && (
              <span className="text-[11px] text-slate-400 font-medium">
                <strong className="text-white">{t.totalAthletes}</strong> Registered Skaters
              </span>
            )}
          </div>
        </div>

        {/* ================================================== */}
        {/* RIGHT: REGISTRATION / ACTION PANEL                 */}
        {/* ================================================== */}
        <div className="w-full lg:w-48 shrink-0 flex flex-col justify-center items-stretch lg:items-end gap-3 pt-4 lg:pt-0 lg:pl-6 lg:border-l border-slate-800/80">
          {/* Base Fee Badge */}
          <div className="bg-[#060c1d] border border-blue-900/60 rounded-xl p-2.5 w-full text-center lg:text-right">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Base Entry Fee</span>
            <span className="text-base font-black text-amber-400 font-mono">
              ₹{t.entryFeeBase || 1000}
            </span>
            <span className="text-[9px] text-slate-500 block">Per Registered Athlete</span>
          </div>

          {/* Primary Action Button */}
          {isRegistrationOpen ? (
            <button
              onClick={() => handleRegisterClick(t)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-3 px-4 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer transform active:scale-95"
            >
              <span>REGISTER NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : isCompleted ? (
            <button
              onClick={() => handleResultsClick(t.id)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>VIEW RESULTS</span>
              <Trophy className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-slate-800 text-slate-400 font-bold text-xs py-3 px-4 rounded-xl border border-slate-700/50 flex items-center justify-center gap-1.5 cursor-not-allowed"
            >
              <span>OPENS SOON</span>
            </button>
          )}

          {/* Secondary Action Button / Details Link */}
          <button
            onClick={() => setSelectedTournamentForModal(t)}
            className="w-full bg-[#0c162d] hover:bg-[#132247] text-slate-300 hover:text-white border border-blue-900/60 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>VIEW DETAILS</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }
};
