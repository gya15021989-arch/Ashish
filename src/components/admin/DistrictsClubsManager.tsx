import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Check, 
  X, 
  Phone, 
  Mail, 
  Users, 
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Award,
  UserCheck,
  Wallet
} from 'lucide-react';
import { District, Club } from '../../types';
import { api } from '../../services/api';

export const DistrictsClubsManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'districts' | 'clubs'>('districts');
  const [districts, setDistricts] = useState<District[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<string>('ALL');
  
  // Modals
  const [isDistrictModalOpen, setIsDistrictModalOpen] = useState(false);
  const [isClubModalOpen, setIsClubModalOpen] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Deletion modals state
  const [deleteDistrictConfirm, setDeleteDistrictConfirm] = useState<District | null>(null);
  const [deleteClubConfirm, setDeleteClubConfirm] = useState<Club | null>(null);

  // Uploading states
  const [uploadingDistrictPhoto, setUploadingDistrictPhoto] = useState(false);
  const [uploadingPresidentPhoto, setUploadingPresidentPhoto] = useState(false);
  const [uploadingSecretaryPhoto, setUploadingSecretaryPhoto] = useState(false);
  const [uploadingTreasurerPhoto, setUploadingTreasurerPhoto] = useState(false);
  const [uploadingClubPhoto, setUploadingClubPhoto] = useState(false);
  const [uploadingCoachPhoto, setUploadingCoachPhoto] = useState(false);

  // Forms
  const defaultDistrictForm: Partial<District> = {
    name: '',
    hindiName: '',
    zone: 'Central',
    presidentName: '',
    president: '',
    presidentPhone: '',
    presidentEmail: '',
    presidentPhotoUrl: '',
    secretaryName: '',
    secretary: '',
    secretaryPhone: '',
    secretaryEmail: '',
    secretaryPhotoUrl: '',
    treasurerName: '',
    treasurer: '',
    treasurerPhone: '',
    treasurerEmail: '',
    treasurerPhotoUrl: '',
    contactPhone: '',
    contactEmail: '',
    officeAddress: '',
    stadiumVenue: '',
    affiliatedYear: 2015,
    status: 'Active',
    clubsCount: 0,
    skatersCount: 0,
    logoUrl: '',
    photoUrl: ''
  };

  const defaultClubForm: Partial<Club> = {
    name: '',
    hindiName: '',
    affiliationNumber: '',
    district: 'Lucknow',
    city: 'Lucknow',
    headCoach: '',
    contactPerson: '',
    coachDesignation: 'Head Coach & RSFI Technical Official',
    coachPhone: '',
    coachEmail: '',
    contactPhone: '',
    contactEmail: '',
    officialAddress: '',
    venue: '',
    facility: '200m Banked Track & Synthetic Surface',
    disciplines: ['Inline Speed', 'Roller Freestyle'],
    establishedYear: 2020,
    skatersCount: 0,
    status: 'Active',
    photoUrl: '',
    coachPhotoUrl: ''
  };

  const [districtForm, setDistrictForm] = useState<Partial<District>>(defaultDistrictForm);
  const [clubForm, setClubForm] = useState<Partial<Club>>(defaultClubForm);
  const [newDisciplineText, setNewDisciplineText] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [dRes, cRes] = await Promise.all([
        api.getDistricts(),
        api.getClubs()
      ]);
      if (dRes.success && dRes.data) setDistricts(dRes.data);
      if (cRes.success && cRes.data) setClubs(cRes.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load district & club records', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper for generic file to Base64 and upload (accepting JPG/JPEG/PNG)
  const handleGenericImageUpload = async (
    file: File,
    onSuccess: (url: string) => void,
    setLoadingState: (loading: boolean) => void
  ) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      showToast('Image size exceeds 8MB. Please select a smaller JPG image.', 'error');
      return;
    }

    setLoadingState(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const uploadRes = await api.uploadFile(file.name, base64, false);
        if (uploadRes.success && uploadRes.fileUrl) {
          onSuccess(uploadRes.fileUrl);
          showToast('JPG / Image uploaded successfully!', 'success');
        } else {
          showToast(uploadRes.message || 'Image upload failed', 'error');
        }
        setLoadingState(false);
      };
      reader.onerror = () => {
        showToast('Failed to read image file', 'error');
        setLoadingState(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      showToast('Error uploading image', 'error');
      setLoadingState(false);
    }
  };

  // ==========================================
  // DISTRICT HANDLERS (Full CRUD)
  // ==========================================
  const handleOpenAddDistrict = () => {
    setEditingDistrict(null);
    setDistrictForm({
      ...defaultDistrictForm
    });
    setIsDistrictModalOpen(true);
  };

  const handleOpenEditDistrict = (d: District) => {
    setEditingDistrict(d);
    const presName = d.presidentName || d.president || '';
    const secName = d.secretaryName || d.secretary || '';
    const secPhone = d.secretaryPhone || d.contactPhone || '';
    const secEmail = d.secretaryEmail || d.contactEmail || '';
    const tresName = d.treasurerName || d.treasurer || '';
    const tresPhone = d.treasurerPhone || '';
    const tresEmail = d.treasurerEmail || '';

    setDistrictForm({ 
      ...d,
      presidentName: presName,
      president: presName,
      presidentPhone: d.presidentPhone || '',
      presidentEmail: d.presidentEmail || '',
      presidentPhotoUrl: d.presidentPhotoUrl || '',
      secretaryName: secName,
      secretary: secName,
      secretaryPhone: secPhone,
      secretaryEmail: secEmail,
      secretaryPhotoUrl: d.secretaryPhotoUrl || '',
      treasurerName: tresName,
      treasurer: tresName,
      treasurerPhone: tresPhone,
      treasurerEmail: tresEmail,
      treasurerPhotoUrl: d.treasurerPhotoUrl || '',
      contactPhone: secPhone,
      contactEmail: secEmail,
      officeAddress: d.officeAddress || '',
      stadiumVenue: d.stadiumVenue || '',
      photoUrl: d.photoUrl || d.logoUrl || '',
      logoUrl: d.logoUrl || d.photoUrl || '',
      status: d.status || 'Active'
    });
    setIsDistrictModalOpen(true);
  };

  const handleSaveDistrict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!districtForm.name?.trim()) {
      showToast('District name is required', 'error');
      return;
    }

    const payload: Partial<District> = {
      ...districtForm,
      president: districtForm.presidentName || districtForm.president || '',
      presidentName: districtForm.presidentName || districtForm.president || '',
      secretary: districtForm.secretaryName || districtForm.secretary || '',
      secretaryName: districtForm.secretaryName || districtForm.secretary || '',
      contactPhone: districtForm.secretaryPhone || districtForm.contactPhone || '',
      secretaryPhone: districtForm.secretaryPhone || districtForm.contactPhone || '',
      contactEmail: districtForm.secretaryEmail || districtForm.contactEmail || '',
      secretaryEmail: districtForm.secretaryEmail || districtForm.contactEmail || '',
      treasurer: districtForm.treasurerName || districtForm.treasurer || '',
      treasurerName: districtForm.treasurerName || districtForm.treasurer || '',
      treasurerPhone: districtForm.treasurerPhone || '',
      treasurerEmail: districtForm.treasurerEmail || '',
      treasurerPhotoUrl: districtForm.treasurerPhotoUrl || '',
      logoUrl: districtForm.photoUrl || districtForm.logoUrl || '',
      photoUrl: districtForm.photoUrl || districtForm.logoUrl || ''
    };

    try {
      if (editingDistrict) {
        const res = await api.updateDistrict(editingDistrict.id, payload);
        if (res.success) {
          showToast(`District "${districtForm.name}" updated successfully!`);
          loadData();
          setIsDistrictModalOpen(false);
        } else {
          showToast(res.message || 'Failed to update district', 'error');
        }
      } else {
        const res = await api.createDistrict(payload);
        if (res.success) {
          showToast(`District "${districtForm.name}" registered successfully!`);
          loadData();
          setIsDistrictModalOpen(false);
        } else {
          showToast(res.message || 'Failed to register district', 'error');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to save district unit', 'error');
    }
  };

  const handleConfirmDeleteDistrict = async () => {
    if (!deleteDistrictConfirm) return;
    try {
      const res = await api.deleteDistrict(deleteDistrictConfirm.id);
      if (res.success) {
        showToast(`District "${deleteDistrictConfirm.name}" removed successfully!`);
        setDistricts(prev => prev.filter(d => d.id !== deleteDistrictConfirm.id));
        setDeleteDistrictConfirm(null);
      } else {
        showToast(res.message || 'Failed to delete district', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete district unit', 'error');
    }
  };

  // ==========================================
  // CLUB HANDLERS (Full CRUD)
  // ==========================================
  const handleOpenAddClub = () => {
    setEditingClub(null);
    setClubForm({
      ...defaultClubForm,
      district: districts[0]?.name || 'Lucknow',
      city: districts[0]?.name || 'Lucknow'
    });
    setNewDisciplineText('');
    setIsClubModalOpen(true);
  };

  const handleOpenEditClub = (c: Club) => {
    setEditingClub(c);
    setClubForm({ 
      ...c,
      headCoach: c.headCoach || c.contactPerson || '',
      coachPhone: c.coachPhone || c.contactPhone || '',
      coachEmail: c.coachEmail || c.contactEmail || '',
      disciplines: Array.isArray(c.disciplines) ? [...c.disciplines] : ['Inline Speed', 'Roller Freestyle'],
      status: c.status || 'Active'
    });
    setNewDisciplineText('');
    setIsClubModalOpen(true);
  };

  const handleSaveClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubForm.name?.trim() || !clubForm.district?.trim()) {
      showToast('Club name and district are required', 'error');
      return;
    }

    try {
      const payload = {
        ...clubForm,
        contactPerson: clubForm.headCoach || clubForm.contactPerson || '',
        contactPhone: clubForm.coachPhone || clubForm.contactPhone || '',
        contactEmail: clubForm.coachEmail || clubForm.contactEmail || ''
      };

      if (editingClub) {
        const res = await api.updateClub(editingClub.id, payload);
        if (res.success) {
          showToast(`Club "${clubForm.name}" updated successfully!`);
          loadData();
          setIsClubModalOpen(false);
        } else {
          showToast(res.message || 'Failed to update club', 'error');
        }
      } else {
        const res = await api.createClub(payload);
        if (res.success) {
          showToast(`Club "${clubForm.name}" affiliated successfully!`);
          loadData();
          setIsClubModalOpen(false);
        } else {
          showToast(res.message || 'Failed to affiliate club', 'error');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to save club affiliation', 'error');
    }
  };

  const handleConfirmDeleteClub = async () => {
    if (!deleteClubConfirm) return;
    try {
      const res = await api.deleteClub(deleteClubConfirm.id);
      if (res.success) {
        showToast(`Club "${deleteClubConfirm.name}" removed successfully!`);
        setClubs(prev => prev.filter(c => c.id !== deleteClubConfirm.id));
        setDeleteClubConfirm(null);
      } else {
        showToast(res.message || 'Failed to delete club', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete club affiliation', 'error');
    }
  };

  const handleAddDiscipline = () => {
    const trimmed = newDisciplineText.trim();
    if (!trimmed) return;
    const current = (clubForm.disciplines as string[]) || [];
    if (!current.includes(trimmed)) {
      setClubForm({ ...clubForm, disciplines: [...current, trimmed] });
    }
    setNewDisciplineText('');
  };

  const handleRemoveDiscipline = (disc: string) => {
    const current = (clubForm.disciplines as string[]) || [];
    setClubForm({ ...clubForm, disciplines: current.filter(d => d !== disc) });
  };

  // Filtered lists
  const filteredDistricts = useMemo(() => {
    const q = search.toLowerCase().trim();
    return districts.filter(d => {
      const matchZone = selectedZone === 'ALL' || d.zone === selectedZone;
      const matchSearch = !q || 
        d.name.toLowerCase().includes(q) || 
        (d.hindiName && d.hindiName.toLowerCase().includes(q)) ||
        (d.secretary && d.secretary.toLowerCase().includes(q)) ||
        (d.secretaryName && d.secretaryName.toLowerCase().includes(q)) ||
        (d.president && d.president.toLowerCase().includes(q)) ||
        (d.presidentName && d.presidentName.toLowerCase().includes(q));
      return matchZone && matchSearch;
    });
  }, [districts, selectedZone, search]);

  const filteredClubs = useMemo(() => {
    const q = search.toLowerCase().trim();
    return clubs.filter(c => {
      const matchDist = selectedDistrictFilter === 'ALL' || c.district === selectedDistrictFilter;
      const matchSearch = !q || 
        c.name.toLowerCase().includes(q) ||
        (c.hindiName && c.hindiName.toLowerCase().includes(q)) ||
        (c.headCoach && c.headCoach.toLowerCase().includes(q)) ||
        (c.contactPerson && c.contactPerson.toLowerCase().includes(q)) ||
        (c.city && c.city.toLowerCase().includes(q));
      return matchDist && matchSearch;
    });
  }, [clubs, selectedDistrictFilter, search]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toast && (
        <div className={`p-4 rounded-2xl flex items-center justify-between shadow-xl transition-all duration-300 border ${
          toast.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          <div className="flex items-center gap-3">
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-xs font-bold">{toast.msg}</span>
          </div>
          <button onClick={() => setToast(null)} className="p-1 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Top Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <MapPin className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  Districts & Affiliated Clubs Management
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                    FULL CRUD + JPG UPLOAD
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Manage all 75 District Associations of UP, President, Secretary, affiliated clubs, and JPG photos.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadData}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
              <span>Refresh</span>
            </button>

            {activeSubTab === 'districts' ? (
              <button
                onClick={handleOpenAddDistrict}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Register District Unit</span>
              </button>
            ) : (
              <button
                onClick={handleOpenAddClub}
                className="bg-blue-600 hover:bg-blue-500 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Affiliate New Club</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 border border-slate-800/60 p-4 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">District Associations</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{districts.length} / 75</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/60 p-4 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Affiliated Clubs</span>
            <div className="text-2xl font-black text-blue-400 mt-1">{clubs.length}</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/60 p-4 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Leadership Photos (JPG)</span>
            <div className="text-xs font-bold text-emerald-400 mt-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>President, Sec & Treasurer JPG</span>
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/60 p-4 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Full Access</span>
            <div className="text-xs font-bold text-emerald-400 mt-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Create, Edit, Delete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Tabs Toggle */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => { setActiveSubTab('districts'); setSearch(''); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'districts'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-md font-black'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>75 District Associations ({districts.length})</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('clubs'); setSearch(''); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'clubs'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-md font-black'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Affiliated Skating Clubs & Academies ({clubs.length})</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder={activeSubTab === 'districts' ? "Search district, president, secretary, zone..." : "Search club academy name, coach, facility..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-white placeholder:text-slate-500 outline-none w-full"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-slate-500 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {activeSubTab === 'districts' ? (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'Central', 'Eastern', 'Western', 'Bundelkhand', 'Rohilkhand'].map((z) => (
              <button
                key={z}
                onClick={() => setSelectedZone(z)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedZone === z
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {z === 'ALL' ? 'All Zones' : `${z} Zone`}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold">Filter District:</span>
            <select
              value={selectedDistrictFilter}
              onChange={(e) => setSelectedDistrictFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              <option value="ALL">All Districts ({clubs.length})</option>
              {districts.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: DISTRICTS LIST CARDS                           */}
      {/* ========================================================= */}
      {activeSubTab === 'districts' && (
        <div>
          {loading ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-16 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold">Loading official district associations...</p>
            </div>
          ) : filteredDistricts.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-16 text-center text-slate-400 space-y-3">
              <MapPin className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">No Matching Districts Found</h4>
              <p className="text-xs text-slate-500">No district matches &ldquo;{search}&rdquo;</p>
              <button onClick={() => setSearch('')} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 cursor-pointer">
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDistricts.map((dist) => {
                const pres = dist.presidentName || dist.president;
                const sec = dist.secretaryName || dist.secretary;
                const tres = dist.treasurerName || dist.treasurer;
                const presPhoto = dist.presidentPhotoUrl;
                const secPhoto = dist.secretaryPhotoUrl;
                const tresPhoto = dist.treasurerPhotoUrl;
                const bannerPhoto = dist.photoUrl || dist.logoUrl;

                return (
                  <div 
                    key={dist.id} 
                    className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-emerald-500/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* District Banner/Emblem Area */}
                      <div className="relative h-36 bg-slate-950 overflow-hidden flex items-center justify-center">
                        {bannerPhoto ? (
                          <img
                            src={bannerPhoto}
                            alt={dist.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-600">
                            <MapPin className="w-8 h-8 opacity-40 mb-1" />
                            <span className="text-[10px] font-bold text-slate-500">District Banner / Emblem</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

                        {/* Zone & Status Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-black/75 backdrop-blur-md text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                            {dist.zone} Zone
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md ${
                            dist.status === 'Inactive' 
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          }`}>
                            {dist.status || 'Active'}
                          </span>
                        </div>

                        {dist.affiliatedYear && (
                          <div className="absolute top-3 right-3">
                            <span className="text-[10px] font-bold font-mono bg-slate-900/80 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                              Est. {dist.affiliatedYear}
                            </span>
                          </div>
                        )}

                        <div className="absolute bottom-3 left-4 right-4">
                          <h3 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                            {dist.name}
                          </h3>
                          {dist.hindiName && (
                            <p className="text-xs text-emerald-400 font-medium">
                              {dist.hindiName}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Leadership Details with Photos */}
                      <div className="p-5 space-y-4">
                        {/* President, Secretary & Treasurer Visual Rows */}
                        <div className="space-y-2.5">
                          {/* President Row */}
                          <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800/80 flex items-center gap-3">
                            {presPhoto ? (
                              <img
                                src={presPhoto}
                                alt="President"
                                referrerPolicy="no-referrer"
                                className="w-11 h-11 rounded-xl object-cover border border-amber-500/40 shrink-0"
                              />
                            ) : (
                              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                                <Award className="w-4 h-4" />
                              </div>
                            )}
                            <div className="truncate flex-1">
                              <span className="text-[10px] font-black uppercase text-amber-400 block tracking-wider">President</span>
                              <p className="text-xs font-black text-white truncate">
                                {pres || 'Not Appointed / Vacant'}
                              </p>
                              {dist.presidentPhone && (
                                <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                                  <Phone className="w-2.5 h-2.5 text-amber-400" />
                                  {dist.presidentPhone}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* General Secretary Row */}
                          <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800/80 flex items-center gap-3">
                            {secPhoto ? (
                              <img
                                src={secPhoto}
                                alt="Secretary"
                                referrerPolicy="no-referrer"
                                className="w-11 h-11 rounded-xl object-cover border border-emerald-500/40 shrink-0"
                              />
                            ) : (
                              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                                <UserCheck className="w-4 h-4" />
                              </div>
                            )}
                            <div className="truncate flex-1">
                              <span className="text-[10px] font-black uppercase text-emerald-400 block tracking-wider">General Secretary</span>
                              <p className="text-xs font-black text-white truncate">
                                {sec || 'Not Appointed / Vacant'}
                              </p>
                              {(dist.secretaryPhone || dist.contactPhone) && (
                                <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                                  <Phone className="w-2.5 h-2.5 text-emerald-400" />
                                  {dist.secretaryPhone || dist.contactPhone}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Treasurer Row */}
                          <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800/80 flex items-center gap-3">
                            {tresPhoto ? (
                              <img
                                src={tresPhoto}
                                alt="Treasurer"
                                referrerPolicy="no-referrer"
                                className="w-11 h-11 rounded-xl object-cover border border-sky-500/40 shrink-0"
                              />
                            ) : (
                              <div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
                                <Wallet className="w-4 h-4" />
                              </div>
                            )}
                            <div className="truncate flex-1">
                              <span className="text-[10px] font-black uppercase text-sky-400 block tracking-wider">Treasurer (कोषाध्यक्ष)</span>
                              <p className="text-xs font-black text-white truncate">
                                {tres || 'Not Appointed / Vacant'}
                              </p>
                              {dist.treasurerPhone && (
                                <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                                  <Phone className="w-2.5 h-2.5 text-sky-400" />
                                  {dist.treasurerPhone}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Address & Stadium */}
                        <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                          {(dist.secretaryEmail || dist.contactEmail) && (
                            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                              <span className="flex items-center gap-1 text-slate-500">
                                <Mail className="w-3 h-3 text-emerald-400" /> Email:
                              </span>
                              <span className="truncate max-w-[170px]">{dist.secretaryEmail || dist.contactEmail}</span>
                            </div>
                          )}
                          {dist.officeAddress && (
                            <p className="text-[11px] text-slate-400 line-clamp-2 pt-1 border-t border-slate-800/60">
                              📍 {dist.officeAddress}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-4 pt-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                        <span className="text-emerald-400 font-bold">{dist.clubsCount || 0} Clubs</span>
                        <span>•</span>
                        <span>{dist.skatersCount || 0} Skaters</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditDistrict(dist)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-black text-emerald-300 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Edit district details, president, secretary, and photos"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteDistrictConfirm(dist)}
                          className="p-1.5 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer"
                          title="Delete district unit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: CLUBS LIST CARDS                               */}
      {/* ========================================================= */}
      {activeSubTab === 'clubs' && (
        <div>
          {loading ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-16 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold">Loading affiliated skating clubs...</p>
            </div>
          ) : filteredClubs.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-16 text-center text-slate-400 space-y-3">
              <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">No Matching Clubs Found</h4>
              <p className="text-xs text-slate-500">No club academy matches &ldquo;{search}&rdquo;</p>
              <button onClick={() => setSearch('')} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 cursor-pointer">
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map((club) => (
                <div 
                  key={club.id} 
                  className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-blue-500/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Club Photo Banner */}
                    <div className="relative h-36 bg-slate-950 overflow-hidden flex items-center justify-center">
                      {club.photoUrl ? (
                        <img
                          src={club.photoUrl}
                          alt={club.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-600">
                          <Building2 className="w-8 h-8 opacity-40 mb-1" />
                          <span className="text-[10px] font-bold text-slate-500">No JPG Banner Photo</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

                      {/* District & Status Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-black/75 backdrop-blur-md text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-lg">
                          📍 {club.district}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          {club.status || 'Active'}
                        </span>
                      </div>

                      {club.affiliationNumber && (
                        <div className="absolute top-3 right-3">
                          <span className="text-[10px] font-mono bg-black/70 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                            {club.affiliationNumber}
                          </span>
                        </div>
                      )}

                      <div className="absolute bottom-3 left-4 right-4">
                        <h3 className="text-base font-black text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                          {club.name}
                        </h3>
                        {club.hindiName && (
                          <p className="text-xs text-blue-400 font-medium line-clamp-1">
                            {club.hindiName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Club Details Body */}
                    <div className="p-5 space-y-3">
                      {/* Head Coach Profile */}
                      <div className="flex items-center gap-3 bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800/80">
                        {club.coachPhotoUrl ? (
                          <img
                            src={club.coachPhotoUrl}
                            alt="Coach"
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-xl object-cover border border-blue-500/40 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                            <Users className="w-5 h-5" />
                          </div>
                        )}
                        <div className="truncate">
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">Head Coach / Contact</span>
                          <p className="text-xs font-bold text-white truncate">
                            {club.headCoach || club.contactPerson || 'Not Appointed'}
                          </p>
                          {(club.coachPhone || club.contactPhone) && (
                            <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                              <Phone className="w-2.5 h-2.5 text-blue-400" />
                              {club.coachPhone || club.contactPhone}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Facilities & Address */}
                      <div className="space-y-1.5 text-xs text-slate-300">
                        {club.facility && (
                          <div className="text-[11px] text-slate-300">
                            <strong className="text-slate-500">Facility: </strong>
                            <span>{club.facility}</span>
                          </div>
                        )}
                        {(club.venue || club.officialAddress) && (
                          <div className="text-[11px] text-slate-400 line-clamp-1">
                            <strong className="text-slate-500">Rink / Venue: </strong>
                            <span>{club.venue || club.officialAddress}</span>
                          </div>
                        )}
                      </div>

                      {/* Disciplines Chips */}
                      {club.disciplines && club.disciplines.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-800">
                          {(club.disciplines as string[]).slice(0, 3).map((disc, idx) => (
                            <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                              {disc}
                            </span>
                          ))}
                          {club.disciplines.length > 3 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-950 text-blue-400">
                              +{club.disciplines.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-4 pt-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      Est. {club.establishedYear || 2020} • {club.skatersCount || 0} Skaters
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditClub(club)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Edit club details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteClubConfirm(club)}
                        className="p-1.5 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer"
                        title="Delete club affiliation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* DISTRICT MODAL: CREATE / FULL EDIT (President, Secretary, Photo) */}
      {/* ========================================================= */}
      {isDistrictModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95">
            <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <MapPin className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {editingDistrict ? `Edit District: ${editingDistrict.name}` : 'Register New District Unit'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Edit President, General Secretary, Treasurer, leadership contacts, and JPG photographs
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsDistrictModalOpen(false)} 
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDistrict} className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
              {/* Section 1: Basic District Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>1. District Details (ज़िले का विवरण)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">District Name *</label>
                    <input
                      type="text"
                      required
                      value={districtForm.name || ''}
                      onChange={(e) => setDistrictForm({ ...districtForm, name: e.target.value })}
                      placeholder="e.g. Varanasi, Lucknow"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Hindi Name / हिंदी नाम</label>
                    <input
                      type="text"
                      value={districtForm.hindiName || ''}
                      onChange={(e) => setDistrictForm({ ...districtForm, hindiName: e.target.value })}
                      placeholder="उदा. वाराणसी, लखनऊ"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Geographic Zone</label>
                    <select
                      value={districtForm.zone || 'Central'}
                      onChange={(e) => setDistrictForm({ ...districtForm, zone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                    >
                      <option value="Central">Central Zone</option>
                      <option value="Eastern">Eastern Zone</option>
                      <option value="Western">Western Zone</option>
                      <option value="Bundelkhand">Bundelkhand Zone</option>
                      <option value="Rohilkhand">Rohilkhand Zone</option>
                      <option value="Southern">Southern Zone</option>
                    </select>
                  </div>
                </div>

                {/* District Logo / Banner JPG Upload */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                      District Banner / Association Crest Logo (JPG / JPEG)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        Size: 800 × 450 px (16:9)
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        Max 8MB
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={districtForm.photoUrl || districtForm.logoUrl || ''}
                      onChange={(e) => setDistrictForm({ ...districtForm, photoUrl: e.target.value, logoUrl: e.target.value })}
                      placeholder="https://... or click Upload JPG Image"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none font-mono"
                    />

                    <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-colors shrink-0">
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{uploadingDistrictPhoto ? 'Uploading...' : 'Upload JPG Banner'}</span>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleGenericImageUpload(
                              file,
                              (url) => setDistrictForm(prev => ({ ...prev, photoUrl: url, logoUrl: url })),
                              setUploadingDistrictPhoto
                            );
                          }
                        }}
                      />
                    </label>
                  </div>

                  {(districtForm.photoUrl || districtForm.logoUrl) && (
                    <div className="relative h-28 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 w-full">
                      <img
                        src={districtForm.photoUrl || districtForm.logoUrl}
                        alt="District Banner Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setDistrictForm({ ...districtForm, photoUrl: '', logoUrl: '' })}
                        className="absolute top-2 right-2 p-1.5 bg-black/75 hover:bg-rose-600 text-white rounded-lg transition-colors cursor-pointer"
                        title="Remove banner image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: PRESIDENT Details & JPG Photo */}
              <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>2. District President (अध्यक्ष का विवरण एवं JPG फ़ोटो)</span>
                  </h4>
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    PRESIDENT FULL EDIT
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">President Name</label>
                    <input
                      type="text"
                      value={districtForm.presidentName || districtForm.president || ''}
                      onChange={(e) => setDistrictForm({ ...districtForm, presidentName: e.target.value, president: e.target.value })}
                      placeholder="e.g. Dr. Rajesh Sharma"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">President Phone</label>
                    <input
                      type="text"
                      value={districtForm.presidentPhone || ''}
                      onChange={(e) => setDistrictForm({ ...districtForm, presidentPhone: e.target.value })}
                      placeholder="+91 94150 XXXXX"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">President Email</label>
                    <input
                      type="email"
                      value={districtForm.presidentEmail || ''}
                      onChange={(e) => setDistrictForm({ ...districtForm, presidentEmail: e.target.value })}
                      placeholder="president@district.org"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none font-mono"
                    />
                  </div>
                </div>

                {/* President JPG Photo Upload */}
                <div className="space-y-2 pt-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="block text-xs font-bold text-slate-300">
                      President Portrait Photo (JPG / JPEG फ़ोटो)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        Size: 400 × 400 px (1:1 Passport)
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        Max 8MB
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="text"
                      value={districtForm.presidentPhotoUrl || ''}
                      onChange={(e) => setDistrictForm({ ...districtForm, presidentPhotoUrl: e.target.value })}
                      placeholder="President JPG Photo URL or use Upload button"
                      className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none font-mono"
                    />
                    <label className="w-full sm:w-auto cursor-pointer bg-amber-600 hover:bg-amber-500 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shrink-0 shadow-lg shadow-amber-600/20">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingPresidentPhoto ? 'Uploading...' : 'Upload President JPG'}</span>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleGenericImageUpload(
                              file,
                              (url) => setDistrictForm(prev => ({ ...prev, presidentPhotoUrl: url })),
                              setUploadingPresidentPhoto
                            );
                          }
                        }}
                      />
                    </label>
                  </div>

                  {districtForm.presidentPhotoUrl && (
                    <div className="flex items-center gap-3 bg-slate-900 p-2.5 rounded-xl border border-slate-800 w-fit mt-2">
                      <img
                        src={districtForm.presidentPhotoUrl}
                        alt="President Preview"
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-lg object-cover border border-amber-500/50"
                      />
                      <div className="text-xs">
                        <span className="text-amber-400 font-bold block">President Photo Attached</span>
                        <span className="text-[10px] text-slate-400 font-mono">JPG format verified</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDistrictForm({ ...districtForm, presidentPhotoUrl: '' })}
                        className="p-1.5 text-slate-500 hover:text-rose-400 ml-3 cursor-pointer"
                        title="Remove President Photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: GENERAL SECRETARY Details & JPG Photo */}
              <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>3. General Secretary (महासचिव का विवरण एवं JPG फ़ोटो)</span>
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    SECRETARY FULL EDIT
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">General Secretary Name *</label>
                    <input
                      type="text"
                      value={districtForm.secretaryName || districtForm.secretary || ''}
                      onChange={(e) => setDistrictForm({ ...districtForm, secretaryName: e.target.value, secretary: e.target.value })}
                      placeholder="e.g. Sri Manish Saxena"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Secretary Phone</label>
                    <input
                      type="text"
                      value={districtForm.secretaryPhone || districtForm.contactPhone || ''}
                      onChange={(e) => setDistrictForm({ ...districtForm, secretaryPhone: e.target.value, contactPhone: e.target.value })}
                      placeholder="+91 98112 XXXXX"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Secretary Email</label>
                    <input
                      type="email"
                      value={districtForm.secretaryEmail || districtForm.contactEmail || ''}
                      onChange={(e) => setDistrictForm({ ...districtForm, secretaryEmail: e.target.value, contactEmail: e.target.value })}
                      placeholder="secretary@district.org"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Secretary JPG Photo Upload */}
                <div className="space-y-2 pt-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="block text-xs font-bold text-slate-300">
                      Secretary Portrait Photo (JPG / JPEG फ़ोटो)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        Size: 400 × 400 px (1:1 Passport)
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        Max 8MB
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="text"
                      value={districtForm.secretaryPhotoUrl || ''}
                      onChange={(e) => setDistrictForm({ ...districtForm, secretaryPhotoUrl: e.target.value })}
                      placeholder="Secretary JPG Photo URL or use Upload button"
                      className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none font-mono"
                    />
                    <label className="w-full sm:w-auto cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shrink-0 shadow-lg shadow-emerald-600/20">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingSecretaryPhoto ? 'Uploading...' : 'Upload Secretary JPG'}</span>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleGenericImageUpload(
                              file,
                              (url) => setDistrictForm(prev => ({ ...prev, secretaryPhotoUrl: url })),
                              setUploadingSecretaryPhoto
                            );
                          }
                        }}
                      />
                    </label>
                  </div>

                  {districtForm.secretaryPhotoUrl && (
                    <div className="flex items-center gap-3 bg-slate-900 p-2.5 rounded-xl border border-slate-800 w-fit mt-2">
                      <img
                        src={districtForm.secretaryPhotoUrl}
                        alt="Secretary Preview"
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-lg object-cover border border-emerald-500/50"
                      />
                      <div className="text-xs">
                        <span className="text-emerald-400 font-bold block">Secretary Photo Attached</span>
                        <span className="text-[10px] text-slate-400 font-mono">JPG format verified</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDistrictForm({ ...districtForm, secretaryPhotoUrl: '' })}
                        className="p-1.5 text-slate-500 hover:text-rose-400 ml-3 cursor-pointer"
                        title="Remove Secretary Photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: TREASURER Details & JPG Photo */}
              <div className="bg-slate-950/80 border border-sky-500/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-xs font-black uppercase text-sky-400 tracking-wider flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-sky-400" />
                    <span>4. District Treasurer (कोषाध्यक्ष का विवरण एवं JPG फ़ोटो)</span>
                  </h4>
                  <span className="text-[10px] font-bold text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                    TREASURER FULL EDIT
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Treasurer Name / कोषाध्यक्ष का नाम</label>
                    <input
                      type="text"
                      value={districtForm.treasurerName || districtForm.treasurer || ''}
                      onChange={(e) => setDistrictForm({ ...districtForm, treasurerName: e.target.value, treasurer: e.target.value })}
                      placeholder="e.g. Shri Vivek Srivastava"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-sky-500 outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Treasurer Phone / मोबाइल</label>
                    <input
                      type="text"
                      value={districtForm.treasurerPhone || ''}
                      onChange={(e) => setDistrictForm({ ...districtForm, treasurerPhone: e.target.value })}
                      placeholder="+91 94501 XXXXX"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-sky-500 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Treasurer Email / आधिकारिक ईमेल</label>
                    <input
                      type="email"
                      value={districtForm.treasurerEmail || ''}
                      onChange={(e) => setDistrictForm({ ...districtForm, treasurerEmail: e.target.value })}
                      placeholder="treasurer@district.org"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-sky-500 outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Treasurer JPG Photo Upload */}
                <div className="space-y-2 pt-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="block text-xs font-bold text-slate-300">
                      Treasurer Portrait Photo (JPG / JPEG फ़ोटो)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
                        Size: 400 × 400 px (1:1 Passport)
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        Max 8MB
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="text"
                      value={districtForm.treasurerPhotoUrl || ''}
                      onChange={(e) => setDistrictForm({ ...districtForm, treasurerPhotoUrl: e.target.value })}
                      placeholder="Treasurer JPG Photo URL or use Upload button"
                      className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-sky-500 outline-none font-mono"
                    />
                    <label className="w-full sm:w-auto cursor-pointer bg-sky-600 hover:bg-sky-500 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shrink-0 shadow-lg shadow-sky-600/20">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingTreasurerPhoto ? 'Uploading...' : 'Upload Treasurer JPG'}</span>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleGenericImageUpload(
                              file,
                              (url) => setDistrictForm(prev => ({ ...prev, treasurerPhotoUrl: url })),
                              setUploadingTreasurerPhoto
                            );
                          }
                        }}
                      />
                    </label>
                  </div>

                  {districtForm.treasurerPhotoUrl && (
                    <div className="flex items-center gap-3 bg-slate-900 p-2.5 rounded-xl border border-slate-800 w-fit mt-2">
                      <img
                        src={districtForm.treasurerPhotoUrl}
                        alt="Treasurer Preview"
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-lg object-cover border border-sky-500/50"
                      />
                      <div className="text-xs">
                        <span className="text-sky-400 font-bold block">Treasurer Photo Attached</span>
                        <span className="text-[10px] text-slate-400 font-mono">JPG format verified</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDistrictForm({ ...districtForm, treasurerPhotoUrl: '' })}
                        className="p-1.5 text-slate-500 hover:text-rose-400 ml-3 cursor-pointer"
                        title="Remove Treasurer Photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 5: Address, Stadium & Affiliation Stats */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  5. Office Secretariat, Stadium Venue & Affiliation
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Office / Secretariat Address</label>
                    <textarea
                      rows={2}
                      value={districtForm.officeAddress || ''}
                      onChange={(e) => setDistrictForm({ ...districtForm, officeAddress: e.target.value })}
                      placeholder="Sports Complex, District Office..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-emerald-500 outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Home Stadium / Skating Rink Venue</label>
                    <textarea
                      rows={2}
                      value={districtForm.stadiumVenue || ''}
                      onChange={(e) => setDistrictForm({ ...districtForm, stadiumVenue: e.target.value })}
                      placeholder="e.g. Dr. Sampurnanand Sports Stadium, Sigra..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-emerald-500 outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Affiliated Year</label>
                    <input
                      type="number"
                      value={districtForm.affiliatedYear || 2015}
                      onChange={(e) => setDistrictForm({ ...districtForm, affiliatedYear: Number(e.target.value) || 2015 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Clubs Count</label>
                    <input
                      type="number"
                      value={districtForm.clubsCount || 0}
                      onChange={(e) => setDistrictForm({ ...districtForm, clubsCount: Number(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Skaters Count</label>
                    <input
                      type="number"
                      value={districtForm.skatersCount || 0}
                      onChange={(e) => setDistrictForm({ ...districtForm, skatersCount: Number(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                    <input
                      type="checkbox"
                      checked={districtForm.status !== 'Inactive'}
                      onChange={(e) => setDistrictForm({ ...districtForm, status: e.target.checked ? 'Active' : 'Inactive' })}
                      className="w-4 h-4 text-emerald-600 bg-slate-950 border-slate-800 rounded"
                    />
                    <span>Active & Recognized District Unit by UPRSA</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-5 border-t border-slate-800 sticky bottom-0 bg-slate-900/95 py-2">
                <button 
                  type="button" 
                  onClick={() => setIsDistrictModalOpen(false)} 
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 bg-slate-800 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingDistrict ? 'Save District Changes' : 'Register District Unit'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CLUB MODAL: CREATE / FULL EDIT (With JPG Upload)           */}
      {/* ========================================================= */}
      {isClubModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95">
            <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Building2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {editingClub ? `Edit Club: ${editingClub.name}` : 'Affiliate New Skating Club'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Manage club name, district affiliation, head coach, facility, and JPG photographs
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsClubModalOpen(false)} 
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveClub} className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
              {/* Club Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Club Academy Name *</label>
                  <input
                    type="text"
                    required
                    value={clubForm.name || ''}
                    onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })}
                    placeholder="e.g. Royal Skating Academy"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Hindi Name / हिंदी नाम</label>
                  <input
                    type="text"
                    value={clubForm.hindiName || ''}
                    onChange={(e) => setClubForm({ ...clubForm, hindiName: e.target.value })}
                    placeholder="उदा. रॉयल स्केटिंग अकादमी"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Affiliation Number</label>
                  <input
                    type="text"
                    value={clubForm.affiliationNumber || ''}
                    onChange={(e) => setClubForm({ ...clubForm, affiliationNumber: e.target.value })}
                    placeholder="UPRSA-CLB-042"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none font-mono"
                  />
                </div>
              </div>

              {/* District & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Affiliated District *</label>
                  <select
                    value={clubForm.district || 'Lucknow'}
                    onChange={(e) => setClubForm({ ...clubForm, district: e.target.value, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none"
                  >
                    {districts.map(d => (
                      <option key={d.id} value={d.name}>{d.name} ({d.zone} Zone)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">City / Region</label>
                  <input
                    type="text"
                    value={clubForm.city || ''}
                    onChange={(e) => setClubForm({ ...clubForm, city: e.target.value })}
                    placeholder="e.g. Gomti Nagar, Lucknow"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Club Banner Photo Upload */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                    Club & Rink Banner Photograph (JPG / JPEG)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                      Size: 800 × 450 px (16:9)
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      Max 8MB
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={clubForm.photoUrl || ''}
                    onChange={(e) => setClubForm({ ...clubForm, photoUrl: e.target.value })}
                    placeholder="https://... or click Upload JPG Banner"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none font-mono"
                  />

                  <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-blue-400" />
                    <span>{uploadingClubPhoto ? 'Uploading...' : 'Upload JPG Banner'}</span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleGenericImageUpload(
                            file,
                            (url) => setClubForm(prev => ({ ...prev, photoUrl: url })),
                            setUploadingClubPhoto
                          );
                        }
                      }}
                    />
                  </label>
                </div>

                {clubForm.photoUrl && (
                  <div className="relative h-28 rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                    <img
                      src={clubForm.photoUrl}
                      alt="Club Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setClubForm({ ...clubForm, photoUrl: '' })}
                      className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-rose-600 text-white rounded-lg transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Head Coach Profile & Photo */}
              <div className="bg-slate-950/80 border border-blue-500/30 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-black uppercase text-blue-400 tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Head Coach & Technical Leadership (कोच विवरण एवं JPG फ़ोटो)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Head Coach Name</label>
                    <input
                      type="text"
                      value={clubForm.headCoach || clubForm.contactPerson || ''}
                      onChange={(e) => setClubForm({ ...clubForm, headCoach: e.target.value, contactPerson: e.target.value })}
                      placeholder="e.g. Coach Vikram Singh"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Coach Phone</label>
                    <input
                      type="text"
                      value={clubForm.coachPhone || clubForm.contactPhone || ''}
                      onChange={(e) => setClubForm({ ...clubForm, coachPhone: e.target.value, contactPhone: e.target.value })}
                      placeholder="+91 94150 XXXXX"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Coach Email</label>
                    <input
                      type="email"
                      value={clubForm.coachEmail || clubForm.contactEmail || ''}
                      onChange={(e) => setClubForm({ ...clubForm, coachEmail: e.target.value, contactEmail: e.target.value })}
                      placeholder="coach@club.org"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Coach JPG Photo Upload */}
                <div className="space-y-2 pt-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="block text-xs font-bold text-slate-300">
                      Coach Portrait Photo (JPG / JPEG फ़ोटो)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                        Size: 400 × 400 px (1:1 Passport)
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        Max 8MB
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="text"
                      value={clubForm.coachPhotoUrl || ''}
                      onChange={(e) => setClubForm({ ...clubForm, coachPhotoUrl: e.target.value })}
                      placeholder="Coach JPG Photo URL or use Upload button"
                      className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none font-mono"
                    />
                    <label className="w-full sm:w-auto cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shrink-0 shadow-lg shadow-blue-600/20">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingCoachPhoto ? 'Uploading...' : 'Upload Coach JPG'}</span>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleGenericImageUpload(
                              file,
                              (url) => setClubForm(prev => ({ ...prev, coachPhotoUrl: url })),
                              setUploadingCoachPhoto
                            );
                          }
                        }}
                      />
                    </label>
                  </div>

                  {clubForm.coachPhotoUrl && (
                    <div className="flex items-center gap-3 bg-slate-900 p-2.5 rounded-xl border border-slate-800 w-fit mt-2">
                      <img
                        src={clubForm.coachPhotoUrl}
                        alt="Coach Preview"
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-lg object-cover border border-blue-500/50"
                      />
                      <div className="text-xs">
                        <span className="text-blue-400 font-bold block">Coach Photo Attached</span>
                        <span className="text-[10px] text-slate-400 font-mono">JPG format verified</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setClubForm({ ...clubForm, coachPhotoUrl: '' })}
                        className="p-1.5 text-slate-500 hover:text-rose-400 ml-3 cursor-pointer"
                        title="Remove Coach Photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Facilities & Address */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Rink Facilities</label>
                    <input
                      type="text"
                      value={clubForm.facility || ''}
                      onChange={(e) => setClubForm({ ...clubForm, facility: e.target.value })}
                      placeholder="e.g. 200m Banked Synthetic Track"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Rink / Venue Address</label>
                    <input
                      type="text"
                      value={clubForm.venue || clubForm.officialAddress || ''}
                      onChange={(e) => setClubForm({ ...clubForm, venue: e.target.value, officialAddress: e.target.value })}
                      placeholder="Sector 21 Stadium / Sports Complex..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Disciplines Chips */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Skating Disciplines Taught</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {((clubForm.disciplines as string[]) || []).map((disc, idx) => (
                      <span key={idx} className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-slate-700">
                        {disc}
                        <button type="button" onClick={() => handleRemoveDiscipline(disc)} className="text-slate-400 hover:text-rose-400">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add discipline (e.g. Speed, Inline Freestyle, Roller Hockey)"
                      value={newDisciplineText}
                      onChange={(e) => setNewDisciplineText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddDiscipline(); } }}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddDiscipline}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Established Year</label>
                    <input
                      type="number"
                      value={clubForm.establishedYear || 2020}
                      onChange={(e) => setClubForm({ ...clubForm, establishedYear: Number(e.target.value) || 2020 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Active Skaters Count</label>
                    <input
                      type="number"
                      value={clubForm.skatersCount || 0}
                      onChange={(e) => setClubForm({ ...clubForm, skatersCount: Number(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-5 border-t border-slate-800 sticky bottom-0 bg-slate-900/95 py-2">
                <button 
                  type="button" 
                  onClick={() => setIsClubModalOpen(false)} 
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 bg-slate-800 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingClub ? 'Save Club Changes' : 'Affiliate Club'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete District Confirmation Dialog */}
      {deleteDistrictConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Delete District Unit Association?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to remove &ldquo;<strong className="text-white">{deleteDistrictConfirm.name}</strong>&rdquo; from the official 75 district directory?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteDistrictConfirm(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 bg-slate-800 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteDistrict}
                className="px-5 py-2.5 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Club Confirmation Dialog */}
      {deleteClubConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Delete Club Affiliation?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to remove &ldquo;<strong className="text-white">{deleteClubConfirm.name}</strong>&rdquo; ({deleteClubConfirm.district})?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteClubConfirm(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 bg-slate-800 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteClub}
                className="px-5 py-2.5 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
