import React from 'react';
import { 
  Shield, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Award, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Heart,
  Lock,
  FileText
} from 'lucide-react';
import { UPRSA_INFO } from '../../data/uprsaKnowledge';
import { UprsaLogo } from './UprsaLogo';

interface FooterProps {
  setCurrentView?: (view: string) => void;
  onNavigate?: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView, onNavigate }) => {
  const navigate = (view: string) => {
    if (onNavigate) onNavigate(view);
    if (setCurrentView) setCurrentView(view);
  };

  return (
    <footer className="w-full bg-[#040811] text-slate-300 border-t border-slate-800/90 select-none">
      
      {/* Top Banner inside Footer */}
      <div className="w-full bg-[#070d18] border-b border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <UprsaLogo size="lg" />
            <div>
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                UTTAR PRADESH ROLLER SPORTS ASSOCIATION
              </h3>
              <p className="text-xs text-amber-400 font-semibold">
                Sole Recognized State Governing Body for Roller Sports in Uttar Pradesh
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Affiliated with Roller Skating Federation of India (RSFI) & UP Olympic Association
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('register')}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
            >
              Athlete Registration
            </button>
            <button
              onClick={() => navigate('verify_athlete')}
              className="bg-[#0b1329] hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
            >
              Verify Digital ID
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Column 1 (2 cols wide on desktop): About & Secretariat Office */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-black text-white uppercase tracking-wider">
                State Secretariat & Headquarters
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Registered under the Societies Registration Act XXI of 1860 (Reg No: {UPRSA_INFO.regNumber}). Dedicated to developing speed skating, inline freestyle, and roller hockey athletes across all 75 districts of UP.
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{UPRSA_INFO.headOffice}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{UPRSA_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{UPRSA_INFO.email}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'Official Home', view: 'home' },
                { label: 'About Association', view: 'about' },
                { label: 'Executive Committee', view: 'about' },
                { label: 'Affiliated Districts (75)', view: 'districts' },
                { label: 'Affiliated Clubs & Rinks', view: 'clubs' },
                { label: 'Championship Calendar', view: 'tournaments' },
                { label: 'Gazette & News Archive', view: 'news_gallery' }
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => navigate(item.view)}
                    className="text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Disciplines */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Sports Disciplines
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                'Inline Speed Skating',
                'Quad Speed Skating',
                'Inline Freestyle Slalom',
                'Roller Hockey',
                'Inline Hockey',
                'Skateboarding & Vert',
                'Roller Freestyle',
                'Downhill & Alpine'
              ].map((disc) => (
                <li key={disc}>
                  <button
                    onClick={() => navigate('activities')}
                    className="text-slate-400 hover:text-indigo-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <span>{disc}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Athlete Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Athlete Services
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'Skater Registration 2026–27', view: 'register' },
                { label: 'Digital Athlete ID Card', view: 'verify_athlete' },
                { label: 'Certificate Verification', view: 'verify_cert' },
                { label: 'Live Race Scoring & Heats', view: 'results' },
                { label: 'State Leaderboard & Points', view: 'rankings' },
                { label: 'Skater Login / Dashboard', view: 'skater_login' },
                { label: 'Official Admin Portal', view: 'admin_login' }
              ].map((serv) => (
                <li key={serv.label}>
                  <button
                    onClick={() => navigate(serv.view)}
                    className="text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <span>{serv.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="w-full bg-[#020409] border-t border-slate-900 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p>© {new Date().getFullYear()} Uttar Pradesh Roller Sports Association (UPRSA). All rights reserved.</p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Affiliated with Roller Skating Federation of India (RSFI) • Sole Governing Body for Roller Sports in UP
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => navigate('about')} className="hover:text-slate-300 transition-colors">Federation Constitution</button>
            <span>•</span>
            <button onClick={() => navigate('contact')} className="hover:text-slate-300 transition-colors">Contact Support</button>
            <span>•</span>
            <button onClick={() => navigate('admin_login')} className="hover:text-amber-400 transition-colors font-mono">Official Admin Login</button>
          </div>
        </div>
      </div>

    </footer>
  );
};
