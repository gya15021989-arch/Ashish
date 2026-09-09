import React from 'react';
import { 
  Trophy, 
  MapPin, 
  Calendar, 
  Award, 
  Flame, 
  Target, 
  ArrowLeft, 
  Clock, 
  ShieldCheck, 
  Star, 
  Sparkles, 
  Share2, 
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Activity,
  Zap
} from 'lucide-react';

export interface AthleteJourneyData {
  id: string;
  name: string;
  hindiName?: string;
  district: string;
  discipline: string;
  category: string;
  achievement: string;
  record: string;
  medals: string;
  photo: string;
  tag: string;
  regNo: string;
  dob: string;
  age: number;
  clubName: string;
  coachName: string;
  startedYear: number;
  bioSummary: string;
  personalStory: string;
  specialty: string;
  trainingRegime: string;
  gearSetup: string;
  quote: string;
  careerMilestones: {
    year: string;
    event: string;
    level: 'District' | 'State' | 'National' | 'International';
    result: string;
    timingOrScore?: string;
    highlight: string;
  }[];
  galleryPhotos: {
    url: string;
    caption: string;
  }[];
  stats: {
    stateMedals: number;
    nationalMedals: number;
    racesWon: number;
    personalBest: string;
  };
}

interface AthleteJourneyModalProps {
  athlete: AthleteJourneyData | null;
  onClose: () => void;
  onNavigate?: (view: string) => void;
}

export const AthleteJourneyModal: React.FC<AthleteJourneyModalProps> = ({ athlete, onClose, onNavigate }) => {
  if (!athlete) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-[#0a1120] border border-amber-500/30 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl shadow-black/80 my-auto text-slate-100 relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Back button and Quick Action */}
        <div className="bg-[#070d18]/95 border-b border-slate-800/90 px-6 py-4 flex items-center justify-between z-20 backdrop-blur-md sticky top-0 shrink-0">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>वापस (Back to Athletes)</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Official UPRSA Athlete Profile</span>
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 border border-slate-700 flex items-center justify-center text-slate-400 hover:border-rose-500/40 text-sm font-bold transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-8 custom-scrollbar flex-1">
          
          {/* Top Hero Banner Section */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-r from-slate-950 via-[#0d1629] to-slate-950 p-6 sm:p-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
              {/* Profile Photo */}
              <div className="relative shrink-0">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-2 border-amber-500/50 shadow-2xl bg-slate-900">
                  <img
                    src={athlete.photo}
                    alt={athlete.name}
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-lg shadow-black/80 whitespace-nowrap">
                  {athlete.tag}
                </div>
              </div>

              {/* Title, Details, Quick Badges */}
              <div className="space-y-4 text-center md:text-left flex-1">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span className="text-xs font-bold text-amber-400 bg-amber-950/80 border border-amber-500/30 px-2.5 py-0.5 rounded-lg">
                      {athlete.discipline}
                    </span>
                    <span className="text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700 px-2.5 py-0.5 rounded-lg">
                      {athlete.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400 bg-slate-900/90 border border-slate-800 px-2.5 py-0.5 rounded-lg">
                      Reg: {athlete.regNo}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                    <span>{athlete.name}</span>
                    {athlete.hindiName && (
                      <span className="text-slate-400 font-normal text-xl sm:text-2xl">({athlete.hindiName})</span>
                    )}
                  </h1>

                  <p className="text-xs sm:text-sm font-semibold text-amber-300 flex items-center justify-center md:justify-start gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>District: <strong className="text-white">{athlete.district}</strong> • Affiliated with Uttar Pradesh Roller Sports Association</span>
                  </p>
                </div>

                {/* Quick Info Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Club / Academy</span>
                    <span className="text-xs font-bold text-white truncate block">{athlete.clubName}</span>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Coach / Mentor</span>
                    <span className="text-xs font-bold text-white truncate block">{athlete.coachName}</span>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Started In</span>
                    <span className="text-xs font-bold text-amber-400 block">{athlete.startedYear} (Exp: {2026 - athlete.startedYear} Yrs)</span>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Medals</span>
                    <span className="text-xs font-black text-white block">{athlete.medals}</span>
                  </div>
                </div>

                {/* Quote */}
                {athlete.quote && (
                  <div className="p-3 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-xl text-xs text-amber-200 italic font-medium">
                    "{athlete.quote}"
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#0c1322] border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-extrabold text-slate-400 block">National Medals</span>
                <span className="text-xl font-black text-white">{athlete.stats.nationalMedals} 🥇/🥈</span>
              </div>
            </div>

            <div className="bg-[#0c1322] border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-extrabold text-slate-400 block">State Championships</span>
                <span className="text-xl font-black text-white">{athlete.stats.stateMedals} Medals</span>
              </div>
            </div>

            <div className="bg-[#0c1322] border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Races / Heats Won</span>
                <span className="text-xl font-black text-white">{athlete.stats.racesWon}+ Wins</span>
              </div>
            </div>

            <div className="bg-[#0c1322] border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Personal Best Time</span>
                <span className="text-xl font-black text-amber-300 font-mono">{athlete.stats.personalBest}</span>
              </div>
            </div>
          </div>

          {/* Detailed Biography & Journey Story */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Inspiring Journey & Personal Story */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#0c1322] border border-slate-800 p-6 sm:p-7 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-black text-sm uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>खिलाड़ी की प्रेरणादायक यात्रा (The Skater's Journey & Evolution)</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  {athlete.bioSummary}
                </p>

                <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800/90 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span>शुरुआती संघर्ष और प्रशिक्षण का सफर (Early Days & Training Grind)</span>
                  </h4>
                  <p>{athlete.personalStory}</p>
                </div>
              </div>

              {/* Career Timeline / Milestones */}
              <div className="bg-[#0c1322] border border-slate-800 p-6 sm:p-7 rounded-3xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-white font-black text-base">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>कैरियर की प्रमुख उपलब्धियां (Career Milestones & Records)</span>
                  </div>
                  <span className="text-xs text-slate-400">RSFI & UPRSA Verified</span>
                </div>

                <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
                  {athlete.careerMilestones.map((ms, idx) => (
                    <div key={idx} className="relative pl-9 space-y-1">
                      <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-[#0c1322] -translate-x-1/2 shadow-sm" />
                      
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-black text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                            {ms.year}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-white">
                            {ms.event}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-lg">
                          {ms.result}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 font-normal">
                        {ms.highlight}
                      </p>
                      {ms.timingOrScore && (
                        <span className="text-[11px] font-mono text-amber-300 font-semibold block">
                          ⏱ {ms.timingOrScore}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Training Regime, Gear Setup & Gallery Photos */}
            <div className="space-y-6">
              
              {/* Technical Specialty & Gear */}
              <div className="bg-[#0c1322] border border-slate-800 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>तकनीकी विशेषता व उपकरण</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-slate-400 font-semibold block">तकनीकी विशेषता (Specialty):</span>
                    <p className="text-slate-200">{athlete.specialty}</p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-slate-400 font-semibold block">दैनिक ट्रेनिंग शिड्यूल (Regime):</span>
                    <p className="text-slate-200">{athlete.trainingRegime}</p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-slate-400 font-semibold block">स्केट गियर व सेटअप (Equipment):</span>
                    <p className="text-slate-200 font-mono text-[11px]">{athlete.gearSetup}</p>
                  </div>
                </div>
              </div>

              {/* Photo Moments Gallery */}
              <div className="bg-[#0c1322] border border-slate-800 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>ट्रैक के यादगार पल (Track Moments)</span>
                </h3>

                <div className="grid grid-cols-2 gap-2.5">
                  {athlete.galleryPhotos.map((photo, i) => (
                    <div key={i} className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-800">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[10px] font-medium text-slate-200 truncate">{photo.caption}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Call to Action */}
              <div className="p-4 bg-gradient-to-br from-amber-500/20 via-[#0c1322] to-slate-900 border border-amber-500/40 rounded-2xl text-center space-y-2">
                <span className="text-xs font-bold text-amber-300 block">प्रेरित हों और स्केटिंग शुरू करें!</span>
                <p className="text-[11px] text-slate-300">उत्तर प्रदेश रोलर स्पोर्ट्स एसोसिएशन के साथ अपना खिलाड़ी पंजीकरण कराएं।</p>
                <button
                  onClick={() => {
                    onClose();
                    if (onNavigate) onNavigate('register');
                  }}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  नया एथलीट रजिस्ट्रेशन करें ➔
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
