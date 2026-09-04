import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Upload, 
  Check, 
  X, 
  AlertCircle, 
  RefreshCw, 
  Eye, 
  Layers, 
  Sliders, 
  Shield, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw,
  Image as ImageIcon,
  Tag,
  FileText
} from 'lucide-react';
import { api } from '../../services/api';
import { DisciplineItem } from '../../types';

export const DisciplinesManager: React.FC = () => {
  const [disciplines, setDisciplines] = useState<DisciplineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DisciplineItem | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState<'basic' | 'specs' | 'events' | 'rules'>('basic');
  const [newEventText, setNewEventText] = useState('');

  // Delete modal state
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<DisciplineItem | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Form State
  const defaultFormData: Partial<DisciplineItem> = {
    number: 1,
    name: '',
    hindiName: '',
    recognitionBadge: 'WORLD SKATE & RSFI RECOGNIZED',
    imageUrl: '',
    description: '',
    hindiDescription: '',
    equipmentSpecs: '',
    rinkStandard: '',
    events: [],
    rules: {
      governingBody: 'World Skate & RSFI Technical Committee',
      ageCategories: 'Tots, Minis, Cadet, Sub-Junior, Junior, Senior, Masters',
      safetyGear: 'Official Federation Certified Helmet & Safety Gear (Mandatory)',
      scoringFormat: 'Electronic Transponder Timing / Standard Scoring',
      wheelLimit: 'As per World Skate & RSFI specifications'
    },
    status: 'Active'
  };

  const [formData, setFormData] = useState<Partial<DisciplineItem>>(defaultFormData);

  // Toast notification helper
  const showNotice = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadDisciplines = async () => {
    setLoading(true);
    try {
      const res = await api.getDisciplines();
      if (res.success && res.data) {
        setDisciplines(res.data);
      }
    } catch (err) {
      console.error('Failed to load disciplines:', err);
      showNotice('Failed to load disciplines from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisciplines();
  }, []);

  // Handle open create modal
  const handleOpenCreate = () => {
    setEditingItem(null);
    const nextNumber = disciplines.length > 0 ? Math.max(...disciplines.map(d => Number(d.number) || 0)) + 1 : 1;
    setFormData({
      ...defaultFormData,
      number: nextNumber,
      events: ['Sprint Trial', 'Long Distance Points Race']
    });
    setActiveFormTab('basic');
    setNewEventText('');
    setIsModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEdit = (item: DisciplineItem) => {
    setEditingItem(item);
    setFormData({
      ...item,
      events: item.events ? [...item.events] : [],
      rules: {
        governingBody: item.rules?.governingBody || 'World Skate & RSFI Technical Committee',
        ageCategories: item.rules?.ageCategories || '',
        safetyGear: item.rules?.safetyGear || '',
        scoringFormat: item.rules?.scoringFormat || '',
        wheelLimit: item.rules?.wheelLimit || ''
      },
      status: item.status || 'Active'
    });
    setActiveFormTab('basic');
    setNewEventText('');
    setIsModalOpen(true);
  };

  // Handle image upload with JPG/JPEG support
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      showNotice('File size exceeds 8MB. Please select a smaller JPG/PNG image.', 'error');
      return;
    }

    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const uploadRes = await api.uploadFile(file.name, base64, false);
        if (uploadRes.success && uploadRes.fileUrl) {
          setFormData(prev => ({ ...prev, imageUrl: uploadRes.fileUrl }));
          showNotice('JPG image uploaded successfully!', 'success');
        } else {
          showNotice(uploadRes.message || 'Image upload failed', 'error');
        }
        setUploadingImage(false);
      };
      reader.onerror = () => {
        showNotice('Failed to read image file', 'error');
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Image upload error:', err);
      showNotice('An error occurred while uploading image', 'error');
      setUploadingImage(false);
    }
  };

  // Events tag manager
  const handleAddEvent = () => {
    const trimmed = newEventText.trim();
    if (!trimmed) return;
    const currentEvents = formData.events || [];
    if (!currentEvents.includes(trimmed)) {
      setFormData({ ...formData, events: [...currentEvents, trimmed] });
    }
    setNewEventText('');
  };

  const handleRemoveEvent = (eventToRemove: string) => {
    const currentEvents = formData.events || [];
    setFormData({
      ...formData,
      events: currentEvents.filter(ev => ev !== eventToRemove)
    });
  };

  // Save (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      showNotice('Please enter a discipline name', 'error');
      return;
    }

    try {
      if (editingItem) {
        // Update
        const res = await api.updateDiscipline(editingItem.id, formData);
        if (res.success && res.data) {
          setDisciplines(prev => prev.map(d => d.id === editingItem.id ? res.data! : d));
          showNotice(`Discipline "${res.data.name}" updated successfully`);
          setIsModalOpen(false);
        } else {
          showNotice(res.message || 'Failed to update discipline', 'error');
        }
      } else {
        // Create
        const res = await api.createDiscipline(formData);
        if (res.success && res.data) {
          setDisciplines(prev => [...prev, res.data!].sort((a, b) => (a.number || 99) - (b.number || 99)));
          showNotice(`Discipline "${res.data.name}" created successfully`);
          setIsModalOpen(false);
        } else {
          showNotice(res.message || 'Failed to create discipline', 'error');
        }
      }
    } catch (err) {
      console.error('Failed to save discipline:', err);
      showNotice('An error occurred while saving', 'error');
    }
  };

  // Delete
  const handleConfirmDelete = async () => {
    if (!deleteConfirmItem) return;
    try {
      const res = await api.deleteDiscipline(deleteConfirmItem.id);
      if (res.success) {
        setDisciplines(prev => prev.filter(d => d.id !== deleteConfirmItem.id));
        showNotice(`Discipline "${deleteConfirmItem.name}" deleted successfully`);
        setDeleteConfirmItem(null);
      } else {
        showNotice(res.message || 'Failed to delete discipline', 'error');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showNotice('Failed to delete discipline', 'error');
    }
  };

  // Reset to default 14 RSFI disciplines
  const handleConfirmReset = async () => {
    try {
      const res = await api.resetDisciplines();
      if (res.success && res.data) {
        setDisciplines(res.data);
        showNotice('Successfully restored 14 official RSFI default disciplines');
        setIsResetConfirmOpen(false);
      } else {
        showNotice(res.message || 'Failed to reset disciplines', 'error');
      }
    } catch (err) {
      console.error('Reset error:', err);
      showNotice('Failed to reset disciplines', 'error');
    }
  };

  // Filtered disciplines list
  const filteredList = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return disciplines;
    return disciplines.filter(d => 
      d.name.toLowerCase().includes(q) ||
      (d.hindiName && d.hindiName.toLowerCase().includes(q)) ||
      (d.description && d.description.toLowerCase().includes(q)) ||
      (d.events && d.events.some(ev => ev.toLowerCase().includes(q)))
    );
  }, [disciplines, searchQuery]);

  // Statistics
  const totalEventsCount = useMemo(() => {
    return disciplines.reduce((acc, d) => acc + (d.events?.length || 0), 0);
  }, [disciplines]);

  const activeCount = useMemo(() => {
    return disciplines.filter(d => d.status !== 'Inactive').length;
  }, [disciplines]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {notification && (
        <div className={`p-4 rounded-2xl flex items-center justify-between shadow-xl transition-all duration-300 border ${
          notification.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-xs font-bold">{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="p-1 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner & Control Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-md shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Trophy className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  Sports Disciplines & Activities CMS
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                    FULL CRUD
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Manage all recognized Roller Sports disciplines, rules, equipment specs, events, and JPG banner photos.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-colors flex items-center gap-1.5"
              title="Restore standard 14 RSFI official disciplines"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset 14 RSFI</span>
            </button>

            <button
              onClick={loadDisciplines}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Discipline</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 border border-slate-800/60 p-4 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Total Disciplines</span>
            <div className="text-2xl font-black text-white mt-1">{disciplines.length}</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/60 p-4 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Active & Public</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{activeCount}</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/60 p-4 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">State / National Events</span>
            <div className="text-2xl font-black text-amber-400 mt-1">{totalEventsCount}</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/60 p-4 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">JPG Upload Support</span>
            <div className="text-xs font-bold text-indigo-400 mt-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search disciplines by name (Speed, Freestyle, Hockey, Artistic...), events, or rules..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 outline-none"
          />
        </div>
        <span className="text-xs text-slate-400 font-mono shrink-0">
          Showing {filteredList.length} of {disciplines.length}
        </span>
      </div>

      {/* Disciplines Grid */}
      {loading ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-400">Loading disciplines repository...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800">
          <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-white mb-1">No Disciplines Found</h4>
          <p className="text-xs text-slate-400 mb-4">No sports match &ldquo;{searchQuery}&rdquo;</p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-700"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className={`bg-slate-900 border rounded-3xl overflow-hidden shadow-xl flex flex-col transition-all duration-300 group ${
                item.status === 'Inactive' 
                  ? 'border-slate-800/60 opacity-60' 
                  : 'border-slate-800 hover:border-amber-500/50 hover:shadow-2xl'
              }`}
            >
              {/* Card Image Banner */}
              <div className="relative h-44 bg-slate-950 overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                    <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                    <span className="text-[11px] font-bold">No JPG Photo Set</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                {/* Priority Number */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-xl shadow-md">
                    #{item.number}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-sm ${
                    item.status === 'Inactive'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {item.status || 'Active'}
                  </span>
                </div>

                {/* Recognition Badge */}
                <div className="absolute top-3 right-3">
                  <span className="text-[9px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30 px-2 py-1 rounded-lg">
                    {item.recognitionBadge || 'RSFI RECOGNIZED'}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-base font-black text-white tracking-tight line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </h3>
                  {item.hindiName && (
                    <p className="text-xs text-amber-400 font-medium line-clamp-1">
                      {item.hindiName}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {item.description || item.hindiDescription || 'No description provided.'}
                </p>

                {/* Events list preview */}
                {item.events && item.events.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Tag className="w-3 h-3 text-amber-400" />
                      Official Events ({item.events.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.events.slice(0, 3).map((ev, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono"
                        >
                          {ev}
                        </span>
                      ))}
                      {item.events.length > 3 && (
                        <span className="text-[10px] bg-slate-800 text-amber-400 font-bold px-1.5 py-0.5 rounded-md">
                          +{item.events.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Equipment & Track preview */}
                {(item.rinkStandard || item.equipmentSpecs) && (
                  <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1 font-mono">
                    {item.rinkStandard && (
                      <div className="truncate">
                        <strong className="text-slate-300">Surface:</strong> {item.rinkStandard}
                      </div>
                    )}
                    {item.rules?.governingBody && (
                      <div className="truncate text-slate-500">
                        <strong className="text-slate-400">Rules:</strong> {item.rules.governingBody}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    ID: {item.id}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteConfirmItem(item)}
                      className="p-1.5 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer"
                      title="Delete Discipline"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* CREATE / EDIT DISCIPLINE MODAL                            */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Trophy className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {editingItem ? `Edit Discipline: ${editingItem.name}` : 'Add New Discipline'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configure sports metadata, JPG photograph, race events, and regulations
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 pt-2 gap-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveFormTab('basic')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 flex items-center gap-2 ${
                  activeFormTab === 'basic'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>1. General & JPG Photo</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab('specs')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 flex items-center gap-2 ${
                  activeFormTab === 'specs'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>2. Descriptions & Surface</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab('events')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 flex items-center gap-2 ${
                  activeFormTab === 'events'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>3. Events Tagging ({formData.events?.length || 0})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab('rules')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 flex items-center gap-2 ${
                  activeFormTab === 'rules'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>4. Rules & Equipment</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* TAB 1: BASIC & JPG PHOTO */}
              {activeFormTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Display Order / # *</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={formData.number || 1}
                        onChange={(e) => setFormData({ ...formData, number: Number(e.target.value) || 1 })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-300 mb-1">Discipline Name (English) *</label>
                      <input
                        type="text"
                        required
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. INLINE SPEED, ROLLER FREESTYLE, ARTISTIC SKATING"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none uppercase font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Hindi Name / हिंदी नाम</label>
                      <input
                        type="text"
                        value={formData.hindiName || ''}
                        onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                        placeholder="उदा. इनलाइन स्पीड स्केटिंग"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Recognition Badge Text</label>
                      <input
                        type="text"
                        value={formData.recognitionBadge || ''}
                        onChange={(e) => setFormData({ ...formData, recognitionBadge: e.target.value })}
                        placeholder="e.g. WORLD SKATE & RSFI RECOGNIZED"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none text-amber-300 font-mono"
                      />
                    </div>
                  </div>

                  {/* JPG / JPEG PHOTO UPLOAD SECTION */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                        Discipline Banner Photo (JPG / JPEG / PNG) *
                      </label>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        JPG UPLOAD ACTIVE
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        required
                        value={formData.imageUrl || ''}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://... or upload a local JPG image"
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none font-mono"
                      />

                      {/* JPG Upload Button */}
                      <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-colors shrink-0">
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>{uploadingImage ? 'Uploading...' : 'Upload JPG / Image'}</span>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>

                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Supports <strong>.JPG</strong>, <strong>.JPEG</strong>, <strong>.PNG</strong>, or <strong>.WebP</strong> up to 8MB.</span>
                    </p>

                    {/* Image Preview */}
                    {formData.imageUrl && (
                      <div className="mt-2 relative h-36 rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, imageUrl: '' })}
                          className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-rose-600 text-white rounded-lg transition-colors"
                          title="Remove image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                      <input
                        type="checkbox"
                        checked={formData.status !== 'Inactive'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'Active' : 'Inactive' })}
                        className="w-4 h-4 text-amber-500 bg-slate-950 border-slate-800 rounded focus:ring-amber-500"
                      />
                      <span>Active & Visible on Public Portal</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: DESCRIPTIONS & SURFACE */}
              {activeFormTab === 'specs' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">English Description *</label>
                    <textarea
                      rows={3}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Comprehensive overview of the discipline, competition format, and objectives..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-amber-500 outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Hindi Description / हिंदी विवरण</label>
                    <textarea
                      rows={3}
                      value={formData.hindiDescription || ''}
                      onChange={(e) => setFormData({ ...formData, hindiDescription: e.target.value })}
                      placeholder="विधा का हिंदी में संक्षिप्त विवरण..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-amber-500 outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Equipment Specifications</label>
                      <textarea
                        rows={2}
                        value={formData.equipmentSpecs || ''}
                        onChange={(e) => setFormData({ ...formData, equipmentSpecs: e.target.value })}
                        placeholder="Carbon fiber boots, 3x110mm or 4x100mm wheels, frames..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-amber-500 outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Rink / Track / Surface Standards</label>
                      <textarea
                        rows={2}
                        value={formData.rinkStandard || ''}
                        onChange={(e) => setFormData({ ...formData, rinkStandard: e.target.value })}
                        placeholder="200m Banked Track with Vesmaco / Synthetic surface or certified road..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-amber-500 outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: EVENTS TAGGING */}
              {activeFormTab === 'events' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Add Competition Event</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newEventText}
                        onChange={(e) => setNewEventText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddEvent();
                          }
                        }}
                        placeholder="e.g. 500m + D Sprint, Classic Slalom, 10,000m Elimination..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddEvent}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Event</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 min-h-[120px]">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                      Current Events ({formData.events?.length || 0})
                    </span>
                    {formData.events && formData.events.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {formData.events.map((ev, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono px-3 py-1.5 rounded-xl flex items-center gap-2 group hover:border-amber-500/50"
                          >
                            <span>{ev}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveEvent(ev)}
                              className="text-slate-500 hover:text-rose-400 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No events added yet. Type an event name and press Add Event.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: RULES & EQUIPMENT */}
              {activeFormTab === 'rules' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Governing Body / Committee</label>
                    <input
                      type="text"
                      value={formData.rules?.governingBody || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        rules: { ...formData.rules!, governingBody: e.target.value }
                      })}
                      placeholder="e.g. World Skate Speed Technical Committee & RSFI Speed Board"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Age Categories</label>
                    <input
                      type="text"
                      value={formData.rules?.ageCategories || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        rules: { ...formData.rules!, ageCategories: e.target.value }
                      })}
                      placeholder="e.g. Tots (U-6), Minis (6-8), Cadet (8-10, 10-12), Sub-Junior, Junior, Senior, Masters"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Mandatory Safety Gear</label>
                    <input
                      type="text"
                      value={formData.rules?.safetyGear || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        rules: { ...formData.rules!, safetyGear: e.target.value }
                      })}
                      placeholder="e.g. Certified Aero Speed Helmet (Mandatory), Skin-tight Race Suit"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Scoring & Timing Format</label>
                      <input
                        type="text"
                        value={formData.rules?.scoringFormat || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          rules: { ...formData.rules!, scoringFormat: e.target.value }
                        })}
                        placeholder="Electronic Transponder Timing with Photo Finish"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Wheel / Gear Limit</label>
                      <input
                        type="text"
                        value={formData.rules?.wheelLimit || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          rules: { ...formData.rules!, wheelLimit: e.target.value }
                        })}
                        placeholder="Max 90mm Minis, 100mm Cadets, 110mm Juniors"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="text-xs text-slate-400">
                  {activeFormTab !== 'rules' ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeFormTab === 'basic') setActiveFormTab('specs');
                        else if (activeFormTab === 'specs') setActiveFormTab('events');
                        else if (activeFormTab === 'events') setActiveFormTab('rules');
                      }}
                      className="text-amber-400 hover:underline font-bold"
                    >
                      Next Step →
                    </button>
                  ) : null}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingItem ? 'Save Discipline' : 'Create Discipline'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DELETE CONFIRMATION MODAL                                 */}
      {/* ========================================================= */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-400">
              <span className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <Trash2 className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-base font-black text-white">Delete Discipline?</h4>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs">
              <p className="text-white font-bold">{deleteConfirmItem.name}</p>
              {deleteConfirmItem.hindiName && (
                <p className="text-slate-400">{deleteConfirmItem.hindiName}</p>
              )}
              <p className="text-[11px] text-slate-500 mt-1">
                Display Order: #{deleteConfirmItem.number} • Events: {deleteConfirmItem.events?.length || 0}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 bg-slate-800 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* RESET TO 14 RSFI CONFIRMATION MODAL                       */}
      {/* ========================================================= */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-400">
              <span className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <RotateCcw className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-base font-black text-white">Reset to 14 RSFI Disciplines?</h4>
                <p className="text-xs text-slate-400">Restores all standard World Skate / RSFI disciplines.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              This will overwrite current disciplines and reload all 14 official disciplines with official photos, rules, and event categories.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 bg-slate-800 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to 14 RSFI</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
