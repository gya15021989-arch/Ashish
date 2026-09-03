import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Search, 
  Calendar, 
  User, 
  CreditCard,
  RotateCw
} from 'lucide-react';
import { Skater } from '../../types';
import { api } from '../../services/api';

export const RegistrationStatusView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [skater, setSkater] = useState<Skater | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await api.getSkaters({ search: query.trim() });
      if (res.success && res.data.length > 0) {
        setSkater(res.data[0]);
      } else {
        setSkater(null);
        setError('No skater profile found with the specified registration number or phone.');
      }
    } catch (err: any) {
      setSkater(null);
      setError('Failed to fetch skater status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-extrabold text-white">
          Check Skater Registration Status
        </h3>
        <p className="text-xs text-slate-400">
          Enter your Registration Number or Registered Mobile Number to check document verification and 2026 renewal status.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. UPRSA-2026-SK-1001 or 9876543210"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white uppercase placeholder:normal-case focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5"
          >
            {loading ? 'Checking...' : 'Check Status'}
          </button>
        </form>
      </div>

      {searched && (
        <div>
          {skater ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 animate-in fade-in duration-200">
              {/* Status Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h4 className="text-lg font-bold text-white">
                    {skater.firstName} {skater.lastName}
                  </h4>
                  <span className="text-xs font-mono text-amber-400">
                    Reg No: {skater.registrationNumber}
                  </span>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-black uppercase px-3 py-1 rounded-full border ${
                    skater.status === 'verified' || skater.status === 'approved' || skater.status === 'active'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : skater.status === 'rejected'
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {skater.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Status Roadmap */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800/80 text-center text-xs">
                <div className="space-y-1">
                  <span className="text-slate-500 text-[10px] block">1. Form Submitted</span>
                  <span className="text-emerald-400 font-bold">Completed</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 text-[10px] block">2. District Review</span>
                  <span className="text-emerald-400 font-bold">
                    {skater.status === 'pending' ? 'Under Review' : 'Approved'}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 text-[10px] block">3. State Digital ID</span>
                  <span className="text-amber-400 font-bold">
                    {skater.status === 'pending' ? 'Pending Approval' : 'Issued'}
                  </span>
                </div>
              </div>

              {/* Skater Info summary */}
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-300">
                <div>
                  <span className="text-slate-500 text-[11px] block">District & Club:</span>
                  <span className="font-semibold text-white">{skater.district}</span>
                  <span className="text-slate-400 block text-[10px]">{skater.club}</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[11px] block">Discipline & Age Group:</span>
                  <span className="font-semibold text-white">{skater.discipline}</span>
                  <span className="text-slate-400 block text-[10px]">{skater.ageCategory} ({skater.gender})</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[11px] block">Annual Affiliation Fee:</span>
                  <span className="font-semibold text-emerald-400">
                    {skater.annualFeePaid ? 'Paid (Active)' : 'Pending Submission'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 text-[11px] block">Validity:</span>
                  <span className="font-semibold text-white">{skater.validUntil || '31-DEC-2026'}</span>
                </div>
              </div>

              {skater.rejectionReason && (
                <div className="p-3 bg-red-950/40 rounded-xl border border-red-500/40 text-xs text-red-300">
                  <strong>Rejection Note:</strong> {skater.rejectionReason}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-red-500/30 rounded-3xl p-6 text-center text-red-300 text-xs">
              {error || 'No matching skater record found.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
