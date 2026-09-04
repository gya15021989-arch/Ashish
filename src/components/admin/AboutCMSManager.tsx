import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  Upload,
  Check,
  X,
  Eye,
  Info,
  Layers,
  BookOpen,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Save,
  Image as ImageIcon,
  ArrowUpDown
} from 'lucide-react';
import { AboutContent, AboutSection, AboutPolicy, AboutInfo } from '../../types';
import { api } from '../../services/api';

export const AboutCMSManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'sections' | 'policies' | 'info'>('sections');
  const [aboutData, setAboutData] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Section Modal State
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<AboutSection | null>(null);
  const [sectionForm, setSectionForm] = useState<Partial<AboutSection>>({
    title: '',
    badge: '',
    badgeColor: 'amber',
    description: '',
    footerTag: '',
    imageUrl: '',
    order: 1,
    status: 'Active'
  });

  // Policy Modal State
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<AboutPolicy | null>(null);
  const [policyForm, setPolicyForm] = useState<Partial<AboutPolicy>>({
    title: '',
    description: '',
    linkUrl: '',
    order: 1
  });

  // Info Form State
  const [infoForm, setInfoForm] = useState<AboutInfo>({
    establishedText: 'ESTABLISHED 1988 • REG. NO. UP/S/294',
    title: 'About Uttar Pradesh Roller Sports Association',
    tagline: 'The supreme state governing and promotional body for Roller, Speed, Inline Freestyle...',
    headOfficeAddress: '',
    phone: '',
    email: '',
    constitutionTitle: 'Constitution & Official Policies',
    statRegisteredAthletesText: '2,800+ Registered Athletes',
    statAffiliatedUnitsText: '75 District Units Recognized'
  });
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadAboutContent();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadAboutContent = async () => {
    try {
      setLoading(true);
      const res = await api.getAboutContent();
      if (res.success && res.data) {
        setAboutData(res.data);
        if (res.data.info) {
          setInfoForm(res.data.info);
        }
      }
    } catch (err) {
      showToast('Failed to load About page data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Section Handlers
  const handleOpenCreateSection = () => {
    setEditingSection(null);
    setSectionForm({
      title: '',
      badge: '',
      badgeColor: 'amber',
      description: '',
      footerTag: '',
      imageUrl: '',
      order: (aboutData?.sections?.length || 0) + 1,
      status: 'Active'
    });
    setIsSectionModalOpen(true);
  };

  const handleOpenEditSection = (sec: AboutSection) => {
    setEditingSection(sec);
    setSectionForm({ ...sec });
    setIsSectionModalOpen(true);
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionForm.title || !sectionForm.description) {
      showToast('Title and Description are required', 'error');
      return;
    }

    try {
      if (editingSection) {
        const res = await api.updateAboutSection(editingSection.id, sectionForm);
        if (res.success) {
          showToast('About section updated successfully');
          setIsSectionModalOpen(false);
          loadAboutContent();
        } else {
          showToast(res.message || 'Failed to update section', 'error');
        }
      } else {
        const res = await api.createAboutSection(sectionForm);
        if (res.success) {
          showToast('New About section created successfully');
          setIsSectionModalOpen(false);
          loadAboutContent();
        } else {
          showToast(res.message || 'Failed to create section', 'error');
        }
      }
    } catch (err) {
      showToast('Error saving About section', 'error');
    }
  };

  const handleDeleteSection = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete the section "${title}"?`)) {
      return;
    }
    try {
      const res = await api.deleteAboutSection(id);
      if (res.success) {
        showToast('Section deleted successfully');
        loadAboutContent();
      } else {
        showToast(res.message || 'Failed to delete section', 'error');
      }
    } catch (err) {
      showToast('Error deleting section', 'error');
    }
  };

  // Policy Handlers
  const handleOpenCreatePolicy = () => {
    setEditingPolicy(null);
    setPolicyForm({
      title: '',
      description: '',
      linkUrl: '',
      order: (aboutData?.policies?.length || 0) + 1
    });
    setIsPolicyModalOpen(true);
  };

  const handleOpenEditPolicy = (pol: AboutPolicy) => {
    setEditingPolicy(pol);
    setPolicyForm({ ...pol });
    setIsPolicyModalOpen(true);
  };

  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyForm.title) {
      showToast('Policy title is mandatory', 'error');
      return;
    }

    try {
      if (editingPolicy) {
        const res = await api.updateAboutPolicy(editingPolicy.id, policyForm);
        if (res.success) {
          showToast('Policy updated successfully');
          setIsPolicyModalOpen(false);
          loadAboutContent();
        } else {
          showToast(res.message || 'Failed to update policy', 'error');
        }
      } else {
        const res = await api.createAboutPolicy(policyForm);
        if (res.success) {
          showToast('Policy created successfully');
          setIsPolicyModalOpen(false);
          loadAboutContent();
        } else {
          showToast(res.message || 'Failed to create policy', 'error');
        }
      }
    } catch (err) {
      showToast('Error saving policy', 'error');
    }
  };

  const handleDeletePolicy = async (id: string, title: string) => {
    if (!window.confirm(`Delete policy "${title}"?`)) return;
    try {
      const res = await api.deleteAboutPolicy(id);
      if (res.success) {
        showToast('Policy removed');
        loadAboutContent();
      } else {
        showToast(res.message || 'Failed to delete policy', 'error');
      }
    } catch (err) {
      showToast('Error deleting policy', 'error');
    }
  };

  // General Info Save
  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingInfo(true);
    try {
      const res = await api.updateAboutInfo(infoForm);
      if (res.success) {
        showToast('About page information saved successfully');
        loadAboutContent();
      } else {
        showToast(res.message || 'Failed to save information', 'error');
      }
    } catch (err) {
      showToast('Error saving info', 'error');
    } finally {
      setIsSavingInfo(false);
    }
  };

  // Image Upload with explicit JPG support
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check format
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const fileNameLower = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileNameLower.endsWith(ext)) || file.type.startsWith('image/');
    
    if (!isValid) {
      showToast('Please select a JPG, JPEG, or PNG image file.', 'error');
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await api.uploadFile(file.name, base64, false);
        if (res.success && res.fileUrl) {
          setSectionForm(prev => ({ ...prev, imageUrl: res.fileUrl }));
          showToast('JPG/Image uploaded successfully');
        } else {
          showToast(res.message || 'Failed to upload image', 'error');
        }
      } catch (err) {
        showToast('Upload error', 'error');
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold border animate-in slide-in-from-bottom-3 ${
            toast.type === 'success'
              ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
              : 'bg-red-950 border-red-500 text-red-300'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                CONTENT MANAGEMENT SYSTEM
              </span>
              <span className="text-xs text-slate-500 font-mono">• Live Public About Page</span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-amber-400" />
              About Page Full Access Manager
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Complete administrative authority to <strong className="text-slate-200">Create</strong>, <strong className="text-slate-200">Edit</strong>, and <strong className="text-slate-200">Delete</strong> all sections, mission pillars, policies, and headquarters info displayed on the public About page.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeSubTab === 'sections' && (
              <button
                type="button"
                onClick={handleOpenCreateSection}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Create New About Section</span>
              </button>
            )}

            {activeSubTab === 'policies' && (
              <button
                type="button"
                onClick={handleOpenCreatePolicy}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Regulation / Policy</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex border-b border-slate-800 mt-6 -mb-6">
          <button
            type="button"
            onClick={() => setActiveSubTab('sections')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeSubTab === 'sections'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Mission & Vision Pillars ({aboutData?.sections?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('policies')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeSubTab === 'policies'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Constitution & Policies ({aboutData?.policies?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('info')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeSubTab === 'info'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Header & Secretariat Info</span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-xs font-mono">
          Loading About page content from state database...
        </div>
      ) : (
        <>
          {/* TAB 1: SECTIONS / PILLARS */}
          {activeSubTab === 'sections' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400 font-mono">
                  Displaying {aboutData?.sections?.length || 0} active pillar cards rendered on the public website.
                </div>
              </div>

              {(!aboutData?.sections || aboutData.sections.length === 0) ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                  <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-bold text-white">No About sections found</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">Click "Create New About Section" to add your first pillar card.</p>
                  <button
                    type="button"
                    onClick={handleOpenCreateSection}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Section Now</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {aboutData.sections.map((section, idx) => {
                    const badgeColors: Record<string, string> = {
                      amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                      indigo: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
                      emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                      blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                      purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                      rose: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    };
                    const colorClass = badgeColors[section.badgeColor || 'amber'] || badgeColors.amber;

                    return (
                      <div
                        key={section.id || idx}
                        className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all group"
                      >
                        {/* Card Image */}
                        <div className="h-44 w-full bg-slate-950 relative overflow-hidden">
                          {section.imageUrl ? (
                            <img
                              src={section.imageUrl}
                              alt={section.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <ImageIcon className="w-10 h-10 opacity-30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

                          {/* Badge */}
                          <div className="absolute top-3 left-3 flex items-center gap-2">
                            <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border ${colorClass}`}>
                              {section.badge || 'PILLAR'}
                            </span>
                          </div>

                          <div className="absolute top-3 right-3 flex items-center gap-1.5">
                            <span className="text-[10px] bg-slate-950/80 backdrop-blur-xs text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                              #{section.order || idx + 1}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              section.status === 'Active' 
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}>
                              {section.status}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-base font-bold text-white mb-2 leading-tight">
                              {section.title}
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                              {section.description}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                            <span className="text-[11px] text-amber-400 font-mono font-medium">
                              {section.footerTag || 'UPRSA Pillar'}
                            </span>

                            {/* Actions: Edit & Delete */}
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditSection(section)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                title="Edit Section"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSection(section.id, section.title)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-colors cursor-pointer"
                                title="Delete Section"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: POLICIES & CONSTITUTION */}
          {activeSubTab === 'policies' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400 font-mono">
                  State federation guidelines, technical regulations, and athlete safe sport compliances.
                </div>
              </div>

              {(!aboutData?.policies || aboutData.policies.length === 0) ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                  <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-bold text-white">No policies listed</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">Add your first federation regulation or guideline policy.</p>
                  <button
                    type="button"
                    onClick={handleOpenCreatePolicy}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Regulation / Policy</span>
                  </button>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
                  {aboutData.policies.map((policy, idx) => (
                    <div
                      key={policy.id || idx}
                      className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {policy.order || idx + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white leading-snug">
                            {policy.title}
                          </h4>
                          {policy.description && (
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                              {policy.description}
                            </p>
                          )}
                          {policy.linkUrl && (
                            <a
                              href={policy.linkUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-amber-400 hover:underline mt-1.5 inline-block font-mono"
                            >
                              Document Link: {policy.linkUrl}
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Policy Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEditPolicy(policy)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit Policy"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePolicy(policy.id, policy.title)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-colors cursor-pointer"
                          title="Delete Policy"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HEADER & SECRETARIAT INFO */}
          {activeSubTab === 'info' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-amber-400" />
                  About Page Header & State Secretariat Details
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Customize the organization description, registration number, headquarters location, and contact numbers.
                </p>
              </div>

              <form onSubmit={handleSaveInfo} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Established Badge / Registration Text
                    </label>
                    <input
                      type="text"
                      value={infoForm.establishedText}
                      onChange={(e) => setInfoForm({ ...infoForm, establishedText: e.target.value })}
                      placeholder="ESTABLISHED 1988 • REG. NO. UP/S/294"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Main Page Heading
                    </label>
                    <input
                      type="text"
                      value={infoForm.title}
                      onChange={(e) => setInfoForm({ ...infoForm, title: e.target.value })}
                      placeholder="About Uttar Pradesh Roller Sports Association"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Federation Overview & Tagline
                  </label>
                  <textarea
                    rows={3}
                    value={infoForm.tagline}
                    onChange={(e) => setInfoForm({ ...infoForm, tagline: e.target.value })}
                    placeholder="The supreme state governing and promotional body for Roller, Speed, Inline Freestyle..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-amber-500 outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Athlete Highlight Stat Badge
                    </label>
                    <input
                      type="text"
                      value={infoForm.statRegisteredAthletesText || ''}
                      onChange={(e) => setInfoForm({ ...infoForm, statRegisteredAthletesText: e.target.value })}
                      placeholder="2,800+ Registered Athletes"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      District Affiliation Stat Badge
                    </label>
                    <input
                      type="text"
                      value={infoForm.statAffiliatedUnitsText || ''}
                      onChange={(e) => setInfoForm({ ...infoForm, statAffiliatedUnitsText: e.target.value })}
                      placeholder="75 District Units Recognized"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                    State Secretariat Headquarters
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Head Office Physical Address
                      </label>
                      <input
                        type="text"
                        value={infoForm.headOfficeAddress}
                        onChange={(e) => setInfoForm({ ...infoForm, headOfficeAddress: e.target.value })}
                        placeholder="UP Roller Sports Arena, Sector-G, LDA Colony, Kanpur Road, Lucknow, UP - 226012"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          Secretariat Phone / Helplines
                        </label>
                        <input
                          type="text"
                          value={infoForm.phone}
                          onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                          placeholder="+91 522 2439812, +91 94150 21989"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          Official Email Address
                        </label>
                        <input
                          type="email"
                          value={infoForm.email}
                          onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                          placeholder="uprsa.official@gmail.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingInfo}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingInfo ? 'Saving Changes...' : 'Save About Page Information'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}

      {/* SECTION CREATE / EDIT MODAL */}
      {isSectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingSection ? 'Edit About Section / Pillar' : 'Create New About Section / Pillar'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Full control over title, badge, description, photo (JPG/PNG), and order.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSectionModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSection} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Section Title *</label>
                  <input
                    type="text"
                    required
                    value={sectionForm.title}
                    onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                    placeholder="e.g. Synthetic Banked Tracks"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Badge Label</label>
                  <input
                    type="text"
                    value={sectionForm.badge}
                    onChange={(e) => setSectionForm({ ...sectionForm, badge: e.target.value })}
                    placeholder="e.g. State Mission, Apex Body"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Badge Color</label>
                  <select
                    value={sectionForm.badgeColor || 'amber'}
                    onChange={(e) => setSectionForm({ ...sectionForm, badgeColor: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                  >
                    <option value="amber">Amber / Gold</option>
                    <option value="indigo">Indigo / RSFI Blue</option>
                    <option value="emerald">Emerald Green</option>
                    <option value="blue">Sky Blue</option>
                    <option value="purple">Purple</option>
                    <option value="rose">Rose Red</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    min={1}
                    value={sectionForm.order || 1}
                    onChange={(e) => setSectionForm({ ...sectionForm, order: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Status</label>
                  <select
                    value={sectionForm.status || 'Active'}
                    onChange={(e) => setSectionForm({ ...sectionForm, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                  >
                    <option value="Active">Active (Visible)</option>
                    <option value="Inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Detailed Description *</label>
                <textarea
                  rows={4}
                  required
                  value={sectionForm.description}
                  onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
                  placeholder="Describe the initiative, achievements, historical context, or state federation goals..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-amber-500 outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Footer Tag / Key Highlight</label>
                <input
                  type="text"
                  value={sectionForm.footerTag}
                  onChange={(e) => setSectionForm({ ...sectionForm, footerTag: e.target.value })}
                  placeholder="e.g. Infrastructure & Excellence"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                />
              </div>

              {/* PHOTO UPLOAD WITH EXPLICIT JPG OPTION */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    Section Photograph (JPG / JPEG / PNG)
                  </label>
                  <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    JPG OPTION READY
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={sectionForm.imageUrl}
                    onChange={(e) => setSectionForm({ ...sectionForm, imageUrl: e.target.value })}
                    placeholder="https://... or /storage/... or upload a JPG file"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none font-mono"
                  />

                  {/* JPG Upload Button */}
                  <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload JPG / Photo'}</span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Accepts standard <strong>.JPG</strong>, <strong>.JPEG</strong>, <strong>.PNG</strong> formats up to 5MB.</span>
                </p>

                {/* Live Preview */}
                {sectionForm.imageUrl && (
                  <div className="mt-2 relative rounded-xl overflow-hidden border border-slate-700 h-32 w-full max-w-xs bg-slate-900">
                    <img
                      src={sectionForm.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={() => setSectionForm({ ...sectionForm, imageUrl: '' })}
                      className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-red-500 text-white rounded-lg text-xs"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSectionModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingSection ? 'Update Section' : 'Create Section'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POLICY CREATE / EDIT MODAL */}
      {isPolicyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingPolicy ? 'Edit Policy / Circular' : 'Add New Regulation / Policy'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    State code, technical rules, or constitution circular.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPolicyModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePolicy} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Policy / Circular Title *</label>
                <input
                  type="text"
                  required
                  value={policyForm.title}
                  onChange={(e) => setPolicyForm({ ...policyForm, title: e.target.value })}
                  placeholder="e.g. RSFI Technical Regulations 2026 for Speed & Inline"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description / Key Highlights</label>
                <textarea
                  rows={3}
                  value={policyForm.description}
                  onChange={(e) => setPolicyForm({ ...policyForm, description: e.target.value })}
                  placeholder="Brief synopsis of what this regulation mandates..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-amber-500 outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Reference URL (Optional)</label>
                  <input
                    type="text"
                    value={policyForm.linkUrl}
                    onChange={(e) => setPolicyForm({ ...policyForm, linkUrl: e.target.value })}
                    placeholder="https://uprsa.org/docs/... or document link"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    min={1}
                    value={policyForm.order || 1}
                    onChange={(e) => setPolicyForm({ ...policyForm, order: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPolicyModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingPolicy ? 'Update Policy' : 'Add Policy'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
