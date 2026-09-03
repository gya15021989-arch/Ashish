import React, { useState, useEffect } from 'react';
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
  Shield, 
  Filter, 
  Flame 
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

  // Forms
  const [districtForm, setDistrictForm] = useState<Partial<District>>({
    name: '',
    zone: 'Central',
    president: '',
    secretary: '',
    contactPhone: '',
    contactEmail: '',
    officeAddress: '',
    status: 'Active',
    clubsCount: 0,
    skatersCount: 0
  });

  const [clubForm, setClubForm] = useState<Partial<Club>>({
    name: '',
    district: 'Lucknow',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    officialAddress: '',
    facility: 'Banked Track & Outdoor Rink',
    disciplines: ['Speed', 'Inline Freestyle'],
    establishedYear: 2020,
    skatersCount: 0,
    status: 'Active'
  });

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

  // District handlers
  const handleOpenAddDistrict = () => {
    setEditingDistrict(null);
    setDistrictForm({
      name: '',
      zone: 'Central',
      president: '',
      secretary: '',
      contactPhone: '',
      contactEmail: '',
      officeAddress: '',
      status: 'Active',
      clubsCount: 0,
      skatersCount: 0
    });
    setIsDistrictModalOpen(true);
  };

  const handleOpenEditDistrict = (d: District) => {
    setEditingDistrict(d);
    setDistrictForm({ ...d });
    setIsDistrictModalOpen(true);
  };

  const handleSaveDistrict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!districtForm.name) {
      showToast('District name is required', 'error');
      return;
    }

    try {
      if (editingDistrict) {
        const res = await api.updateDistrict(editingDistrict.id, districtForm);
        if (res.success) {
          showToast('District updated');
          loadData();
          setIsDistrictModalOpen(false);
        }
      } else {
        const res = await api.createDistrict(districtForm);
        if (res.success) {
          showToast('District registered');
          loadData();
          setIsDistrictModalOpen(false);
        }
      }
    } catch (err) {
      showToast('Failed to save district', 'error');
    }
  };

  const handleDeleteDistrict = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this district association record?')) return;
    try {
      const res = await api.deleteDistrict(id);
      if (res.success) {
        showToast('District removed');
        loadData();
      }
    } catch (err) {
      showToast('Failed to delete district', 'error');
    }
  };

  // Club handlers
  const handleOpenAddClub = () => {
    setEditingClub(null);
    setClubForm({
      name: '',
      district: districts[0]?.name || 'Lucknow',
      contactPerson: '',
      contactPhone: '',
      contactEmail: '',
      officialAddress: '',
      facility: 'Banked Track & Outdoor Rink',
      disciplines: ['Speed', 'Inline Freestyle'],
      establishedYear: 2022,
      skatersCount: 0,
      status: 'Active'
    });
    setIsClubModalOpen(true);
  };

  const handleOpenEditClub = (c: Club) => {
    setEditingClub(c);
    setClubForm({ ...c });
    setIsClubModalOpen(true);
  };

  const handleSaveClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubForm.name || !clubForm.district) {
      showToast('Club name and district are required', 'error');
      return;
    }

    try {
      if (editingClub) {
        const res = await api.updateClub(editingClub.id, clubForm);
        if (res.success) {
          showToast('Club details updated');
          loadData();
          setIsClubModalOpen(false);
        }
      } else {
        const res = await api.createClub(clubForm);
        if (res.success) {
          showToast('Club affiliated successfully');
          loadData();
          setIsClubModalOpen(false);
        }
      }
    } catch (err) {
      showToast('Failed to save club', 'error');
    }
  };

  const handleDeleteClub = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this affiliated club?')) return;
    try {
      const res = await api.deleteClub(id);
      if (res.success) {
        showToast('Club affiliation removed');
        loadData();
      }
    } catch (err) {
      showToast('Failed to delete club', 'error');
    }
  };

  const filteredDistricts = districts.filter(d => {
    const matchZone = selectedZone === 'ALL' || d.zone === selectedZone;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
      (d.secretary && d.secretary.toLowerCase().includes(search.toLowerCase())) ||
      (d.president && d.president.toLowerCase().includes(search.toLowerCase()));
    return matchZone && matchSearch;
  });

  const filteredClubs = clubs.filter(c => {
    const matchDist = selectedDistrictFilter === 'ALL' || c.district === selectedDistrictFilter;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.contactPerson && c.contactPerson.toLowerCase().includes(search.toLowerCase()));
    return matchDist && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold border ${
          toast.type === 'success' ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-red-950 border-red-500 text-red-300'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <h2 className="text-xl font-black text-white">Districts & Affiliated Clubs Directory</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage all 75 District Roller Skating Associations of UP, affiliated training clubs, and district executives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'districts' ? (
            <button
              onClick={handleOpenAddDistrict}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>+ Register District Unit</span>
            </button>
          ) : (
            <button
              onClick={handleOpenAddClub}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>+ Affiliate New Club</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => { setActiveSubTab('districts'); setSearch(''); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'districts'
              ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>75 District Associations ({districts.length})</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('clubs'); setSearch(''); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'clubs'
              ? 'bg-slate-800 text-blue-400 border border-blue-500/30 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Affiliated Skating Clubs ({clubs.length})</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={activeSubTab === 'districts' ? "Search district name, secretary, president..." : "Search club academy name, coach..."}
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
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedZone === z
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
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
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
            >
              <option value="ALL">All Districts</option>
              {districts.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Sub-tab 1: Districts */}
      {activeSubTab === 'districts' && (
        <div>
          {loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              Loading district associations...
            </div>
          ) : filteredDistricts.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-2">
              <MapPin className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs">No matching districts found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDistricts.map((dist) => (
                <div key={dist.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {dist.zone} Zone
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        dist.status === 'Active' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                      }`}>
                        {dist.status || 'Active'}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-white">{dist.name}</h3>
                    
                    <div className="space-y-1 mt-2 text-xs text-slate-300">
                      {dist.secretary && (
                        <div>
                          <span className="text-slate-500 font-semibold">Secretary: </span>
                          <span className="font-bold text-slate-200">{dist.secretary}</span>
                        </div>
                      )}
                      {dist.president && (
                        <div>
                          <span className="text-slate-500 font-semibold">President: </span>
                          <span className="text-slate-200">{dist.president}</span>
                        </div>
                      )}
                      {dist.contactPhone && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{dist.contactPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span>{dist.clubsCount || 0} Clubs</span>
                      <span>•</span>
                      <span>{dist.skatersCount || 0} Skaters</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditDistrict(dist)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400"
                        title="Edit district"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDistrict(dist.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/50 text-red-400"
                        title="Delete district"
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

      {/* Sub-tab 2: Clubs */}
      {activeSubTab === 'clubs' && (
        <div>
          {loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              Loading affiliated clubs...
            </div>
          ) : filteredClubs.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-2">
              <Building2 className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs">No matching clubs found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClubs.map((club) => (
                <div key={club.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {club.district}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                        {club.status || 'Active'}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-white">{club.name}</h3>

                    <div className="space-y-1 mt-2 text-xs text-slate-300">
                      {club.contactPerson && (
                        <div>
                          <span className="text-slate-500 font-semibold">Head Coach: </span>
                          <span className="font-bold text-slate-200">{club.contactPerson}</span>
                        </div>
                      )}
                      {club.facility && (
                        <div className="text-[11px] text-slate-400">
                          <span className="text-slate-500">Facility: </span>
                          <span>{club.facility}</span>
                        </div>
                      )}
                      {club.contactPhone && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{club.contactPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-slate-400">
                      Est. {club.establishedYear || 2020} • {club.skatersCount || 0} Skaters
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditClub(club)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400"
                        title="Edit club"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClub(club.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/50 text-red-400"
                        title="Delete club"
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

      {/* District Modal */}
      {isDistrictModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-black text-white">{editingDistrict ? 'Edit District Unit' : 'Register New District Unit'}</h3>
              <button onClick={() => setIsDistrictModalOpen(false)} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveDistrict} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">District Name *</label>
                  <input
                    type="text"
                    required
                    value={districtForm.name}
                    onChange={(e) => setDistrictForm({ ...districtForm, name: e.target.value })}
                    placeholder="e.g. Lucknow, Varanasi"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Geographic Zone</label>
                  <select
                    value={districtForm.zone}
                    onChange={(e) => setDistrictForm({ ...districtForm, zone: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="Central">Central Zone</option>
                    <option value="Eastern">Eastern Zone</option>
                    <option value="Western">Western Zone</option>
                    <option value="Bundelkhand">Bundelkhand Zone</option>
                    <option value="Rohilkhand">Rohilkhand Zone</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">General Secretary</label>
                  <input
                    type="text"
                    value={districtForm.secretary}
                    onChange={(e) => setDistrictForm({ ...districtForm, secretary: e.target.value })}
                    placeholder="Secretary Name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">President</label>
                  <input
                    type="text"
                    value={districtForm.president}
                    onChange={(e) => setDistrictForm({ ...districtForm, president: e.target.value })}
                    placeholder="President Name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={districtForm.contactPhone}
                    onChange={(e) => setDistrictForm({ ...districtForm, contactPhone: e.target.value })}
                    placeholder="+91 94150 XXXXX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={districtForm.contactEmail}
                    onChange={(e) => setDistrictForm({ ...districtForm, contactEmail: e.target.value })}
                    placeholder="district@uprsa.org"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsDistrictModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 bg-slate-800">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Save District Unit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Club Modal */}
      {isClubModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-black text-white">{editingClub ? 'Edit Affiliated Club' : 'Affiliate New Skating Club'}</h3>
              <button onClick={() => setIsClubModalOpen(false)} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveClub} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Club / Academy Name *</label>
                <input
                  type="text"
                  required
                  value={clubForm.name}
                  onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })}
                  placeholder="e.g. Awadh Roller Sports Club"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">District Unit *</label>
                  <select
                    value={clubForm.district}
                    onChange={(e) => setClubForm({ ...clubForm, district: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none"
                  >
                    {districts.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Head Coach / President</label>
                  <input
                    type="text"
                    value={clubForm.contactPerson}
                    onChange={(e) => setClubForm({ ...clubForm, contactPerson: e.target.value })}
                    placeholder="Coach Name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={clubForm.contactPhone}
                    onChange={(e) => setClubForm({ ...clubForm, contactPhone: e.target.value })}
                    placeholder="+91 98180 XXXXX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Facility / Rink Type</label>
                  <input
                    type="text"
                    value={clubForm.facility}
                    onChange={(e) => setClubForm({ ...clubForm, facility: e.target.value })}
                    placeholder="200m Banked Track / 40x20m Rink"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsClubModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 bg-slate-800">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Affiliate Club</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
