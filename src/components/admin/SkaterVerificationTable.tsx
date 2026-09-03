import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  Eye, 
  FileText, 
  Award, 
  Shield, 
  Download, 
  RefreshCw, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { Skater } from '../../types';
import { api } from '../../services/api';
import { CertificateGeneratorModal } from './CertificateGeneratorModal';

export const SkaterVerificationTable: React.FC = () => {
  const [skaters, setSkaters] = useState<Skater[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedSkater, setSelectedSkater] = useState<Skater | null>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certSkater, setCertSkater] = useState<Skater | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    loadSkaters();
  }, []);

  const loadSkaters = async () => {
    try {
      const res = await api.getSkaters();
      if (res.success) {
        setSkaters(res.data);
      }
    } catch (e) {
      console.error('Failed to load skaters:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySkater = async (skaterId: string, status: 'approved' | 'rejected', reason?: string) => {
    try {
      const res = await api.verifySkater(skaterId, status, reason);
      if (res.success) {
        setSkaters(prev => prev.map(s => s.id === skaterId ? res.data : s));
        if (selectedSkater?.id === skaterId) {
          setSelectedSkater(res.data);
        }
        setIsRejecting(false);
        setRejectReason('');
      }
    } catch (err) {
      console.error('Failed to update verification status:', err);
    }
  };

  const filteredSkaters = skaters.filter(s => {
    const matchesSearch = 
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      s.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.district.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search);
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">
            Skater Affiliation & Verification Queue
          </h3>
          <p className="text-xs text-slate-400">
            Verify Municipal DOB certificates, medical clearance, UTR payments, and issue official state registration numbers.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skater, reg no, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Statuses ({skaters.length})</option>
            <option value="pending">Pending Review</option>
            <option value="verified">Verified / Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Skaters Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Athlete / Reg No</th>
                <th className="py-3.5 px-4">District & Club</th>
                <th className="py-3.5 px-4">Category & Discipline</th>
                <th className="py-3.5 px-4">Fee UTR</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSkaters.map((s) => (
                <tr key={s.id} className="hover:bg-slate-850 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-sm">
                      {s.firstName} {s.lastName}
                    </div>
                    <div className="text-[10px] font-mono text-amber-400">
                      {s.registrationNumber} • {s.dateOfBirth}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-200">{s.district}</div>
                    <div className="text-[10px] text-slate-400">{s.club}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{s.ageCategory} ({s.gender})</div>
                    <div className="text-[10px] text-slate-400">{s.discipline}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono text-emerald-400 font-bold">
                      {s.annualFeePaid ? (s.annualFeeUtr || 'PAID') : 'UNPAID'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">₹500 / 2026</span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                      s.status === 'verified' || s.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : s.status === 'rejected'
                          ? 'bg-red-500/20 text-red-300 border-red-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {s.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedSkater(s);
                        setIsDocModalOpen(true);
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3 py-1.5 rounded-xl border border-slate-700"
                    >
                      Inspect Dossier
                    </button>

                    {s.status === 'pending' ? (
                      <button
                        onClick={() => handleVerifySkater(s.id, 'approved')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-sm"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setCertSkater(s);
                          setIsCertModalOpen(true);
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-xl shadow-sm"
                      >
                        Issue Cert
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Athlete Dossier Inspection Modal */}
      {isDocModalOpen && selectedSkater && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">
                  Dossier Inspection: {selectedSkater.firstName} {selectedSkater.lastName}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsDocModalOpen(false);
                  setIsRejecting(false);
                }}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] block">Registration No:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">{selectedSkater.registrationNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Current Verification Status:</span>
                  <span className="font-bold text-white uppercase">{selectedSkater.status}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Date of Birth & Age Bracket:</span>
                  <span className="font-semibold text-white">{selectedSkater.dateOfBirth} ({selectedSkater.ageCategory})</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Father / Guardian:</span>
                  <span className="font-semibold text-white">{selectedSkater.fatherName}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Mobile / WhatsApp:</span>
                  <span className="font-semibold text-white">{selectedSkater.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Annual Fee UTR:</span>
                  <span className="font-mono font-semibold text-emerald-400">{selectedSkater.annualFeeUtr || 'N/A'}</span>
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div className="space-y-2">
                <h4 className="font-bold text-white">Verification Attachments:</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold block">1. Passport Photo</span>
                      <span className="text-[10px] text-slate-500">Official Badge Headshot</span>
                    </div>
                    {selectedSkater.photoUrl && (
                      <a
                        href={selectedSkater.photoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-400 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </a>
                    )}
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold block">2. DOB Birth Proof</span>
                      <span className="text-[10px] text-slate-500">Municipal Gazette</span>
                    </div>
                    <span className="text-emerald-400 font-semibold text-[11px]">✓ Verified</span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold block">3. Medical Fitness</span>
                      <span className="text-[10px] text-slate-500">MBBS Clearance</span>
                    </div>
                    <span className="text-emerald-400 font-semibold text-[11px]">✓ Attached</span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold block">4. Aadhaar / Address</span>
                      <span className="text-[10px] text-slate-500">State Residency</span>
                    </div>
                    <span className="text-emerald-400 font-semibold text-[11px]">✓ Attached</span>
                  </div>
                </div>
              </div>

              {/* Rejection Form */}
              {isRejecting && (
                <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-2xl space-y-2">
                  <label className="text-[11px] font-bold text-red-300 block">
                    Provide Rejection / Resubmission Reason *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Unclear DOB certificate. Please upload clear municipal certificate..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full bg-slate-950 border border-red-500/50 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-400"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsRejecting(false)}
                      className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleVerifySkater(selectedSkater.id, 'rejected', rejectReason)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={() => setIsRejecting(true)}
                className="bg-red-900/60 hover:bg-red-900 text-red-300 px-4 py-2 rounded-xl text-xs font-semibold border border-red-700"
              >
                Reject / Request Resubmission
              </button>

              <button
                onClick={() => {
                  handleVerifySkater(selectedSkater.id, 'approved');
                  setIsDocModalOpen(false);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-xl text-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Issue State ID</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Issue Modal */}
      <CertificateGeneratorModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        onCertificateIssued={(cert) => {
          setIsCertModalOpen(false);
        }}
        prefillSkater={certSkater}
      />
    </div>
  );
};
