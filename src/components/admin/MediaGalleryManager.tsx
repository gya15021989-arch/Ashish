import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Video, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Check, 
  X, 
  Search, 
  Play, 
  Tv, 
  Eye, 
  Calendar, 
  MapPin, 
  Layers, 
  Sparkles 
} from 'lucide-react';
import { GalleryItem, VideoBroadcast } from '../../types';
import { api } from '../../services/api';

export const MediaGalleryManager: React.FC = () => {
  const [subTab, setSubTab] = useState<'photos' | 'videos'>('photos');
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<VideoBroadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryItem | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoBroadcast | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Photo form state
  const [photoForm, setPhotoForm] = useState<Partial<GalleryItem>>({
    title: '',
    category: 'Tournaments',
    imageUrl: '',
    date: new Date().toISOString().split('T')[0],
    tournamentName: '36th UP State Championship'
  });

  // Video form state
  const [videoForm, setVideoForm] = useState<Partial<VideoBroadcast>>({
    title: '',
    hindiTitle: '',
    category: 'Championship Finals',
    videoUrl: '',
    thumbnailUrl: '',
    duration: '10:00',
    date: new Date().toISOString().split('T')[0],
    venue: 'LDA Banked Track, Lucknow',
    district: 'Lucknow',
    views: 0,
    featured: true,
    hd: true,
    description: '',
    broadcaster: 'UPRSA Media'
  });

  useEffect(() => {
    loadMedia();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadMedia = async () => {
    try {
      setLoading(true);
      const [pRes, vRes] = await Promise.all([
        api.getGallery(),
        api.getVideos()
      ]);
      if (pRes.success && pRes.data) setPhotos(pRes.data);
      if (vRes.success && vRes.data) setVideos(vRes.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load media files', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Photo Handlers
  const handleOpenAddPhoto = () => {
    setEditingPhoto(null);
    setPhotoForm({
      title: '',
      category: 'Tournaments',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      date: new Date().toISOString().split('T')[0],
      tournamentName: '36th UP State Roller Skating Championship'
    });
    setIsPhotoModalOpen(true);
  };

  const handleOpenEditPhoto = (item: GalleryItem) => {
    setEditingPhoto(item);
    setPhotoForm({ ...item });
    setIsPhotoModalOpen(true);
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.title || !photoForm.imageUrl) {
      showToast('Title and Image URL are required', 'error');
      return;
    }

    try {
      if (editingPhoto) {
        const res = await api.updateGalleryItem(editingPhoto.id, photoForm);
        if (res.success) {
          showToast('Photo details updated');
          loadMedia();
          setIsPhotoModalOpen(false);
        }
      } else {
        const res = await api.createGalleryItem(photoForm);
        if (res.success) {
          showToast('Photo added to state gallery');
          loadMedia();
          setIsPhotoModalOpen(false);
        }
      }
    } catch (err) {
      showToast('Failed to save photo', 'error');
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!window.confirm('Delete this photo from gallery?')) return;
    try {
      const res = await api.deleteGalleryItem(id);
      if (res.success) {
        showToast('Photo deleted');
        loadMedia();
      }
    } catch (err) {
      showToast('Failed to delete photo', 'error');
    }
  };

  // Video Handlers
  const handleOpenAddVideo = () => {
    setEditingVideo(null);
    setVideoForm({
      title: '',
      hindiTitle: '',
      category: 'Championship Finals',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      duration: '12:30',
      date: new Date().toISOString().split('T')[0],
      venue: 'LDA Banked Track, Lucknow',
      district: 'Lucknow',
      views: 0,
      featured: true,
      hd: true,
      description: '',
      broadcaster: 'UPRSA Media'
    });
    setIsVideoModalOpen(true);
  };

  const handleOpenEditVideo = (item: VideoBroadcast) => {
    setEditingVideo(item);
    setVideoForm({ ...item });
    setIsVideoModalOpen(true);
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.videoUrl) {
      showToast('Title and Video URL are required', 'error');
      return;
    }

    try {
      if (editingVideo) {
        const res = await api.updateVideo(editingVideo.id, videoForm);
        if (res.success) {
          showToast('Video details updated');
          loadMedia();
          setIsVideoModalOpen(false);
        }
      } else {
        const res = await api.createVideo(videoForm);
        if (res.success) {
          showToast('Video broadcast published');
          loadMedia();
          setIsVideoModalOpen(false);
        }
      }
    } catch (err) {
      showToast('Failed to save video', 'error');
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!window.confirm('Delete this video broadcast?')) return;
    try {
      const res = await api.deleteVideo(id);
      if (res.success) {
        showToast('Video deleted');
        loadMedia();
      }
    } catch (err) {
      showToast('Failed to delete video', 'error');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'photo' | 'videoThumb') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await api.uploadFile(file.name, base64, false);
        if (res.success && res.fileUrl) {
          if (target === 'photo') {
            setPhotoForm(prev => ({ ...prev, imageUrl: res.fileUrl }));
          } else {
            setVideoForm(prev => ({ ...prev, thumbnailUrl: res.fileUrl }));
          }
          showToast('Image uploaded successfully');
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
            <span className="w-2.5 h-2.5 rounded-full bg-pink-400"></span>
            <h2 className="text-xl font-black text-white">Media & Broadcast Manager</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Curate official state photo albums, championship race videos, and YouTube broadcast streams.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {subTab === 'photos' ? (
            <button
              onClick={handleOpenAddPhoto}
              className="bg-pink-600 hover:bg-pink-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-pink-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add High-Res Photo</span>
            </button>
          ) : (
            <button
              onClick={handleOpenAddVideo}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-red-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Video Broadcast</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setSubTab('photos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'photos'
              ? 'bg-slate-800 text-pink-400 border border-pink-500/30 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Photo Gallery ({photos.length})</span>
        </button>

        <button
          onClick={() => setSubTab('videos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'videos'
              ? 'bg-slate-800 text-red-400 border border-red-500/30 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>Video Broadcasts ({videos.length})</span>
        </button>
      </div>

      {/* Tab Content: Photos */}
      {subTab === 'photos' && (
        <div className="space-y-4">
          {loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              Loading photo gallery...
            </div>
          ) : photos.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-2">
              <ImageIcon className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs">No photos added yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((item) => (
                <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group shadow-xl">
                  <div className="relative h-48 bg-slate-950 overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-3.5 space-y-2">
                    <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{item.date}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditPhoto(item)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-400"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePhoto(item.id)}
                          className="p-1 rounded bg-slate-800 hover:bg-red-950/50 text-red-400"
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
        </div>
      )}

      {/* Tab Content: Videos */}
      {subTab === 'videos' && (
        <div className="space-y-4">
          {loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              Loading video broadcasts...
            </div>
          ) : videos.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-2">
              <Tv className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs">No video broadcasts added yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((vid) => (
                <div key={vid.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
                  <div className="relative h-44 bg-slate-950 overflow-hidden">
                    <img 
                      src={vid.thumbnailUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'} 
                      alt={vid.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-center justify-center">
                      <a
                        href={vid.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                      >
                        <Play className="w-5 h-5 ml-0.5 fill-white" />
                      </a>
                    </div>
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded">
                        {vid.category}
                      </span>
                      {vid.hd && (
                        <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded">
                          HD 1080p
                        </span>
                      )}
                    </div>
                    {vid.duration && (
                      <div className="absolute bottom-2 right-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-mono text-white">
                        {vid.duration}
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">{vid.title}</h4>
                      {vid.hindiTitle && (
                        <p className="text-xs text-amber-300/80 font-medium font-sans mt-0.5 line-clamp-1">
                          {vid.hindiTitle}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {vid.district || 'Uttar Pradesh'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {vid.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                      <span className="text-[11px] font-mono text-slate-400">
                        {vid.views || 0} views
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditVideo(vid)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(vid.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/50 text-red-400"
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
        </div>
      )}

      {/* Photo Modal */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-black text-white">{editingPhoto ? 'Edit Photo' : 'Add Photo to Gallery'}</h3>
              <button onClick={() => setIsPhotoModalOpen(false)} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSavePhoto} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={photoForm.title}
                  onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                  placeholder="e.g. 500m Sprint Medalist Podium Ceremony"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-pink-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={photoForm.category}
                    onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-pink-500 outline-none"
                  >
                    <option value="Tournaments">Championships</option>
                    <option value="Award Ceremony">Award Ceremony</option>
                    <option value="Speed">Speed Skating</option>
                    <option value="Freestyle">Inline Freestyle</option>
                    <option value="Training">Coaching Camp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Event Date</label>
                  <input
                    type="date"
                    value={photoForm.date}
                    onChange={(e) => setPhotoForm({ ...photoForm, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-pink-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">High-Res Image URL *</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={photoForm.imageUrl}
                    onChange={(e) => setPhotoForm({ ...photoForm, imageUrl: e.target.value })}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-pink-500 outline-none font-mono"
                  />
                  <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'photo')} />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsPhotoModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 bg-slate-800">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-xs font-bold bg-pink-600 hover:bg-pink-500 text-white flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Save Photo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-black text-white">{editingVideo ? 'Edit Video' : 'Add Video Broadcast'}</h3>
              <button onClick={() => setIsVideoModalOpen(false)} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveVideo} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Video Title (English) *</label>
                <input
                  type="text"
                  required
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="e.g. 36th State Championship Rink Sprint Finals"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Hindi Title / हिंदी शीर्षक</label>
                <input
                  type="text"
                  value={videoForm.hindiTitle}
                  onChange={(e) => setVideoForm({ ...videoForm, hindiTitle: e.target.value })}
                  placeholder="e.g. 36वीं राज्य चैंपियनशिप रिंक स्प्रिंट फाइनल"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">YouTube / Video Streaming URL *</label>
                <input
                  type="url"
                  required
                  value={videoForm.videoUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-red-500 outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={videoForm.category}
                    onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                    placeholder="Championship Finals"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-red-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Duration</label>
                  <input
                    type="text"
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                    placeholder="12:45"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-red-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Thumbnail Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={videoForm.thumbnailUrl}
                    onChange={(e) => setVideoForm({ ...videoForm, thumbnailUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-red-500 outline-none font-mono"
                  />
                  <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'videoThumb')} />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsVideoModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 bg-slate-800">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Publish Video</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
