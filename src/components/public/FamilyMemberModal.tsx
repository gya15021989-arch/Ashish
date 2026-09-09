import React from 'react';
import { 
  Heart, 
  MapPin, 
  Award, 
  ArrowLeft, 
  Phone, 
  Mail, 
  Calendar, 
  Building2, 
  Sparkles, 
  Target, 
  Briefcase,
  Star,
  Quote
} from 'lucide-react';

export interface FamilyMemberData {
  id: string;
  name: string;
  hindiName?: string;
  photo: string;
  roleCategory: 'Patron & Mentor' | 'District President / Secretary' | 'Chief Coach / NIS' | 'Senior Official / Referee' | 'Sports Doctor & Physiotherapist' | 'Veteran Skater & Pioneer';
  designation: string;
  organizationUnit: string;
  nativePlace: string;
  currentLocation: string;
  experienceYears: number;
  badge: string;
  phone?: string;
  email?: string;
  shortSummary: string;
  fullBio: {
    originAndEarlyLife: string;
    skatingContribution: string;
    careerJourney: string;
    philosophyAndMessage: string;
    specialHonors: string[];
    galleryMoments?: {
      url: string;
      caption: string;
    }[];
  };
}

interface FamilyMemberModalProps {
  member: FamilyMemberData | null;
  onClose: () => void;
  onNavigate?: (view: string) => void;
}

export const FamilyMemberModal: React.FC<FamilyMemberModalProps> = ({ member, onClose, onNavigate }) => {
  if (!member) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-[#0a1120] border border-rose-500/30 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl shadow-black/80 my-auto text-slate-100 relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="bg-[#070d18]/95 border-b border-slate-800/90 px-6 py-4 flex items-center justify-between z-20 backdrop-blur-md sticky top-0 shrink-0">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-rose-400" />
            <span>वापस (Back to UPRSA Family)</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>UPRSA Family Official Profile</span>
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 border border-slate-700 flex items-center justify-center text-slate-400 hover:border-rose-500/40 text-sm font-bold transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-8 custom-scrollbar flex-1">
          
          {/* Top Profile Card Header */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-r from-slate-950 via-[#131124] to-slate-950 p-6 sm:p-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
              {/* Photo */}
              <div className="relative shrink-0">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-2 border-rose-500/40 shadow-2xl bg-slate-900">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-lg shadow-black/80 whitespace-nowrap">
                  {member.badge}
                </div>
              </div>

              {/* Information */}
              <div className="space-y-4 text-center md:text-left flex-1">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span className="text-xs font-bold text-rose-400 bg-rose-950/80 border border-rose-500/30 px-2.5 py-0.5 rounded-lg">
                      {member.roleCategory}
                    </span>
                    <span className="text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700 px-2.5 py-0.5 rounded-lg">
                      अनुभव: {member.experienceYears}+ वर्ष
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                    <span>{member.name}</span>
                    {member.hindiName && (
                      <span className="text-slate-400 font-normal text-xl sm:text-2xl">({member.hindiName})</span>
                    )}
                  </h1>

                  <div className="text-xs sm:text-sm font-bold text-amber-400">
                    {member.designation} • <span className="text-slate-200 font-semibold">{member.organizationUnit}</span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-rose-300 flex items-center justify-center md:justify-start gap-1.5 pt-0.5">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>मूल निवास (Native Place): <strong className="text-white">{member.nativePlace}</strong> • वर्तमान: <strong className="text-white">{member.currentLocation}</strong></span>
                  </p>
                </div>

                {/* Quick Info Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">संबद्ध इकाई / जिला</span>
                    <span className="text-xs font-bold text-white truncate block">{member.organizationUnit}</span>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">संपर्क नंबर</span>
                    <span className="text-xs font-bold text-white truncate block">{member.phone || 'Available with UPRSA'}</span>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-center col-span-2 sm:col-span-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">ईमेल</span>
                    <span className="text-xs font-bold text-white truncate block">{member.email || 'office@uprsa.org'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Full Biography & Story Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Comprehensive Story */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* 1. Origin & Early Life */}
              <div className="bg-[#0c1322] border border-slate-800 p-6 sm:p-7 rounded-3xl space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-black text-sm uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>मूल निवास, पृष्ठभूमि एवं प्रारंभिक जीवन (Origin & Background)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  {member.fullBio.originAndEarlyLife}
                </p>
              </div>

              {/* 2. Skating Contribution */}
              <div className="bg-[#0c1322] border border-slate-800 p-6 sm:p-7 rounded-3xl space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-black text-sm uppercase tracking-wider">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>स्केटिंग खेल में अभूतपूर्व योगदान एवं उपलब्धियां (Skating Contribution)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  {member.fullBio.skatingContribution}
                </p>
              </div>

              {/* 3. Career Journey & Administrative Leadership */}
              <div className="bg-[#0c1322] border border-slate-800 p-6 sm:p-7 rounded-3xl space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 font-black text-sm uppercase tracking-wider">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                  <span>जीवन यात्रा एवं संगठनात्मक अनुभव (Life Journey & Roles)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  {member.fullBio.careerJourney}
                </p>
              </div>

            </div>

            {/* Right 1 Col: Honors, Philosophy & Moments */}
            <div className="space-y-6">
              
              {/* Special Honors */}
              <div className="bg-[#0c1322] border border-slate-800 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span>प्रमुख सम्मान एवं दायित्व</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {member.fullBio.specialHonors.map((honor, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>{honor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Philosophy / Message */}
              <div className="bg-gradient-to-br from-rose-500/15 via-[#0c1322] to-slate-900 border border-rose-500/30 p-6 rounded-3xl space-y-3">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
                  <Quote className="w-4 h-4 text-rose-400" />
                  <span>युवा खिलाड़ियों के लिए संदेश</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed italic font-medium">
                  "{member.fullBio.philosophyAndMessage}"
                </p>
              </div>

              {/* Gallery Photos if any */}
              {member.fullBio.galleryMoments && member.fullBio.galleryMoments.length > 0 && (
                <div className="bg-[#0c1322] border border-slate-800 p-6 rounded-3xl space-y-4">
                  <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-rose-400" />
                    <span>संगठनात्मक झलकियां</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {member.fullBio.galleryMoments.map((pic, i) => (
                      <div key={i} className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-800">
                        <img
                          src={pic.url}
                          alt={pic.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                          <span className="text-[10px] font-medium text-slate-200 truncate">{pic.caption}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
