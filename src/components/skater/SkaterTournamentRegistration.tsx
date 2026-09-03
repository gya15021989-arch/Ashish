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
  Shield,
  Zap,
  DollarSign
} from 'lucide-react';
import { Tournament, Skater, TournamentEvent, TournamentRegistration, PaymentSettings } from '../../types';
import { api } from '../../services/api';

interface SkaterTournamentRegistrationProps {
  initialTournament?: Tournament | null;
  skater: Skater | null;
  onSuccess: (reg: TournamentRegistration) => void;
  onCancel: () => void;
}

export const SkaterTournamentRegistration: React.FC<SkaterTournamentRegistrationProps> = ({
  initialTournament,
  skater,
  onSuccess,
  onCancel
}) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(initialTournament || null);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  
  // Custom Skater inputs if not logged in
  const [skaterRegNo, setSkaterRegNo] = useState(skater?.registrationNumber || '');
  const [skaterName, setSkaterName] = useState(skater ? `${skater.firstName} ${skater.lastName}` : '');
  const [district, setDistrict] = useState(skater?.district || 'Lucknow');
  const [club, setClub] = useState(skater?.club || 'Lucknow Speed Skating Academy');
  const [ageCategory, setAgeCategory] = useState(skater?.ageCategory || 'Junior (15 to 18)');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(skater?.gender || 'Male');
  const [discipline, setDiscipline] = useState(skater?.discipline || 'Speed Skating (Quad)');
  
  // Payment
  const [paymentUtr, setPaymentUtr] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tRes, pRes] = await Promise.all([
        api.getTournaments(),
        api.getPaymentSettings()
      ]);

      if (tRes.success) {
        setTournaments(tRes.data);
        if (!selectedTournament && tRes.data.length > 0) {
          setSelectedTournament(tRes.data[0]);
        }
      }
      if (pRes.success) {
        setPaymentSettings(pRes.data);
      }
    } catch (e) {
      console.error('Failed to load tournament entry data:', e);
    }
  };

  const handleToggleEvent = (eventId: string) => {
    if (selectedEventIds.includes(eventId)) {
      setSelectedEventIds(selectedEventIds.filter(id => id !== eventId));
    } else {
      setSelectedEventIds([...selectedEventIds, eventId]);
    }
  };

  // Calculate Total Entry Fee
  const baseFee = selectedTournament?.entryFeeBase || 1000;
  const eventsFee = (selectedTournament?.events || [])
    .filter(ev => selectedEventIds.includes(ev.id))
    .reduce((sum, ev) => sum + ev.entryFee, 0);
  const totalFee = baseFee + eventsFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTournament) {
      setError('Please select a tournament.');
      return;
    }
    if (!skaterRegNo.trim() || !skaterName.trim()) {
      setError('Please specify skater name and registration number.');
      return;
    }
    if (selectedEventIds.length === 0) {
      setError('Please select at least one championship event.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: Partial<TournamentRegistration> = {
        tournamentId: selectedTournament.id,
        tournamentTitle: selectedTournament.title,
        skaterId: skater?.id || 'sk-' + Date.now(),
        skaterName: skaterName.trim(),
        skaterRegNo: skaterRegNo.trim(),
        district,
        club,
        ageCategory,
        gender,
        discipline,
        selectedEvents: selectedEventIds,
        totalFee,
        paymentStatus: paymentUtr.trim() ? 'submitted' : 'pending',
        paymentUtr: paymentUtr.trim() || undefined,
        status: 'pending'
      };

      const res = await api.submitRegistration(payload);
      if (res.success && res.data) {
        onSuccess(res.data);
      } else {
        setError(res.message || 'Tournament registration failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error during entry submission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 text-xs font-bold">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>ONLINE CHAMPIONSHIP ENTRY</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Tournament Entry & Event Nomination
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Submit your event nominations and fee for state & zonal championships.
          </p>
        </div>

        {error && (
          <div className="bg-red-950/60 border border-red-500/40 p-4 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tournament Selection */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>1. Select Championship</span>
            </h3>

            <select
              value={selectedTournament?.id || ''}
              onChange={(e) => {
                const t = tournaments.find(item => item.id === e.target.value);
                if (t) {
                  setSelectedTournament(t);
                  setSelectedEventIds([]);
                }
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.startDate}) — {t.district}
                </option>
              ))}
            </select>

            {selectedTournament && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">Dates</span>
                  <span className="font-bold text-white">{selectedTournament.startDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Deadline</span>
                  <span className="font-bold text-amber-400">{selectedTournament.registrationDeadline}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Base Entry Fee</span>
                  <span className="font-bold text-white font-mono">₹{selectedTournament.entryFeeBase}</span>
                </div>
              </div>
            )}
          </div>

          {/* Skater Identification */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>2. Athlete Identification</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Skater Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={skaterName}
                  onChange={(e) => setSkaterName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  State Registration Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UPRSA-2026-SK-1001"
                  value={skaterRegNo}
                  onChange={(e) => setSkaterRegNo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  District
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Age Category
                </label>
                <input
                  type="text"
                  value={ageCategory}
                  onChange={(e) => setAgeCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                >
                  <option value="Male">Male / Boy</option>
                  <option value="Female">Female / Girl</option>
                </select>
              </div>
            </div>
          </div>

          {/* Event Selection */}
          {selectedTournament && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>3. Select Events to Enter ({selectedEventIds.length} Selected)</span>
              </h3>

              <div className="space-y-2.5">
                {selectedTournament.events.map((ev) => {
                  const isChecked = selectedEventIds.includes(ev.id);
                  return (
                    <label
                      key={ev.id}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-amber-950/40 border-amber-500/60 shadow-md'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleEvent(ev.id)}
                          className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-0"
                        />
                        <div>
                          <span className="font-bold text-white text-xs block">{ev.eventName}</span>
                          <span className="text-[10px] text-slate-400">
                            {ev.discipline} • {ev.ageCategory} ({ev.gender}) {ev.distance ? `• ${ev.distance}` : ''}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold text-amber-400">
                        +₹{ev.entryFee}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Payment & Total Fee */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Total Payable Fee</span>
                <div className="text-2xl font-black text-amber-400 font-mono">
                  ₹{totalFee}
                </div>
                <span className="text-[10px] text-slate-500">
                  Base Fee (₹{baseFee}) + Event Fees (₹{eventsFee})
                </span>
              </div>

              <div className="w-24 h-24 bg-white rounded-xl p-1.5 flex flex-col items-center justify-center">
                <QrCode className="w-18 h-18 text-slate-950" />
                <span className="text-[7px] text-slate-900 font-mono font-bold">UPI PAYMENT</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-amber-400 block mb-1">
                Transaction UTR / Ref Number
              </label>
              <input
                type="text"
                placeholder="Enter UPI UTR Number (12 digits), e.g. 408219873456"
                value={paymentUtr}
                onChange={(e) => setPaymentUtr(e.target.value)}
                className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase font-mono placeholder:normal-case focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black px-8 py-3 rounded-xl text-xs flex items-center gap-2 shadow-xl shadow-amber-500/20 transition-all hover:scale-105"
              >
                {loading ? (
                  <span>Submitting Entry...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Tournament Nomination</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
