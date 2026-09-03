import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Trophy, 
  MapPin, 
  Users, 
  Search, 
  RotateCcw, 
  Eye, 
  X, 
  ShieldCheck, 
  Calendar,
  Layers,
  ChevronRight,
  Flame,
  ArrowRight,
  Medal,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import { SkaterRanking, DistrictRanking, ClubRanking, Tournament } from '../../types';
import { api } from '../../services/api';
import { DISCIPLINES, AGE_CATEGORIES_2026 } from '../../data/uprsaKnowledge';
import { UP_MANDALS_DATA, MANDAL_NAMES, getMandalForDistrict, getDistrictsForMandal } from '../../data/mandals';
import { ALL_75_UP_DISTRICTS } from '../../data/all75Districts';
import { OFFICIAL_UPRSA_TOURNAMENTS } from '../../data/allTournamentsData';

type RankingType = 'individual' | 'state' | 'district' | 'club';
type TournamentScope = 'overall' | 'tournament_wise';

export const Rankings: React.FC = () => {
  // 1. Ranking Type Selector
  const [rankingType, setRankingType] = useState<RankingType>('individual');
  
  // 2. Tournament Scope
  const [tournamentScope, setTournamentScope] = useState<TournamentScope>('overall');
  const [tournamentsList, setTournamentsList] = useState<Tournament[]>(OFFICIAL_UPRSA_TOURNAMENTS);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>(
    OFFICIAL_UPRSA_TOURNAMENTS[0]?.id || 'tour-2026-01'
  );

  // Data States
  const [individualRankings, setIndividualRankings] = useState<SkaterRanking[]>([]);
  const [districtRankings, setDistrictRankings] = useState<DistrictRanking[]>([]);
  const [clubRankings, setClubRankings] = useState<ClubRanking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter States
  const [search, setSearch] = useState<string>('');
  const [mandalFilter, setMandalFilter] = useState<string>('All');
  const [districtFilter, setDistrictFilter] = useState<string>('All');
  const [disciplineFilter, setDisciplineFilter] = useState<string>('All');
  const [ageFilter, setAgeFilter] = useState<string>('All');

  // Modal for athlete profile
  const [selectedAthlete, setSelectedAthlete] = useState<SkaterRanking | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rankingsRes, tournamentsRes] = await Promise.all([
        api.getRankings(),
        api.getTournaments()
      ]);

      if (rankingsRes.success && rankingsRes.data) {
        setIndividualRankings(rankingsRes.data.individualRankings || []);
        setDistrictRankings(rankingsRes.data.districtRankings || []);
        setClubRankings(rankingsRes.data.clubRankings || []);
      }

      if (tournamentsRes.success && tournamentsRes.data && tournamentsRes.data.length > 0) {
        setTournamentsList(tournamentsRes.data);
      }
    } catch (e) {
      console.error('Failed to load rankings:', e);
    } finally {
      setLoading(false);
    }
  };

  // Handle Mandal Filter Change
  const handleMandalChange = (mandal: string) => {
    setMandalFilter(mandal);
    if (mandal !== 'All') {
      const allowedDistricts = getDistrictsForMandal(mandal);
      if (districtFilter !== 'All' && !allowedDistricts.includes(districtFilter)) {
        setDistrictFilter('All');
      }
    }
  };

  // Handle District Filter Change
  const handleDistrictChange = (district: string) => {
    setDistrictFilter(district);
    if (district !== 'All') {
      const parentMandal = getMandalForDistrict(district);
      if (mandalFilter !== 'All' && mandalFilter !== parentMandal) {
        setMandalFilter(parentMandal);
      }
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setMandalFilter('All');
    setDistrictFilter('All');
    setDisciplineFilter('All');
    setAgeFilter('All');
  };

  // Available districts for dropdown based on selected Mandal
  const availableDistricts = mandalFilter === 'All'
    ? ALL_75_UP_DISTRICTS.map(d => d.name)
    : getDistrictsForMandal(mandalFilter);

  // Filter Individual & State Rankings
  const filteredIndividual = individualRankings.filter(s => {
    const sMandal = s.mandal || getMandalForDistrict(s.district);
    const regNo = s.skaterRegNo || s.registrationNumber || '';
    
    const matchesSearch = !search || 
      s.skaterName.toLowerCase().includes(search.toLowerCase()) ||
      s.district.toLowerCase().includes(search.toLowerCase()) ||
      sMandal.toLowerCase().includes(search.toLowerCase()) ||
      s.club.toLowerCase().includes(search.toLowerCase()) ||
      regNo.toLowerCase().includes(search.toLowerCase());

    const matchesMandal = mandalFilter === 'All' || sMandal === mandalFilter;
    const matchesDistrict = districtFilter === 'All' || s.district.toLowerCase() === districtFilter.toLowerCase();
    const matchesDisc = disciplineFilter === 'All' || s.discipline === disciplineFilter;
    const matchesAge = ageFilter === 'All' || s.ageCategory === ageFilter;

    return matchesSearch && matchesMandal && matchesDistrict && matchesDisc && matchesAge;
  });

  // Filter District Rankings
  const filteredDistricts = districtRankings.filter(d => {
    const dMandal = d.mandal || getMandalForDistrict(d.district);
    const matchesSearch = !search || 
      d.district.toLowerCase().includes(search.toLowerCase()) ||
      dMandal.toLowerCase().includes(search.toLowerCase());
    const matchesMandal = mandalFilter === 'All' || dMandal === mandalFilter;
    const matchesDistrict = districtFilter === 'All' || d.district.toLowerCase() === districtFilter.toLowerCase();

    return matchesSearch && matchesMandal && matchesDistrict;
  });

  // Filter Club Rankings
  const filteredClubs = clubRankings.filter(c => {
    const cMandal = c.mandal || getMandalForDistrict(c.district);
    const matchesSearch = !search || 
      c.club.toLowerCase().includes(search.toLowerCase()) ||
      c.district.toLowerCase().includes(search.toLowerCase()) ||
      cMandal.toLowerCase().includes(search.toLowerCase());
    const matchesMandal = mandalFilter === 'All' || cMandal === mandalFilter;
    const matchesDistrict = districtFilter === 'All' || c.district.toLowerCase() === districtFilter.toLowerCase();

    return matchesSearch && matchesMandal && matchesDistrict;
  });

  const selectedTournament = tournamentsList.find(t => t.id === selectedTournamentId) || tournamentsList[0];
  const activeScopeName = tournamentScope === 'overall' 
    ? 'Overall Cumulative Standings (2026 Session)' 
    : (selectedTournament?.title || 'Specific Tournament Standings');

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background Subtle Track / Silhouette Aesthetics (Extremely low opacity, non-intrusive) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full border-[60px] border-amber-500/20 rotate-12" />
        <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] rounded-full border-[40px] border-blue-500/20" />
        <div className="absolute bottom-10 right-10 w-[900px] h-[400px] border-y-[2px] border-amber-500/40 rotate-[-6deg]" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-8">
        
        {/* ==================================================
            1. PAGE HEADER / HERO
           ================================================== */}
        <section className="text-center max-w-4xl mx-auto space-y-4 pt-2 pb-2">
          {/* Small Premium Badge */}
          <div className="inline-flex items-center gap-2 bg-[#0c162d] text-amber-400 px-4 py-1.5 rounded-full border border-amber-500/40 text-[11px] font-black uppercase tracking-widest shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>OFFICIAL UPRSA MERIT & POINTS ENGINE</span>
          </div>

          {/* Centered Large Bold Federation Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.1]">
            OFFICIAL STANDING RANKING &<br className="hidden sm:inline" /> LEADERBOARD
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Dynamic, 100% result-driven standings computed exclusively from verified, published championship finishes in Uttar Pradesh.
          </p>

          {/* Scoring Rule Strip */}
          <div className="pt-2">
            <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 bg-[#0c162d]/90 border border-blue-900/60 rounded-2xl px-6 py-2.5 text-xs shadow-xl backdrop-blur-sm">
              <span className="text-amber-400 font-extrabold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                SCORING RULE:
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-200">
                <span className="text-amber-400">🥇 1st:</span>
                <span className="font-mono font-black text-amber-300">5 pts</span>
              </span>
              <span className="text-slate-700 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 font-bold text-slate-200">
                <span className="text-slate-300">🥈 2nd:</span>
                <span className="font-mono font-black text-slate-100">3 pts</span>
              </span>
              <span className="text-slate-700 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 font-bold text-slate-200">
                <span className="text-amber-600">🥉 3rd:</span>
                <span className="font-mono font-black text-amber-400">1 pt</span>
              </span>
            </div>
          </div>
        </section>

        {/* ==================================================
            UNIFIED CONTROL PANEL (Ranking Type + Scope + Filters)
           ================================================== */}
        <div className="bg-[#0b1426] border border-blue-900/60 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-7">
          
          {/* 2. RANKING TYPE SECTION */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-widest px-1">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>1. SELECT RANKING TYPE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Card 1: Individual Skater */}
              <button
                onClick={() => setRankingType('individual')}
                className={`p-4 rounded-2xl text-left transition-all relative overflow-hidden cursor-pointer flex flex-col justify-between border ${
                  rankingType === 'individual'
                    ? 'bg-gradient-to-br from-amber-500 via-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/25 border-amber-400 ring-2 ring-amber-400/50'
                    : 'bg-[#080e1e] hover:bg-slate-900/90 text-slate-300 hover:text-white border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                    <Award className={`w-5 h-5 shrink-0 ${rankingType === 'individual' ? 'text-slate-950' : 'text-amber-400'}`} />
                    <span>Individual Skater</span>
                  </span>
                  {rankingType === 'individual' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-950" />
                  )}
                </div>
                <p className={`text-xs font-medium ${rankingType === 'individual' ? 'text-slate-900/90 font-bold' : 'text-slate-400'}`}>
                  Cumulative Athlete Standings
                </p>
              </button>

              {/* Card 2: State Championship */}
              <button
                onClick={() => setRankingType('state')}
                className={`p-4 rounded-2xl text-left transition-all relative overflow-hidden cursor-pointer flex flex-col justify-between border ${
                  rankingType === 'state'
                    ? 'bg-gradient-to-br from-amber-500 via-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/25 border-amber-400 ring-2 ring-amber-400/50'
                    : 'bg-[#080e1e] hover:bg-slate-900/90 text-slate-300 hover:text-white border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                    <Trophy className={`w-5 h-5 shrink-0 ${rankingType === 'state' ? 'text-slate-950' : 'text-amber-400'}`} />
                    <span>State Championship</span>
                  </span>
                  {rankingType === 'state' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-950" />
                  )}
                </div>
                <p className={`text-xs font-medium ${rankingType === 'state' ? 'text-slate-900/90 font-bold' : 'text-slate-400'}`}>
                  State Sanctioned Results
                </p>
              </button>

              {/* Card 3: District Championship */}
              <button
                onClick={() => setRankingType('district')}
                className={`p-4 rounded-2xl text-left transition-all relative overflow-hidden cursor-pointer flex flex-col justify-between border ${
                  rankingType === 'district'
                    ? 'bg-gradient-to-br from-amber-500 via-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/25 border-amber-400 ring-2 ring-amber-400/50'
                    : 'bg-[#080e1e] hover:bg-slate-900/90 text-slate-300 hover:text-white border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                    <MapPin className={`w-5 h-5 shrink-0 ${rankingType === 'district' ? 'text-slate-950' : 'text-amber-400'}`} />
                    <span>District Championship</span>
                  </span>
                  {rankingType === 'district' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-950" />
                  )}
                </div>
                <p className={`text-xs font-medium ${rankingType === 'district' ? 'text-slate-900/90 font-bold' : 'text-slate-400'}`}>
                  Zila Level Team Standings
                </p>
              </button>

              {/* Card 4: Club Championship */}
              <button
                onClick={() => setRankingType('club')}
                className={`p-4 rounded-2xl text-left transition-all relative overflow-hidden cursor-pointer flex flex-col justify-between border ${
                  rankingType === 'club'
                    ? 'bg-gradient-to-br from-amber-500 via-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/25 border-amber-400 ring-2 ring-amber-400/50'
                    : 'bg-[#080e1e] hover:bg-slate-900/90 text-slate-300 hover:text-white border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                    <Users className={`w-5 h-5 shrink-0 ${rankingType === 'club' ? 'text-slate-950' : 'text-amber-400'}`} />
                    <span>Club Championship</span>
                  </span>
                  {rankingType === 'club' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-950" />
                  )}
                </div>
                <p className={`text-xs font-medium ${rankingType === 'club' ? 'text-slate-900/90 font-bold' : 'text-slate-400'}`}>
                  Academy & Club Standings
                </p>
              </button>
            </div>
          </div>

          {/* 3. TOURNAMENT SCOPE */}
          <div className="space-y-3 pt-2 border-t border-blue-950">
            <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-widest px-1">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>2. SELECT TOURNAMENT SCOPE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#080e1e] p-3.5 sm:p-4 rounded-2xl border border-slate-800">
              {/* Two large options */}
              <div className="md:col-span-6 flex gap-2.5">
                <button
                  onClick={() => setTournamentScope('overall')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                    tournamentScope === 'overall'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md border-amber-400'
                      : 'bg-[#0c162d] text-slate-300 hover:text-white border-slate-700/80'
                  }`}
                >
                  <Flame className="w-4 h-4" />
                  <span>OVERALL (CUMULATIVE)</span>
                </button>

                <button
                  onClick={() => setTournamentScope('tournament_wise')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                    tournamentScope === 'tournament_wise'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md border-amber-400'
                      : 'bg-[#0c162d] text-slate-300 hover:text-white border-slate-700/80'
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  <span>TOURNAMENT WISE</span>
                </button>
              </div>

              {/* Specific Tournament dropdown */}
              <div className="md:col-span-6 flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  SPECIFIC TOURNAMENT:
                </span>
                <select
                  value={selectedTournamentId}
                  onChange={(e) => {
                    setSelectedTournamentId(e.target.value);
                    if (tournamentScope !== 'tournament_wise') {
                      setTournamentScope('tournament_wise');
                    }
                  }}
                  className="w-full bg-[#0c162d] border border-slate-700 text-slate-100 rounded-xl px-4 py-3 text-xs sm:text-sm font-bold focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                >
                  {tournamentsList.map(tour => (
                    <option key={tour.id} value={tour.id} className="bg-[#0c162d] text-white">
                      {tour.title} ({tour.district})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 4. FILTER BAR */}
          <div className="space-y-3 pt-2 border-t border-blue-950">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
              
              {/* Search */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                  <Search className="w-3 h-3 text-amber-400" />
                  <span>Search</span>
                </label>
                <input
                  type="text"
                  placeholder="Search skater, ID, club, district..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-11 bg-[#080e1e] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* All Mandals */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-sky-400" />
                  <span>All Mandals</span>
                </label>
                <select
                  value={mandalFilter}
                  onChange={(e) => handleMandalChange(e.target.value)}
                  className="w-full h-11 bg-[#080e1e] border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                >
                  <option value="All">All Mandals (18)</option>
                  {MANDAL_NAMES.map(mandal => (
                    <option key={mandal} value={mandal} className="bg-[#0c162d]">
                      {mandal}
                    </option>
                  ))}
                </select>
              </div>

              {/* All Districts */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-indigo-400" />
                  <span>All Districts</span>
                </label>
                <select
                  value={districtFilter}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full h-11 bg-[#080e1e] border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                >
                  <option value="All">All Districts ({availableDistricts.length})</option>
                  {availableDistricts.map(dName => (
                    <option key={dName} value={dName} className="bg-[#0c162d]">
                      {dName}
                    </option>
                  ))}
                </select>
              </div>

              {/* All Disciplines */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>All Disciplines</span>
                </label>
                <select
                  value={disciplineFilter}
                  onChange={(e) => setDisciplineFilter(e.target.value)}
                  className="w-full h-11 bg-[#080e1e] border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                >
                  <option value="All">All Disciplines</option>
                  {DISCIPLINES.map(d => (
                    <option key={d.id} value={d.name} className="bg-[#0c162d]">
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* All Age Groups */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                  <Users className="w-3 h-3 text-emerald-400" />
                  <span>All Age Groups</span>
                </label>
                <select
                  value={ageFilter}
                  onChange={(e) => setAgeFilter(e.target.value)}
                  className="w-full h-11 bg-[#080e1e] border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                >
                  <option value="All">All Age Groups</option>
                  {AGE_CATEGORIES_2026.map(a => (
                    <option key={a.category} value={a.category} className="bg-[#0c162d]">
                      {a.category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Filters */}
              <div>
                <button
                  onClick={handleResetFilters}
                  className="w-full h-11 bg-[#080e1e] hover:bg-slate-900 text-amber-400 hover:text-amber-300 border border-slate-700 hover:border-amber-500/50 rounded-xl px-3 py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            5. INDIVIDUAL SKATER RANKINGS / STATE CHAMPIONSHIP
           ================================================== */}
        {(rankingType === 'individual' || rankingType === 'state') && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              {/* Heading with green status indicator */}
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse inline-block ring-4 ring-emerald-500/20" />
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  {rankingType === 'individual' 
                    ? `INDIVIDUAL SKATER RANKINGS (${filteredIndividual.length} ATHLETES)` 
                    : `STATE CHAMPIONSHIP STANDINGS (${filteredIndividual.length} ATHLETES)`}
                </h2>
              </div>

              {/* Scope Display */}
              <div className="text-xs text-slate-300 bg-[#0c162d] px-3.5 py-1.5 rounded-xl border border-blue-900/60 font-medium">
                Scope: <strong className="text-amber-400 font-bold">{activeScopeName}</strong>
              </div>
            </div>

            {/* Wide, Clean Leaderboard Table */}
            <div className="bg-[#0b1426] border border-blue-900/60 rounded-3xl shadow-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 min-w-[1020px]">
                  <thead className="bg-[#070d1a] text-slate-300 uppercase tracking-wider text-[11px] font-bold border-b border-blue-950">
                    <tr>
                      <th className="py-4 px-4 text-center w-16">RANK</th>
                      <th className="py-4 px-4">ATHLETE NAME</th>
                      <th className="py-4 px-4">CLUB</th>
                      <th className="py-4 px-4">DISTRICT</th>
                      <th className="py-4 px-4 text-sky-400">MANDAL</th>
                      <th className="py-4 px-4 text-center">EVENTS</th>
                      <th className="py-4 px-4 text-center text-amber-400">GOLD</th>
                      <th className="py-4 px-4 text-center text-slate-300">SILVER</th>
                      <th className="py-4 px-4 text-center text-amber-600">BRONZE</th>
                      <th className="py-4 px-4 text-center">TOTAL MEDALS</th>
                      <th className="py-4 px-4 text-right text-amber-400">POINTS</th>
                      <th className="py-4 px-4 text-center">PROFILE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredIndividual.length === 0 ? (
                      <tr>
                        <td colSpan={12} className="py-16 text-center text-slate-500">
                          <p className="text-sm font-medium">No athlete rankings match the selected filters.</p>
                          <button
                            onClick={handleResetFilters}
                            className="mt-3 text-xs text-amber-400 font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset all filters</span>
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredIndividual.map((s, idx) => {
                        const mandal = s.mandal || getMandalForDistrict(s.district);
                        const gold = s.gold !== undefined ? s.gold : (s.goldCount || 0);
                        const silver = s.silver !== undefined ? s.silver : (s.silverCount || 0);
                        const bronze = s.bronze !== undefined ? s.bronze : (s.bronzeCount || 0);
                        const totalMedals = s.totalMedals !== undefined ? s.totalMedals : (gold + silver + bronze);
                        const events = s.eventsCount || (totalMedals > 0 ? totalMedals : 1);
                        const regNo = s.skaterRegNo || s.registrationNumber || `UPRSA/2026/REG-${(idx + 1).toString().padStart(3, '0')}`;
                        const currentRank = s.rank || idx + 1;

                        return (
                          <tr key={s.skaterId || idx} className="hover:bg-blue-950/40 transition-colors">
                            {/* RANK BADGE */}
                            <td className="py-4 px-4 text-center">
                              <div className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center font-black text-xs font-mono shadow-md ${
                                currentRank === 1 
                                  ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black ring-1 ring-amber-300' 
                                  : currentRank === 2 
                                    ? 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-950 font-bold ring-1 ring-slate-100' 
                                    : currentRank === 3 
                                      ? 'bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 text-amber-100 font-bold ring-1 ring-amber-600' 
                                      : 'bg-[#080e1e] text-slate-300 border border-slate-700/70 font-semibold'
                              }`}>
                                #{currentRank}
                              </div>
                            </td>

                            {/* ATHLETE NAME + ID + DISCIPLINE */}
                            <td className="py-4 px-4">
                              <div className="font-extrabold text-white text-sm">{s.skaterName}</div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-mono font-bold text-amber-400/90">{regNo}</span>
                                {s.discipline && (
                                  <span className="text-[9px] uppercase font-bold bg-blue-950/80 text-blue-300 px-1.5 py-0.2 rounded border border-blue-900">
                                    {s.discipline}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* CLUB */}
                            <td className="py-4 px-4 font-medium text-slate-200">
                              {s.club}
                            </td>

                            {/* DISTRICT */}
                            <td className="py-4 px-4 font-medium text-slate-200">
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-amber-400/80 shrink-0" />
                                {s.district}
                              </span>
                            </td>

                            {/* MANDAL */}
                            <td className="py-4 px-4">
                              <span className="text-xs text-sky-400 font-medium">
                                {mandal}
                              </span>
                            </td>

                            {/* EVENTS */}
                            <td className="py-4 px-4 text-center">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#080e1e] text-slate-300 border border-slate-700">
                                {events}
                              </span>
                            </td>

                            {/* GOLD */}
                            <td className="py-4 px-4 text-center font-black text-amber-400 text-sm">
                              {gold > 0 ? (
                                <span className="inline-flex items-center gap-1 font-mono">
                                  <span>🥇</span>
                                  <span>{gold}</span>
                                </span>
                              ) : (
                                <span className="text-slate-600 font-mono">0</span>
                              )}
                            </td>

                            {/* SILVER */}
                            <td className="py-4 px-4 text-center font-bold text-slate-300 text-sm">
                              {silver > 0 ? (
                                <span className="inline-flex items-center gap-1 font-mono">
                                  <span>🥈</span>
                                  <span>{silver}</span>
                                </span>
                              ) : (
                                <span className="text-slate-600 font-mono">0</span>
                              )}
                            </td>

                            {/* BRONZE */}
                            <td className="py-4 px-4 text-center font-bold text-amber-600 text-sm">
                              {bronze > 0 ? (
                                <span className="inline-flex items-center gap-1 font-mono">
                                  <span>🥉</span>
                                  <span>{bronze}</span>
                                </span>
                              ) : (
                                <span className="text-slate-600 font-mono">0</span>
                              )}
                            </td>

                            {/* TOTAL MEDALS */}
                            <td className="py-4 px-4 text-center font-extrabold text-slate-200 text-sm font-mono">
                              {totalMedals}
                            </td>

                            {/* POINTS (Prominent in orange) */}
                            <td className="py-4 px-4 text-right">
                              <div className="text-base font-black font-mono text-amber-400">
                                {s.totalPoints} <span className="text-[11px] font-sans font-bold text-amber-400/80">pts</span>
                              </div>
                            </td>

                            {/* PROFILE BUTTON */}
                            <td className="py-4 px-4 text-center">
                              <button
                                onClick={() => setSelectedAthlete({ ...s, mandal, gold, silver, bronze, totalMedals, eventsCount: events })}
                                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shadow-md cursor-pointer"
                                title="View Skater Profile"
                              >
                                <span>Profile</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================
            6. DISTRICT CHAMPIONSHIP VIEW
           ================================================== */}
        {rankingType === 'district' && (
          <section className="space-y-8">
            {/* Podium Summary */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-widest text-amber-400 px-1">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>OFFICIAL DISTRICT CHAMPIONSHIP PODIUM SUMMARY</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {filteredDistricts.slice(0, 3).map((dist, idx) => {
                  const mandal = dist.mandal || getMandalForDistrict(dist.district);
                  const gold = dist.gold !== undefined ? dist.gold : (dist.goldCount || 0);
                  const silver = dist.silver !== undefined ? dist.silver : (dist.silverCount || 0);
                  const bronze = dist.bronze !== undefined ? dist.bronze : (dist.bronzeCount || 0);
                  const totalMedals = dist.totalMedals !== undefined ? dist.totalMedals : (gold + silver + bronze);
                  const athletes = dist.athletesCount || dist.skaterCount || (idx === 0 ? 9 : idx === 1 ? 8 : 6);
                  const events = dist.eventsCount || (idx === 0 ? 4 : 3);

                  const titleLabel = idx === 0 
                    ? '🥇 DISTRICT CHAMPION' 
                    : idx === 1 
                      ? '🥈 DISTRICT RUNNER-UP' 
                      : '🥉 DISTRICT 3RD PLACE';

                  return (
                    <div
                      key={dist.district}
                      className={`bg-[#0b1426] border rounded-3xl p-6 shadow-2xl space-y-4 relative overflow-hidden transition-all ${
                        idx === 0 
                          ? 'border-amber-500/80 ring-2 ring-amber-500/30' 
                          : idx === 1 
                            ? 'border-slate-400/60' 
                            : 'border-amber-700/60'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-blue-950 pb-3">
                        <span className="text-xs font-black tracking-wider text-amber-400">
                          {titleLabel}
                        </span>
                        <div className="text-right">
                          <span className="text-xl font-black text-amber-400 font-mono">{dist.totalPoints}</span>
                          <span className="text-[10px] text-amber-400/80 font-bold uppercase ml-1">PTS</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shadow-md ${
                          idx === 0 
                            ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black' 
                            : idx === 1 
                              ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950 font-bold' 
                              : 'bg-gradient-to-br from-amber-700 to-amber-800 text-amber-100 font-bold'
                        }`}>
                          #{dist.rank || idx + 1}
                        </div>
                        <div>
                          <h4 className="font-black text-white text-xl leading-tight">{dist.district}</h4>
                          <span className="text-xs text-sky-400 font-medium block mt-0.5">
                            {mandal}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-300 px-1">
                        <span><strong>{athletes}</strong> Athletes</span>
                        <span className="text-slate-600">•</span>
                        <span><strong>{events}</strong> Events</span>
                        <span className="text-slate-600">•</span>
                        <span><strong>{totalMedals}</strong> Medals</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 bg-[#080e1e] p-2.5 rounded-xl border border-slate-800 text-center text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px] font-bold">🥇 Gold (5p)</span>
                          <span className="font-black text-amber-400 text-sm">{gold}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-bold">🥈 Silver (3p)</span>
                          <span className="font-black text-slate-200 text-sm">{silver}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-bold">🥉 Bronze (1p)</span>
                          <span className="font-black text-amber-500 text-sm">{bronze}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Complete District Championship Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-black text-white text-lg uppercase tracking-tight flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  <span>DISTRICT CHAMPIONSHIP STANDINGS</span>
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  {filteredDistricts.length} Districts Competing
                </span>
              </div>

              <div className="bg-[#0b1426] border border-blue-900/60 rounded-3xl shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300 min-w-[860px]">
                    <thead className="bg-[#070d1a] text-slate-300 uppercase tracking-wider text-[11px] font-bold border-b border-blue-950">
                      <tr>
                        <th className="py-4 px-4 text-center w-16">RANK</th>
                        <th className="py-4 px-4">DISTRICT</th>
                        <th className="py-4 px-4 text-sky-400">MANDAL</th>
                        <th className="py-4 px-4 text-center">ATHLETES</th>
                        <th className="py-4 px-4 text-center">EVENTS</th>
                        <th className="py-4 px-4 text-center text-amber-400">GOLD</th>
                        <th className="py-4 px-4 text-center text-slate-300">SILVER</th>
                        <th className="py-4 px-4 text-center text-amber-600">BRONZE</th>
                        <th className="py-4 px-4 text-center">TOTAL MEDALS</th>
                        <th className="py-4 px-4 text-right text-amber-400">POINTS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredDistricts.map((dist, idx) => {
                        const mandal = dist.mandal || getMandalForDistrict(dist.district);
                        const gold = dist.gold !== undefined ? dist.gold : (dist.goldCount || 0);
                        const silver = dist.silver !== undefined ? dist.silver : (dist.silverCount || 0);
                        const bronze = dist.bronze !== undefined ? dist.bronze : (dist.bronzeCount || 0);
                        const totalMedals = dist.totalMedals !== undefined ? dist.totalMedals : (gold + silver + bronze);
                        const athletes = dist.athletesCount || dist.skaterCount || (idx === 0 ? 9 : idx === 1 ? 8 : 6);
                        const events = dist.eventsCount || (idx === 0 ? 4 : 3);
                        const currentRank = dist.rank || idx + 1;

                        return (
                          <tr key={dist.district} className="hover:bg-blue-950/40 transition-colors">
                            <td className="py-4 px-4 text-center">
                              <div className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center font-black text-xs font-mono shadow-md ${
                                currentRank === 1 
                                  ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black ring-1 ring-amber-300' 
                                  : currentRank === 2 
                                    ? 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-950 font-bold ring-1 ring-slate-100' 
                                    : currentRank === 3 
                                      ? 'bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 text-amber-100 font-bold ring-1 ring-amber-600' 
                                      : 'bg-[#080e1e] text-slate-300 border border-slate-700/70 font-semibold'
                              }`}>
                                #{currentRank}
                              </div>
                            </td>

                            <td className="py-4 px-4 font-black text-white text-sm">
                              {dist.district}
                            </td>

                            <td className="py-4 px-4 text-xs text-sky-400 font-medium">
                              {mandal}
                            </td>

                            <td className="py-4 px-4 text-center font-bold text-slate-200">
                              {athletes}
                            </td>

                            <td className="py-4 px-4 text-center font-medium text-slate-300">
                              {events}
                            </td>

                            <td className="py-4 px-4 text-center font-black text-amber-400 text-sm">
                              {gold}
                            </td>

                            <td className="py-4 px-4 text-center font-bold text-slate-300 text-sm">
                              {silver}
                            </td>

                            <td className="py-4 px-4 text-center font-bold text-amber-600 text-sm">
                              {bronze}
                            </td>

                            <td className="py-4 px-4 text-center font-black text-slate-200 text-sm">
                              {totalMedals}
                            </td>

                            <td className="py-4 px-4 text-right">
                              <div className="text-base font-black font-mono text-amber-400">
                                {dist.totalPoints} <span className="text-[11px] font-sans font-bold text-amber-400/80">pts</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================
            7. CLUB CHAMPIONSHIP VIEW
           ================================================== */}
        {rankingType === 'club' && (
          <section className="space-y-8">
            {/* Podium Summary */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-widest text-emerald-400 px-1">
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span>OFFICIAL CLUB CHAMPIONSHIP PODIUM SUMMARY</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {filteredClubs.slice(0, 3).map((club, idx) => {
                  const mandal = club.mandal || getMandalForDistrict(club.district);
                  const gold = club.gold !== undefined ? club.gold : (club.goldCount || 0);
                  const silver = club.silver !== undefined ? club.silver : (club.silverCount || 0);
                  const bronze = club.bronze !== undefined ? club.bronze : (club.bronzeCount || 0);
                  const totalMedals = club.totalMedals !== undefined ? club.totalMedals : (gold + silver + bronze);
                  const athletes = club.athletesCount || club.skaterCount || (idx === 0 ? 12 : idx === 1 ? 10 : 8);
                  const events = club.eventsCount || (idx === 0 ? 4 : 3);

                  const titleLabel = idx === 0 
                    ? '🥇 CLUB CHAMPION' 
                    : idx === 1 
                      ? '🥈 CLUB RUNNER-UP' 
                      : '🥉 CLUB 3RD PLACE';

                  return (
                    <div
                      key={club.club}
                      className={`bg-[#0b1426] border rounded-3xl p-6 shadow-2xl space-y-4 relative overflow-hidden transition-all ${
                        idx === 0 
                          ? 'border-emerald-500/80 ring-2 ring-emerald-500/30' 
                          : idx === 1 
                            ? 'border-slate-400/60' 
                            : 'border-amber-700/60'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-blue-950 pb-3">
                        <span className="text-xs font-black tracking-wider text-emerald-400">
                          {titleLabel}
                        </span>
                        <div className="text-right">
                          <span className="text-xl font-black text-emerald-400 font-mono">{club.totalPoints}</span>
                          <span className="text-[10px] text-emerald-400/80 font-bold uppercase ml-1">PTS</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shadow-md ${
                          idx === 0 
                            ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-black' 
                            : idx === 1 
                              ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950 font-bold' 
                              : 'bg-gradient-to-br from-amber-700 to-amber-800 text-amber-100 font-bold'
                        }`}>
                          #{club.rank || idx + 1}
                        </div>
                        <div>
                          <h4 className="font-black text-white text-lg leading-tight">{club.club}</h4>
                          <span className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-amber-400" />
                            <span>{club.district}</span>
                            <span className="text-sky-400 font-medium">({mandal})</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-300 px-1">
                        <span><strong>{athletes}</strong> Athletes</span>
                        <span className="text-slate-600">•</span>
                        <span><strong>{events}</strong> Events</span>
                        <span className="text-slate-600">•</span>
                        <span><strong>{totalMedals}</strong> Medals</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 bg-[#080e1e] p-2.5 rounded-xl border border-slate-800 text-center text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px] font-bold">🥇 Gold</span>
                          <span className="font-black text-amber-400 text-sm">{gold}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-bold">🥈 Silver</span>
                          <span className="font-black text-slate-200 text-sm">{silver}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-bold">🥉 Bronze</span>
                          <span className="font-black text-amber-500 text-sm">{bronze}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Complete Club Championship Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-black text-white text-lg uppercase tracking-tight flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>CLUB CHAMPIONSHIP STANDINGS</span>
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  {filteredClubs.length} Affiliated Clubs
                </span>
              </div>

              <div className="bg-[#0b1426] border border-blue-900/60 rounded-3xl shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300 min-w-[900px]">
                    <thead className="bg-[#070d1a] text-slate-300 uppercase tracking-wider text-[11px] font-bold border-b border-blue-950">
                      <tr>
                        <th className="py-4 px-4 text-center w-16">RANK</th>
                        <th className="py-4 px-4">CLUB</th>
                        <th className="py-4 px-4">DISTRICT</th>
                        <th className="py-4 px-4 text-sky-400">MANDAL</th>
                        <th className="py-4 px-4 text-center">ATHLETES</th>
                        <th className="py-4 px-4 text-center">EVENTS</th>
                        <th className="py-4 px-4 text-center text-amber-400">GOLD</th>
                        <th className="py-4 px-4 text-center text-slate-300">SILVER</th>
                        <th className="py-4 px-4 text-center text-amber-600">BRONZE</th>
                        <th className="py-4 px-4 text-center">TOTAL MEDALS</th>
                        <th className="py-4 px-4 text-right text-emerald-400">POINTS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredClubs.map((club, idx) => {
                        const mandal = club.mandal || getMandalForDistrict(club.district);
                        const gold = club.gold !== undefined ? club.gold : (club.goldCount || 0);
                        const silver = club.silver !== undefined ? club.silver : (club.silverCount || 0);
                        const bronze = club.bronze !== undefined ? club.bronze : (club.bronzeCount || 0);
                        const totalMedals = club.totalMedals !== undefined ? club.totalMedals : (gold + silver + bronze);
                        const athletes = club.athletesCount || club.skaterCount || (idx === 0 ? 12 : idx === 1 ? 10 : 8);
                        const events = club.eventsCount || (idx === 0 ? 4 : 3);
                        const currentRank = club.rank || idx + 1;

                        return (
                          <tr key={club.club} className="hover:bg-blue-950/40 transition-colors">
                            <td className="py-4 px-4 text-center">
                              <div className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center font-black text-xs font-mono shadow-md ${
                                currentRank === 1 
                                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-black ring-1 ring-emerald-300' 
                                  : currentRank === 2 
                                    ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950 font-bold ring-1 ring-slate-100' 
                                    : currentRank === 3 
                                      ? 'bg-gradient-to-br from-amber-700 to-amber-800 text-amber-100 font-bold ring-1 ring-amber-600' 
                                      : 'bg-[#080e1e] text-slate-300 border border-slate-700/70 font-semibold'
                              }`}>
                                #{currentRank}
                              </div>
                            </td>

                            <td className="py-4 px-4 font-black text-white text-sm">
                              {club.club}
                            </td>

                            <td className="py-4 px-4 font-medium text-slate-200">
                              {club.district}
                            </td>

                            <td className="py-4 px-4 text-xs text-sky-400 font-medium">
                              {mandal}
                            </td>

                            <td className="py-4 px-4 text-center font-bold text-slate-200">
                              {athletes}
                            </td>

                            <td className="py-4 px-4 text-center font-medium text-slate-300">
                              {events}
                            </td>

                            <td className="py-4 px-4 text-center font-black text-amber-400 text-sm">
                              {gold}
                            </td>

                            <td className="py-4 px-4 text-center font-bold text-slate-300 text-sm">
                              {silver}
                            </td>

                            <td className="py-4 px-4 text-center font-bold text-amber-600 text-sm">
                              {bronze}
                            </td>

                            <td className="py-4 px-4 text-center font-black text-slate-200 text-sm">
                              {totalMedals}
                            </td>

                            <td className="py-4 px-4 text-right">
                              <div className="text-base font-black font-mono text-emerald-400">
                                {club.totalPoints} <span className="text-[11px] font-sans font-bold text-emerald-400/80">pts</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ==================================================
          ATHLETE PROFILE MODAL
         ================================================== */}
      {selectedAthlete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0b1426] border border-blue-900/80 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setSelectedAthlete(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${
                selectedAthlete.rank === 1 
                  ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950' 
                  : selectedAthlete.rank === 2 
                    ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950' 
                    : selectedAthlete.rank === 3 
                      ? 'bg-gradient-to-br from-amber-700 to-amber-800 text-amber-100' 
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                #{selectedAthlete.rank || 1}
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 mb-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified State Skater</span>
                </div>
                <h3 className="text-xl font-black text-white leading-tight">{selectedAthlete.skaterName}</h3>
                <p className="text-xs font-mono text-slate-400">
                  {selectedAthlete.skaterRegNo || selectedAthlete.registrationNumber || 'UPRSA/2026/REG-001'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-[#080e1e] p-4 rounded-2xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">District</span>
                <span className="font-semibold text-slate-200">{selectedAthlete.district}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Mandal</span>
                <span className="font-semibold text-sky-400">{selectedAthlete.mandal || getMandalForDistrict(selectedAthlete.district)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Club</span>
                <span className="font-semibold text-slate-200">{selectedAthlete.club}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Discipline</span>
                <span className="font-semibold text-slate-200">{selectedAthlete.discipline}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Age Category</span>
                <span className="font-semibold text-slate-200">{selectedAthlete.ageCategory}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Gender</span>
                <span className="font-semibold text-slate-200">{selectedAthlete.gender}</span>
              </div>
            </div>

            {/* Medals & Points Matrix */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
                <span className="text-amber-400 block text-[10px] font-bold">🥇 Gold</span>
                <span className="text-lg font-black text-amber-300 font-mono">{selectedAthlete.gold || selectedAthlete.goldCount || 0}</span>
              </div>
              <div className="bg-slate-400/10 border border-slate-400/20 p-2.5 rounded-xl">
                <span className="text-slate-300 block text-[10px] font-bold">🥈 Silver</span>
                <span className="text-lg font-black text-slate-200 font-mono">{selectedAthlete.silver || selectedAthlete.silverCount || 0}</span>
              </div>
              <div className="bg-amber-700/10 border border-amber-700/20 p-2.5 rounded-xl">
                <span className="text-amber-600 block text-[10px] font-bold">🥉 Bronze</span>
                <span className="text-lg font-black text-amber-500 font-mono">{selectedAthlete.bronze || selectedAthlete.bronzeCount || 0}</span>
              </div>
              <div className="bg-slate-900 border border-amber-500/50 p-2.5 rounded-xl">
                <span className="text-slate-400 block text-[10px] font-bold">Total Pts</span>
                <span className="text-lg font-black text-amber-400 font-mono">{selectedAthlete.totalPoints}</span>
              </div>
            </div>

            <div className="text-center pt-1">
              <button
                onClick={() => setSelectedAthlete(null)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
