import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  Award, 
  Shield, 
  Download, 
  Printer, 
  Calendar, 
  User, 
  MapPin, 
  Trophy,
  QrCode,
  Medal,
  Check,
  FileCheck,
  Building2,
  CalendarDays,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Certificate } from '../../types';
import { api } from '../../services/api';
import { useSiteSettings } from '../../context/SiteSettingsContext';

interface CertificateVerificationProps {
  initialCode?: string;
}

export const CertificateVerification: React.FC<CertificateVerificationProps> = ({ initialCode = '' }) => {
  const { settings } = useSiteSettings();
  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialCode) {
      handleVerify(initialCode);
    }
  }, [initialCode]);

  const handleVerify = async (codeToVerify: string) => {
    if (!codeToVerify.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await api.verifyCertificate(codeToVerify.trim());
      if (res.success && res.data) {
        setCertificate(res.data);
      } else {
        setCertificate(null);
        setError(res.message || 'प्रमाण पत्र रिकॉर्ड UPRSA आधिकारिक रजिस्ट्री में नहीं मिला। कृपया कोड जांचें।');
      }
    } catch (err: any) {
      setCertificate(null);
      setError('सत्यापन सर्वर से कनेक्ट करने में त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(code);
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper for position medal style
  const getPositionBadge = (pos?: string) => {
    const p = (pos || '').toLowerCase();
    if (p.includes('1st') || p.includes('gold') || p.includes('प्रथम') || p.includes('gold medal')) {
      return {
        bg: 'from-amber-500/20 via-yellow-500/10 to-amber-600/20 border-amber-400/50 text-amber-300',
        badge: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black',
        icon: Trophy,
        label: pos || '1st Place (Gold Medal 🥇)',
        title: 'गोल्ड मेडल विजेता • स्टेट चैंपियन (1st Rank)'
      };
    }
    if (p.includes('2nd') || p.includes('silver') || p.includes('द्वितीय') || p.includes('silver medal')) {
      return {
        bg: 'from-slate-300/20 via-slate-400/10 to-slate-500/20 border-slate-300/50 text-slate-200',
        badge: 'bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 font-black',
        icon: Medal,
        label: pos || '2nd Place (Silver Medal 🥈)',
        title: 'सिल्वर मेडल विजेता (2nd Rank)'
      };
    }
    if (p.includes('3rd') || p.includes('bronze') || p.includes('तृतीय') || p.includes('bronze medal')) {
      return {
        bg: 'from-amber-700/20 via-orange-800/10 to-amber-900/20 border-orange-600/50 text-orange-300',
        badge: 'bg-gradient-to-r from-amber-600 to-orange-500 text-white font-black',
        icon: Medal,
        label: pos || '3rd Place (Bronze Medal 🥉)',
        title: 'कांस्य / ब्रॉन्ज मेडल विजेता (3rd Rank)'
      };
    }
    return {
      bg: 'from-blue-500/20 via-indigo-500/10 to-blue-600/20 border-blue-400/50 text-blue-300',
      badge: 'bg-blue-600 text-white font-bold',
      icon: Award,
      label: pos || 'Official Participation & Merit',
      title: 'सफल प्रतिभागिता व मेरिट प्रमाण पत्र'
    };
  };

  const posInfo = certificate ? getPositionBadge(certificate.position) : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-1.5 rounded-full border border-emerald-500/30 text-xs font-bold uppercase tracking-wider shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>आधिकारिक स्टेट सर्टिफिकेट सत्यापन पोर्टल • CERTIFICATE AUTHENTICATION</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            वेरिफाई सर्टिफिकेट (Verify Certificate)
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            सर्टिफिकेट नंबर (जैसे <span className="text-amber-400 font-mono font-bold">UPRSA/CERT/2026/00101</span>) या ऑथेंटिकेशन कोड दर्ज करें। बच्चे का नाम, टूर्नामेंट, पोजीशन व दिनांक तुरंत स्क्रीन पर सत्यापित हो जाएंगे।
          </p>
        </div>

        {/* Verification Form Bar */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
          <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="सर्टिफिकेट नंबर या कोड दर्ज करें (उदा. UPRSA/CERT/2026/00101 या 7f89a101)"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-xs sm:text-sm text-white uppercase placeholder:normal-case placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black px-8 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              {loading ? (
                <span>रिकॉर्ड खोजा जा रहा है...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>सर्टिफिकेट वेरिफाई करें</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Verification Results Display */}
        {searched && (
          <div>
            {certificate ? (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                {/* 1. Official Authenticated Verification Banner */}
                <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border-2 border-emerald-500/50 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 text-center md:text-left">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border-2 border-emerald-500/50 shrink-0 shadow-lg shadow-emerald-500/10">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-black px-3 py-0.5 rounded-full border border-emerald-500/40 mb-1 uppercase tracking-wide">
                        <Shield className="w-3 h-3" />
                        <span>आधिकारिक वैध प्रमाण पत्र • AUTHENTIC & VALID</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        सर्टिफिकेट सत्यापन सफल (Verified & Authentic)
                      </h3>
                      <p className="text-xs text-emerald-400/90 font-mono mt-0.5">
                        सर्टिफिकेट नंबर: <span className="font-bold text-white">{certificate.certificateNumber}</span> • ऑथ कोड: <span className="text-amber-400 font-bold">{certificate.verificationCode}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => {
                        setCertificate(null);
                        setSearched(false);
                        setCode('');
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-all"
                    >
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <span>नया सत्यापन करें</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-emerald-500/40 cursor-pointer transition-all"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>प्रिंट विवरण (Print Details)</span>
                    </button>
                  </div>
                </div>

                {/* 2. Key Highlights Dashboard: Position, Child & Tournament */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Highlight 1: Position / Rank */}
                  <div className={`bg-gradient-to-br ${posInfo?.bg || 'bg-slate-900 border-slate-800'} border rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <Trophy className="w-3.5 h-3.5 text-amber-400" />
                          <span>टूर्नामेंट में स्थान / पोजीशन</span>
                        </span>
                        {certificate.races && certificate.races.length > 1 && (
                          <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-black border border-amber-500/30">
                            {certificate.races.length} रेस खेलीं
                          </span>
                        )}
                      </div>

                      {certificate.races && certificate.races.length > 1 ? (
                        <div className="space-y-2 pt-1">
                          {certificate.races.map((rc, idx) => {
                            const rBadge = getPositionBadge(rc.position);
                            return (
                              <div key={idx} className="bg-slate-950/80 border border-white/10 rounded-2xl p-2.5 flex items-center justify-between gap-2">
                                <div className="space-y-0.5">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase">रेस {idx + 1}</span>
                                  <div className="text-xs font-bold text-white leading-tight">{rc.raceName}</div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 ${rBadge.badge}`}>
                                  {rc.position}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <>
                          <div className="pt-1">
                            <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-black shadow-md ${posInfo?.badge}`}>
                              {posInfo?.label}
                            </span>
                          </div>
                          <h4 className="text-xl font-black text-white pt-1 leading-tight">
                            {certificate.position || 'सफल प्रतिभागिता (Participation)'}
                          </h4>
                          <p className="text-xs text-slate-300">
                            {posInfo?.title}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                      <span>कैटेगरी: <strong className="text-white">{certificate.type || 'State Merit'}</strong></span>
                      <span>स्थिति: <strong className="text-emerald-400">वेरिफाइड</strong></span>
                    </div>
                  </div>

                  {/* Highlight 2: Child Name & Athlete Info */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      <span>सर्टिफिकेट किसके नाम से इशू है? (खिलाड़ी का विवरण)</span>
                    </span>

                    <div className="space-y-1">
                      <div className="text-2xl font-black text-white flex items-center gap-2">
                        <span>{certificate.recipientName}</span>
                      </div>
                      {certificate.fatherName && (
                        <p className="text-xs text-slate-300">
                          पिता / अभिभावक: <strong className="text-white">{certificate.fatherName}</strong>
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 block uppercase font-semibold">UPRSA रजिस्ट्रेशन नंबर</span>
                        <span className="font-mono font-bold text-amber-400 text-xs truncate block">
                          {certificate.recipientRegNo || 'UPRSA/REG/VERIFIED'}
                        </span>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 block uppercase font-semibold">गृह जिला (District)</span>
                        <span className="font-bold text-white text-xs truncate block">
                          {certificate.district || 'उत्तर प्रदेश'}
                        </span>
                      </div>
                    </div>

                    {certificate.club && (
                      <div className="text-xs text-slate-400 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate font-medium">क्लब/अकादमी: <strong className="text-slate-200">{certificate.club}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Highlight 3: Tournament & Dates */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-emerald-400" />
                      <span>किस टूर्नामेंट का है? (प्रतियोगिता व दिनांक)</span>
                    </span>

                    <div className="space-y-1">
                      <h4 className="text-base font-black text-white leading-snug">
                        {certificate.tournamentName || 'उत्तर प्रदेश राज्य रोलर स्पोर्ट्स चैंपियनशिप 2026'}
                      </h4>
                      {certificate.eventName && (
                        <p className="text-xs font-semibold text-amber-300">
                          इवेंट/रेस: {certificate.eventName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 pt-1 text-xs">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>
                          टूर्नामेंट दिनांक:{' '}
                          <strong className="text-white">
                            {certificate.tournamentStartDate 
                              ? `${certificate.tournamentStartDate} ${certificate.tournamentEndDate ? `से ${certificate.tournamentEndDate}` : ''}`
                              : (certificate.issueDate || '2026')}
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-300">
                        <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>
                          सर्टिफिकेट जारी दिनांक: <strong className="text-white font-mono">{certificate.issueDate || '2026-08-22'}</strong>
                        </span>
                      </div>

                      {(certificate.tournamentVenue || certificate.tournamentCity) && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                          <span className="truncate">
                            स्थान: <strong className="text-white">{certificate.tournamentVenue || certificate.tournamentCity}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Detailed Multi-Race Breakdown Cards */}
                {certificate.races && certificate.races.length > 0 && (
                  <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                      <div>
                        <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-3 py-0.5 rounded-full text-[11px] font-black uppercase mb-1.5">
                          <Trophy className="w-3.5 h-3.5 text-amber-400" />
                          <span>प्रतियोगिता परिणाम • ALL RACES & STANDINGS</span>
                        </div>
                        <h3 className="text-xl font-black text-white">
                          टूर्नामेंट में खेली गई सभी रेस एवं प्राप्त पोजीशन का विवरण ({certificate.races.length} Races)
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          खिलाड़ी <strong className="text-white">{certificate.recipientName}</strong> ने इस चैंपियनशिप में कुल {certificate.races.length} रेस में भाग लिया। तीनों रेस का सत्यापन इस एकल प्रमाण पत्र द्वारा प्रमाणित है:
                        </p>
                      </div>

                      <div className="shrink-0">
                        <span className="bg-emerald-500/20 text-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>UPRSA आधिकारिक सत्यापित</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {certificate.races.map((r, idx) => {
                        const rBadge = getPositionBadge(r.position);
                        return (
                          <div
                            key={idx}
                            className="bg-slate-950/90 rounded-2xl p-5 border border-slate-800/90 space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase">
                                  रेस {idx + 1} (Race {idx + 1})
                                </span>
                                <span className="text-[11px] text-slate-400 font-medium">
                                  {certificate.discipline || 'Speed Skating'}
                                </span>
                              </div>

                              <h4 className="text-base font-black text-white leading-snug">
                                {r.raceName}
                              </h4>

                              {certificate.ageCategory && (
                                <p className="text-[11px] text-slate-400">
                                  आयु वर्ग: <strong className="text-slate-300">{certificate.ageCategory}</strong>
                                </p>
                              )}
                            </div>

                            <div className="pt-3 border-t border-slate-800/80 space-y-2">
                              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                                टूर्नामेंट में प्राप्त पोजीशन / स्थान:
                              </span>
                              <div className={`p-3 rounded-xl text-xs font-black flex items-center justify-between shadow-md ${rBadge.badge}`}>
                                <span>{r.position}</span>
                                <Trophy className="w-4 h-4 shrink-0" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#0f172a] border border-red-500/40 rounded-3xl p-8 text-center space-y-4 shadow-xl">
                <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
                  <XCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  सत्यापन असफल / रिकॉर्ड नहीं मिला (Record Not Found)
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  {error || 'दर्ज किया गया सर्टिफिकेट कोड UPRSA आधिकारिक रजिस्ट्री से मैच नहीं हुआ। कृपया सर्टिफिकेट पर छपा नंबर या कोड दोबारा जांच कर पुनः दर्ज करें।'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
