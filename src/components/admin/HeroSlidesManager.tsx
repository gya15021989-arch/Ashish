import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Image as ImageIcon, 
  Check, 
  X, 
  Upload, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { HeroSlide } from '../../types';
import { api } from '../../services/api';

export const HeroSlidesManager: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<HeroSlide>>({
    title: '',
    subtitle: '',
    badge: 'OFFICIAL RSFI AFFILIATED STATE BODY',
    imageUrl: '',
    actionText: 'Register as Skater',
    actionLink: '#register',
    order: 1,
    isActive: true
  });

  useEffect(() => {
    loadSlides();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadSlides = async () => {
    try {
      setLoading(true);
      const res = await api.getHeroSlides();
      if (res.success && res.data) {
        setSlides(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load hero slides', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingSlide(null);
    setFormData({
      title: '',
      subtitle: '',
      badge: 'OFFICIAL RSFI AFFILIATED STATE BODY',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80',
      actionText: 'Explore Championships',
      actionLink: '#tournaments',
      order: slides.length + 1,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      ...slide,
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      badge: slide.badge || 'OFFICIAL RSFI AFFILIATED STATE BODY',
      imageUrl: slide.imageUrl || '',
      actionText: slide.actionText || 'Register as Skater',
      actionLink: slide.actionLink || '#register',
      order: slide.order ?? 1,
      isActive: slide.isActive ?? true
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) {
      showToast('Title and Image URL are required', 'error');
      return;
    }

    try {
      if (editingSlide) {
        const res = await api.updateHeroSlide(editingSlide.id, formData);
        if (res.success) {
          showToast('Slide updated successfully');
          loadSlides();
          setIsModalOpen(false);
        }
      } else {
        const res = await api.createHeroSlide(formData);
        if (res.success) {
          showToast('New banner slide added');
          loadSlides();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to save slide', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this hero banner slide?')) return;
    try {
      const res = await api.deleteHeroSlide(id);
      if (res.success) {
        showToast('Slide removed');
        loadSlides();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete slide', 'error');
    }
  };

  const handleToggleActive = async (slide: HeroSlide) => {
    try {
      const res = await api.updateHeroSlide(slide.id, { isActive: !slide.isActive });
      if (res.success) {
        showToast(`Slide ${!slide.isActive ? 'activated' : 'deactivated'}`);
        loadSlides();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await api.uploadFile(file.name, base64, false);
        if (res.success && res.fileUrl) {
          setFormData(prev => ({ ...prev, imageUrl: res.fileUrl }));
          showToast('Image uploaded successfully');
        }
      } catch (err) {
        showToast('Image upload failed', 'error');
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
            <h2 className="text-xl font-black text-white">Homepage Hero Banners Manager</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Control the high-impact carousel slides, call-to-actions, and headlines on the public homepage.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Banner Slide</span>
        </button>
      </div>

      {/* Slides Grid */}
      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          Loading hero banner slides...
        </div>
      ) : slides.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <ImageIcon className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-400">No custom hero slides created yet.</p>
          <button
            onClick={handleOpenAdd}
            className="bg-amber-500 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl"
          >
            Create First Slide
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {slides.map((slide, idx) => (
            <div 
              key={slide.id} 
              className={`bg-slate-900 border rounded-2xl overflow-hidden shadow-xl transition-all ${
                slide.isActive ? 'border-slate-800' : 'border-slate-800/40 opacity-60'
              }`}
            >
              {/* Image preview banner */}
              <div className="relative h-44 bg-slate-950 overflow-hidden">
                <img 
                  src={slide.imageUrl} 
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30 text-[10px] font-black font-mono px-2.5 py-1 rounded-lg">
                    SLIDE #{slide.order || idx + 1}
                  </span>
                  {slide.isActive ? (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      ACTIVE
                    </span>
                  ) : (
                    <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-1 rounded-lg">
                      HIDDEN
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] font-mono font-bold text-amber-400 tracking-wider uppercase bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                    {slide.badge}
                  </span>
                  <h3 className="text-base font-black text-white mt-1 line-clamp-1">
                    {slide.title}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {slide.subtitle}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="font-semibold text-slate-400">Button:</span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-amber-300">
                      {slide.actionText} → {slide.actionLink}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleActive(slide)}
                      title={slide.isActive ? 'Hide slide' : 'Show slide'}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                      {slide.isActive ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
                    </button>
                    <button
                      onClick={() => handleOpenEdit(slide)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 transition-colors"
                      title="Edit slide"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(slide.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/50 text-red-400 transition-colors"
                      title="Delete slide"
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

      {/* Add / Edit Slide Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">
                  {editingSlide ? 'Edit Banner Slide' : 'Create New Hero Slide'}
                </h3>
                <span className="text-xs text-slate-400">Manage high-impact public homepage hero visuals</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Top Eyebrow Badge</label>
                  <input
                    type="text"
                    value={formData.badge || ''}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. OFFICIAL RSFI AFFILIATED STATE BODY"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Slide Order / Priority</label>
                  <input
                    type="number"
                    value={formData.order ?? 1}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 36th UP State Roller Skating Championship 2026"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Subtitle / Description</label>
                <textarea
                  rows={3}
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Official state selection trials for the 63rd National Championship..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Banner Background Image URL *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.imageUrl || ''}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... or /storage/..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none font-mono"
                  />
                  <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload JPG / Image</span>
                    <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Accepts JPG, JPEG, PNG or WebP images</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Button Action Text</label>
                  <input
                    type="text"
                    value={formData.actionText || ''}
                    onChange={(e) => setFormData({ ...formData, actionText: e.target.value })}
                    placeholder="e.g. Register as Skater"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Button Target Link</label>
                  <input
                    type="text"
                    value={formData.actionLink || ''}
                    onChange={(e) => setFormData({ ...formData, actionLink: e.target.value })}
                    placeholder="e.g. #register, #tournaments"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-amber-500 bg-slate-950 border-slate-800 rounded focus:ring-amber-500"
                  />
                  <span>Active & Visible on Public Homepage</span>
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
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingSlide ? 'Save Changes' : 'Publish Slide'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
