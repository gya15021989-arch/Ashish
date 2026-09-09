import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Award, 
  CheckCircle2, 
  MapPin, 
  Users, 
  Target, 
  FileText, 
  Building2,
  Mail,
  Phone,
  Layers,
  Sparkles,
  Trophy,
  Heart,
  ChevronRight,
  Flame,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Search,
  Filter
} from 'lucide-react';
import { UPRSA_INFO } from '../../data/uprsaKnowledge';
import { api } from '../../services/api';
import { AboutContent, AboutSection, AboutPolicy, AboutInfo } from '../../types';
import { AthleteJourneyModal, AthleteJourneyData } from './AthleteJourneyModal';
import { FamilyMemberModal, FamilyMemberData } from './FamilyMemberModal';
import { INITIAL_FEATURED_ATHLETES } from '../../data/athleteJourneysData';
import { UPRSA_FAMILY_MEMBERS } from '../../data/uprsaFamilyData';

export type AboutActiveTab = 'overview' | 'executive' | 'athletes' | 'family';

interface AboutProps {
  initialTab?: AboutActiveTab;
  setCurrentView?: (view: string) => void;
  onNavigate?: (view: string) => void;
}

export const About: React.FC<AboutProps> = ({ initialTab = 'overview', setCurrentView, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<AboutActiveTab>(initialTab);
  const [aboutData, setAboutData] = useState<AboutContent | null>(null);
  const [committeeMembers, setCommitteeMembers] = useState<any[]>(UPRSA_INFO.executiveCommittee);
  const [athletes, setAthletes] = useState<AthleteJourneyData[]>(INITIAL_FEATURED_ATHLETES);
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberData[]>(UPRSA_FAMILY_MEMBERS);
  const [selectedAthleteForJourney, setSelectedAthleteForJourney] = useState<AthleteJourneyData | null>(null);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<FamilyMemberData | null>(null);
  const [familyCategoryFilter, setFamilyCategoryFilter] = useState<string>('all');
  const [athleteDisciplineFilter, setAthleteDisciplineFilter] = useState<string>('all');
  const [athleteSearchQuery, setAthleteSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Sync when initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const navigate = (view: string) => {
    if (onNavigate) onNavigate(view);
    if (setCurrentView) setCurrentView(view);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [aboutRes, commRes, athRes, famRes] = await Promise.all([
        api.getAboutContent(),
        api.getCommittee(),
        api.getAboutAthletes(),
        api.getAboutFamilyMembers()
      ]);

      if (aboutRes.success && aboutRes.data) {
        setAboutData(aboutRes.data);
      }
      if (commRes.success && commRes.data && commRes.data.length > 0) {
        setCommitteeMembers(commRes.data);
      }
      if (athRes.success && athRes.data && athRes.data.length > 0) {
        setAthletes(athRes.data);
      }
      if (famRes.success && famRes.data && famRes.data.length > 0) {
        setFamilyMembers(famRes.data);
      }
    } catch (err) {
      console.error('Error loading about data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Resolved dynamic values with high-quality fallbacks
  const info: AboutInfo = aboutData?.info || {
    establishedText: 'ESTABLISHED 1988 • REG. NO. UP/S/294',
    title: 'About Uttar Pradesh Roller Sports Association',
    tagline: 'The supreme state governing and promotional body for Roller, Speed, Inline Freestyle, Artistic, Roller Hockey, and Downhill skating across 75 districts of Uttar Pradesh.',
    headOfficeAddress: UPRSA_INFO.headOffice,
    phone: UPRSA_INFO.phone,
    email: UPRSA_INFO.email,
    constitutionTitle: 'Constitution & Official Policies',
    statRegisteredAthletesText: '2,800+ Registered Athletes',
    statAffiliatedUnitsText: '75 District Units Recognized'
  };

  const sections: AboutSection[] = (aboutData?.sections && aboutData.sections.length > 0)
    ? aboutData.sections.filter(s => s.status !== 'Inactive')
    : [
        {
          id: 'sec-vision',
          title: 'Our Vision',
          badge: 'State Mission',
          badgeColor: 'amber',
          description: "To establish Uttar Pradesh as India's premier roller sports powerhouse by creating international-standard synthetic 200m banked tracks, grassroots talent identification across all 75 districts, and comprehensive athlete training programs.",
          footerTag: 'Infrastructure & Excellence',
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1000&q=80',
          order: 1,
          status: 'Active'
        },
        {
          id: 'sec-affiliation',
          title: 'RSFI & State Affiliation',
          badge: 'Apex Body',
          badgeColor: 'indigo',
          description: 'UPRSA is the solely recognized state member of the Roller Skating Federation of India (RSFI) and UP Olympic Association, recognized by the Department of Sports, Government of Uttar Pradesh for official state team selections.',
          footerTag: 'Sole Recognized Federation',
          imageUrl: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&w=1000&q=80',
          order: 2,
          status: 'Active'
        },
        {
          id: 'sec-athlete-dev',
          title: 'Athlete Development',
          badge: 'Grassroots To Podium',
          badgeColor: 'emerald',
          description: 'Over 2,800 active registered athletes, annual state championships, national training camps, certified coaches, state referee seminars, and transparent merit-based selection trials.',
          footerTag: '2,800+ Registered Athletes',
          imageUrl: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&w=1000&q=80',
          order: 3,
          status: 'Active'
        }
      ];

  const policies: AboutPolicy[] = (aboutData?.policies && aboutData.policies.length > 0)
    ? aboutData.policies
    : [
        {
          id: 'pol-1',
          title: 'RSFI Technical Regulations 2026 for Speed & Inline',
          order: 1
        },
        {
          id: 'pol-2',
          title: 'Anti-Doping Policy aligned with NADA / WADA Code',
          order: 2
        },
        {
          id: 'pol-3',
          title: 'POSH & Athlete Safe Sport Protection Committee',
          order: 3
        },
        {
          id: 'pol-4',
          title: 'State Selection Trials & Points Matrix (5-3-1 Rule)',
          order: 4
        }
      ];

  // Dynamic Featured State Athletes (From CMS or Initial dataset)
  const featuredAthletes: AthleteJourneyData[] = (athletes && athletes.length > 0)
    ? athletes
    : INITIAL_FEATURED_ATHLETES;

  // UPRSA Family Stakeholder Pillars
  const familyPillars = [
    {
      id: 'districts-pillar',
      title: '75 District Roller Sports Associations',
      badge: '75 Districts Recognized',
      icon: MapPin,
      color: 'amber',
      count: '75 Units',
      description: 'Affiliated district units actively governing, organizing district trials, selecting district squads, and promoting skating at school and grassroots levels.',
      actionLabel: 'Explore 75 Districts',
      view: 'districts'
    },
    {
      id: 'clubs-pillar',
      title: 'Affiliated Clubs, Academies & Synthetic Tracks',
      badge: 'Certified Academies',
      icon: Building2,
      color: 'indigo',
      count: '120+ Academies',
      description: 'Official RSFI registered skating clubs, coaching academies, school training centers, and synthetic banked tracks shaping everyday training.',
      actionLabel: 'View Affiliated Clubs',
      view: 'clubs'
    },
    {
      id: 'coaches-pillar',
      title: 'Certified Coaches & Technical Referees Panel',
      badge: 'RSFI Certified',
      icon: Award,
      color: 'emerald',
      count: '85+ Officials',
      description: 'Nationally certified coaches, electronic photo-finish technical juries, race judges, and sports medicine officers maintaining international fair play.',
      actionLabel: 'Contact Technical Panel',
      view: 'contact'
    },
    {
      id: 'skaters-pillar',
      title: 'Skaters & Sports Parents Community',
      badge: 'Athletes & Families',
      icon: Heart,
      color: 'rose',
      count: '2,800+ Skaters',
      description: 'The heartbeat of UPRSA — our dedicated athletes, passionate parents, patron supporters, and skating enthusiasts across Uttar Pradesh.',
      actionLabel: 'Register New Skater',
      view: 'register'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3.5 py-1 rounded-full border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>{info.establishedText || 'ESTABLISHED 1988 • REG. NO. UP/S/294'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {activeTab === 'executive' 
              ? 'UPRSA Executive Council (कार्यकारिणी समिति)' 
              : activeTab === 'athletes' 
              ? 'Our Athletes & Champions (हमारे खिलाड़ी)'
              : activeTab === 'family'
              ? 'UPRSA Family & Ecosystem (यूपीआरएसए परिवार)'
              : (info.title || 'About Uttar Pradesh Roller Sports Association')}
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            {activeTab === 'executive'
              ? 'State leadership and sports administrators presiding over official championships, RSFI affiliations, and governance across 75 districts.'
              : activeTab === 'athletes'
              ? 'Meet the medalists, national champions, and state record holders flying the Uttar Pradesh flag high in speed and artistic skating.'
              : activeTab === 'family'
              ? 'The unified federation of 75 District Associations, 120+ Clubs & Academies, certified Coaches, and 2,800+ passionate Athletes & Families.'
              : (info.tagline || 'The supreme state governing and promotional body for Roller, Speed, Inline Freestyle, Artistic, Roller Hockey, and Downhill skating across 75 districts of Uttar Pradesh.')}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE NAVIGATION TABS: Overview, Executive Council, Our Athletes, UPRSA Family */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-center">
          <div className="bg-[#0c1322] border border-slate-800 p-1.5 rounded-2xl flex flex-wrap items-center justify-center gap-1.5 shadow-xl max-w-full">
            
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>About Overview (परिचय)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('executive')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'executive'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>UPRSA Executive Council (कार्यकारिणी)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('athletes')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'athletes'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Our Athletes (हमारे खिलाड़ी)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('family')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'family'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>UPRSA Family (यूपीआरएसए परिवार)</span>
            </button>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ABOUT OVERVIEW */}
        {/* ========================================================================= */}
        {(activeTab === 'overview') && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Dynamic Core Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {sections.map((section) => {
                const badgeColorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
                  amber: { bg: 'bg-slate-950/80', text: 'text-amber-400', border: 'border-amber-500/40', glow: 'hover:border-amber-500/50' },
                  indigo: { bg: 'bg-slate-950/80', text: 'text-indigo-400', border: 'border-indigo-500/40', glow: 'hover:border-indigo-500/50' },
                  emerald: { bg: 'bg-slate-950/80', text: 'text-emerald-400', border: 'border-emerald-500/40', glow: 'hover:border-emerald-500/50' },
                  blue: { bg: 'bg-slate-950/80', text: 'text-blue-400', border: 'border-blue-500/40', glow: 'hover:border-blue-500/50' },
                  purple: { bg: 'bg-slate-950/80', text: 'text-purple-400', border: 'border-purple-500/40', glow: 'hover:border-purple-500/50' },
                  rose: { bg: 'bg-slate-950/80', text: 'text-rose-400', border: 'border-rose-500/40', glow: 'hover:border-rose-500/50' }
                };
                const theme = badgeColorMap[section.badgeColor || 'amber'] || badgeColorMap.amber;

                return (
                  <div
                    key={section.id}
                    className={`group bg-[#0f172a] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl ${theme.glow} transition-all duration-300 flex flex-col justify-between`}
                  >
                    <div>
                      {/* Large Photograph Area */}
                      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900">
                        {section.imageUrl ? (
                          <img
                            src={section.imageUrl}
                            alt={section.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-center brightness-[0.78] contrast-[1.08] saturate-[1.12] group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-950 flex items-center justify-center text-slate-600">
                            <Layers className="w-12 h-12 opacity-30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent" />
                        
                        {section.badge && (
                          <div className="absolute top-4 left-4">
                            <div className={`inline-flex items-center gap-1.5 ${theme.bg} ${theme.text} border ${theme.border} text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md shadow-md`}>
                              <Target className="w-3.5 h-3.5" />
                              <span>{section.badge}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Text Content */}
                      <div className="p-6 sm:p-7 space-y-3">
                        <h3 className="text-xl font-black text-white tracking-tight group-hover:text-amber-300 transition-colors">
                          {section.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                          {section.description}
                        </p>
                      </div>
                    </div>

                    {section.footerTag && (
                      <div className="px-6 pb-6 pt-0">
                        <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs font-bold text-amber-400">
                          <span>{section.footerTag}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick links to Council, Athletes and Family */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div 
                onClick={() => setActiveTab('executive')}
                className="bg-[#0c1322] border border-slate-800 hover:border-amber-500/50 p-6 rounded-3xl transition-all cursor-pointer group space-y-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                  UPRSA Executive Council →
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  View the official governing council, Office Bearers, President, Secretary General, and district leadership profiles.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('athletes')}
                className="bg-[#0c1322] border border-slate-800 hover:border-indigo-500/50 p-6 rounded-3xl transition-all cursor-pointer group space-y-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <Trophy className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors">
                  Our Athletes & Champions →
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Discover state record holders, national medalists, and inspiring journey stories representing Uttar Pradesh.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('family')}
                className="bg-[#0c1322] border border-slate-800 hover:border-rose-500/50 p-6 rounded-3xl transition-all cursor-pointer group space-y-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/30">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-rose-300 transition-colors">
                  UPRSA Family & Units →
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Connect with our network of 75 District Associations, 120+ Clubs, certified coaches, and skating families statewide.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: UPRSA EXECUTIVE COUNCIL */}
        {/* ========================================================================= */}
        {(activeTab === 'executive' || activeTab === 'overview') && (
          <div className="bg-[#070d18] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-amber-500/15 text-amber-300 px-3.5 py-1 rounded-full border border-amber-500/30 text-xs font-black tracking-widest uppercase mb-2">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Leadership & Sports Governance</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white">
                  UPRSA EXECUTIVE COUNCIL <span className="text-amber-400">(2024–2028)</span>
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                Elected under RSFI & National Sports Code Guidelines
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {committeeMembers.map((member, i) => {
                const name = member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'UPRSA Official';
                const role = member.role || member.designation || 'Executive Member';
                const district = member.district || 'Statewide';
                const phone = member.phone || '';
                const email = member.email || '';
                const address = member.address || '';
                const bio = member.roleDescription || member.bio || 'Official administrative leadership role supervising state roller sports operations.';
                const photo = member.photoUrl || member.photo || '';

                const initials = name
                  .split(' ')
                  .filter((n: string) => !n.startsWith('Dr.') && !n.startsWith('Shri') && !n.startsWith('Smt.'))
                  .map((n: string) => n[0])
                  .join('')
                  .slice(0, 2) || name.slice(0, 2).toUpperCase();

                return (
                  <div
                    key={member.id || i}
                    className="bg-[#0c1322] border border-slate-800/90 hover:border-amber-500/50 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-amber-500/10"
                  >
                    <div>
                      {/* Large Portrait Image */}
                      <div className="relative w-full aspect-[4/4.6] sm:aspect-[4/4.4] overflow-hidden bg-slate-900 flex items-center justify-center">
                        {photo ? (
                          <img
                            src={photo}
                            alt={name}
                            className="w-full h-full object-cover object-top brightness-[0.95] contrast-[1.05] group-hover:scale-102 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                              const fallback = (e.target as HTMLElement).nextElementSibling;
                              if (fallback) (fallback as HTMLElement).style.display = 'flex';
                            }}
                          />
                        ) : null}

                        {/* Fallback Badge */}
                        <div 
                          className={`w-full h-full bg-gradient-to-br from-slate-900 via-[#0d1629] to-slate-950 flex flex-col items-center justify-center text-amber-400 p-6 relative overflow-hidden select-none ${
                            photo ? 'hidden' : 'flex'
                          }`}
                        >
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.15),transparent_70%)] pointer-events-none" />
                          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-900/90 border-2 border-amber-500/40 flex items-center justify-center shadow-2xl relative mb-3">
                            <Shield className="w-6 h-6 text-amber-500/30 absolute top-2.5 right-2.5" />
                            <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-wider">{initials}</span>
                          </div>
                          <span className="text-xs font-mono font-bold tracking-widest text-slate-300 uppercase">UPRSA EXECUTIVE</span>
                          <span className="text-[10px] text-amber-500/80 tracking-widest font-mono uppercase mt-0.5">OFFICIAL SEAL</span>
                        </div>

                        {/* Designation Badge */}
                        <div className="absolute top-3.5 right-3.5 z-10">
                          <div className="inline-flex items-center gap-1.5 bg-amber-500 text-slate-950 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-lg shadow-black/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                            <span>{role}</span>
                          </div>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0c1322] via-[#0c1322]/60 to-transparent pointer-events-none" />
                      </div>

                      {/* Person Information */}
                      <div className="p-6 sm:p-7 space-y-4">
                        <div className="space-y-1.5">
                          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight group-hover:text-amber-300 transition-colors">
                            {name}
                          </h3>
                          <div className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                            <span>{role}</span>
                          </div>
                          <div className="text-xs text-slate-300 font-medium flex items-center gap-1.5 pt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>Jurisdiction: <strong className="text-white">{district}</strong></span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed font-normal bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5">
                          {bio}
                        </p>
                      </div>
                    </div>

                    {/* Contact details */}
                    <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-0 space-y-3">
                      <div className="border-t border-slate-800/80 pt-4 space-y-3 text-xs">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                            <Phone className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase font-extrabold text-amber-400 tracking-wider block">Mobile Number</span>
                            {phone ? (
                              <a 
                                href={`tel:${phone.split(',')[0].trim()}`} 
                                className="text-white hover:text-amber-300 font-semibold transition-colors truncate block"
                              >
                                {phone}
                              </a>
                            ) : (
                              <span className="text-slate-400 italic">Official contact details not available</span>
                            )}
                          </div>
                        </div>

                        <div className="h-px bg-slate-800/60 w-full" />

                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                            <Mail className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase font-extrabold text-amber-400 tracking-wider block">Official Email</span>
                            {email ? (
                              <a 
                                href={`mailto:${email}`} 
                                className="text-white hover:text-amber-300 font-medium transition-colors truncate block"
                              >
                                {email}
                              </a>
                            ) : (
                              <span className="text-slate-400 italic">Official contact details not available</span>
                            )}
                          </div>
                        </div>

                        {address && (
                          <>
                            <div className="h-px bg-slate-800/60 w-full" />
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                                <MapPin className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="text-[10px] uppercase font-extrabold text-amber-400 tracking-wider block">Official Address</span>
                                <span className="text-slate-300 leading-snug block">
                                  {address}
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: OUR ATHLETES & CHAMPIONS */}
        {/* ========================================================================= */}
        {activeTab === 'athletes' && (() => {
          const disciplinesList = [
            { id: 'all', label: 'सभी इवेंट्स (All)', badge: `${featuredAthletes.length} एथलीट` },
            { id: 'inline_speed', label: 'Inline Speed Skating (110/125mm)', key: 'Inline Speed' },
            { id: 'quad_speed', label: 'Quad Speed Skating (4-Wheel)', key: 'Quad' },
            { id: 'freestyle', label: 'Inline Freestyle & Slalom', key: 'Freestyle' },
            { id: 'artistic', label: 'Artistic & Figure Skating', key: 'Artistic' },
            { id: 'hockey', label: 'Roller Hockey & Inline Hockey', key: 'Hockey' }
          ];

          const filteredAthletes = featuredAthletes.filter((ath) => {
            const matchesSearch = athleteSearchQuery === '' || 
              ath.name.toLowerCase().includes(athleteSearchQuery.toLowerCase()) ||
              (ath.hindiName && ath.hindiName.includes(athleteSearchQuery)) ||
              ath.district.toLowerCase().includes(athleteSearchQuery.toLowerCase()) ||
              ath.discipline.toLowerCase().includes(athleteSearchQuery.toLowerCase()) ||
              ath.achievement.toLowerCase().includes(athleteSearchQuery.toLowerCase());

            if (!matchesSearch) return false;

            if (athleteDisciplineFilter === 'all') return true;
            if (athleteDisciplineFilter === 'inline_speed') return ath.discipline.includes('Inline Speed');
            if (athleteDisciplineFilter === 'quad_speed') return ath.discipline.includes('Quad');
            if (athleteDisciplineFilter === 'freestyle') return ath.discipline.includes('Freestyle') || ath.discipline.includes('Slalom');
            if (athleteDisciplineFilter === 'artistic') return ath.discipline.includes('Artistic') || ath.discipline.includes('Figure');
            if (athleteDisciplineFilter === 'hockey') return ath.discipline.includes('Hockey');
            return true;
          });

          return (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Header Banner */}
              <div className="bg-[#070d18] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 bg-indigo-500/15 text-indigo-300 px-3.5 py-1 rounded-full border border-indigo-500/30 text-xs font-black tracking-widest uppercase mb-2">
                    <Trophy className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Roll of Honor • राज्य गौरव</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-white">
                    OUR STATE ATHLETES & CHAMPIONS
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Over 2,800+ registered athletes. नीचे दिए गए <strong>इवेंट / अनुशासन (Discipline)</strong> फ़िल्टर से मनपसंद स्केटिंग इवेंट के स्केटर्स देखें।
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => navigate('register')}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Register as Skater 2026–27</span>
                  </button>
                  <button
                    onClick={() => navigate('rankings')}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>State Leaderboard & Points →</span>
                  </button>
                </div>
              </div>

              {/* Discipline-Wise Interactive Filter Bar & Search Input */}
              <div className="bg-[#0c1322] border border-slate-800 p-5 rounded-3xl shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Filter className="w-4 h-4 text-amber-400" />
                    <span>इवेंट / अनुशासन अनुसार फ़िल्टर करें (Filter by Discipline):</span>
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full md:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={athleteSearchQuery}
                      onChange={(e) => setAthleteSearchQuery(e.target.value)}
                      placeholder="नाम, जिला या इवेंट खोजें..."
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                    {athleteSearchQuery && (
                      <button
                        onClick={() => setAthleteSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Discipline Filter Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
                  {disciplinesList.map((disc) => (
                    <button
                      key={disc.id}
                      type="button"
                      onClick={() => setAthleteDisciplineFilter(disc.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        athleteDisciplineFilter === disc.id
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20 scale-[1.02]'
                          : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      <span>{disc.label}</span>
                      {disc.id === 'all' && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                          athleteDisciplineFilter === 'all' ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {featuredAthletes.length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Athletes Count Bar */}
              <div className="flex items-center justify-between text-xs text-slate-400 px-2">
                <span>
                  दिखाए जा रहे एथलीट्स: <strong className="text-amber-400">{filteredAthletes.length}</strong> / {featuredAthletes.length}
                </span>
                {athleteDisciplineFilter !== 'all' && (
                  <button
                    onClick={() => setAthleteDisciplineFilter('all')}
                    className="text-amber-400 hover:underline font-semibold cursor-pointer"
                  >
                    सभी इवेंट्स देखें (Reset Filter)
                  </button>
                )}
              </div>

              {/* Athletes Grid with "जर्नी (Journey)" Action Button */}
              {filteredAthletes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAthletes.map((ath) => (
                    <div
                      key={ath.id}
                      className="bg-[#0c1322] border border-slate-800 hover:border-amber-500/60 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-amber-500/10"
                    >
                      <div>
                        <div className="relative h-56 w-full overflow-hidden bg-slate-900 cursor-pointer" onClick={() => setSelectedAthleteForJourney(ath)}>
                          <img
                            src={ath.photo}
                            alt={ath.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1322] via-[#0c1322]/40 to-transparent" />
                          
                          <div className="absolute top-4 left-4">
                            <span className="text-[10px] font-black text-amber-300 bg-slate-950/85 px-2.5 py-1 rounded-full border border-amber-500/40 uppercase tracking-wider backdrop-blur-md">
                              {ath.tag}
                            </span>
                          </div>

                          <div className="absolute bottom-3 left-4 right-4">
                            <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors flex items-center gap-2">
                              <span>{ath.name}</span>
                              {ath.hindiName && (
                                <span className="text-xs font-medium text-slate-300">({ath.hindiName})</span>
                              )}
                            </h3>
                            <p className="text-xs text-amber-400 font-semibold">{ath.discipline} • {ath.category}</p>
                          </div>
                        </div>

                        <div className="p-5 space-y-3">
                          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>District: <strong className="text-white">{ath.district}</strong></span>
                          </div>

                          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-400 font-medium">Key Achievement:</span>
                              <span className="font-bold text-amber-300">{ath.achievement}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
                              <span className="text-slate-400 font-medium">{ath.record}</span>
                              <span className="font-mono font-bold text-white">{ath.medals}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 pt-0">
                        <button
                          type="button"
                          onClick={() => setSelectedAthleteForJourney(ath)}
                          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:scale-[1.02]"
                        >
                          <Flame className="w-4 h-4 text-slate-950 fill-slate-950" />
                          <span>जर्नी (Athlete Journey & Story) ➔</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#0c1322] border border-slate-800 rounded-3xl p-12 text-center space-y-3">
                  <p className="text-slate-300 font-semibold">इस इवेंट या सर्च के लिए कोई एथलीट नहीं मिला।</p>
                  <button
                    onClick={() => {
                      setAthleteDisciplineFilter('all');
                      setAthleteSearchQuery('');
                    }}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    सभी एथलीट देखें (Clear Filter)
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        {/* ========================================================================= */}
        {/* TAB 4: UPRSA FAMILY (FAMILY ECOSYSTEM & INDIVIDUAL PROFILES) */}
        {/* ========================================================================= */}
        {activeTab === 'family' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Header Banner */}
            <div className="bg-[#070d18] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-rose-500/15 text-rose-300 px-3.5 py-1 rounded-full border border-rose-500/30 text-xs font-black tracking-widest uppercase mb-2">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>Statewide Skating Community • यूपीआरएसए परिवार</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white">
                  THE UPRSA FAMILY & STAKEHOLDERS
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  उत्तर प्रदेश रोलर स्केटिंग परिवार के प्रत्येक मार्गदर्शक, जिला सचिव, मुख्य कोच, रेफरी एवं खेल विशेषज्ञों का संपूर्ण विवरण।
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('contact')}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
                >
                  <Mail className="w-4 h-4" />
                  <span>Join / Connect with UPRSA</span>
                </button>
              </div>
            </div>

            {/* Individual Family Members Directory (एक-एक व्यक्ति का इंडिविजुअल फोटो, नाम, स्थान, संक्षिप्त परिचय और संपूर्ण परिचय) */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-rose-400" />
                    <span>UPRSA Family Members Directory (परिवार के सदस्य)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    व्यक्ति का नाम, जिला, पद एवं संक्षिप्त परिचय नीचे दिया गया है। विस्तृत जीवन यात्रा के लिए <strong>"संपूर्ण परिचय"</strong> पर क्लिक करें।
                  </p>
                </div>

                {/* Filter categories */}
                <div className="flex flex-wrap items-center gap-1.5 bg-[#0c1322] p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setFamilyCategoryFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      familyCategoryFilter === 'all'
                        ? 'bg-rose-500 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    सभी ({familyMembers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFamilyCategoryFilter('Patron & Mentor')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      familyCategoryFilter === 'Patron & Mentor'
                        ? 'bg-rose-500 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    मार्गदर्शक
                  </button>
                  <button
                    type="button"
                    onClick={() => setFamilyCategoryFilter('District President / Secretary')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      familyCategoryFilter === 'District President / Secretary'
                        ? 'bg-rose-500 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    जिला पदाधिकारी
                  </button>
                  <button
                    type="button"
                    onClick={() => setFamilyCategoryFilter('Chief Coach / NIS')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      familyCategoryFilter === 'Chief Coach / NIS'
                        ? 'bg-rose-500 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    चीफ कोच
                  </button>
                  <button
                    type="button"
                    onClick={() => setFamilyCategoryFilter('Senior Official / Referee')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      familyCategoryFilter === 'Senior Official / Referee'
                        ? 'bg-rose-500 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    रेफरी व अधिकारी
                  </button>
                </div>
              </div>

              {/* Members Grid with individual Photo, Name, Belonging place, Short Intro, and 'संपूर्ण परिचय' button */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {familyMembers
                  .filter(member => familyCategoryFilter === 'all' || member.roleCategory === familyCategoryFilter)
                  .map((member) => (
                    <div
                      key={member.id}
                      className="bg-[#0c1322] border border-slate-800 hover:border-rose-500/50 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-rose-500/10"
                    >
                      <div>
                        {/* Member Individual Photo */}
                        <div 
                          className="relative h-60 w-full overflow-hidden bg-slate-900 cursor-pointer"
                          onClick={() => setSelectedFamilyMember(member)}
                        >
                          <img
                            src={member.photo}
                            alt={member.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1322] via-[#0c1322]/40 to-transparent" />
                          
                          {/* Role Badge */}
                          <div className="absolute top-4 left-4">
                            <span className="text-[10px] font-black text-rose-300 bg-slate-950/85 px-2.5 py-1 rounded-full border border-rose-500/40 uppercase tracking-wider backdrop-blur-md">
                              {member.badge}
                            </span>
                          </div>

                          <div className="absolute top-4 right-4">
                            <span className="text-[10px] font-bold text-slate-300 bg-black/70 px-2 py-0.5 rounded-md border border-slate-700 backdrop-blur-sm">
                              {member.experienceYears}+ वर्ष अनुभव
                            </span>
                          </div>

                          {/* Member Name & Designation */}
                          <div className="absolute bottom-3 left-4 right-4">
                            <h4 className="text-lg sm:text-xl font-black text-white group-hover:text-rose-300 transition-colors flex items-center gap-1.5">
                              <span>{member.name}</span>
                              {member.hindiName && (
                                <span className="text-xs font-normal text-slate-300">({member.hindiName})</span>
                              )}
                            </h4>
                            <p className="text-xs text-amber-400 font-semibold">{member.designation}</p>
                          </div>
                        </div>

                        {/* Details & Short Intro (छोटा सा परिचय) */}
                        <div className="p-5 space-y-3.5">
                          {/* Native Place & Organization Unit */}
                          <div className="space-y-1.5 text-xs text-slate-300">
                            <div className="flex items-center gap-1.5 text-rose-300 font-semibold">
                              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              <span>मूल स्थान (Native Place): <strong className="text-white">{member.nativePlace}</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span className="truncate">{member.organizationUnit}</span>
                            </div>
                          </div>

                          {/* Short Introduction Box */}
                          <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-slate-800/80 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-rose-400" />
                              <span>संक्षिप्त परिचय (Short Intro):</span>
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                              {member.shortSummary}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 'संपूर्ण परिचय' Button (Opens Full Bio & Life Story Modal) */}
                      <div className="p-5 pt-0">
                        <button
                          type="button"
                          onClick={() => setSelectedFamilyMember(member)}
                          className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-black text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:scale-[1.02]"
                        >
                          <BookOpen className="w-4 h-4 text-white" />
                          <span>संपूर्ण परिचय (Full Bio & Life Story) ➔</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* 4 Pillars Grid */}
            <div className="pt-6 border-t border-slate-800/80 space-y-4">
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <span>UPRSA Institutional Pillars & Infrastructure</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {familyPillars.map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={pillar.id}
                      className="bg-[#0c1322] border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all flex flex-col justify-between group space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-bold font-mono text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800/60">
                            {pillar.count}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                            {pillar.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                            {pillar.description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                        <button
                          onClick={() => navigate(pillar.view)}
                          className="bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-700 hover:border-amber-400 text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                        >
                          <span>{pillar.actionLabel}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <span className="text-[11px] text-slate-400 font-semibold">
                          RSFI Recognized
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* State Secretariat & Infrastructure Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <span>State Secretariat Headquarters</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {info.headOfficeAddress || UPRSA_INFO.headOffice}
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>{info.phone || UPRSA_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>{info.email || UPRSA_INFO.email}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('contact')}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer transition-colors"
              >
                Contact State Secretariat
              </button>
              <button
                onClick={() => navigate('activities')}
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-xl text-xs border border-slate-700 cursor-pointer transition-colors"
              >
                Discipline Guidelines
              </button>
            </div>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>{info.constitutionTitle || 'Constitution & Official Policies'}</span>
            </h3>

            <ul className="space-y-2.5 text-xs text-slate-300">
              {policies.map((policy, idx) => (
                <li key={policy.id || idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{policy.title}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => navigate('news_gallery')}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
              >
                Download Official Constitution & Circulars →
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* ATHLETE JOURNEY MODAL & FULL PROFILE STORY */}
      {/* ========================================================================= */}
      {selectedAthleteForJourney && (
        <AthleteJourneyModal
          athlete={selectedAthleteForJourney}
          onClose={() => setSelectedAthleteForJourney(null)}
          onNavigate={(view) => {
            setSelectedAthleteForJourney(null);
            navigate(view);
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* UPRSA FAMILY MEMBER DETAILED BIO & LIFE STORY MODAL */}
      {/* ========================================================================= */}
      {selectedFamilyMember && (
        <FamilyMemberModal
          member={selectedFamilyMember}
          onClose={() => setSelectedFamilyMember(null)}
          onNavigate={(view) => {
            setSelectedFamilyMember(null);
            navigate(view);
          }}
        />
      )}

    </div>
  );
};
