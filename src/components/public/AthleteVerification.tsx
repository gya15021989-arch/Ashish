import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  Shield, 
  Clock, 
  Calendar, 
  User, 
  MapPin, 
  Award,
  AlertCircle,
  RotateCw,
  Printer,
  QrCode
} from 'lucide-react';
import { api } from '../../services/api';
import { CURRENT_SEASON_DISPLAY, CURRENT_SEASON_CODE, OFFICIAL_SEASON_LABELS } from '../../config/season';
import { UPRSA_INFO } from '../../data/uprsaKnowledge';

interface AthleteVerificationProps {
  initialRegNo?: string;
}

export const AthleteVerification: React.FC<AthleteVerificationProps> = ({ initialRegNo = '' }) => {
  const [regNo, setRegNo] = useState(initialRegNo);
  const [loading, setLoading] = useState(false);
  const [skater, setSkater] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialRegNo) {
      handleVerify(initialRegNo);
    }
  }, [initialRegNo]);

  const handleVerify = async (queryId: string) => {
    if (!queryId.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await api.verifySkaterPublic(queryId.trim());
      if (res.success && res.data) {
        setSkater(res.data);
      } else {
        setSkater(null);
        setError(res.message || `No official athlete record found for code "${queryId}". Please check the registration number.`);
      }
    } catch (err: any) {
      setSkater(null);
      setError('Network error while querying the state athlete registry.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(regNo);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3.5 py-1 rounded-full border border-amber-500/30 text-xs font-black uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>OFFICIAL STATE ATHLETE REGISTRY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Athlete & Digital ID Verification
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Verify official Uttar Pradesh state skater credentials, district affiliation, and current Season {CURRENT_SEASON_DISPLAY} status.
          </p>
        </div>

        {/* Verification Search Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Registration ID, e.g. UPRSA-LKO-2026-00001 or UPRSA-GBN-2026-00008"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-xs sm:text-sm text-white uppercase placeholder:normal-case placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !regNo.trim()}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black px-8 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              {loading ? (
                <span>Checking Database...</span>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Verify Athlete ID</span>
                </>
              )}
            </button>
          </form>

          {/* Sample IDs for instant check */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400 pt-1">
            <span>Quick sample searches:</span>
            <button
              type="button"
              onClick={() => { setRegNo('UPRSA/2026/LKO/00101'); handleVerify('UPRSA/2026/LKO/00101'); }}
              className="font-mono text-amber-400 hover:underline cursor-pointer"
            >
              UPRSA/2026/LKO/00101
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => { setRegNo('UPRSA-GBN-2026-00008'); handleVerify('UPRSA-GBN-2026-00008'); }}
              className="font-mono text-amber-400 hover:underline cursor-pointer"
            >
              UPRSA-GBN-2026-00008
            </button>
          </div>
        </div>

        {/* Verification Result Section */}
        {searched && (
          <div>
            {skater ? (
              <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-200">
                
                {/* Official Status Header */}
                <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                  skater.isVerified 
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                    : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${
                      skater.isVerified 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-lg shadow-emerald-500/10' 
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    }`}>
                      {skater.isVerified ? <CheckCircle2 className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm uppercase tracking-wide">
                          {skater.isVerified ? 'VERIFIED ATHLETE' : 'PENDING VERIFICATION'}
                        </span>
                        {skater.isVerified && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-black uppercase">
                            OFFICIAL SEAL ATTESTED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {skater.isVerified 
                          ? 'This athlete record has been officially authenticated and approved by the UPRSA Executive Board.' 
                          : 'Pending Verification - Documents under review by the state scrutiny committee.'}
                      </p>
                    </div>
                  </div>

                  <div className="text-center sm:text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Registry Status</span>
                    <span className={`text-xs font-black uppercase px-3 py-1 rounded-full border ${
                      skater.isVerified 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {skater.isVerified ? 'VERIFIED' : 'PENDING VERIFICATION'}
                    </span>
                  </div>
                </div>

                {/* Athlete Dossier Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Photo Headshot */}
                  <div className="flex flex-col items-center justify-center p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                    <div className="w-28 h-28 rounded-2xl bg-slate-900 border-2 border-amber-500/60 overflow-hidden mb-2">
                      {skater.photoUrl ? (
                        <img
                          src={skater.photoUrl}
                          alt={`${skater.firstName} ${skater.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-bold">
                          HEADSHOT
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-bold text-white">{skater.firstName} {skater.lastName}</span>
                    <span className="text-[10px] font-mono text-amber-400">{skater.registrationNumber}</span>
                  </div>

                  {/* Verification Credentials */}
                  <div className="sm:col-span-2 grid grid-cols-2 gap-3 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Registered District:</span>
                      <span className="font-bold text-white">{skater.district}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block">Administrative Mandal:</span>
                      <span className="font-semibold text-slate-200">{skater.mandal || 'State Direct'}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block">Affiliated Club:</span>
                      <span className="font-semibold text-slate-200 truncate block">{skater.club}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block">Coach Name:</span>
                      <span className="font-semibold text-slate-200">{skater.coachName || 'N/A'}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block">Primary Discipline:</span>
                      <span className="font-bold text-indigo-400">{skater.discipline}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block">Age Bracket / Gender:</span>
                      <span className="font-semibold text-slate-200">{skater.ageCategory} ({skater.gender})</span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block">Affiliation Validity:</span>
                      <span className="font-mono text-emerald-400 font-bold">Through {skater.validUntil || OFFICIAL_SEASON_LABELS.VALID_UNTIL}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block">Annual Affiliation Fee:</span>
                      <span className="font-semibold text-slate-200">
                        {skater.annualFeePaid ? 'Paid (Verified)' : 'Pending Scrutiny Reconcile'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Security Notice */}
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Issued under the seal of Uttar Pradesh Roller Sports Association (UPRSA).</span>
                  <span className="font-mono text-amber-400">RSFI AFFILIATION ACTIVE</span>
                </div>
              </div>
            ) : (
              <div className="bg-red-950/30 border border-red-500/40 rounded-3xl p-6 sm:p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/40">
                  <XCircle className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white">Athlete Not Found in Official Registry</h3>
                <p className="text-xs text-red-300 max-w-md mx-auto">
                  {error}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
