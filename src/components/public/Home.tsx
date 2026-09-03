import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Award, 
  Calendar, 
  Trophy, 
  CheckCircle2, 
  ChevronRight, 
  Radio, 
  ArrowRight,
  FileText, 
  Users, 
  Activity, 
  MapPin, 
  Sparkles, 
  Search,
  ExternalLink,
  Zap,
  TrendingUp,
  Target,
  Building2,
  Phone,
  Mail,
  Compass,
  Flame,
  Medal,
  QrCode,
  Lock,
  Clock,
  Download,
  Eye,
  Check,
  Star
} from 'lucide-react';
import { Hero } from './Hero';
import { Announcement, Tournament, TournamentResult, SkaterRanking, DistrictRanking, ClubRanking, HeroSlide } from '../../types';
import { api } from '../../services/api';
import { DISCIPLINES, UPRSA_INFO } from '../../data/uprsaKnowledge';
import { CURRENT_SEASON, SEASON_CONFIG } from '../../config/season';

interface HomeProps {
  currentView?: string;
  activePage?: string;
  setCurrentView?: (view: string) => void;
  onNavigate?: (view: string) => void;
  onOpenLiveScore?: () => void;
  onOpenVerify?: (certCode?: string) => void;
  onOpenAiChat?: () => void;
}

export const Home: React.FC<HomeProps> = ({ 
  setCurrentView, 
  onNavigate,
  onOpenLiveScore, 
  onOpenVerify,
  onOpenAiChat 
}) => {
  const navigate = (view: string) => {
    if (onNavigate) onNavigate(view);
    if (setCurrentView) setCurrentView(view);
  };

  const handleOpenLiveScore = () => {
    if (onOpenLiveScore) onOpenLiveScore();
    else navigate('live_score');
  };

  const handleOpenVerify = (code?: string) => {
    if (onOpenVerify) onOpenVerify(code);
    else navigate('verify_cert');
  };

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [recentResults, setRecentResults] = useState<TournamentResult[]>([]);
  const [topSkaters, setTopSkaters] = useState<SkaterRanking[]>([]);
  const [topDistricts, setTopDistricts] = useState<DistrictRanking[]>([]);
  const [topClubs, setTopClubs] = useState<ClubRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const [contentRes, tourRes, resultsRes, rankRes] = await Promise.all([
        api.getContentAll(),
        api.getTournaments(),
        api.getResults(),
        api.getRankings()
      ]);

      if (contentRes.success && contentRes.data) {
        if (contentRes.data.heroSlides) {
          setHeroSlides(contentRes.data.heroSlides);
        }
        setAnnouncements(contentRes.data.announcements || []);
      }
      if (tourRes.success && tourRes.data) {
        setTournaments(tourRes.data);
      }
      if (resultsRes.success && resultsRes.data) {
        setRecentResults(resultsRes.data.slice(0, 6));
      }
      if (rankRes.success && rankRes.data) {
        setTopSkaters(rankRes.data.individualRankings?.slice(0, 6) || []);
        setTopDistricts(rankRes.data.districtRankings?.slice(0, 5) || []);
        setTopClubs(rankRes.data.clubRankings?.slice(0, 5) || []);
      }
    } catch (err) {
      console.error('Error fetching home data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fallback tournaments if database empty
  const displayTournaments: Tournament[] = tournaments.length > 0 ? tournaments.slice(0, 3) : [
    {
      id: 'tour-1',
      title: '36th UP State Roller Skating Championship 2026',
      edition: '36th UP State Championship',
      category: 'STATE CHAMPIONSHIP',
      description: 'Official selection trials for the 63rd National Roller Skating Championship. Quad and Inline Speed, Freestyle & Roller Hockey events.',
      venue: 'KD Singh Babu Stadium & Synthetic Track',
      district: 'Lucknow',
      state: 'Uttar Pradesh',
      startDate: '2026-10-24',
      endDate: '2026-10-27',
      registrationDeadline: '2026-10-15',
      status: 'open',
      organizer: 'UPRSA & Lucknow District Association',
      contactPerson: 'Technical Committee UPRSA',
      contactPhone: '+91 94150 12345',
      entryFeeBase: 1200,
      isPublished: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'tour-2',
      title: 'NCR Open Roller Skating Track Cup 2026',
      edition: 'NCR Open Speed Cup',
      category: 'DISTRICT OPEN',
      description: 'Open ranking track trials for Tots, Minis, Cadet, Sub-Junior, Junior & Senior categories.',
      venue: 'Noida Indoor Stadium Banked Rink',
      district: 'Gautam Buddha Nagar',
      state: 'Uttar Pradesh',
      startDate: '2026-11-12',
      endDate: '2026-11-14',
      registrationDeadline: '2026-11-05',
      status: 'upcoming',
      organizer: 'Gautam Buddha Nagar Roller Sports Association',
      contactPerson: 'Organizing Secretary',
      contactPhone: '+91 98100 54321',
      entryFeeBase: 1000,
      isPublished: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'tour-3',
      title: 'UP State Inline Freestyle & Slalom Championship 2026',
      edition: 'State Slalom Finals',
      category: 'FREESTYLE CHAMPIONSHIP',
      description: 'Speed Slalom, Classic Slalom, Pair Slalom, Battle and Slide competitions.',
      venue: 'Mahamaya Sports Stadium Rink',
      district: 'Ghaziabad',
      state: 'Uttar Pradesh',
      startDate: '2026-12-04',
      endDate: '2026-12-06',
      registrationDeadline: '2026-11-25',
      status: 'upcoming',
      organizer: 'Ghaziabad District Roller Sports Association',
      contactPerson: 'Freestyle Technical Director',
      contactPhone: '+91 97110 98765',
      entryFeeBase: 1100,
      isPublished: true,
      created_at: new Date().toISOString()
    }
  ];

  const topDistrict = topDistricts[0] || {
    rank: 1,
    district: 'Lucknow',
    gold: 18,
    silver: 12,
    bronze: 9,
    totalPoints: 145
  };

  const topClub = topClubs[0] || {
    rank: 1,
    club: 'Roller Skating Academy Lucknow',
    district: 'Lucknow',
    gold: 14,
    silver: 9,
    bronze: 6,
    totalPoints: 112
  };

  const topSkater = topSkaters[0] || {
    rank: 1,
    skaterName: 'Aarav Sharma',
    district: 'Lucknow',
    discipline: 'Speed Skating (Inline)',
    ageCategory: 'Junior (15 to 18)',
    gold: 4,
    silver: 1,
    bronze: 0,
    totalPoints: 23
  };

  return (
    <div className="w-full min-h-screen bg-[#070d18] text-slate-100 selection:bg-amber-500 selection:text-slate-950 overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 1. HERO FRONT SCREEN */}
      {/* ========================================================================= */}
      <Hero 
        setCurrentView={navigate} 
        onNavigate={navigate}
        onOpenLiveScore={handleOpenLiveScore} 
        slides={heroSlides}
      />

      {/* ========================================================================= */}
      {/* 2. OFFICIAL STATISTICS CARDS (Section 9: 4 Clean Premium Cards) */}
      {/* ========================================================================= */}
      <section className="w-full relative z-20 -mt-7 sm:-mt-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            
            {/* Stat 1: 75 AFFILIATED DISTRICTS */}
            <div 
              onClick={() => navigate('districts')}
              className="bg-[#0b1329] hover:bg-[#0f1b3b] border border-blue-900/50 hover:border-amber-500/50 p-5 sm:p-6 rounded-2xl shadow-xl transition-all cursor-pointer group backdrop-blur-md"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl sm:text-4xl font-black text-amber-400 font-sans tracking-tight">75</span>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider group-hover:text-amber-300 transition-colors">
                AFFILIATED DISTRICTS
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Statewide mandal coverage in UP
              </div>
            </div>

            {/* Stat 2: 120+ AFFILIATED CLUBS */}
            <div 
              onClick={() => navigate('clubs')}
              className="bg-[#0b1329] hover:bg-[#0f1b3b] border border-blue-900/50 hover:border-indigo-500/50 p-5 sm:p-6 rounded-2xl shadow-xl transition-all cursor-pointer group backdrop-blur-md"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl sm:text-4xl font-black text-indigo-400 font-sans tracking-tight">120+</span>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider group-hover:text-indigo-300 transition-colors">
                AFFILIATED CLUBS
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Certified coaching academies & rinks
              </div>
            </div>

            {/* Stat 3: 2,800+ REGISTERED ATHLETES */}
            <div 
              onClick={() => navigate('rankings')}
              className="bg-[#0b1329] hover:bg-[#0f1b3b] border border-blue-900/50 hover:border-emerald-500/50 p-5 sm:p-6 rounded-2xl shadow-xl transition-all cursor-pointer group backdrop-blur-md"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-sans tracking-tight">2,800+</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider group-hover:text-emerald-300 transition-colors">
                REGISTERED ATHLETES
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Speed, Freestyle & Roller Hockey
              </div>
            </div>

            {/* Stat 4: 75+ ANNUAL CHAMPIONSHIPS */}
            <div 
              onClick={() => navigate('tournaments')}
              className="bg-[#0b1329] hover:bg-[#0f1b3b] border border-blue-900/50 hover:border-purple-500/50 p-5 sm:p-6 rounded-2xl shadow-xl transition-all cursor-pointer group backdrop-blur-md"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl sm:text-4xl font-black text-purple-400 font-sans tracking-tight">75+</span>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Trophy className="w-5 h-5" />
                </div>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider group-hover:text-purple-300 transition-colors">
                ANNUAL CHAMPIONSHIPS
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                District, state & selection trials
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CIRCULAR / NEWS TICKER (Section 10: Professional narrow ticker) */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#0b1329] border border-blue-900/50 rounded-2xl p-2.5 sm:p-3 flex flex-col md:flex-row items-center gap-3 shadow-lg">
            
            {/* Left Ticker Badge */}
            <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-wider shrink-0 bg-slate-950 px-3 py-1.5 rounded-xl border border-amber-500/30">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>OFFICIAL CIRCULARS & NOTICES</span>
            </div>

            {/* Middle Marquee / List */}
            <div className="flex-1 overflow-x-auto flex gap-6 no-scrollbar text-xs py-1 w-full md:w-auto">
              {announcements.length > 0 ? (
                announcements.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => navigate('news_gallery')}
                    className="cursor-pointer flex items-center gap-2 text-slate-300 hover:text-amber-400 whitespace-nowrap transition-colors"
                  >
                    <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded font-mono border border-blue-800/60 font-bold">
                      {item.date}
                    </span>
                    <span className="font-semibold text-slate-200">{item.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                ))
              ) : (
                <div 
                  onClick={() => navigate('tournaments')}
                  className="cursor-pointer flex items-center gap-2 text-slate-300 hover:text-amber-400 whitespace-nowrap transition-colors"
                >
                  <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded font-mono border border-blue-800/60 font-bold">
                    {CURRENT_SEASON}
                  </span>
                  <span className="font-semibold text-slate-200">36th UP State Championship Selection trials entry portal is currently active.</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              )}
            </div>

            {/* Right: VIEW ALL → */}
            <button
              onClick={() => navigate('news_gallery')}
              className="text-xs text-amber-400 hover:text-amber-300 font-extrabold shrink-0 cursor-pointer flex items-center gap-1.5 px-3 py-1 rounded-lg hover:bg-slate-900 transition-colors uppercase"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. UPCOMING CHAMPIONSHIPS (Section 11: 1st homepage block) */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#081022] border-y border-slate-800/80 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 mt-6">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest block mb-2">
                UPRSA CHAMPIONSHIPS
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Upcoming Championships & Selection Trials
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Explore upcoming state-level roller skating championships, trials prospectus, and race dates.
              </p>
            </div>

            <button
              onClick={() => navigate('tournaments')}
              className="bg-[#0b1329] hover:bg-[#0f1b3b] text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:border-amber-500 font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all self-start md:self-auto cursor-pointer shadow-sm"
            >
              <span>View All Tournaments</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Tournament Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayTournaments.map((tour) => (
              <div
                key={tour.id}
                className="bg-[#0b1329] border border-blue-900/40 hover:border-amber-500/50 rounded-2xl p-6 shadow-xl transition-all flex flex-col justify-between group hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black bg-blue-950 text-blue-300 border border-blue-800/80 px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {tour.category || 'STATE CHAMPIONSHIP'}
                    </span>
                    <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                      tour.status === 'open' 
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}>
                      {tour.status === 'open' ? '🟢 ENTRIES OPEN' : '🟡 UPCOMING'}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                    {tour.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-normal">
                    {tour.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2.5 text-slate-300 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{tour.startDate} to {tour.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-300 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{tour.venue}, {tour.district}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    Entry: <strong className="text-white">₹{tour.entryFeeBase}</strong>
                  </div>
                  <button
                    onClick={() => navigate('tournaments')}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Event Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. LATEST RESULTS & RANKINGS (Section 11: 2nd homepage block) */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest block mb-2">
                OFFICIAL PODIUMS & LEADERBOARDS
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Latest Results & State Rankings
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Verified electronic timesheets, heat results, and 75 district championship standings.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('results')}
                className="bg-[#0b1329] hover:bg-[#0f1b3b] text-amber-400 border border-slate-700/80 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                All Results Archive
              </button>
              <button
                onClick={() => navigate('rankings')}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black transition-colors cursor-pointer"
              >
                District Leaderboard
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 7 cols: Latest Timesheets & Podiums */}
            <div className="lg:col-span-7 bg-[#0b1329] border border-blue-900/50 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 bg-[#040811] border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>State Championship Podiums ({CURRENT_SEASON})</span>
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                  Electronic Timing
                </span>
              </div>

              <div className="divide-y divide-slate-800/80">
                {(recentResults.length > 0 ? recentResults : [
                  { id: '1', skaterName: 'Aarav Sharma', district: 'Lucknow', eventName: '500m + D Sprint', discipline: 'Inline Speed', ageCategory: 'Junior', medal: 'Gold', timeRecord: '44.82s', position: 1 },
                  { id: '2', skaterName: 'Ananya Verma', district: 'Ghaziabad', eventName: 'Classic Slalom', discipline: 'Inline Freestyle', ageCategory: 'Sub-Junior', medal: 'Gold', points: 88.5, position: 1 },
                  { id: '3', skaterName: 'Rohan Gupta', district: 'Gautam Buddha Nagar', eventName: '1000m Sprint', discipline: 'Quad Speed', ageCategory: 'Cadet', medal: 'Silver', timeRecord: '1:34.12', position: 2 },
                  { id: '4', skaterName: 'Kavya Singh', district: 'Varanasi', eventName: 'One Lap Road Sprint', discipline: 'Inline Speed', ageCategory: 'Junior', medal: 'Bronze', timeRecord: '38.45s', position: 3 }
                ]).map((res: any) => (
                  <div key={res.id} className="p-4 flex items-center justify-between hover:bg-slate-900/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                          res.medal === 'Gold' 
                            ? 'bg-amber-500 text-slate-950 font-bold' 
                            : res.medal === 'Silver' 
                              ? 'bg-slate-300 text-slate-950 font-bold' 
                              : 'bg-amber-700 text-white font-bold'
                        }`}>
                          {res.medal}
                        </span>
                        <h4 className="font-bold text-white text-sm">{res.skaterName}</h4>
                        <span className="text-xs text-slate-400 font-mono">({res.district})</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {res.eventName} • {res.discipline} ({res.ageCategory})
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-amber-400">
                        {res.timeRecord || `${res.points} Pts`}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Rank #{res.position}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 cols: Top District Medal Tally */}
            <div className="lg:col-span-5 bg-[#0b1329] border border-blue-900/50 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>District Trophy Leaders</span>
                </h3>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  TOP 5 MANDALS
                </span>
              </div>

              <div className="space-y-2.5">
                {(topDistricts.length > 0 ? topDistricts : [
                  { rank: 1, district: 'Lucknow', gold: 18, silver: 12, bronze: 9, totalPoints: 145 },
                  { rank: 2, district: 'Ghaziabad', gold: 14, silver: 10, bronze: 8, totalPoints: 118 },
                  { rank: 3, district: 'Gautam Buddha Nagar', gold: 11, silver: 9, bronze: 7, totalPoints: 98 },
                  { rank: 4, district: 'Varanasi', gold: 8, silver: 6, bronze: 5, totalPoints: 71 },
                  { rank: 5, district: 'Kanpur Nagar', gold: 6, silver: 5, bronze: 4, totalPoints: 53 }
                ]).map((dist, idx) => (
                  <div
                    key={dist.district}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                        idx === 0 ? 'bg-amber-500 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-300'
                      }`}>
                        #{dist.rank || idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">{dist.district}</h4>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2">
                          <span>🥇 {dist.gold || 0}</span>
                          <span>🥈 {dist.silver || 0}</span>
                          <span>🥉 {dist.bronze || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-amber-400 font-mono">
                        {dist.totalPoints}
                      </span>
                      <span className="block text-[10px] text-slate-500">POINTS</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. OFFICIAL NEWS & CIRCULARS (Section 11: 3rd homepage block) */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#081022] border-y border-slate-800/80 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest block mb-2">
                GAZETTE & NOTICES
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Official News & Federation Circulars
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Authentic regulatory updates, selection criteria, and technical guidelines.
              </p>
            </div>

            <button
              onClick={() => navigate('news_gallery')}
              className="bg-[#0b1329] hover:bg-[#0f1b3b] text-amber-400 hover:text-amber-300 border border-amber-500/30 px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Gazette Archive</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: 'n1',
                title: 'Mandatory Skater Digital ID Verification Protocol 2026–27',
                date: 'September 2026',
                category: 'OFFICIAL CIRCULAR',
                desc: 'All affiliated skaters must carry the state digital athlete identity card with authenticated QR code for upcoming state trials.',
                gazetteNo: 'UPRSA/CIR/2026/041'
              },
              {
                id: 'n2',
                title: '36th UP State Championship Selection Trials Dates Announced',
                date: 'August 2026',
                category: 'STATE CHAMPIONSHIP',
                desc: 'Selection trials for Quad, Inline Speed, and Freestyle Slalom scheduled at KD Singh Babu Stadium, Lucknow.',
                gazetteNo: 'UPRSA/CIR/2026/039'
              },
              {
                id: 'n3',
                title: 'Technical Rules & Wheel Dimensions Standard Update',
                date: 'July 2026',
                category: 'TECHNICAL DIRECTIVE',
                desc: 'Adoption of updated World Skate wheel specifications for Road Sprints and Banked Track Heats.',
                gazetteNo: 'UPRSA/CIR/2026/035'
              }
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => navigate('news_gallery')}
                className="bg-[#0b1329] border border-blue-900/40 hover:border-amber-500/50 rounded-2xl p-6 shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{item.date}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-slate-500">{item.gazetteNo}</span>
                  <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Circular →
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. ROLLER SPORTS DISCIPLINES (Section 11: 4th homepage block) */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
              OFFICIAL SPORTS DISCIPLINES
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Recognized Roller Sports Disciplines
            </h2>
            <p className="text-xs sm:text-base text-slate-400">
              Governing all 10 Olympic, Asian Games & World Skate roller sports categories in Uttar Pradesh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Discipline 1 */}
            <div className="bg-[#0b1329] border border-blue-900/50 rounded-2xl overflow-hidden shadow-xl group hover:border-amber-500/50 transition-all">
              <div className="relative h-48 overflow-hidden bg-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80" 
                  alt="Inline Speed Skating" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1329] via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full uppercase">
                    SPEED RACING
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                  INLINE SPEED SKATING
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  High-velocity track and road racing with 3 or 4-wheel precision inline frames (100mm–125mm) on 200m banked synthetic tracks.
                </p>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400">200m • 500m • 10k Pts</span>
                  <button onClick={() => navigate('register')} className="text-amber-400 font-bold hover:underline">Register →</button>
                </div>
              </div>
            </div>

            {/* Discipline 2 */}
            <div className="bg-[#0b1329] border border-blue-900/50 rounded-2xl overflow-hidden shadow-xl group hover:border-indigo-500/50 transition-all">
              <div className="relative h-48 overflow-hidden bg-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&w=800&q=80" 
                  alt="Inline Freestyle Slalom" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1329] via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-black bg-indigo-500 text-white px-2.5 py-0.5 rounded-full uppercase">
                    FREESTYLE SLALOM
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-black text-white group-hover:text-indigo-300 transition-colors">
                  INLINE FREESTYLE
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Technical cone slalom, artistic footwork, speed battle, and precision high jump trials scored by international federation judges.
                </p>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Classic • Speed • Slide</span>
                  <button onClick={() => navigate('register')} className="text-indigo-400 font-bold hover:underline">Register →</button>
                </div>
              </div>
            </div>

            {/* Discipline 3 */}
            <div className="bg-[#0b1329] border border-blue-900/50 rounded-2xl overflow-hidden shadow-xl group hover:border-emerald-500/50 transition-all">
              <div className="relative h-48 overflow-hidden bg-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&w=800&q=80" 
                  alt="Quad Speed & Roller Hockey" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1329] via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-black bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full uppercase">
                    TRADITIONAL QUAD
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-black text-white group-hover:text-emerald-300 transition-colors">
                  QUAD SPEED & HOCKEY
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Traditional four-wheel quad speed sprint heats, rink relays, and high-octane Roller Hockey & Inline Hockey championships.
                </p>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Rink Sprints • Hockey</span>
                  <button onClick={() => navigate('register')} className="text-emerald-400 font-bold hover:underline">Register →</button>
                </div>
              </div>
            </div>

          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => navigate('activities')}
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 bg-[#0b1329] border border-slate-700/80 hover:border-amber-500/40 px-6 py-3 rounded-full transition-all cursor-pointer shadow-md"
            >
              <span>Explore All 10 Official RSFI Disciplines</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FEATURED ATHLETES & PERFORMANCE CHAMPIONS (Section 11: 5th block) */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#081022] border-y border-slate-800/80 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
              STATE ATHLETE SPOTLIGHT
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Featured State Athletes & Champions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Uttar Pradesh state record holders and national medalists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Athlete 1 */}
            <div className="bg-[#0b1329] border border-blue-900/50 rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden group hover:border-amber-500/40 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black">
                  🥇
                </div>
                <span className="text-[10px] font-black text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-800/60 uppercase tracking-wider">
                  SPEED RECORD
                </span>
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Aarav Sharma</h3>
                <p className="text-xs text-slate-400">Inline Speed • Lucknow</p>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="text-slate-400 text-[10px]">STATE RECORD</div>
                  <div className="font-bold text-white">500m Sprint (44.82s)</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400 text-[10px]">MEDALS</div>
                  <div className="font-black text-amber-400 font-mono">4 🥇 • 1 🥈</div>
                </div>
              </div>
            </div>

            {/* Athlete 2 */}
            <div className="bg-[#0b1329] border border-blue-900/50 rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black">
                  🏆
                </div>
                <span className="text-[10px] font-black text-indigo-300 bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-800/60 uppercase tracking-wider">
                  FREESTYLE SLALOM
                </span>
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Ananya Verma</h3>
                <p className="text-xs text-slate-400">Classic Slalom • Ghaziabad</p>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="text-slate-400 text-[10px]">MERIT SCORE</div>
                  <div className="font-bold text-white">88.50 Points (Rank #1)</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400 text-[10px]">MEDALS</div>
                  <div className="font-black text-indigo-400 font-mono">3 🥇 • 2 🥈</div>
                </div>
              </div>
            </div>

            {/* Athlete 3 */}
            <div className="bg-[#0b1329] border border-blue-900/50 rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black">
                  ⚡
                </div>
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/60 uppercase tracking-wider">
                  ROAD SPRINTER
                </span>
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Kavya Singh</h3>
                <p className="text-xs text-slate-400">One Lap Road • Varanasi</p>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="text-slate-400 text-[10px]">TIME RECORD</div>
                  <div className="font-bold text-white">One Lap Sprint (38.45s)</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400 text-[10px]">MEDALS</div>
                  <div className="font-black text-emerald-400 font-mono">2 🥇 • 2 🥉</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. PHOTO & VIDEO GALLERY (Section 11: 6th homepage block) */}
      {/* ========================================================================= */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest block mb-1">
                ACTION CAPTURES
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Photo & Video Gallery
              </h2>
            </div>
            <button
              onClick={() => navigate('news_gallery')}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Gallery</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Banked Track Sprint Heats', cat: 'Speed Skating', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80' },
              { title: 'Freestyle Slalom Cone Battle', cat: 'Inline Freestyle', img: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&w=600&q=80' },
              { title: 'State Medal Podium Ceremony', cat: 'Awards & Honors', img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80' },
              { title: 'State Referee & Coach Clinic', cat: 'Training Camp', img: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&w=600&q=80' }
            ].map((item, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden aspect-video sm:aspect-square bg-slate-900 border border-slate-800 shadow-md">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block">{item.cat}</span>
                  <h4 className="text-xs font-bold text-white leading-tight truncate">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. UPRSA AFFILIATION & RECOGNITION (Section 11: 7th homepage block) */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#081022] border-y border-slate-800/80 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-2 mb-8">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
              OFFICIAL SANCTIONS & AFFILIATIONS
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Recognized by Apex Sports Federations & Government Bodies
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            <div className="bg-[#0b1329] border border-slate-800/80 p-4 rounded-xl text-center space-y-1">
              <div className="text-base font-black text-amber-400">RSFI</div>
              <div className="text-xs text-slate-200 font-semibold">Roller Skating Federation of India</div>
              <div className="text-[10px] text-slate-500">Sole State Member</div>
            </div>
            <div className="bg-[#0b1329] border border-slate-800/80 p-4 rounded-xl text-center space-y-1">
              <div className="text-base font-black text-blue-400">UPOA</div>
              <div className="text-xs text-slate-200 font-semibold">UP Olympic Association</div>
              <div className="text-[10px] text-slate-500">Recognized State Body</div>
            </div>
            <div className="bg-[#0b1329] border border-slate-800/80 p-4 rounded-xl text-center space-y-1">
              <div className="text-base font-black text-emerald-400">MYAS</div>
              <div className="text-xs text-slate-200 font-semibold">Ministry of Youth Affairs & Sports</div>
              <div className="text-[10px] text-slate-500">Govt of India</div>
            </div>
            <div className="bg-[#0b1329] border border-slate-800/80 p-4 rounded-xl text-center space-y-1">
              <div className="text-base font-black text-indigo-400">SPORTS UP</div>
              <div className="text-xs text-slate-200 font-semibold">Directorate of Sports</div>
              <div className="text-[10px] text-slate-500">Govt of Uttar Pradesh</div>
            </div>
            <div className="bg-[#0b1329] border border-slate-800/80 p-4 rounded-xl text-center space-y-1 col-span-2 sm:col-span-1">
              <div className="text-base font-black text-purple-400">WORLD SKATE</div>
              <div className="text-xs text-slate-200 font-semibold">World Skate Federation</div>
              <div className="text-[10px] text-slate-500">Olympic Standard</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. FINAL REGISTRATION CTA (Section 11: 8th homepage block) */}
      {/* ========================================================================= */}
      <section className="w-full bg-gradient-to-r from-[#040811] via-[#091530] to-[#040811] border-t border-amber-500/30 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-4 py-1.5 rounded-full border border-amber-500/40 text-xs font-black tracking-wider uppercase shadow-md">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>AFFILIATION PORTAL • SEASON 2026–27</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Ready to Compete in Season 2026–27?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join over 2,800 registered skaters across 75 districts of Uttar Pradesh. Complete your registration and get your official Digital Athlete ID today.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('register')}
              className="bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-8 py-4 rounded-xl text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>REGISTER AS SKATER NOW</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
            <button
              onClick={() => navigate('tournaments')}
              className="bg-[#0b1329] hover:bg-[#0f1b3b] text-white font-bold px-7 py-4 rounded-xl text-sm border border-slate-700 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>EXPLORE TOURNAMENTS</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
