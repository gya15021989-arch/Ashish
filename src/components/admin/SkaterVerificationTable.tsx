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
  UserCheck,
  Edit3,
  Trash2,
  FolderOpen,
  Printer,
  Archive,
  RotateCcw,
  Calendar,
  X,
  AlertTriangle,
  UserX
} from 'lucide-react';
import { Skater, DisciplineType } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { getSkaterLicenseNumber } from '../../utils/districtCodes';
import { CertificateGeneratorModal } from './CertificateGeneratorModal';
import { SkaterDetailsModal } from './SkaterDetailsModal';
import { SkaterEditModal } from './SkaterEditModal';
import { SkaterDocumentsModal } from './SkaterDocumentsModal';
import { SkaterDeleteConfirmModal } from './SkaterDeleteConfirmModal';
import { RegistrationSlipModal } from '../skater/RegistrationSlipModal';

const UP_DISTRICTS = [
  'All',
  'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 'Azamgarh', 
  'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 
  'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 
  'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar (Noida)', 'Ghaziabad', 
  'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 
  'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 
  'Kheri (Lakhimpur)', 'Kushinagar', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 
  'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 
  'Prayagraj (Allahabad)', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 
  'Shahjahanpur', 'Shamli', 'Shrawasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 
  'Unnao', 'Varanasi'
];

const DISCIPLINES = [
  'All',
  'Speed Skating (Inline)',
  'Speed Skating (Quad)',
  'Inline Freestyle',
  'Roller Freestyle',
  'Artistic Skating',
  'Roller Hockey',
  'Inline Hockey',
  'Skateboarding',
  'Roller Derby',
  'Alpine / Downhill'
];

export const SkaterVerificationTable: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const adminEmail = user?.email || 'admin@uprsa.org';

  const [skaters, setSkaters] = useState<Skater[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [disciplineFilter, setDisciplineFilter] = useState('All');
  const [clubFilter, setClubFilter] = useState('All');
  const [ageCategoryFilter, setAgeCategoryFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showTrashOnly, setShowTrashOnly] = useState(false);

  // Active Modals
  const [detailSkater, setDetailSkater] = useState<Skater | null>(null);
  const [editSkater, setEditSkater] = useState<Skater | null>(null);
  const [docSkater, setDocSkater] = useState<Skater | null>(null);
  const [deleteSkater, setDeleteSkater] = useState<Skater | null>(null);
  const [slipSkater, setSlipSkater] = useState<Skater | null>(null);
  const [certSkater, setCertSkater] = useState<Skater | null>(null);

  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadSkaters();
  }, [showTrashOnly]);

  const loadSkaters = async () => {
    setLoading(true);
    try {
      const res = await api.getSkaters({
        includeDeleted: showTrashOnly,
        status: showTrashOnly ? 'trash' : undefined
      });
      if (res.success && res.data) {
        setSkaters(res.data);
      }
    } catch (e) {
      console.error('Failed to load skaters:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSkaterUpdated = (updated: Skater) => {
    setSkaters(prev => prev.map(s => s.id === updated.id ? updated : s));
    if (detailSkater?.id === updated.id) setDetailSkater(updated);
    if (editSkater?.id === updated.id) setEditSkater(updated);
    if (docSkater?.id === updated.id) setDocSkater(updated);
    setActionFeedback({ type: 'success', message: `Skater ${updated.firstName} ${updated.lastName} successfully updated.` });
  };

  const handleSkaterDeleted = (skaterId: string, isPermanent: boolean) => {
    setSkaters(prev => prev.filter(s => s.id !== skaterId));
    if (detailSkater?.id === skaterId) setDetailSkater(null);
    setDeleteSkater(null);
    setActionFeedback({
      type: 'success',
      message: isPermanent 
        ? 'Skater application has been permanently purged from official registry.'
        : 'Skater application has been moved to trash.'
    });
  };

  const handleRestoreSkater = async (skater: Skater) => {
    try {
      const res = await api.restoreSkater(skater.id, adminEmail);
      if (res.success && res.data) {
        setSkaters(prev => prev.filter(s => s.id !== skater.id));
        setActionFeedback({
          type: 'success',
          message: `Skater ${skater.firstName} ${skater.lastName} restored from trash to active roster.`
        });
      }
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Failed to restore skater from trash.'
      });
    }
  };

  const handleQuickApprove = async (skater: Skater) => {
    try {
      const generatedLicense = skater.licenseNumber || getSkaterLicenseNumber(skater);
      const res = await api.updateSkaterStatus(
        skater.id,
        'approved',
        undefined,
        'Approved by Administrator via Scrutiny Roster',
        generatedLicense,
        adminEmail
      );
      if (res.success && res.data) {
        handleSkaterUpdated(res.data);
      }
    } catch (err: any) {
      setActionFeedback({ type: 'error', message: err.message || 'Failed to approve skater.' });
    }
  };

  // Client-side filtering
  const filteredSkaters = skaters.filter(s => {
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || (
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
      (s.registrationNumber && s.registrationNumber.toLowerCase().includes(q)) ||
      (s.applicationNumber && s.applicationNumber.toLowerCase().includes(q)) ||
      (s.licenseNumber && s.licenseNumber.toLowerCase().includes(q)) ||
      (s.loginId && s.loginId.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.district && s.district.toLowerCase().includes(q)) ||
      (s.club && s.club.toLowerCase().includes(q)) ||
      (s.phone && s.phone.includes(q))
    );

    const matchesStatus = 
      statusFilter === 'All' ||
      (statusFilter === 'pending' && (s.status === 'pending' || s.status === 'under_scrutiny')) ||
      (statusFilter === 'verified' && (s.status === 'verified' || s.status === 'approved')) ||
      (statusFilter === 'rejected' && s.status === 'rejected') ||
      s.status === statusFilter;

    const matchesDistrict = districtFilter === 'All' || s.district === districtFilter;
    const matchesDiscipline = disciplineFilter === 'All' || s.discipline === disciplineFilter;
    const matchesClub = clubFilter === 'All' || s.club === clubFilter;
    const matchesAgeCategory = ageCategoryFilter === 'All' || s.ageCategory === ageCategoryFilter;

    const regDate = s.created_at ? s.created_at.split('T')[0] : '';
    const matchesDateFrom = !dateFrom || (regDate && regDate >= dateFrom);
    const matchesDateTo = !dateTo || (regDate && regDate <= dateTo);

    return matchesSearch && matchesStatus && matchesDistrict && matchesDiscipline && matchesClub && matchesAgeCategory && matchesDateFrom && matchesDateTo;
  });

  // Unique Clubs and Age Categories for Filters
  const availableClubs = Array.from(new Set(skaters.map(s => s.club).filter(Boolean))).sort() as string[];
  const availableAgeCategories = Array.from(new Set(skaters.map(s => s.ageCategory).filter(Boolean))).sort() as string[];

  // KPI Metrics
  const totalCount = skaters.length;
  const pendingCount = skaters.filter(s => s.status === 'pending' || s.status === 'under_scrutiny').length;
  const verifiedCount = skaters.filter(s => s.status === 'verified' || s.status === 'approved').length;
  const rejectedCount = skaters.filter(s => s.status === 'rejected').length;

  const getDocCount = (s: Skater) => {
    return [
      s.photoUrl,
      s.dobProofUrl,
      s.aadhaarDocUrl,
      s.medicalCertUrl,
      s.schoolIdDocUrl,
      s.otherDocUrl
    ].filter(Boolean).length;
  };

  const calculateAge = (dob: string) => {
    if (!dob) return '—';
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return age > 0 ? `${age}y` : '—';
  };

  return (
    <div className="space-y-5">
      {/* Alert / Feedback Notification */}
      {actionFeedback && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between animate-in fade-in ${
          actionFeedback.type === 'success'
            ? 'bg-emerald-950/60 text-emerald-200 border-emerald-500/40'
            : 'bg-red-950/60 text-red-200 border-red-500/40'
        }`}>
          <div className="flex items-center gap-2">
            {actionFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{actionFeedback.message}</span>
          </div>
          <button 
            onClick={() => setActionFeedback(null)} 
            className="text-slate-400 hover:text-white text-sm px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner & Quick KPI Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                UPRSA SECRETARIAT • SKATER APPROVAL MODULE
              </span>
              {showTrashOnly && (
                <span className="text-[10px] font-mono font-bold bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30 uppercase">
                  VIEWING ARCHIVED / TRASH
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              {showTrashOnly ? 'Archived & Deleted Skater Applications' : 'Athlete Scrutiny & State Approval Center'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Authorized admin management: view full applicant details, inspect KYC documents, edit registrations, delete or restore applications, and issue official state licenses.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowTrashOnly(!showTrashOnly)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                showTrashOnly
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-slate-950 text-slate-300 border-slate-700 hover:border-slate-600'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{showTrashOnly ? 'Show Active Skaters' : 'Trash / Archive'}</span>
            </button>

            <button
              onClick={loadSkaters}
              disabled={loading}
              className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold"
              title="Refresh roster"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Scannable Counters */}
        {!showTrashOnly && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
            <div 
              onClick={() => setStatusFilter('All')} 
              className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                statusFilter === 'All' ? 'bg-slate-800/90 border-amber-500/40' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Applications</span>
              <span className="text-lg font-black text-white">{totalCount}</span>
            </div>

            <div 
              onClick={() => setStatusFilter('pending')} 
              className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                statusFilter === 'pending' ? 'bg-amber-500/10 border-amber-500/50' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] text-amber-400 uppercase font-bold block">Pending Scrutiny</span>
              <span className="text-lg font-black text-amber-300">{pendingCount}</span>
            </div>

            <div 
              onClick={() => setStatusFilter('verified')} 
              className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                statusFilter === 'verified' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] text-emerald-400 uppercase font-bold block">Verified / Approved</span>
              <span className="text-lg font-black text-emerald-300">{verifiedCount}</span>
            </div>

            <div 
              onClick={() => setStatusFilter('rejected')} 
              className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                statusFilter === 'rejected' ? 'bg-red-500/10 border-red-500/50' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] text-red-400 uppercase font-bold block">Rejected / Corrections</span>
              <span className="text-lg font-black text-red-300">{rejectedCount}</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
          {/* Search Box */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Name, Reg No, App No, Phone, Club..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="verified">Verified / Approved</option>
              <option value="under_scrutiny">Under Correction</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* District Filter */}
          <div>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {UP_DISTRICTS.map(d => (
                <option key={d} value={d}>{d === 'All' ? 'All Districts' : d}</option>
              ))}
            </select>
          </div>

          {/* Discipline Filter */}
          <div>
            <select
              value={disciplineFilter}
              onChange={(e) => setDisciplineFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {DISCIPLINES.map(disc => (
                <option key={disc} value={disc}>{disc === 'All' ? 'All Disciplines' : disc}</option>
              ))}
            </select>
          </div>

          {/* Club Filter */}
          <div>
            <select
              value={clubFilter}
              onChange={(e) => setClubFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Clubs</option>
              {availableClubs.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Age Category Filter */}
          <div>
            <select
              value={ageCategoryFilter}
              onChange={(e) => setAgeCategoryFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Age Categories</option>
              {availableAgeCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
                setDistrictFilter('All');
                setDisciplineFilter('All');
                setClubFilter('All');
                setAgeCategoryFilter('All');
                setDateFrom('');
                setDateTo('');
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 rounded-xl text-xs border border-slate-700 transition-colors text-center"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Date Filter Strip */}
        <div className="flex items-center gap-3 text-xs pt-1 flex-wrap text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-400 font-medium">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Registration Date Range:</span>
          </span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-[11px]"
              title="Registered After"
            />
            <span>to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-[11px]"
              title="Registered Before"
            />
          </div>
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(''); setDateTo(''); }}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Clear dates
            </button>
          )}

          <div className="ml-auto text-[11px] text-slate-400">
            Showing <strong>{filteredSkaters.length}</strong> of <strong>{skaters.length}</strong> skater applications
          </div>
        </div>
      </div>

      {/* Skater Applications Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading skater applications from database...</p>
          </div>
        ) : filteredSkaters.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <UserX className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-white">No Skater Applications Found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No skater matches the selected search filters. Try adjusting your search query, status, or district.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Athlete & Reg ID</th>
                  <th className="py-3.5 px-4">District & Club</th>
                  <th className="py-3.5 px-4">Discipline & Age</th>
                  <th className="py-3.5 px-4">KYC Documents</th>
                  <th className="py-3.5 px-4">Fee / UTR</th>
                  <th className="py-3.5 px-4 text-center">Status & License</th>
                  <th className="py-3.5 px-4 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredSkaters.map((s) => {
                  const docCount = getDocCount(s);
                  const isAppr = s.status === 'verified' || s.status === 'approved' || (s.status as string) === 'APPROVED';
                  const isRej = s.status === 'rejected';

                  return (
                    <tr key={s.id} className="hover:bg-slate-850/60 transition-colors">
                      {/* Athlete Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {s.photoUrl ? (
                            <img
                              src={s.photoUrl}
                              alt={s.firstName}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400 shrink-0">
                              {s.firstName.charAt(0)}{s.lastName.charAt(0)}
                            </div>
                          )}

                          <div>
                            <div className="font-bold text-white text-sm">
                              {s.firstName} {s.lastName}
                            </div>
                            <div className="text-[10px] font-mono text-amber-400 flex items-center gap-1.5 flex-wrap">
                              <span>{s.registrationNumber}</span>
                              <span className="text-emerald-300 bg-emerald-950/70 px-1.5 py-0.2 rounded border border-emerald-500/30 text-[9px] font-bold">
                                LIC: {s.licenseNumber || getSkaterLicenseNumber(s)}
                              </span>
                              {s.applicationNumber && (
                                <span className="text-slate-500">• APP: {s.applicationNumber}</span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              DOB: {s.dateOfBirth} ({s.age || calculateAge(s.dateOfBirth)}) • {s.gender}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* District & Club */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{s.district}</div>
                        <div className="text-[11px] text-slate-400">{s.club || 'Unaffiliated'}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{s.phone}</div>
                      </td>

                      {/* Discipline & Category */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-amber-300">{s.discipline}</div>
                        <div className="text-[11px] text-slate-400">{s.ageCategory}</div>
                        {s.coachName && (
                          <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                            Coach: {s.coachName}
                          </div>
                        )}
                      </td>

                      {/* Documents Badge */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => setDocSkater(s)}
                          className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-2.5 py-1.5 rounded-xl transition-colors text-left"
                          title="Click to manage applicant documents"
                        >
                          <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-200 block text-[11px]">
                              {docCount}/6 Files
                            </span>
                            <span className="text-[9px] text-slate-400 block">
                              {docCount >= 4 ? 'KYC Compliant' : 'Incomplete'}
                            </span>
                          </div>
                        </button>
                      </td>

                      {/* Fee Payment */}
                      <td className="py-3.5 px-4">
                        <span className={`font-mono font-bold text-[11px] block ${
                          s.annualFeePaid ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {s.annualFeePaid ? '₹500 PAID' : 'UNPAID'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 block truncate max-w-[120px]" title={s.annualFeeUtr}>
                          {s.annualFeeUtr || 'No UTR'}
                        </span>
                      </td>

                      {/* Status & License */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border inline-block ${
                          isAppr
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : isRej
                              ? 'bg-red-500/20 text-red-300 border-red-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}>
                          {s.status}
                        </span>

                        <span className="text-[9px] font-mono text-emerald-300 block mt-1 truncate max-w-[130px]" title={s.licenseNumber || getSkaterLicenseNumber(s)}>
                          {s.licenseNumber || getSkaterLicenseNumber(s)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Inspect Dossier / Full Details */}
                          <button
                            onClick={() => setDetailSkater(s)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
                            title="View Full Skater Details"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-400" />
                          </button>

                          {/* Edit Skater */}
                          <button
                            onClick={() => setEditSkater(s)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
                            title="Edit Skater Data"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                          </button>

                          {/* Documents Vault */}
                          <button
                            onClick={() => setDocSkater(s)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
                            title="Manage Documents (Replace/Delete)"
                          >
                            <FileText className="w-3.5 h-3.5 text-emerald-400" />
                          </button>

                          {/* Registration Slip */}
                          <button
                            onClick={() => setSlipSkater(s)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
                            title="Annual Registration Docket Slip"
                          >
                            <Printer className="w-3.5 h-3.5 text-purple-400" />
                          </button>

                          {/* Quick Approve (if pending) */}
                          {!isAppr && !s.isDeleted && (
                            <button
                              onClick={() => handleQuickApprove(s)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] flex items-center gap-1 shadow-sm"
                              title="Quick Approve"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                          )}

                          {/* Issue Certificate (if approved) */}
                          {isAppr && !s.isDeleted && (
                            <button
                              onClick={() => {
                                setCertSkater(s);
                                setIsCertModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-[11px] flex items-center gap-1 shadow-sm"
                              title="Issue State Certificate"
                            >
                              <Award className="w-3 h-3" />
                              <span>Cert</span>
                            </button>
                          )}

                          {/* If in Trash: Restore & Purge */}
                          {s.isDeleted ? (
                            <>
                              <button
                                onClick={() => handleRestoreSkater(s)}
                                className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] font-bold flex items-center gap-1"
                                title="Restore Skater from Trash"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Restore</span>
                              </button>

                              <button
                                onClick={() => setDeleteSkater(s)}
                                className="p-1.5 bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white rounded-lg border border-red-500/50"
                                title="Permanently Purge Skater"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            /* Delete Skater */
                            <button
                              onClick={() => setDeleteSkater(s)}
                              className="p-1.5 bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 rounded-lg border border-slate-700 hover:border-red-500/40 transition-colors"
                              title="Delete Skater"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: Full Details Modal */}
      {detailSkater && (
        <SkaterDetailsModal
          isOpen={Boolean(detailSkater)}
          onClose={() => setDetailSkater(null)}
          skater={detailSkater}
          adminUser={adminEmail}
          onSkaterUpdated={handleSkaterUpdated}
          onEditRequested={() => {
            setEditSkater(detailSkater);
          }}
          onDocumentsRequested={() => {
            setDocSkater(detailSkater);
          }}
          onDeleteRequested={() => {
            setDeleteSkater(detailSkater);
          }}
          onPrintSlipRequested={() => {
            setSlipSkater(detailSkater);
          }}
        />
      )}

      {/* MODAL 2: Edit Skater Modal */}
      {editSkater && (
        <SkaterEditModal
          isOpen={Boolean(editSkater)}
          onClose={() => setEditSkater(null)}
          skater={editSkater}
          adminUser={adminEmail}
          onSkaterUpdated={handleSkaterUpdated}
        />
      )}

      {/* MODAL 3: Documents Management Modal */}
      {docSkater && (
        <SkaterDocumentsModal
          isOpen={Boolean(docSkater)}
          onClose={() => setDocSkater(null)}
          skater={docSkater}
          adminUser={adminEmail}
          onSkaterUpdated={handleSkaterUpdated}
        />
      )}

      {/* MODAL 4: Delete Confirmation Modal */}
      {deleteSkater && (
        <SkaterDeleteConfirmModal
          isOpen={Boolean(deleteSkater)}
          onClose={() => setDeleteSkater(null)}
          skater={deleteSkater}
          adminUser={adminEmail}
          onDeleted={handleSkaterDeleted}
        />
      )}

      {/* MODAL 5: Registration Slip Modal */}
      {slipSkater && (
        <RegistrationSlipModal
          isOpen={Boolean(slipSkater)}
          onClose={() => setSlipSkater(null)}
          skater={slipSkater}
        />
      )}

      {/* MODAL 6: Certificate Generator Modal */}
      <CertificateGeneratorModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        onCertificateIssued={(cert) => {
          setIsCertModalOpen(false);
          setActionFeedback({ type: 'success', message: `Official Certificate ${cert.certificateNumber} issued successfully.` });
        }}
        prefillSkater={certSkater}
      />
    </div>
  );
};
