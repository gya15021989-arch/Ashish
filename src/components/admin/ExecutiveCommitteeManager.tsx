import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Check, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Shield, 
  Award, 
  ArrowUpDown, 
  Briefcase 
} from 'lucide-react';
import { CommitteeMember } from '../../types';
import { api } from '../../services/api';

export const ExecutiveCommitteeManager: React.FC = () => {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<CommitteeMember>>({
    name: '',
    hindiName: '',
    designation: 'Executive Member',
    hindiDesignation: '',
    category: 'Executive Board',
    district: 'Lucknow',
    phone: '',
    email: '',
    photoUrl: '',
    bio: '',
    order: 1,
    status: 'Active',
    appointedYear: 2024
  });

  useEffect(() => {
    loadCommittee();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadCommittee = async () => {
    try {
      setLoading(true);
      const res = await api.getCommittee();
      if (res.success && res.data) {
        setMembers(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load committee members', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      hindiName: '',
      designation: 'Vice President',
      hindiDesignation: 'उपाध्यक्ष',
      category: 'Executive Board',
      district: 'Lucknow',
      phone: '+91 ',
      email: '',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      bio: '',
      order: members.length + 1,
      status: 'Active',
      appointedYear: 2026
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: CommitteeMember) => {
    setEditingMember(m);
    setFormData({ ...m });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.designation) {
      showToast('Name and Designation are required', 'error');
      return;
    }

    try {
      if (editingMember) {
        const res = await api.updateCommitteeMember(editingMember.id, formData);
        if (res.success) {
          showToast('Office bearer details updated');
          loadCommittee();
          setIsModalOpen(false);
        }
      } else {
        const res = await api.createCommitteeMember(formData);
        if (res.success) {
          showToast('New office bearer added');
          loadCommittee();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      showToast('Failed to save committee member', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this official from the committee directory?')) return;
    try {
      const res = await api.deleteCommitteeMember(id);
      if (res.success) {
        showToast('Official removed');
        loadCommittee();
      }
    } catch (err) {
      showToast('Failed to delete member', 'error');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await api.uploadFile(file.name, base64, false);
        if (res.success && res.fileUrl) {
          setFormData(prev => ({ ...prev, photoUrl: res.fileUrl }));
          showToast('Official portrait uploaded');
        }
      } catch (err) {
        showToast('Upload failed', 'error');
      }
    };
    reader.readAsDataURL(file);
  };

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
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <h2 className="text-xl font-black text-white">Executive Committee & Office Bearers</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage state federation leadership, executive board, technical officials, and patrons.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Office Bearer</span>
        </button>
      </div>

      {/* Committee Grid */}
      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          Loading committee directory...
        </div>
      ) : members.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-2">
          <Users className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-xs">No committee members added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.sort((a, b) => (a.order || 0) - (b.order || 0)).map((m) => (
            <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-950 border border-amber-500/30 shrink-0">
                    <img
                      src={m.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'}
                      alt={m.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/20">
                        #{m.order || 1} • {m.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-white truncate mt-1">{m.name}</h3>
                    {m.hindiName && (
                      <p className="text-xs text-amber-300/80 font-medium font-sans truncate">
                        {m.hindiName}
                      </p>
                    )}
                    <p className="text-xs font-bold text-blue-400">{m.designation}</p>
                    {m.hindiDesignation && (
                      <p className="text-[11px] text-slate-400 font-sans">{m.hindiDesignation}</p>
                    )}
                  </div>
                </div>

                {m.bio && (
                  <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                    {m.bio}
                  </p>
                )}

                <div className="space-y-1 mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                  {m.district && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{m.district} District</span>
                    </div>
                  )}
                  {m.phone && (
                    <div className="flex items-center gap-1.5 font-mono">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span>{m.phone}</span>
                    </div>
                  )}
                  {m.email && (
                    <div className="flex items-center gap-1.5 font-mono">
                      <Mail className="w-3 h-3 text-slate-500" />
                      <span className="truncate">{m.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                  {m.status || 'Active'} {m.appointedYear ? `• Since ${m.appointedYear}` : ''}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(m)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400"
                    title="Edit official"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/50 text-red-400"
                    title="Delete official"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
              <h3 className="text-lg font-black text-white">
                {editingMember ? 'Edit Office Bearer' : 'Add New Office Bearer'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Official Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Akhilesh Chandra Sharma"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Hindi Name / हिंदी नाम</label>
                  <input
                    type="text"
                    value={formData.hindiName}
                    onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                    placeholder="e.g. डॉ. अखिलेश चंद्र शर्मा"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Designation (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. President, Secretary General"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Hindi Designation / हिंदी पद</label>
                  <input
                    type="text"
                    value={formData.hindiDesignation}
                    onChange={(e) => setFormData({ ...formData, hindiDesignation: e.target.value })}
                    placeholder="e.g. अध्यक्ष, महासचिव"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                  >
                    <option value="Executive Board">Executive Board</option>
                    <option value="Office Bearer">Office Bearer</option>
                    <option value="Patron">Patron / Advisor</option>
                    <option value="Technical Official">Technical Official</option>
                    <option value="Disciplinary Committee">Disciplinary Committee</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Order Priority</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="Lucknow"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Portrait Photo URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none font-mono"
                  />
                  <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 94150 XXXXX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="president@uprsa.org"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Brief Official Biography</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Experience in roller sports administration, achievements..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 bg-slate-800">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Save Official</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
