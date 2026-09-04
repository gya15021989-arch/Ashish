import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  Upload, 
  Check, 
  X, 
  Search, 
  AlertTriangle, 
  Paperclip, 
  Calendar, 
  Tag, 
  Shield, 
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';
import { Announcement } from '../../types';
import { api } from '../../services/api';

export const NewsAnnouncementsManager: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [uploadingJpg, setUploadingJpg] = useState(false);

  // Form State with rich bilingual, JPG photo and PDF support
  const [formData, setFormData] = useState<Partial<Announcement> & {
    hindiTitle?: string;
    circularNumber?: string;
    signatory?: string;
    designation?: string;
    urgency?: 'NORMAL' | 'HIGH' | 'CRITICAL';
    content?: string;
    imageUrl?: string;
  }>({
    title: '',
    hindiTitle: '',
    circularNumber: 'UPRSA/CIR/2026/',
    category: 'Circular',
    isImportant: false,
    date: new Date().toISOString().split('T')[0],
    linkText: 'Download Official Circular (PDF)',
    linkUrl: '',
    fileUrl: '',
    imageUrl: '',
    signatory: 'General Secretary',
    designation: 'Uttar Pradesh Roller Sports Association',
    urgency: 'NORMAL',
    content: ''
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await api.getAnnouncements();
      if (res.success && res.data) {
        setAnnouncements(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load announcements', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingAnn(null);
    setFormData({
      title: '',
      hindiTitle: '',
      circularNumber: `UPRSA/CIR/2026/${Math.floor(100 + Math.random() * 900)}`,
      category: 'Circular',
      isImportant: false,
      date: new Date().toISOString().split('T')[0],
      linkText: 'Download Official Circular (PDF)',
      linkUrl: '',
      fileUrl: '',
      imageUrl: '',
      signatory: 'General Secretary',
      designation: 'Uttar Pradesh Roller Sports Association',
      urgency: 'NORMAL',
      content: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ann: Announcement) => {
    setEditingAnn(ann);
    setFormData({ 
      ...ann,
      imageUrl: (ann as any).imageUrl || ''
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)/i) && !file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
      showToast('Please select a JPG, JPEG, or PNG image file', 'error');
      return;
    }

    setUploadingJpg(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await api.uploadFile(file.name, base64, true);
        if (res.success && res.fileUrl) {
          setFormData(prev => ({ 
            ...prev, 
            imageUrl: res.fileUrl 
          }));
          showToast('JPG Photo attached successfully');
        }
      } catch (err) {
        showToast('Image upload failed', 'error');
      } finally {
        setUploadingJpg(false);
      }
    };
    reader.onerror = () => {
      setUploadingJpg(false);
      showToast('Failed to read image file', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      showToast('Title is required', 'error');
      return;
    }

    try {
      if (editingAnn) {
        const res = await api.updateAnnouncement(editingAnn.id, formData);
        if (res.success) {
          showToast('Circular updated successfully');
          loadAnnouncements();
          setIsModalOpen(false);
        }
      } else {
        const res = await api.createAnnouncement(formData);
        if (res.success) {
          showToast('New circular published');
          loadAnnouncements();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to save announcement', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this circular announcement?')) return;
    try {
      const res = await api.deleteAnnouncement(id);
      if (res.success) {
        showToast('Announcement removed');
        loadAnnouncements();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete', 'error');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await api.uploadFile(file.name, base64, false);
        if (res.success && res.fileUrl) {
          setFormData(prev => ({ 
            ...prev, 
            fileUrl: res.fileUrl, 
            linkUrl: res.fileUrl,
            linkText: `Download ${file.name}` 
          }));
          showToast('Official PDF/Document attached successfully');
        }
      } catch (err) {
        showToast('File upload failed', 'error');
      }
    };
    reader.readAsDataURL(file);
  };

  const filtered = announcements.filter(a => {
    const matchCat = selectedCategory === 'ALL' || a.category === selectedCategory;
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || 
      (a.category && a.category.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
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
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
            <h2 className="text-xl font-black text-white">News, Circulars & Official Gazette</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Publish state notifications, championship circulars, eligibility orders, and downloadable PDFs.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Publish New Circular</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search circulars, notifications, championship notices..."
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

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'Championship', 'Circular', 'Results', 'General'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          Loading official circulars...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-400">No matching circulars or announcements found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ann) => (
            <div
              key={ann.id}
              className={`bg-slate-900 border rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:border-slate-700 ${
                ann.isImportant ? 'border-amber-500/40 bg-slate-900/90' : 'border-slate-800'
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                {/* JPG Photo Thumbnail if available */}
                {Boolean((ann as any).imageUrl) && (
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shrink-0 hidden sm:block">
                    <img
                      src={(ann as any).imageUrl}
                      alt={ann.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      ann.category === 'Championship' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      ann.category === 'Results' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      ann.category === 'Circular' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {ann.category}
                    </span>

                    {ann.isImportant && (
                      <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-400" />
                        CRITICAL NOTICE
                      </span>
                    )}

                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {ann.date}
                    </span>

                    {Boolean((ann as any).imageUrl) && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                        <ImageIcon className="w-2.5 h-2.5" />
                        JPG PHOTO
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {ann.title}
                  </h3>

                  {(ann as any).hindiTitle && (
                    <p className="text-xs text-amber-300/80 font-medium font-sans">
                      {(ann as any).hindiTitle}
                    </p>
                  )}

                  {(ann.linkUrl || ann.fileUrl) && (
                    <div className="pt-1">
                      <a
                        href={ann.linkUrl || ann.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-400 hover:text-blue-300 bg-blue-950/40 border border-blue-800/40 px-2.5 py-1 rounded-lg"
                      >
                        <Paperclip className="w-3 h-3" />
                        <span>{ann.linkText || 'Download PDF Attachment'}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => handleOpenEdit(ann)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
                  title="Edit notice"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(ann.id)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-950/50 text-red-400 hover:text-red-300 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
                  title="Delete notice"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Circular Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
              <div>
                <h3 className="text-lg font-black text-white">
                  {editingAnn ? 'Edit Official Circular' : 'Publish New Circular / Gazette Notice'}
                </h3>
                <span className="text-xs text-slate-400">State Federation official notification broadcaster</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none"
                  >
                    <option value="Circular">Official Circular</option>
                    <option value="Championship">Championship / Trials</option>
                    <option value="Results">Championship Results</option>
                    <option value="General">General Notification</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Issue Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Circular Ref Number</label>
                  <input
                    type="text"
                    value={formData.circularNumber}
                    onChange={(e) => setFormData({ ...formData, circularNumber: e.target.value })}
                    placeholder="UPRSA/CIR/2026/089"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Official Circular Title (English) *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Schedule for 36th UP State Speed & Freestyle Skating Championship"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Hindi Title / हिंदी शीर्षक (Bilingual Support)</label>
                <input
                  type="text"
                  value={formData.hindiTitle}
                  onChange={(e) => setFormData({ ...formData, hindiTitle: e.target.value })}
                  placeholder="e.g. 36वीं उत्तर प्रदेश राज्य स्पीड एवं फ्रीस्टाइल स्केटिंग चैंपियनशिप की आधिकारिक सूचना"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Brief Description / Notification Body</label>
                <textarea
                  rows={3}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Detailed guidelines, event venue instructions, eligibility criteria..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none resize-none"
                />
              </div>

              {/* JPG Photo / Banner Upload */}
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>Circular Photo / Banner (सर्कुलर/इवेंट फोटो JPG)</span>
                  </label>
                  {Boolean(formData.imageUrl) && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: '' })}
                      className="text-[11px] text-red-400 hover:text-red-300 font-bold"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={formData.imageUrl || ''}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://... or upload local JPG photo"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none font-mono"
                  />
                  <label className="cursor-pointer bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-lg shadow-amber-500/20">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingJpg ? 'Uploading...' : 'Upload JPG Photo'}</span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                {Boolean(formData.imageUrl) && (
                  <div className="flex items-center gap-3 pt-1">
                    <img
                      src={formData.imageUrl}
                      alt="Photo Preview"
                      referrerPolicy="no-referrer"
                      className="w-20 h-14 object-cover rounded-lg border border-slate-700 bg-slate-900"
                    />
                    <span className="text-[11px] text-emerald-400 font-mono">
                      ✓ JPG Image attached - will display on website circular card
                    </span>
                  </div>
                )}
                <p className="text-[11px] text-slate-400">
                  Accepts standard <strong>.JPG</strong>, <strong>.JPEG</strong>, or <strong>.PNG</strong> banner photos for public notice cards.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Attach Official PDF Circular / Scanned Gazette</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.fileUrl || formData.linkUrl || ''}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value, linkUrl: e.target.value })}
                    placeholder="https://... or upload PDF document"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none font-mono"
                  />
                  <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload PDF Circular</span>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,image/jpeg,image/jpg,image/png,image/*,application/pdf" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Supports PDF circulars, official circular scans, or JPG/PNG documents</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Signatory Authority</label>
                  <input
                    type="text"
                    value={formData.signatory}
                    onChange={(e) => setFormData({ ...formData, signatory: e.target.value })}
                    placeholder="e.g. General Secretary"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Button / Download Label</label>
                  <input
                    type="text"
                    value={formData.linkText}
                    onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                    placeholder="e.g. Download Prospectus (PDF)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.isImportant}
                    onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                    className="w-4 h-4 text-red-500 bg-slate-950 border-slate-800 rounded focus:ring-red-500"
                  />
                  <span className="text-red-400 font-bold">Mark as Critical / Important Banner Notice</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingAnn ? 'Save Changes' : 'Publish Notice'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
