import React, { useState } from 'react';
import {
  Heart,
  Plus,
  Trash2,
  Edit3,
  Search,
  RotateCcw,
  Sparkles,
  MapPin,
  Calendar,
  Award,
  Phone,
  Mail,
  Building2,
  Image as ImageIcon,
  Check,
  X,
  Save,
  Upload,
  UserCheck,
  Briefcase,
  Star,
  Quote
} from 'lucide-react';
import { FamilyMemberData, FamilyRoleCategory } from '../../types';
import { api } from '../../services/api';

interface FamilyCMSManagerProps {
  familyMembers: FamilyMemberData[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

const ROLE_CATEGORIES: FamilyRoleCategory[] = [
  'Patron & Mentor',
  'District President / Secretary',
  'Chief Coach / NIS',
  'Senior Official / Referee',
  'Sports Doctor & Physiotherapist',
  'Veteran Skater & Pioneer',
  'Club & Academy Lead',
  'Parent & Volunteer Lead'
];

export const FamilyCMSManager: React.FC<FamilyCMSManagerProps> = ({
  familyMembers,
  onRefresh,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMemberData | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<FamilyMemberData>>({
    name: '',
    hindiName: '',
    photo: '',
    roleCategory: 'Patron & Mentor',
    designation: '',
    organizationUnit: '',
    nativePlace: 'Lucknow (लखनऊ)',
    currentLocation: 'Lucknow',
    experienceYears: 15,
    badge: 'LEADERSHIP',
    phone: '',
    email: '',
    shortSummary: '',
    fullBio: {
      originAndEarlyLife: '',
      skatingContribution: '',
      careerJourney: '',
      philosophyAndMessage: '',
      specialHonors: [],
      galleryMoments: []
    },
    order: 1,
    status: 'Active'
  });

  // Temp input for honors
  const [newHonor, setNewHonor] = useState('');

  // Filtering
  const filteredMembers = familyMembers.filter(mem => {
    const matchesSearch =
      mem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mem.hindiName && mem.hindiName.includes(searchQuery)) ||
      mem.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.nativePlace.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.roleCategory.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === 'All' || mem.roleCategory === selectedRole;

    return matchesSearch && matchesRole;
  });

  const handleOpenCreate = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      hindiName: '',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      roleCategory: 'District President / Secretary',
      designation: 'District Association President',
      organizationUnit: 'UPRSA Affiliated District Unit',
      nativePlace: 'Lucknow (लखनऊ)',
      currentLocation: 'Lucknow',
      experienceYears: 15,
      badge: 'DISTRICT LEADER',
      phone: '+91 94150 00000',
      email: 'member@uprsa.org',
      shortSummary: 'उत्तर प्रदेश में स्केटिंग खेल को आगे बढ़ाने में निरंतर प्रयासरत।',
      fullBio: {
        originAndEarlyLife: 'मूल निवासी होने के साथ-साथ खेलों के प्रति सदैव समर्पित रहे हैं।',
        skatingContribution: 'जनपद में स्केटिंग क्लब व नए बच्चों को प्रशिक्षण मंच प्रदान किया।',
        careerJourney: 'विगत 15 वर्षों से संगठन और खेल प्रशासन में सक्रिय।',
        philosophyAndMessage: 'खेलों से ही युवा पीढ़ी में अनुशासन, स्वास्थ्य और नेतृत्व क्षमता का विकास होता है।',
        specialHonors: ['विशिष्ट खेल सम्मान', 'UPRSA लाइफटाइम कंट्रीब्यूशन'],
        galleryMoments: []
      },
      order: familyMembers.length + 1,
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (mem: FamilyMemberData) => {
    setEditingMember(mem);
    setFormData({
      ...mem,
      fullBio: mem.fullBio ? {
        ...mem.fullBio,
        specialHonors: mem.fullBio.specialHonors ? [...mem.fullBio.specialHonors] : [],
        galleryMoments: mem.fullBio.galleryMoments ? [...mem.fullBio.galleryMoments] : []
      } : {
        originAndEarlyLife: '',
        skatingContribution: '',
        careerJourney: '',
        philosophyAndMessage: '',
        specialHonors: [],
        galleryMoments: []
      }
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.designation || !formData.nativePlace) {
      showToast('Name, Designation and Native Place are required', 'error');
      return;
    }

    try {
      if (editingMember) {
        const res = await api.updateAboutFamilyMember(editingMember.id, formData);
        if (res.success) {
          showToast('Family member profile updated successfully!');
          setIsModalOpen(false);
          onRefresh();
        } else {
          showToast(res.message || 'Failed to update member', 'error');
        }
      } else {
        const res = await api.createAboutFamilyMember(formData);
        if (res.success) {
          showToast('New UPRSA Family member added successfully!');
          setIsModalOpen(false);
          onRefresh();
        } else {
          showToast(res.message || 'Failed to add member', 'error');
        }
      }
    } catch (err) {
      showToast('Error saving family member profile', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the UPRSA Family directory?`)) {
      return;
    }
    try {
      const res = await api.deleteAboutFamilyMember(id);
      if (res.success) {
        showToast(`"${name}" removed from Family directory.`);
        onRefresh();
      } else {
        showToast(res.message || 'Failed to delete member', 'error');
      }
    } catch (err) {
      showToast('Error deleting family member', 'error');
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset UPRSA Family directory to default records?')) {
      return;
    }
    try {
      const res = await api.resetAboutFamilyMembers();
      if (res.success) {
        showToast('UPRSA Family directory reset to defaults successfully.');
        onRefresh();
      }
    } catch (err) {
      showToast('Error resetting family directory', 'error');
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size exceeds 5MB limit', 'error');
      return;
    }

    try {
      setUploadingPhoto(true);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const res = await api.uploadFile(file.name, base64);
        if (res.success && res.fileUrl) {
          setFormData(prev => ({ ...prev, photo: res.fileUrl }));
          showToast('Photo uploaded successfully');
        } else {
          showToast('Failed to upload photo', 'error');
        }
        setUploadingPhoto(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setUploadingPhoto(false);
      showToast('Upload error', 'error');
    }
  };

  const handleAddHonor = () => {
    if (!newHonor.trim()) return;
    setFormData(prev => ({
      ...prev,
      fullBio: {
        ...(prev.fullBio || {
          originAndEarlyLife: '',
          skatingContribution: '',
          careerJourney: '',
          philosophyAndMessage: '',
          specialHonors: [],
          galleryMoments: []
        }),
        specialHonors: [...(prev.fullBio?.specialHonors || []), newHonor.trim()]
      }
    }));
    setNewHonor('');
  };

  const handleRemoveHonor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fullBio: {
        ...(prev.fullBio || {
          originAndEarlyLife: '',
          skatingContribution: '',
          careerJourney: '',
          philosophyAndMessage: '',
          specialHonors: [],
          galleryMoments: []
        }),
        specialHonors: (prev.fullBio?.specialHonors || []).filter((_, i) => i !== index)
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Bar / Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400" />
            <span>UPRSA Family Directory CMS (यूपीआरएसए फैमिली संपादन)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Manage individual profiles, photos, native roots, short परिचय, and detailed bio modal data for patrons, officials, doctors, coaches, and district pioneers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset to default members"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:opacity-95 text-white font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-rose-500/20 cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Family Member (नया सदस्य जोड़ें)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, native place, designation..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-rose-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedRole('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedRole === 'All'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Roles
          </button>
          {ROLE_CATEGORIES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedRole === role
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Family Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-bold text-white">No family members found</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting the search or click "+ Add Family Member".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((mem, idx) => (
            <div
              key={mem.id || idx}
              className="bg-slate-900/90 border border-slate-800 hover:border-rose-500/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group shadow-lg"
            >
              <div>
                {/* Header photo & badge */}
                <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={mem.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'}
                    alt={mem.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Role Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-gradient-to-r from-rose-600 to-amber-600 text-white font-black text-[10px] uppercase px-2.5 py-1 rounded-md tracking-wider shadow-md">
                      {mem.badge || mem.roleCategory}
                    </span>
                  </div>

                  {/* Order & Status */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="bg-slate-900/80 backdrop-blur-xs text-slate-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700">
                      #{mem.order || idx + 1}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      mem.status === 'Inactive'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {mem.status || 'Active'}
                    </span>
                  </div>

                  {/* Name */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="text-base font-black text-white leading-snug drop-shadow-md">
                      {mem.name}
                    </h4>
                    {mem.hindiName && (
                      <p className="text-xs text-rose-300 font-medium">{mem.hindiName}</p>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2.5">
                  <div className="text-xs font-bold text-amber-400 line-clamp-1">
                    {mem.designation}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      {mem.nativePlace}
                    </span>
                    <span className="text-[11px] bg-slate-950 px-2 py-0.5 rounded text-slate-400 border border-slate-800">
                      {mem.experienceYears} Years Exp.
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60 italic">
                    "{mem.shortSummary}"
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{mem.organizationUnit || 'UPRSA Family Member'}</span>
                    <span className="text-rose-400 font-medium">
                      {mem.fullBio?.specialHonors?.length || 0} Honors
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 flex items-center gap-2 border-t border-slate-800/60 mt-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(mem)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-rose-300 hover:text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Edit Profile & Bio (संपादित करें)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(mem.id, mem.name)}
                  className="p-2 bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl transition-colors cursor-pointer"
                  title="Remove Member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FULL FAMILY MEMBER EDIT / CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingMember ? `Edit Family Member: ${editingMember.name}` : 'Add New UPRSA Family Member'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Individual photo, name, native place, short intro, and complete biography modal details.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 text-slate-200">
              {/* Section 1: Basic Identity */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5" />
                  <span>1. Basic Profile & Designation (व्यक्तिगत परिचय)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Full Name (English) *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Surendra Mohan Sharma"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-rose-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Hindi Name (हिंदी में नाम)</label>
                    <input
                      type="text"
                      value={formData.hindiName || ''}
                      onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                      placeholder="उदा. डॉ. सुरेन्द्र मोहन शर्मा"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-rose-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Role Category (श्रेणी) *</label>
                    <select
                      value={formData.roleCategory}
                      onChange={(e) => setFormData({ ...formData, roleCategory: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-rose-500 outline-none"
                    >
                      {ROLE_CATEGORIES.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Official Designation (पदनाम) *</label>
                    <input
                      type="text"
                      required
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      placeholder="e.g. Senior Patron & Founding Advisor"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-rose-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Organization Unit / Committee</label>
                    <input
                      type="text"
                      value={formData.organizationUnit}
                      onChange={(e) => setFormData({ ...formData, organizationUnit: e.target.value })}
                      placeholder="e.g. UPRSA State Advisory Board"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-rose-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Badge Title</label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="e.g. FOUNDING PATRON"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-rose-500 outline-none"
                    />
                  </div>
                </div>

                {/* Photo Upload / URL */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Individual Photo (व्यक्तिगत फोटो URL / अपलोड)</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={formData.photo}
                      onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-rose-500 outline-none font-mono"
                    />
                    <label className="bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 border border-slate-700">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingPhoto ? 'Uploading...' : 'Upload Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        disabled={uploadingPhoto}
                      />
                    </label>
                  </div>
                  {formData.photo && (
                    <div className="mt-2 flex items-center gap-3">
                      <img
                        src={formData.photo}
                        alt="Preview"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-xs text-slate-400">Photo preview loaded</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Native Place (मूल निवास) *</label>
                    <input
                      type="text"
                      required
                      value={formData.nativePlace}
                      onChange={(e) => setFormData({ ...formData, nativePlace: e.target.value })}
                      placeholder="e.g. Lucknow (लखनऊ)"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-rose-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Current Location</label>
                    <input
                      type="text"
                      value={formData.currentLocation}
                      onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                      placeholder="e.g. Gomti Nagar, Lucknow"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-rose-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Experience (वर्ष)</label>
                    <input
                      type="number"
                      value={formData.experienceYears || ''}
                      onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-rose-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Contact Phone (Optional)</label>
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 94150 00000"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-rose-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Short Summary (छोटा सा परिचय - कार्ड पर दिखने वाला) *</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.shortSummary}
                    onChange={(e) => setFormData({ ...formData, shortSummary: e.target.value })}
                    placeholder="छोटा सा परिचय जो कार्ड पर दिखता है..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-rose-500 outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Section 2: Full Biography (संपूर्ण परिचय / जीवन न्यूज़) */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Quote className="w-3.5 h-3.5" />
                  <span>2. Full Biography Details (संपूर्ण परिचय - "संपूर्ण परिचय" बटन पर खुलने वाला विवरण)</span>
                </h4>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Origin & Early Life (जन्म, प्रारंभिक जीवन व पृष्ठभूमि)</label>
                  <textarea
                    rows={3}
                    value={formData.fullBio?.originAndEarlyLife || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      fullBio: {
                        ...(formData.fullBio || {
                          originAndEarlyLife: '',
                          skatingContribution: '',
                          careerJourney: '',
                          philosophyAndMessage: '',
                          specialHonors: [],
                          galleryMoments: []
                        }),
                        originAndEarlyLife: e.target.value
                      }
                    })}
                    placeholder="जन्म स्थान, प्रारंभिक शिक्षा व खेल से जुड़ाव..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-rose-500 outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Contribution to UP Skating (उत्तर प्रदेश स्केटिंग में विशेष योगदान)</label>
                  <textarea
                    rows={3}
                    value={formData.fullBio?.skatingContribution || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      fullBio: {
                        ...(formData.fullBio || {
                          originAndEarlyLife: '',
                          skatingContribution: '',
                          careerJourney: '',
                          philosophyAndMessage: '',
                          specialHonors: [],
                          galleryMoments: []
                        }),
                        skatingContribution: e.target.value
                      }
                    })}
                    placeholder="राज्य स्तर पर बुनियादी ढांचा, क्लब स्थापना, खिलाड़ियों को मार्गदर्शन आदि..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-rose-500 outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Career Journey & Milestones (करियर यात्रा व प्रशासनिक दायित्व)</label>
                  <textarea
                    rows={3}
                    value={formData.fullBio?.careerJourney || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      fullBio: {
                        ...(formData.fullBio || {
                          originAndEarlyLife: '',
                          skatingContribution: '',
                          careerJourney: '',
                          philosophyAndMessage: '',
                          specialHonors: [],
                          galleryMoments: []
                        }),
                        careerJourney: e.target.value
                      }
                    })}
                    placeholder="विगत वर्षों का सफर, पदभार और जिम्मेदारियां..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-rose-500 outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Philosophy & Message for Youth (प्रेरणादायक संदेश व विचार)</label>
                  <input
                    type="text"
                    value={formData.fullBio?.philosophyAndMessage || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      fullBio: {
                        ...(formData.fullBio || {
                          originAndEarlyLife: '',
                          skatingContribution: '',
                          careerJourney: '',
                          philosophyAndMessage: '',
                          specialHonors: [],
                          galleryMoments: []
                        }),
                        philosophyAndMessage: e.target.value
                      }
                    })}
                    placeholder="उदा. खेलों से ही युवा पीढ़ी में अनुशासन और नेतृत्व क्षमता का विकास होता है।"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-rose-500 outline-none"
                  />
                </div>

                {/* Special Honors List */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="block text-xs font-bold text-slate-300">Special Honors & Awards (विशेष सम्मान व पुरस्कार)</label>
                  
                  {formData.fullBio?.specialHonors && formData.fullBio.specialHonors.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.fullBio.specialHonors.map((honor, i) => (
                        <span key={i} className="bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                          <Award className="w-3 h-3" />
                          <span>{honor}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveHonor(i)}
                            className="text-slate-400 hover:text-white ml-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. यूपी रोलर स्पोर्ट्स लाइफटाइम कंट्रीब्यूशन अवार्ड"
                      value={newHonor}
                      onChange={(e) => setNewHonor(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-rose-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddHonor}
                      className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                    >
                      + Add Honor
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 3: Order and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Display Sort Order</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.order || 1}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-rose-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Publication Status</label>
                  <select
                    value={formData.status || 'Active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-rose-500 outline-none"
                  >
                    <option value="Active">Active (Visible on public site)</option>
                    <option value="Inactive">Inactive / Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3 sticky bottom-0 bg-slate-900 py-3 -mx-6 px-6 -mb-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:opacity-95 text-white font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingMember ? 'Save Changes' : 'Publish Member Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
