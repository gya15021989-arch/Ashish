import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Shield,
  Zap,
  Lock,
  Users,
  Check,
  Copy,
  Printer,
  Sparkles,
  Eye,
  EyeOff,
  UserCheck,
  Layers,
  Award,
  Clock,
  ExternalLink,
  CheckSquare,
  Square
} from 'lucide-react';
import { Tournament, Skater, TournamentEvent, TournamentRegistration, PaymentSettings, DisciplineType } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { AGE_CATEGORIES_2026 } from '../../data/uprsaKnowledge';
import { generateStandardChampionshipEvents, ALL_STANDARD_AGE_CATEGORIES } from '../../data/officialChampionshipEvents';

interface SkaterTournamentRegistrationProps {
  initialTournament?: Tournament | null;
  skater?: Skater | null;
  onSuccess: (reg: TournamentRegistration) => void;
  onCancel: () => void;
}

export const SkaterTournamentRegistration: React.FC<SkaterTournamentRegistrationProps> = ({
  initialTournament,
  skater: propSkater,
  onSuccess,
  onCancel
}) => {
  const { skater: authSkater, login: authLogin } = useAuth();
  const currentSkater = propSkater || authSkater || null;

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(initialTournament || null);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);

  // Registration Workflow Step: 'races' -> 'payment' -> 'confirmation'
  const [step, setStep] = useState<'races' | 'payment' | 'confirmation'>('races');
  const [confirmedRegistration, setConfirmedRegistration] = useState<TournamentRegistration | null>(null);

  // Skater Details state
  const [skaterRegNo, setSkaterRegNo] = useState(currentSkater?.registrationNumber || '');
  const [skaterName, setSkaterName] = useState(
    currentSkater ? `${currentSkater.firstName} ${currentSkater.lastName}`.trim() : ''
  );
  const [district, setDistrict] = useState(currentSkater?.district || 'Lucknow');
  const [club, setClub] = useState(currentSkater?.club || 'Awadh Roller Sports Club');
  const [ageCategory, setAgeCategory] = useState(currentSkater?.ageCategory || 'Sub-Junior (12 to 15)');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(currentSkater?.gender || 'Male');
  const [discipline, setDiscipline] = useState(currentSkater?.discipline || 'Speed Skating (Quad)');

  // Discipline Filter for Races: 'my_discipline' | 'all' | specific discipline name
  const [disciplineFilter, setDisciplineFilter] = useState<'my_discipline' | 'all' | string>('my_discipline');

  // Inline Skater Login State (if not logged in)
  const [loginRegNo, setLoginRegNo] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Payment State
  const [paymentUtr, setPaymentUtr] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Synchronize when currentSkater updates
  useEffect(() => {
    if (currentSkater) {
      setSkaterRegNo(currentSkater.registrationNumber || '');
      setSkaterName(`${currentSkater.firstName || ''} ${currentSkater.lastName || ''}`.trim());
      setDistrict(currentSkater.district || 'Lucknow');
      setClub(currentSkater.club || 'Awadh Roller Sports Club');
      setAgeCategory(currentSkater.ageCategory || 'Sub-Junior (12 to 15)');
      setGender(currentSkater.gender || 'Male');
      setDiscipline(currentSkater.discipline || 'Speed Skating (Quad)');
    }
  }, [currentSkater]);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tRes, pRes] = await Promise.all([
        api.getTournaments(),
        api.getPaymentSettings()
      ]);

      if (tRes.success && tRes.data) {
        setTournaments(tRes.data);
        if (!selectedTournament && tRes.data.length > 0) {
          setSelectedTournament(tRes.data[0]);
        }
      }
      if (pRes.success && pRes.data) {
        setPaymentSettings(pRes.data);
      }
    } catch (e) {
      console.error('Failed to load tournament entry data:', e);
    }
  };

  // Helper: Discipline Match logic
  const doesEventMatchDiscipline = (evDiscipline: string, skaterDisc: string): boolean => {
    if (!evDiscipline || !skaterDisc) return true;
    const e = evDiscipline.toLowerCase().trim();
    const s = skaterDisc.toLowerCase().trim();

    if (e === s) return true;

    // Quad speed matching
    const isQuadSkater = s.includes('quad');
    const isQuadEvent = e.includes('quad');
    if (isQuadSkater && isQuadEvent) return true;
    if (isQuadSkater && !isQuadEvent) return false;
    if (!isQuadSkater && isQuadEvent) return false;

    // Inline speed matching
    const isInlineSpeedSkater = s.includes('inline') && (s.includes('speed') || !s.includes('freestyle'));
    const isInlineSpeedEvent = e.includes('inline') && (e.includes('speed') || (!e.includes('freestyle') && !e.includes('hockey')));
    if (isInlineSpeedSkater && isInlineSpeedEvent) return true;

    // Freestyle matching
    const isFreestyleSkater = s.includes('freestyle') || s.includes('slalom');
    const isFreestyleEvent = e.includes('freestyle') || e.includes('slalom');
    if (isFreestyleSkater && isFreestyleEvent) return true;

    // Artistic matching
    const isArtisticSkater = s.includes('artistic') || s.includes('figure') || s.includes('dance');
    const isArtisticEvent = e.includes('artistic') || e.includes('figure') || e.includes('dance');
    if (isArtisticSkater && isArtisticEvent) return true;

    // Hockey matching
    const isHockeySkater = s.includes('hockey');
    const isHockeyEvent = e.includes('hockey');
    if (isHockeySkater && isHockeyEvent) return true;

    // Skateboarding
    if (s.includes('skateboarding') && e.includes('skateboarding')) return true;

    return e.includes(s) || s.includes(e);
  };

  // Helper: Age Category Eligibility check
  const isEventEligibleForSkater = (ev: TournamentEvent, targetAgeCat: string = ageCategory): boolean => {
    if (!targetAgeCat) return true;
    const allowed = ev.ageCategories && ev.ageCategories.length > 0
      ? ev.ageCategories
      : (ev.ageCategory ? [ev.ageCategory] : []);
      
    if (allowed.length === 0) return true;
    if (allowed.some(c => c.toLowerCase().includes('all') || c.toLowerCase().includes('open') || c.toLowerCase().includes('सभी'))) return true;

    const target = targetAgeCat.toLowerCase().trim();
    
    return allowed.some(cat => {
      const c = cat.toLowerCase().trim();
      if (c === target) return true;
      if (c.includes(target) || target.includes(c)) return true;
      
      // Sub-Junior / 11-14 / 12-15
      const isSubJunior = (str: string) => str.includes('sub-jun') || str.includes('sub junior') || str.includes('11 to 14') || str.includes('12 to 15') || str.includes('11-14') || str.includes('12-15');
      if (isSubJunior(c) && isSubJunior(target)) return true;

      // Junior / 14-17 / 15-18
      const isJunior = (str: string) => (str.includes('junior') && !str.includes('sub')) || str.includes('14 to 17') || str.includes('15 to 18') || str.includes('14-17') || str.includes('15-18');
      if (isJunior(c) && isJunior(target)) return true;

      // Cadet / 8-10 / 9-11 / 10-12 / 7-9
      const isCadet = (str: string) => str.includes('cadet') || str.includes('8 to 10') || str.includes('10 to 12') || str.includes('9 to 11') || str.includes('7 to 9') || str.includes('9-11');
      if (isCadet(c) && isCadet(target)) return true;

      // Senior / Above 17 / Above 18
      const isSenior = (str: string) => str.includes('senior') || str.includes('above 17') || str.includes('above 18') || str.includes('17+') || str.includes('18+');
      if (isSenior(c) && isSenior(target)) return true;

      // 5 to 7 / Under 7
      const isUnder7 = (str: string) => str.includes('5 to 7') || str.includes('under 7') || str.includes('5-7');
      if (isUnder7(c) && isUnder7(target)) return true;

      // Masters
      const isMasters = (str: string) => str.includes('master') || str.includes('above 30') || str.includes('above 35');
      if (isMasters(c) && isMasters(target)) return true;

      return false;
    });
  };

  // Filter events based on active discipline tab & tournament
  const fallbackEvents = selectedTournament ? generateStandardChampionshipEvents(selectedTournament.id) : [];
  const allEvents = (selectedTournament?.events && selectedTournament.events.length >= 10)
    ? selectedTournament.events
    : (fallbackEvents.length > 0 ? fallbackEvents : (selectedTournament?.events || []));

  const myDisciplineEvents = allEvents.filter(ev => doesEventMatchDiscipline(ev.discipline, discipline));
  
  const displayedEvents = disciplineFilter === 'my_discipline'
    ? myDisciplineEvents
    : disciplineFilter === 'all'
    ? allEvents
    : allEvents.filter(ev => ev.discipline.toLowerCase() === disciplineFilter.toLowerCase());

  const handleToggleEvent = (eventId: string) => {
    const targetEv = allEvents.find(e => e.id === eventId);
    if (!targetEv) return;

    if (selectedEventIds.includes(eventId)) {
      setSelectedEventIds(selectedEventIds.filter(id => id !== eventId));
    } else {
      // Validate that this age group is eligible for this race
      if (!isEventEligibleForSkater(targetEv, ageCategory)) {
        setError(`यह रेस आपके आयु वर्ग (${ageCategory}) के लिए उपलब्ध नहीं है। केवल पात्र एज ग्रुप के बच्चे ही यह रेस ले सकते हैं।`);
        return;
      }
      setError(null);
      setSelectedEventIds([...selectedEventIds, eventId]);
    }
  };

  const handleSelectAllMyRaces = () => {
    const eligibleMyIds = myDisciplineEvents
      .filter(ev => isEventEligibleForSkater(ev, ageCategory))
      .map(ev => ev.id);
    
    // Add all eligible to selection
    const merged = Array.from(new Set([...selectedEventIds, ...eligibleMyIds]));
    setSelectedEventIds(merged);
    setError(null);
  };

  const handleClearSelectedRaces = () => {
    setSelectedEventIds([]);
  };

  // Fixed Unified Tournament Entry Fee: Single fee for the entire tournament
  const totalFee = selectedTournament?.entryFeeBase ?? 1200;

  // Handle Inline Skater Login (if athlete wasn't logged in initially)
  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginRegNo.trim() || !loginPassword.trim()) {
      setLoginError('कृपया रजिस्ट्रेशन नंबर और पासवर्ड दोनों दर्ज करें।');
      return;
    }

    setLoginLoading(true);
    setLoginError(null);
    try {
      const res = await authLogin({
        registrationNumber: loginRegNo.trim(),
        password: loginPassword.trim()
      });
      if (res.success && res.skater) {
        setSkaterRegNo(res.skater.registrationNumber || '');
        setSkaterName(`${res.skater.firstName} ${res.skater.lastName}`.trim());
        setDistrict(res.skater.district || 'Lucknow');
        setClub(res.skater.club || 'Awadh Roller Sports Club');
        setAgeCategory(res.skater.ageCategory || 'Sub-Junior (12 to 15)');
        setGender(res.skater.gender || 'Male');
        setDiscipline(res.skater.discipline || 'Speed Skating (Inline)');
        setLoginError(null);
      } else {
        setLoginError(res.message || 'अमान्य क्रेडेंशियल्स। कृपया रजिस्ट्रेशन नंबर व पासवर्ड जांचें।');
      }
    } catch (err: any) {
      setLoginError(err.message || 'लॉगिन में समस्या आई।');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleFillDemoSkater = () => {
    setLoginRegNo('UPRSA/2026/LKO/00101');
    setLoginPassword('aarav@123');
    setLoginError(null);
  };

  // Step 1 -> Step 2: "सबमिट दबाने पर फीस पेमेंट का विकल्प खुले"
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTournament) {
      setError('कृपया टूर्नामेंट का चयन करें।');
      return;
    }
    if (!skaterRegNo.trim() || !skaterName.trim()) {
      setError('कृपया खिलाड़ी का नाम एवं रजिस्ट्रेशन नंबर दर्ज करें।');
      return;
    }
    if (selectedEventIds.length === 0) {
      setError('कृपया कम से कम 1 रेस का चयन करें।');
      return;
    }

    // Verify age category eligibility for selected races
    const ineligible = allEvents.filter(
      ev => selectedEventIds.includes(ev.id) && !isEventEligibleForSkater(ev, ageCategory)
    );
    if (ineligible.length > 0) {
      setError(
        `चयनित रेस "${ineligible.map(e => e.eventName).join(', ')}" आपके आयु वर्ग (${ageCategory}) के लिए पात्र नहीं है।`
      );
      return;
    }

    setError(null);
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2 -> Step 3: Confirm Payment & Submit Registration
  const handleFinalPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTournament) return;

    if (!paymentUtr.trim()) {
      setError('कृपया भुगतान का 12-अंकों का UPI UTR / Reference No. दर्ज करें।');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const selectedEventsData = allEvents.filter(e => selectedEventIds.includes(e.id));
      const payload: Partial<TournamentRegistration> = {
        tournamentId: selectedTournament.id,
        tournamentTitle: selectedTournament.title,
        skaterId: currentSkater?.id || ('skater-' + Date.now()),
        skaterName: skaterName.trim(),
        skaterRegNo: skaterRegNo.trim(),
        district: district,
        club: club,
        ageCategory: ageCategory as any,
        gender: gender as any,
        discipline: discipline as any,
        selectedEventIds: selectedEventIds,
        selectedEvents: selectedEventsData,
        eventsCount: selectedEventIds.length,
        totalFee: totalFee,
        paymentStatus: 'submitted',
        paymentUtr: paymentUtr.trim(),
        paymentDate: new Date().toISOString().split('T')[0],
        status: 'pending'
      };

      const res = await api.submitRegistration(payload);
      if (res.success && res.data) {
        setConfirmedRegistration(res.data);
        setStep('confirmation');
        onSuccess(res.data);
      } else {
        setError(res.message || 'टूर्नामेंट नामांकन सबमिट नहीं हो सका।');
      }
    } catch (err: any) {
      setError(err.message || 'नेटवर्क त्रुटि के कारण नामांकन असफल रहा।');
    } finally {
      setLoading(false);
    }
  };

  // Copy helper
  const handleCopy = (text: string, type: 'upi' | 'bank') => {
    navigator.clipboard.writeText(text);
    if (type === 'upi') {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } else {
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    }
  };

  // UPI payment details
  const upiId = paymentSettings?.upiId || 'uprsa.sports@icici';
  const upiPayee = paymentSettings?.accountName || 'UTTAR PRADESH ROLLER SPORTS ASSOCIATION';
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiPayee)}&am=${totalFee}&tn=${encodeURIComponent('UPRSA Tournament Fee ' + skaterRegNo)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUrl)}`;

  return (
    <div className="min-h-screen bg-[#070d18] text-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Breadcrumb & Step Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/15 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 text-xs font-bold mb-2">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>UPRSA STATE & ZONAL CHAMPIONSHIP ENTRY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              टूर्नामेंट नामांकन एवं रेस चयन
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              अपनी विधा की रेस का चयन करें और एकल निश्चित फीस जमा कर नामांकन पूरा करें।
            </p>
          </div>

          {/* Stepper Wizard */}
          <div className="flex items-center gap-2 text-xs font-bold shrink-0">
            <div className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
              step === 'races'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}>
              {step !== 'races' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>1</span>}
              <span>1. विधा व रेस चयन</span>
            </div>

            <ArrowRight className="w-3 h-3 text-slate-600" />

            <div className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
              step === 'payment'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : step === 'confirmation'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-900 text-slate-500 border border-slate-800'
            }`}>
              {step === 'confirmation' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>2</span>}
              <span>2. फीस पेमेंट</span>
            </div>

            <ArrowRight className="w-3 h-3 text-slate-600" />

            <div className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
              step === 'confirmation'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-500 border border-slate-800'
            }`}>
              <span>3</span>
              <span>3. रसीद / स्लिप</span>
            </div>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="bg-red-950/70 border border-red-500/50 p-4 rounded-2xl text-red-200 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: RACE SELECTION & ATHLETE DASHBOARD                               */}
        {/* ========================================================================= */}
        {step === 'races' && (
          <div className="space-y-6">

            {/* 1. If Athlete is NOT logged in: Provide Quick Inline Login */}
            {!currentSkater && (
              <div className="bg-gradient-to-r from-blue-950/60 to-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>खिलाड़ी लॉगिन आवश्यक (Skater Login Required)</span>
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white mt-1">
                      टूर्नामेंट फॉर्म भरने के लिए अपना रजिस्ट्रेशन नंबर व पासवर्ड डालें
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      लॉगिन करते ही आपकी विधा (Discipline) की सभी रेस स्वतः प्रदर्शित हो जाएंगी।
                    </p>
                  </div>
                </div>

                {loginError && (
                  <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleInlineLogin} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      रजिस्ट्रेशन नंबर (Registration No.) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. UPRSA/2026/LKO/00101"
                      value={loginRegNo}
                      onChange={(e) => setLoginRegNo(e.target.value)}
                      className="w-full bg-[#050b18] border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono placeholder:normal-case focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-300 block">
                        पासवर्ड (Password) *
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="text-[10px] text-amber-400 hover:underline"
                      >
                        {showLoginPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      placeholder="पासवर्ड दर्ज करें"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-[#050b18] border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs py-2 px-3 rounded-xl shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {loginLoading ? 'जांच जारी...' : 'लॉगिन करें ➔'}
                    </button>
                    <button
                      type="button"
                      onClick={handleFillDemoSkater}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                      title="1-क्लिक टेस्ट क्रेडेंशियल्स भरें"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>डेमो</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 2. ATHLETE PROFILE CARD (Active Skater Dashboard) */}
            <div className="bg-[#0c162d] border border-blue-800/80 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-900/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-black text-lg">
                    {skaterName ? skaterName.charAt(0) : 'S'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-black text-white">
                        {skaterName || 'खिलाड़ी प्रोफाइल'}
                      </h2>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>सत्यापित खिलाड़ी</span>
                      </span>
                    </div>
                    <span className="text-xs font-mono text-amber-400 block font-bold">
                      {skaterRegNo || 'UPRSA REGISTRATION REQUIRED'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1">
                  <label className="text-[10px] text-slate-400 font-bold block">
                    विधा बदलें (Change Discipline)
                  </label>
                  <select
                    value={discipline}
                    onChange={(e) => {
                      setDiscipline(e.target.value as any);
                      setDisciplineFilter('my_discipline');
                      setSelectedEventIds([]);
                    }}
                    className="bg-blue-950/80 border border-blue-500/50 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                  >
                    <option value="Speed Skating (Quad)">Speed Skating (Quad / क्वॉड)</option>
                    <option value="Speed Skating (Inline)">Speed Skating (Inline / इनलाइन)</option>
                    <option value="Inline Freestyle">Inline Freestyle (फ्रीस्टाइल / स्लैलम)</option>
                    <option value="Artistic Skating">Artistic Skating (आर्टिस्टिक)</option>
                    <option value="Roller Hockey">Roller Hockey (रोलर हॉकी)</option>
                    <option value="Skateboarding">Skateboarding (स्केटबोर्डिंग)</option>
                  </select>
                </div>
              </div>

              {/* Skater Metadata Badges & Age Category Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#060b18] p-3 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">जिला (District)</span>
                  <span className="font-bold text-white mt-0.5 block">{district}</span>
                </div>
                <div className="bg-[#060b18] p-3 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">आयु वर्ग (Age Cat.)</span>
                  </div>
                  <select
                    value={ageCategory}
                    onChange={(e) => {
                      setAgeCategory(e.target.value);
                      setSelectedEventIds([]);
                    }}
                    className="w-full bg-[#0c162d] border border-amber-500/40 rounded-lg px-2 py-1 text-[11px] text-amber-300 font-bold focus:outline-none"
                  >
                    {ALL_STANDARD_AGE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="bg-[#060b18] p-3 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">लिंग (Gender)</span>
                  <span className="font-bold text-white mt-0.5 block">{gender}</span>
                </div>
                <div className="bg-[#060b18] p-3 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">क्लब (Club / Academy)</span>
                  <span className="font-bold text-slate-300 mt-0.5 block truncate">{club}</span>
                </div>
              </div>
            </div>

            {/* 3. TOURNAMENT INFO & FIXED FEE BANNER */}
            <div className="bg-[#0c162d] border border-blue-800/80 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-900/60 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    टूर्नामेंट का विवरण (Selected Championship)
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                    {selectedTournament?.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{selectedTournament?.startDate} से {selectedTournament?.endDate}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      <span>{selectedTournament?.district} ({selectedTournament?.venue || 'Synthetic Track'})</span>
                    </span>
                  </div>
                </div>

                {/* Unified Championship Fee Pill */}
                <div className="bg-amber-500/15 border-2 border-amber-500/40 p-3.5 rounded-2xl text-right shrink-0">
                  <span className="text-[10px] text-amber-400 font-bold block uppercase">पूरे टूर्नामेंट की फिक्स फीस</span>
                  <span className="text-xl font-black text-amber-300 font-mono">₹{totalFee}</span>
                  <span className="text-[10px] text-emerald-400 block font-medium mt-0.5">
                    ✓ सभी रेस इसी फीस में सम्मिलित
                  </span>
                </div>
              </div>

              {/* Tournament Switcher if multiple are available */}
              {tournaments.length > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">टूर्नामेंट बदलें:</span>
                  <select
                    value={selectedTournament?.id || ''}
                    onChange={(e) => {
                      const t = tournaments.find(item => item.id === e.target.value);
                      if (t) {
                        setSelectedTournament(t);
                        setSelectedEventIds([]);
                      }
                    }}
                    className="bg-[#060b18] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {tournaments.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.startDate})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* 4. DISCIPLINE-BASED EVENT SELECTION (जिस विधा का खिलाड़ी हो, उसकी रेस शो करना) */}
            <div className="bg-[#0c162d] border border-blue-800/80 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-900/60 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase mb-1">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>विधा के अनुसार रेस इवेंट्स (Select Race Events)</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    अपनी विधा की रेस चुनें ({selectedEventIds.length} चयनित)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    आपकी विधा (<strong className="text-amber-300">{discipline}</strong>) एवं आयु वर्ग (<strong className="text-amber-300">{ageCategory}</strong>) के अनुसार उपलब्ध रेस नीचे प्रदर्शित हैं।
                  </p>
                </div>

                {/* Quick Selection Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllMyRaces}
                    className="bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>सभी रेस चुनें</span>
                  </button>

                  {selectedEventIds.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearSelectedRaces}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      साफ़ करें
                    </button>
                  )}
                </div>
              </div>

              {/* Discipline Filter Tabs */}
              <div className="flex items-center gap-2 flex-wrap pb-1">
                <button
                  type="button"
                  onClick={() => setDisciplineFilter('my_discipline')}
                  className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    disciplineFilter === 'my_discipline'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>★ मेरी विधा: {discipline} ({myDisciplineEvents.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDisciplineFilter('Speed Skating (Quad)')}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer ${
                    disciplineFilter === 'Speed Skating (Quad)'
                      ? 'bg-blue-600 text-white font-black'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  Quad Speed
                </button>

                <button
                  type="button"
                  onClick={() => setDisciplineFilter('Speed Skating (Inline)')}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer ${
                    disciplineFilter === 'Speed Skating (Inline)'
                      ? 'bg-blue-600 text-white font-black'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  Inline Speed
                </button>

                <button
                  type="button"
                  onClick={() => setDisciplineFilter('Inline Freestyle')}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer ${
                    disciplineFilter === 'Inline Freestyle'
                      ? 'bg-blue-600 text-white font-black'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  Freestyle Slalom
                </button>

                <button
                  type="button"
                  onClick={() => setDisciplineFilter('all')}
                  className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    disciplineFilter === 'all'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  <span>सभी विधाएं ({allEvents.length})</span>
                </button>
              </div>

              {/* Events List */}
              <div className="space-y-3">
                {displayedEvents.length === 0 ? (
                  <div className="p-8 text-center bg-[#060b18] border border-slate-800 rounded-2xl text-slate-400 text-xs">
                    इस विधा के लिए वर्तमान में कोई रेस इवेंट सूचीबद्ध नहीं है। कृपया "सभी विधाएं" टैब देखें।
                  </div>
                ) : (
                  displayedEvents.map((ev) => {
                    const isChecked = selectedEventIds.includes(ev.id);
                    const isEligible = isEventEligibleForSkater(ev);
                    const allowedCats = ev.ageCategories && ev.ageCategories.length > 0
                      ? ev.ageCategories
                      : (ev.ageCategory ? [ev.ageCategory] : []);

                    return (
                      <div
                        key={ev.id}
                        onClick={() => {
                          if (isEligible) {
                            handleToggleEvent(ev.id);
                          }
                        }}
                        className={`p-4 rounded-2xl border transition-all ${
                          !isEligible
                            ? 'bg-[#060b18]/40 border-slate-800/60 opacity-60 cursor-not-allowed'
                            : isChecked
                            ? 'bg-amber-950/40 border-amber-500/70 shadow-lg shadow-amber-500/10 cursor-pointer'
                            : 'bg-[#060b18] border-slate-800 hover:border-blue-700 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3.5">
                            <div className="pt-0.5">
                              {isEligible ? (
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                  isChecked
                                    ? 'bg-amber-500 border-amber-400 text-slate-950'
                                    : 'border-slate-600 bg-slate-900'
                                }`}>
                                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>
                              ) : (
                                <Lock className="w-4 h-4 text-slate-600" />
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-extrabold text-white text-sm block">
                                  {ev.eventName}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  <span>All Genders (सभी जेंडर)</span>
                                </span>
                                {isEligible ? (
                                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 border border-blue-500/30 font-bold">
                                    ✓ पात्र आयु वर्ग ({ageCategory})
                                  </span>
                                ) : (
                                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-500/15 text-red-400 border border-red-500/30 font-bold">
                                    ⛔ इस आयु वर्ग हेतु नहीं
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                                <span className="text-amber-400 font-medium">
                                  विधा: {ev.discipline}
                                </span>
                                {ev.distance && (
                                  <span className="text-slate-400">
                                    • दूरी: <strong className="text-slate-200">{ev.distance}</strong>
                                  </span>
                                )}
                              </div>

                              {/* Allowed age categories pills */}
                              <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] text-slate-500 font-bold">पात्र वर्ग:</span>
                                {allowedCats.map((cat, cIdx) => (
                                  <span
                                    key={cIdx}
                                    className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                                      cat.trim().toLowerCase() === ageCategory.trim().toLowerCase()
                                        ? 'bg-amber-500/25 text-amber-200 border border-amber-500/40 font-bold'
                                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                                    }`}
                                  >
                                    {cat}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Fee Tag */}
                          <div className="text-right shrink-0">
                            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 block">
                              फीस में सम्मिलित
                            </span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              ₹0 अतिरिक्त
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* 5. SUBMIT BAR: "और सबमिट दबा दे, समिट दबाने के बाद फीस पेमेंट का ऑप्शन खुलिए" */}
            <div className="bg-gradient-to-r from-[#0c162d] to-[#081022] border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  नामांकन सारांश (Nomination Summary)
                </span>
                <div className="text-base sm:text-lg font-black text-white mt-0.5">
                  {selectedEventIds.length} रेस चयनित • कुल टूर्नामेंट फीस: <span className="text-amber-400 font-mono">₹{totalFee} (फिक्स)</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  सबमिट पर क्लिक करते ही सीधे फीस पेमेंट का विकल्प खुलेगा।
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-1/3 sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold px-4 py-3 rounded-2xl text-xs border border-slate-700 cursor-pointer"
                >
                  रद्द करें
                </button>

                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  disabled={selectedEventIds.length === 0}
                  className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black px-8 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer"
                >
                  <span>सबमिट करें एवं फीस पेमेंट करें</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: FEE PAYMENT OPTIONS (समिट दबाने के बाद फीस पेमेंट का ऑप्शन खुलिए)     */}
        {/* ========================================================================= */}
        {step === 'payment' && (
          <div className="space-y-6">

            {/* Header / Instructions */}
            <div className="bg-[#0c162d] border border-amber-500/40 rounded-3xl p-6 shadow-xl space-y-2">
              <div className="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>रेस चयन सफलतापूर्वक सबमिट हुआ</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                चैंपियनशिप एंट्री फीस भुगतान (Step 2: Championship Fee Payment)
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                टूर्नामेंट नामांकन की पुष्टि हेतु नीचे दिए गए आधिकारिक UPI QR कोड या बैंक विवरण पर <strong className="text-amber-300">₹{totalFee}</strong> का भुगतान करें और 12-अंकों का UPI UTR / Reference No. दर्ज करें।
              </p>
            </div>

            {/* Nomination Details Recap */}
            <div className="bg-[#060b18] border border-blue-900/60 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                नामांकन का विवरण (Nomination Summary)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">टूर्नामेंट</span>
                  <span className="font-extrabold text-white text-sm">{selectedTournament?.title}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">खिलाड़ी का नाम व रजिस्ट्रेशन नं.</span>
                  <span className="font-bold text-amber-300">{skaterName} ({skaterRegNo})</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">विधा एवं आयु वर्ग</span>
                  <span className="font-bold text-white">{discipline} • {ageCategory}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">जिला व क्लब</span>
                  <span className="font-bold text-slate-300">{district} • {club}</span>
                </div>
              </div>

              {/* Selected Races list */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 text-xs font-bold block mb-2">
                  चयनित रेसें ({selectedEventIds.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedEventIds.map(id => {
                    const ev = selectedTournament?.events?.find(e => e.id === id);
                    return (
                      <span key={id} className="bg-blue-950/60 border border-blue-800/80 text-blue-200 text-xs px-3 py-1 rounded-xl font-medium">
                        ✓ {ev?.eventName || id}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Fixed Total Fee Box */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase block">
                    कुल देय निश्चित फीस (Unified Fixed Tournament Fee)
                  </span>
                  <span className="text-xs text-slate-300">
                    सभी {selectedEventIds.length} रेस के लिए केवल एक फिक्स फीस
                  </span>
                </div>
                <div className="text-2xl font-black text-amber-300 font-mono">
                  ₹{totalFee}
                </div>
              </div>
            </div>

            {/* Payment Options Grid (UPI QR + Bank Details) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* QR Code Card */}
              <div className="bg-[#0c162d] border border-blue-800/80 rounded-3xl p-6 shadow-xl space-y-4 text-center">
                <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full">
                  <QrCode className="w-3.5 h-3.5 text-amber-400" />
                  <span>स्कैन एवं पे (SCAN & PAY VIA ANY UPI APP)</span>
                </div>

                <div className="w-56 h-56 mx-auto bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center">
                  <img
                    src={qrCodeUrl}
                    alt="UPRSA Tournament Entry UPI QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-slate-400 block">UPI ऐप्स समर्थित:</span>
                  <div className="flex items-center justify-center gap-2 text-slate-300 font-bold text-[11px] flex-wrap">
                    <span className="bg-slate-900 px-2 py-0.5 rounded-md">Google Pay</span>
                    <span className="bg-slate-900 px-2 py-0.5 rounded-md">PhonePe</span>
                    <span className="bg-slate-900 px-2 py-0.5 rounded-md">Paytm</span>
                    <span className="bg-slate-900 px-2 py-0.5 rounded-md">BHIM</span>
                  </div>
                </div>

                {/* Direct UPI Intent Link for mobile */}
                <a
                  href={upiUrl}
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  <span>UPI ऐप में खोलें (Open in UPI App)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* UPI ID & Bank Account Card */}
              <div className="bg-[#0c162d] border border-blue-800/80 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-blue-900/60 pb-3">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>आधिकारिक खाता विवरण (Official Account)</span>
                </h3>

                {/* UPI ID */}
                <div className="bg-[#060b18] p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-bold">आधिकारिक UPRSA UPI ID</span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-amber-300 text-xs sm:text-sm">
                      {upiId}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(upiId, 'upi')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedUpi ? 'कॉपी हुआ' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Bank Account */}
                <div className="bg-[#060b18] p-3.5 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 block font-bold">बैंक खाता विवरण (Bank Transfer)</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('10440200001234', 'bank')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 cursor-pointer"
                    >
                      {copiedBank ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                      <span>{copiedBank ? 'कॉपी हुआ' : 'Copy A/C'}</span>
                    </button>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">खाताधारक (Account Name):</span>
                    <span className="font-bold text-white block">{upiPayee}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500 text-[10px]">A/C No:</span>
                      <span className="font-mono font-bold text-white block">10440200001234</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">IFSC Code:</span>
                      <span className="font-mono font-bold text-white block">BARB0HAZRAT</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">Bank & Branch:</span>
                    <span className="text-slate-300 block">Bank of Baroda, Hazratganj, Lucknow</span>
                  </div>
                </div>

                {/* Amount to pay */}
                <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-3 text-xs text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>भुगतान राशि: <strong className="font-mono text-white">₹{totalFee}</strong> मात्र।</span>
                </div>
              </div>
            </div>

            {/* UTR Submission Form */}
            <form onSubmit={handleFinalPaymentSubmit} className="bg-[#0c162d] border border-blue-800/80 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>भुगतान सत्यापन एवं अंतिम जमा (Submit Payment Reference)</span>
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-bold text-amber-300 block">
                  12-अंकों का UPI UTR / Transaction Reference Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="उदा. 408219873456 या UPI-2026..."
                    value={paymentUtr}
                    onChange={(e) => setPaymentUtr(e.target.value)}
                    className="w-full bg-[#060b18] border border-amber-500/60 focus:border-amber-400 rounded-2xl px-4 py-3 text-sm text-white font-mono uppercase placeholder:normal-case placeholder:text-slate-500 focus:outline-none"
                  />
                  <div className="absolute right-3 top-3 text-[10px] text-slate-500 font-mono pointer-events-none">
                    12 DIGITS
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>भुगतान के बाद आपको प्राप्त SMS या Google Pay/PhonePe की रसीद से UTR नंबर दर्ज करें।</span>
                  <button
                    type="button"
                    onClick={() => setPaymentUtr('4082' + Math.floor(10000000 + Math.random() * 90000000))}
                    className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>⚡ टेस्ट UTR स्वतः भरें</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setStep('races');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold px-5 py-3 rounded-2xl text-xs border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← वापस रेस बदलें (Modify Races)</span>
                </button>

                <button
                  type="submit"
                  disabled={loading || !paymentUtr.trim()}
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black px-8 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 cursor-pointer"
                >
                  {loading ? (
                    <span>जमा किया जा रहा है...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>✓ फीस भुगतान जमा करें और रसीद पाएं</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: CONFIRMATION & OFFICIAL ENTRY SLIP                                */}
        {/* ========================================================================= */}
        {step === 'confirmation' && (
          <div className="space-y-6">

            <div className="bg-emerald-950/60 border-2 border-emerald-500/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center text-emerald-300 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-white">
                टूर्नामेंट नामांकन सफलतापूर्वक दर्ज हुआ!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                आपका नामांकन और फीस भुगतान UPRSA सिस्टम में दर्ज कर लिया गया है। नीचे आपकी आधिकारिक डिजिटल एंट्री स्लिप है।
              </p>
            </div>

            {/* Printable Digital Championship Slip */}
            <div id="entry-slip-card" className="bg-[#0b1427] border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              
              {/* Slip Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-800 pb-5">
                <div>
                  <div className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-widest">
                    UTTAR PRADESH ROLLER SPORTS ASSOCIATION
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                    {selectedTournament?.title}
                  </h3>
                  <span className="text-xs text-slate-400">
                    आधिकारिक टूर्नामेंट नामांकन स्लिप (Championship Entry Slip)
                  </span>
                </div>

                <div className="bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-right shrink-0">
                  <span className="text-[10px] text-emerald-300 font-bold uppercase block">STATUS</span>
                  <span className="text-xs font-black text-emerald-400 font-mono">CONFIRMED & SUBMITTED</span>
                </div>
              </div>

              {/* Slip Body Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-[#060b18] p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">खिलाड़ी का नाम</span>
                  <span className="font-extrabold text-white text-sm block mt-0.5">{skaterName}</span>
                  <span className="font-mono text-amber-400 text-xs">{skaterRegNo}</span>
                </div>

                <div className="bg-[#060b18] p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">विधा एवं आयु वर्ग</span>
                  <span className="font-bold text-white text-sm block mt-0.5">{discipline}</span>
                  <span className="text-slate-400 text-xs">{ageCategory} ({gender})</span>
                </div>

                <div className="bg-[#060b18] p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">जिला एवं क्लब</span>
                  <span className="font-bold text-white text-sm block mt-0.5">{district}</span>
                  <span className="text-slate-400 text-xs truncate block">{club}</span>
                </div>
              </div>

              {/* Nominated Events in the slip */}
              <div className="bg-[#060b18] p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  नामित रेस इवेंट्स (Nominated Race Events):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedEventIds.map((id, idx) => {
                    const ev = selectedTournament?.events?.find(e => e.id === id);
                    return (
                      <div key={id} className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                        <span className="font-bold text-white">
                          {idx + 1}. {ev?.eventName || id}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          फीस सम्मिलित
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Details in slip */}
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block font-bold uppercase">जमा फीस व UTR</span>
                  <span className="text-lg font-black text-amber-300 font-mono">₹{totalFee} (फिक्स टूर्नामेंट फीस)</span>
                  <span className="text-slate-400 text-[11px] block mt-0.5">
                    UTR: <strong className="text-white font-mono">{paymentUtr || 'SUBMITTED'}</strong>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block font-bold uppercase">प्रवेश तिथि</span>
                  <span className="font-mono text-white text-xs">{new Date().toLocaleDateString('hi-IN')}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Printer className="w-4 h-4" />
                  <span>प्रिंट / सेव डिजिटल स्लिप</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirmedRegistration) {
                      onSuccess(confirmedRegistration);
                    } else {
                      onCancel();
                    }
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <span>खिलाड़ी डैशबोर्ड पर जाएं</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
