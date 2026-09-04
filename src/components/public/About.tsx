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
  Sparkles
} from 'lucide-react';
import { UPRSA_INFO } from '../../data/uprsaKnowledge';
import { api } from '../../services/api';
import { AboutContent, AboutSection, AboutPolicy, AboutInfo, CommitteeMember } from '../../types';

interface AboutProps {
  setCurrentView?: (view: string) => void;
  onNavigate?: (view: string) => void;
}

export const About: React.FC<AboutProps> = ({ setCurrentView, onNavigate }) => {
  const [aboutData, setAboutData] = useState<AboutContent | null>(null);
  const [committeeMembers, setCommitteeMembers] = useState<any[]>(UPRSA_INFO.executiveCommittee);
  const [loading, setLoading] = useState(true);

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
      const [aboutRes, commRes] = await Promise.all([
        api.getAboutContent(),
        api.getCommittee()
      ]);

      if (aboutRes.success && aboutRes.data) {
        setAboutData(aboutRes.data);
      }
      if (commRes.success && commRes.data && commRes.data.length > 0) {
        setCommitteeMembers(commRes.data);
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3.5 py-1 rounded-full border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>{info.establishedText || 'ESTABLISHED 1988 • REG. NO. UP/S/294'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {info.title || 'About Uttar Pradesh Roller Sports Association'}
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            {info.tagline || 'The supreme state governing and promotional body for Roller, Speed, Inline Freestyle, Artistic, Roller Hockey, and Downhill skating across 75 districts of Uttar Pradesh.'}
          </p>
        </div>

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
                  {/* Large Photograph Area (45-50% height) with direct JPG display */}
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

        {/* Executive Board */}
        <div className="bg-[#070d18] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
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
                    {/* Large Portrait Image (55-60% of card) */}
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

                      {/* Dignified Federation Placeholder when photo unavailable */}
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

                      {/* Top-Right Small Orange Designation Badge */}
                      <div className="absolute top-3.5 right-3.5 z-10">
                        <div className="inline-flex items-center gap-1.5 bg-amber-500 text-slate-950 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-lg shadow-black/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                          <span>{role}</span>
                        </div>
                      </div>

                      {/* Bottom Gradient Fade over Image */}
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0c1322] via-[#0c1322]/60 to-transparent pointer-events-none" />
                    </div>

                    {/* Person Information Below Photo */}
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

                      {/* Official Biography / Role Description */}
                      <p className="text-xs text-slate-300 leading-relaxed font-normal bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5">
                        {bio}
                      </p>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-0 space-y-3">
                    <div className="border-t border-slate-800/80 pt-4 space-y-3 text-xs">
                      {/* Mobile */}
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

                      {/* Official Email */}
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

        {/* State Secretariat & Infrastructure Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

            <div className="pt-4 border-t border-slate-800 flex gap-3">
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
    </div>
  );
};
