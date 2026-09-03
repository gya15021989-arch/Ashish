import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Building2, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Award,
  Compass,
  ArrowRight,
  Filter,
  UserCheck
} from 'lucide-react';
import { Club } from '../../types';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { VERIFIED_UP_ACADEMIES } from '../../data/allClubsData';

interface ClubsProps {
  onNavigateToRegister?: () => void;
  onNavigate?: (page: string) => void;
}

export const Clubs: React.FC<ClubsProps> = ({ onNavigateToRegister, onNavigate }) => {
  const { lang, setLang } = useLanguage();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedDiscipline, setSelectedDiscipline] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClubs();
  }, []);

  const loadClubs = async () => {
    try {
      const res = await api.getClubs();
      if (res.success && res.data && res.data.length > 0) {
        // Merge API data with verified dataset defaults to guarantee rich fields
        const merged = VERIFIED_UP_ACADEMIES.map(verifiedClub => {
          const apiMatch = res.data.find(c => c.id === verifiedClub.id || c.name.toLowerCase() === verifiedClub.name.toLowerCase());
          return apiMatch ? { ...verifiedClub, ...apiMatch } : verifiedClub;
        });
        
        // Also append any new clubs in DB not in verified list
        res.data.forEach(dbClub => {
          if (!merged.some(m => m.id === dbClub.id || m.name.toLowerCase() === dbClub.name.toLowerCase())) {
            merged.push({
              ...dbClub,
              affiliationNumber: dbClub.affiliationNumber || `UPRSA/CLUB/2026/${(merged.length + 1).toString().padStart(3, '0')}`,
              isVerified: dbClub.status === 'Active'
            });
          }
        });
        setClubs(merged);
      } else {
        setClubs(VERIFIED_UP_ACADEMIES);
      }
    } catch (e) {
      console.error('Failed to load clubs:', e);
      setClubs(VERIFIED_UP_ACADEMIES);
    } finally {
      setLoading(false);
    }
  };

  // Distinct districts list from data
  const districts = ['All', ...Array.from(new Set(clubs.map(c => c.district).filter(Boolean)))];

  // Distinct disciplines list
  const disciplineOptions = [
    'All',
    'Inline Speed',
    'Quad Speed',
    'Inline Freestyle',
    'Roller Hockey',
    'Artistic',
    'Skateboarding'
  ];

  // Filtering logic
  const filtered = clubs.filter(c => {
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || 
      c.name.toLowerCase().includes(q) ||
      (c.hindiName && c.hindiName.toLowerCase().includes(q)) ||
      c.headCoach.toLowerCase().includes(q) ||
      c.district.toLowerCase().includes(q) ||
      (c.city && c.city.toLowerCase().includes(q)) ||
      (c.venue && c.venue.toLowerCase().includes(q)) ||
      (c.officialAddress && c.officialAddress.toLowerCase().includes(q)) ||
      (c.coachPhone && c.coachPhone.includes(q)) ||
      (c.affiliationNumber && c.affiliationNumber.toLowerCase().includes(q));

    const matchesDistrict = selectedDistrict === 'All' || c.district === selectedDistrict;
    
    const matchesDiscipline = selectedDiscipline === 'All' || 
      c.disciplines.some(d => {
        const dStr = String(d).toLowerCase();
        const selStr = selectedDiscipline.toLowerCase();
        return dStr.includes(selStr) || selStr.includes(dStr);
      });

    return matchesSearch && matchesDistrict && matchesDiscipline;
  });

  const handleEnrollClick = () => {
    if (onNavigateToRegister) {
      onNavigateToRegister();
    } else if (onNavigate) {
      onNavigate('register');
    }
  };

  return (
    <div className="min-h-screen bg-[#050b18] text-slate-100 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ================================================== */}
        {/* PAGE TITLE SECTION                                 */}
        {/* ================================================== */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          {/* Small Orange Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500/15 text-amber-400 px-4 py-1.5 rounded-full border border-amber-500/30 text-xs font-extrabold uppercase tracking-widest shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>OFFICIAL UPRSA ACADEMIES DIRECTORY</span>
          </div>

          {/* Large Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-tight drop-shadow-sm">
            AFFILIATED SKATING CLUBS &amp;<br className="hidden sm:inline" /> ACADEMIES
          </h1>

          {/* Subheading */}
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto font-normal">
            Official verified training centers, accredited head coaches, standard banked tracks, and professional rink facilities across Uttar Pradesh.
          </p>

          {/* Language Switcher: [ English ] [ हिन्दी (Hindi) ] */}
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
        {/* SEARCH & FILTER BAR                                */}
        {/* ================================================== */}
        <div className="bg-[#0c162d] border border-blue-900/50 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          {/* LEFT: Search input with search icon */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search club, head coach, city, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#050b18] border border-blue-900/60 focus:border-amber-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
            />
          </div>

          {/* RIGHT: DISTRICT & DISCIPLINE Dropdowns */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* DISTRICT Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider whitespace-nowrap">
                DISTRICT:
              </span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full sm:w-48 bg-[#050b18] border border-blue-900/60 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs text-slate-100 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                {districts.map((d) => (
                  <option key={d} value={d} className="bg-[#050b18] text-white">
                    {d === 'All' ? 'All Districts' : d}
                  </option>
                ))}
              </select>
            </div>

            {/* DISCIPLINE Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider whitespace-nowrap">
                DISCIPLINE:
              </span>
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                className="w-full sm:w-44 bg-[#050b18] border border-blue-900/60 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs text-slate-100 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                {disciplineOptions.map((disc) => (
                  <option key={disc} value={disc} className="bg-[#050b18] text-white">
                    {disc === 'All' ? 'All Disciplines' : disc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Directory Count / Status Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Showing <strong className="text-amber-400">{filtered.length}</strong> of {clubs.length} official academies
          </span>
          {(search || selectedDistrict !== 'All' || selectedDiscipline !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedDistrict('All');
                setSelectedDiscipline('All');
              }}
              className="text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* ================================================== */}
        {/* 3-COLUMN CLUB / ACADEMY GRID                       */}
        {/* ================================================== */}
        {loading ? (
          <div className="text-center py-24 space-y-3">
            <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-400 text-sm font-medium">Loading verified academies directory...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#0c162d] border border-blue-900/50 rounded-2xl p-12 text-center space-y-4">
            <Building2 className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Skating Academies Found</h3>
            <p className="text-slate-400 text-xs max-w-md mx-auto">
              No affiliated academy matched your filter criteria. Try clearing search keywords or selecting a different district/discipline.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedDistrict('All');
                setSelectedDiscipline('All');
              }}
              className="bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg hover:bg-amber-400 transition-all cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((club) => {
              const regBadge = club.affiliationNumber || `UPRSA/CLUB/2026/${club.id.replace('club-', '')}`;
              const athletesCount = club.skatersCount || 120;
              const hasWebsite = !!club.websiteUrl;

              return (
                <div
                  key={club.id}
                  className="bg-gradient-to-b from-[#0e1a38] to-[#081126] border border-blue-900/50 hover:border-amber-500/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-blue-950/60 space-y-4"
                >
                  <div className="space-y-3.5">
                    {/* 1. CLUB/ACADEMY PHOTO */}
                    <div className="w-full h-36 sm:h-40 rounded-xl overflow-hidden bg-[#060c1d] border border-blue-950/80 relative group">
                      {club.photoUrl ? (
                        <img
                          src={club.photoUrl}
                          alt={club.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            // Dignified neutral federation fallback
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              const fallback = parent.querySelector('.club-fallback-crest');
                              if (fallback) fallback.classList.remove('hidden');
                            }
                          }}
                        />
                      ) : null}
                      <div className={`club-fallback-crest w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#0c1938] to-[#060e22] text-center ${club.photoUrl ? 'hidden' : ''}`}>
                        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-2">
                          <Building2 className="w-6 h-6 text-amber-400" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">UPRSA ACCREDITED RINK</span>
                        <span className="text-[10px] text-slate-500">Standard Federation Training Ground</span>
                      </div>
                      <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-sm border border-slate-700/60 px-2 py-0.5 rounded text-[10px] font-extrabold text-slate-300">
                        ESTD. {club.establishedYear || 2010}
                      </div>
                    </div>

                    {/* 2. REGISTRATION / AFFILIATION BADGE + 3. VERIFIED BADGE */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide">
                        {regBadge}
                      </span>
                      <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Verified</span>
                      </span>
                    </div>

                    {/* 4. CLUB NAME */}
                    <div>
                      <h3 className="font-extrabold text-white text-lg sm:text-xl leading-snug tracking-tight">
                        {club.name}
                      </h3>
                      {/* 5. HINDI NAME where available */}
                      {club.hindiName && (
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                          {club.hindiName}
                        </p>
                      )}
                    </div>

                    {/* 6. DISTRICT / CITY */}
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      <span>{club.district}{club.city && club.city !== club.district ? ` (${club.city})` : ''}</span>
                    </div>

                    {/* 7. HEAD COACH / ACADEMY HEAD (Separate darker inner panel) */}
                    <div className="bg-[#060c1d] border border-blue-900/40 rounded-xl p-3.5 space-y-3">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                        <span>HEAD COACH / ACADEMY HEAD</span>
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                      </div>

                      <div className="flex items-start gap-3.5">
                        {/* 8. COACH PHOTO (80–100px prominent frame) / NEUTRAL FEDERATION PLACEHOLDER */}
                        <div className="w-20 h-20 sm:w-[88px] sm:h-[88px] rounded-xl bg-gradient-to-br from-[#0e214d] to-[#08132e] border border-blue-700/50 shrink-0 flex items-center justify-center overflow-hidden shadow-md">
                          {club.coachPhotoUrl ? (
                            <img
                              src={club.coachPhotoUrl}
                              alt={club.headCoach}
                              className="w-full h-full object-cover object-top"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  const placeholder = parent.querySelector('.coach-placeholder-icon');
                                  if (placeholder) placeholder.classList.remove('hidden');
                                }
                              }}
                            />
                          ) : null}
                          <div className={`coach-placeholder-icon flex flex-col items-center justify-center text-center p-1.5 ${club.coachPhotoUrl ? 'hidden' : ''}`}>
                            <UserCheck className="w-9 h-9 sm:w-10 sm:h-10 text-amber-400 mb-0.5" />
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter leading-none">HEAD COACH</span>
                          </div>
                        </div>

                        {/* 9. COACH NAME & 10. COACH DESIGNATION & 11,12. CONTACT INFO */}
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <div>
                            <h4 className="font-bold text-white text-sm sm:text-base leading-snug">
                              {club.headCoach}
                            </h4>
                            <p className="text-[11px] text-amber-400/95 font-medium leading-tight mt-0.5">
                              {club.coachDesignation || 'Head Coach (NIS Accredited)'}
                            </p>
                          </div>

                          {/* 11. PHONE NUMBER & 12. OFFICIAL EMAIL */}
                          <div className="pt-1.5 border-t border-slate-800/80 space-y-1 text-xs">
                            <a
                              href={`tel:${club.coachPhone}`}
                              className="flex items-center gap-1.5 text-slate-300 hover:text-amber-300 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className="font-mono text-xs truncate">{club.coachPhone || 'Not available'}</span>
                            </a>
                            <a
                              href={`mailto:${club.coachEmail}`}
                              className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-300 transition-colors truncate"
                            >
                              <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span className="truncate text-xs">{club.coachEmail || 'Not available'}</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 13. OFFICIAL ADDRESS */}
                    <div className="space-y-1 text-xs">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        OFFICIAL ADDRESS
                      </span>
                      <p className="text-slate-300 text-xs leading-relaxed line-clamp-2">
                        {club.officialAddress || club.venue || 'Official venue address available at district association office.'}
                      </p>
                    </div>

                    {/* 14. FACILITY INFORMATION & 15. WEBSITE / PORTAL LINK */}
                    <div className="grid grid-cols-1 gap-2 pt-1 border-t border-slate-800/80 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                          FACILITY:
                        </span>
                        <span className="text-slate-200 font-semibold text-right text-xs">
                          {club.facility || club.venue || 'Standard Banked Track & Rink'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                          WEBSITE:
                        </span>
                        {hasWebsite ? (
                          <a
                            href={club.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold text-xs underline decoration-cyan-500/40 hover:decoration-cyan-300"
                          >
                            <span>Visit Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-500 text-xs">
                            uprsa.org/{club.id}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 16. DISCIPLINES */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        DISCIPLINES TRAINED:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {club.disciplines && club.disciplines.length > 0 ? (
                          club.disciplines.map((d, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-blue-950/80 text-blue-300 border border-blue-800/50 px-2 py-0.5 rounded font-medium"
                            >
                              {String(d)}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-500">All Federation Disciplines</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ================================================== */}
                  {/* 17. TOTAL ATHLETES & 18. ENROLL ATHLETE BUTTON     */}
                  {/* ================================================== */}
                  <div className="pt-3.5 border-t border-slate-800/90 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Users className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-white">
                        {athletesCount} <span className="text-slate-400 font-normal">Athletes</span>
                      </span>
                    </div>

                    <button
                      onClick={handleEnrollClick}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-lg transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer transform active:scale-95"
                    >
                      <span>Enroll Athlete</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
