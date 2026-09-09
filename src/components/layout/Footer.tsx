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
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useLanguage } from '../../context/LanguageContext';

interface FooterProps {
  setCurrentView?: (view: string) => void;
  onNavigate?: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView, onNavigate }) => {
  const { settings } = useSiteSettings();
  const { lang } = useLanguage();
  const isHindi = lang === 'hi';

  const orgName = isHindi
    ? (settings?.organizationNameHindi || settings?.organizationName || 'उत्तर प्रदेश रोलर स्पोर्ट्स एसोसिएशन')
    : (settings?.organizationName || 'UTTAR PRADESH ROLLER SPORTS ASSOCIATION');
  const orgTagline = isHindi
    ? (settings?.taglineHindi || settings?.tagline || 'स्टेट गवर्निंग बॉडी ऑफ रोलर स्पोर्ट्स इन उत्तर प्रदेश')
    : (settings?.tagline || 'Sole Recognized State Governing Body for Roller Sports in Uttar Pradesh');
  const affNotice = isHindi
    ? (settings?.affiliationNoticeHindi || settings?.affiliationNotice || 'भारतीय रोलर स्केटिंग महासंघ (RSFI) एवं यूपी ओलंपिक संघ (UPOA) से संबद्ध')
    : (settings?.affiliationNotice || 'Affiliated with Roller Skating Federation of India (RSFI) & UP Olympic Association');
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
                {orgName}
              </h3>
              <p className="text-xs text-amber-400 font-semibold uppercase">
                {orgTagline}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {affNotice}
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
                <span>{settings?.officialAddress || UPRSA_INFO.headOffice}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings?.contactPhone || UPRSA_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings?.contactEmail || UPRSA_INFO.email}</span>
              </div>
            </div>

            {/* Official Social Media Channels */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                {isHindi ? 'सोशल मीडिया हैंडल्स' : 'Official Social Channels'}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {settings?.socialVisibility?.facebook !== false && settings?.socialLinks?.facebook && (
                  <a
                    href={settings.socialLinks.facebook.startsWith('http') ? settings.socialLinks.facebook : `https://${settings.socialLinks.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white flex items-center justify-center text-xs transition-transform hover:scale-110"
                    title="Facebook"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                )}
                {settings?.socialVisibility?.instagram !== false && settings?.socialLinks?.instagram && (
                  <a
                    href={settings.socialLinks.instagram.startsWith('http') ? settings.socialLinks.instagram : `https://${settings.socialLinks.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center text-xs transition-transform hover:scale-110"
                    title="Instagram"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/></svg>
                  </a>
                )}
                {settings?.socialVisibility?.youtube !== false && settings?.socialLinks?.youtube && (
                  <a
                    href={settings.socialLinks.youtube.startsWith('http') ? settings.socialLinks.youtube : `https://${settings.socialLinks.youtube}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#FF0000] hover:bg-[#e60000] text-white flex items-center justify-center text-xs transition-transform hover:scale-110"
                    title="YouTube"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                )}
                {settings?.socialVisibility?.whatsapp !== false && settings?.socialLinks?.whatsapp && (
                  <a
                    href={(() => {
                      const w = settings.socialLinks.whatsapp;
                      if (w.startsWith('http')) return w;
                      const d = w.replace(/[^0-9]/g, '');
                      return `https://wa.me/${d}`;
                    })()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center text-xs transition-transform hover:scale-110"
                    title="WhatsApp"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
                  </a>
                )}
                {settings?.socialVisibility?.twitter !== false && settings?.socialLinks?.twitter && (
                  <a
                    href={settings.socialLinks.twitter.startsWith('http') ? settings.socialLinks.twitter : `https://${settings.socialLinks.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-black border border-slate-700 hover:bg-slate-900 text-white flex items-center justify-center text-xs transition-transform hover:scale-110"
                    title="X (Twitter)"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                )}
                {settings?.socialVisibility?.linkedin !== false && settings?.socialLinks?.linkedin && (
                  <a
                    href={settings.socialLinks.linkedin.startsWith('http') ? settings.socialLinks.linkedin : `https://${settings.socialLinks.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#0A66C2] hover:bg-[#084e96] text-white flex items-center justify-center text-xs transition-transform hover:scale-110"
                    title="LinkedIn"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                )}
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
                { label: 'Executive Council (कार्यकारिणी)', view: 'about_executive' },
                { label: 'Our Athletes (खिलाड़ी)', view: 'about_athletes' },
                { label: 'UPRSA Family (परिवार)', view: 'about_family' },
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
