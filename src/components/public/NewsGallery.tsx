import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Download, 
  Calendar, 
  MapPin, 
  Search, 
  ExternalLink, 
  Sparkles, 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize2, 
  Eye, 
  Shield, 
  Award, 
  CheckCircle2, 
  Printer, 
  Layers, 
  Video,
  ArrowRight,
  Radio,
  Tag,
  Building2,
  Share2,
  Check,
  Clock,
  Tv,
  Film,
  Flame,
  Volume2,
  ListVideo,
  BookmarkCheck
} from 'lucide-react';
import { Announcement, GalleryItem } from '../../types';
import { api } from '../../services/api';
import { CURRENT_SEASON } from '../../config/season';
import { UPRSA_INFO } from '../../data/uprsaKnowledge';

// Extended circular interface for rich official display
export interface ExtendedAnnouncement extends Omit<Announcement, 'category'> {
  category: 'Championship' | 'Circular' | 'Results' | 'General' | string;
  hindiTitle?: string;
  circularNumber?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  pdfUrl?: string;
  signatory?: string;
  designation?: string;
  urgency?: 'NORMAL' | 'HIGH' | 'CRITICAL';
}

// Extended gallery item interface for albums and videos
export interface ExtendedGalleryItem extends Omit<GalleryItem, 'category'> {
  category: 'Tournaments' | 'Training' | 'Award Ceremony' | 'Speed' | 'Freestyle' | string;
  venue?: string;
  district?: string;
  description?: string;
  videoUrl?: string;
  images?: string[];
  albumCount?: number;
  highlight?: string;
}

// Dedicated Video Item interface
export interface VideoBroadcastItem {
  id: string;
  title: string;
  hindiTitle?: string;
  category: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  date: string;
  venue: string;
  district: string;
  views: number;
  featured?: boolean;
  hd?: boolean;
  description: string;
  broadcaster?: string;
  chapters?: { time: string; title: string }[];
}

export const NewsGallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'circulars' | 'gallery' | 'videos'>('circulars');
  const [announcements, setAnnouncements] = useState<ExtendedAnnouncement[]>([]);
  const [gallery, setGallery] = useState<ExtendedGalleryItem[]>([]);
  const [videos, setVideos] = useState<VideoBroadcastItem[]>(fallbackVideos);
  const [search, setSearch] = useState('');
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>('ALL PHOTOS');
  const [selectedVideoCategory, setSelectedVideoCategory] = useState<string>('ALL VIDEOS');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [lightboxData, setLightboxData] = useState<{
    images: string[];
    currentIndex: number;
    title: string;
    category?: string;
    date?: string;
    venue?: string;
    district?: string;
  } | null>(null);

  const [selectedAlbum, setSelectedAlbum] = useState<ExtendedGalleryItem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoBroadcastItem | { title: string; videoUrl: string; venue?: string; date?: string; description?: string; chapters?: { time: string; title: string }[] } | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<ExtendedAnnouncement | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeVideoChapter, setActiveVideoChapter] = useState<string>('');

  // Load content from API with fallback
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const res = await api.getContentAll();
      if (res.success && res.data) {
        if (res.data.announcements && res.data.announcements.length > 0) {
          setAnnouncements(res.data.announcements as ExtendedAnnouncement[]);
        } else {
          setAnnouncements(fallbackAnnouncements);
        }

        if (res.data.gallery && res.data.gallery.length > 0) {
          setGallery(res.data.gallery as ExtendedGalleryItem[]);
          // Extract any videos present in gallery items too
          const extractedVideos = (res.data.gallery as ExtendedGalleryItem[])
            .filter(item => item.videoUrl)
            .map((item, idx) => ({
              id: `api-vid-${idx}`,
              title: item.title,
              category: item.category || 'STATE CHAMPIONSHIP',
              videoUrl: item.videoUrl!,
              thumbnailUrl: item.imageUrl,
              duration: '15:30',
              date: item.date || '2026-01-20',
              venue: item.venue || 'UP State Arena',
              district: item.district || 'Lucknow',
              views: 2400 + idx * 350,
              description: item.description || 'Official championship race coverage and state selection trials video.',
              broadcaster: 'UPRSA Media Cell'
            }));
          
          if (extractedVideos.length > 0) {
            setVideos([...extractedVideos, ...fallbackVideos]);
          } else {
            setVideos(fallbackVideos);
          }
        } else {
          setGallery(fallbackGallery);
          setVideos(fallbackVideos);
        }
      } else {
        setAnnouncements(fallbackAnnouncements);
        setGallery(fallbackGallery);
        setVideos(fallbackVideos);
      }
    } catch (e) {
      console.error('Failed to load news & gallery from API, using official repository:', e);
      setAnnouncements(fallbackAnnouncements);
      setGallery(fallbackGallery);
      setVideos(fallbackVideos);
    } finally {
      setLoading(false);
    }
  };

  // Keyboard controls for Lightbox
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!lightboxData) return;
    if (e.key === 'Escape') {
      setLightboxData(null);
    } else if (e.key === 'ArrowLeft') {
      setLightboxData(prev => {
        if (!prev) return null;
        const nextIdx = (prev.currentIndex - 1 + prev.images.length) % prev.images.length;
        return { ...prev, currentIndex: nextIdx };
      });
    } else if (e.key === 'ArrowRight') {
      setLightboxData(prev => {
        if (!prev) return null;
        const nextIdx = (prev.currentIndex + 1) % prev.images.length;
        return { ...prev, currentIndex: nextIdx };
      });
    }
  }, [lightboxData]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Gallery Categories matching prompt specifications
  const galleryCategories = [
    'ALL PHOTOS',
    'SPEED RACING',
    'ARTISTIC SKATING',
    'AWARD CEREMONIES',
    'TRAINING CAMPS',
    'INLINE FREESTYLE',
    'STATE CHAMPIONSHIP'
  ];

  // Video Categories
  const videoCategories = [
    'ALL VIDEOS',
    'CHAMPIONSHIP FINALS',
    'SPEED RACING',
    'ARTISTIC ROUTINES',
    'FREESTYLE SLALOM',
    'COACHING & MASTERCLASSES',
    'AWARDS & FELICITATION'
  ];

  // Category normalization helper for robust filtering
  const normalizeCategory = (cat: string = ''): string => {
    const c = cat.toUpperCase();
    if (c.includes('SPEED') || c.includes('RACE') || c.includes('TRACK')) return 'SPEED RACING';
    if (c.includes('ARTISTIC') || c.includes('DANCE') || c.includes('FIGURE')) return 'ARTISTIC SKATING';
    if (c.includes('AWARD') || c.includes('MEDAL') || c.includes('FELICITATION') || c.includes('CEREMONY')) return 'AWARD CEREMONIES';
    if (c.includes('CAMP') || c.includes('TRAIN') || c.includes('COACHING') || c.includes('SELECTION')) return 'TRAINING CAMPS';
    if (c.includes('FREESTYLE') || c.includes('SLALOM') || c.includes('BATTLE')) return 'INLINE FREESTYLE';
    if (c.includes('STATE') || c.includes('CHAMPIONSHIP') || c.includes('TOURNAMENT') || c.includes('NATIONAL')) return 'STATE CHAMPIONSHIP';
    return 'STATE CHAMPIONSHIP';
  };

  const normalizeVideoCategory = (cat: string = ''): string => {
    const c = cat.toUpperCase();
    if (c.includes('FINAL') || c.includes('CHAMPIONSHIP')) return 'CHAMPIONSHIP FINALS';
    if (c.includes('SPEED') || c.includes('RACE') || c.includes('SPRINT')) return 'SPEED RACING';
    if (c.includes('ARTISTIC') || c.includes('DANCE') || c.includes('FIGURE')) return 'ARTISTIC ROUTINES';
    if (c.includes('FREESTYLE') || c.includes('SLALOM') || c.includes('BATTLE')) return 'FREESTYLE SLALOM';
    if (c.includes('COACH') || c.includes('MASTER') || c.includes('TRAIN') || c.includes('CAMP')) return 'COACHING & MASTERCLASSES';
    if (c.includes('AWARD') || c.includes('FELICITATION') || c.includes('CEREMONY')) return 'AWARDS & FELICITATION';
    return 'CHAMPIONSHIP FINALS';
  };

  // Filtered Circulars
  const filteredAnnouncements = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return announcements;
    return announcements.filter(item => 
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.hindiTitle && item.hindiTitle.toLowerCase().includes(q)) ||
      (item.content && item.content.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.circularNumber && item.circularNumber.toLowerCase().includes(q))
    );
  }, [announcements, search]);

  // Filtered Gallery Items
  const filteredGallery = useMemo(() => {
    const q = search.trim().toLowerCase();
    return gallery.filter(item => {
      const normCat = normalizeCategory(item.category);
      const matchesCategory = selectedGalleryCategory === 'ALL PHOTOS' || 
        normCat === selectedGalleryCategory || 
        item.category?.toUpperCase() === selectedGalleryCategory;

      if (!matchesCategory) return false;
      if (!q) return true;

      return (
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.venue && item.venue.toLowerCase().includes(q)) ||
        (item.district && item.district.toLowerCase().includes(q)) ||
        (item.tournamentName && item.tournamentName.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
      );
    });
  }, [gallery, selectedGalleryCategory, search]);

  // Filtered Video Items
  const filteredVideos = useMemo(() => {
    const q = search.trim().toLowerCase();
    return videos.filter(item => {
      const normCat = normalizeVideoCategory(item.category);
      const matchesCategory = selectedVideoCategory === 'ALL VIDEOS' || 
        normCat === selectedVideoCategory || 
        item.category?.toUpperCase() === selectedVideoCategory;

      if (!matchesCategory) return false;
      if (!q) return true;

      return (
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.hindiTitle && item.hindiTitle.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.venue && item.venue.toLowerCase().includes(q)) ||
        (item.district && item.district.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
      );
    });
  }, [videos, selectedVideoCategory, search]);

  // Featured Video
  const featuredVideo = useMemo(() => {
    return videos.find(v => v.featured) || videos[0];
  }, [videos]);

  // Lightbox Openers
  const openSingleImageLightbox = (item: ExtendedGalleryItem) => {
    const images = item.images && item.images.length > 0 ? item.images : [item.imageUrl];
    setLightboxData({
      images,
      currentIndex: 0,
      title: item.title,
      category: item.category,
      date: item.date,
      venue: item.venue,
      district: item.district
    });
  };

  const openAlbumPhotoLightbox = (album: ExtendedGalleryItem, photoIndex: number) => {
    const images = album.images && album.images.length > 0 ? album.images : [album.imageUrl];
    setLightboxData({
      images,
      currentIndex: photoIndex,
      title: `${album.title} (Photo ${photoIndex + 1})`,
      category: album.category,
      date: album.date,
      venue: album.venue,
      district: album.district
    });
  };

  const handleShareNotice = (notice: ExtendedAnnouncement) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#circular-${notice.id}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleShareVideo = (video: VideoBroadcastItem) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#video-${video.id}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ====================================================
            1. PAGE HEADER (Centered Premium Official Header)
        ==================================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/15 text-amber-300 px-4 py-1.5 rounded-full border border-amber-500/30 text-xs font-black uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>MEDIA, CIRCULARS & VIDEO BROADCAST DESK</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            OFFICIAL CIRCULARS, PHOTOS & VIDEOS
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            Download sanctioned state circulars, explore photo galleries from 75 districts, and watch official high-definition championship race broadcasts and masterclasses.
          </p>
        </div>

        {/* ====================================================
            2. MAIN SECTION SWITCHER (3 Large Professional Tabs)
        ==================================================== */}
        <div className="flex justify-center">
          <div className="bg-[#0b1329] border border-blue-900/50 p-1.5 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-1.5 max-w-3xl w-full shadow-2xl backdrop-blur-md">
            
            {/* TAB 1: CIRCULARS */}
            <button
              onClick={() => {
                setActiveTab('circulars');
                setSearch('');
              }}
              className={`py-3.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider ${
                activeTab === 'circulars'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-[1.01]'
                  : 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <FileText className={`w-4 h-4 shrink-0 ${activeTab === 'circulars' ? 'text-slate-950' : 'text-amber-400'}`} />
              <span className="truncate">CIRCULARS ({announcements.length})</span>
            </button>

            {/* TAB 2: PHOTO GALLERY */}
            <button
              onClick={() => {
                setActiveTab('gallery');
                setSearch('');
              }}
              className={`py-3.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider ${
                activeTab === 'gallery'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-[1.01]'
                  : 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <ImageIcon className={`w-4 h-4 shrink-0 ${activeTab === 'gallery' ? 'text-slate-950' : 'text-amber-400'}`} />
              <span className="truncate">PHOTOS ({gallery.length})</span>
            </button>

            {/* TAB 3: VIDEOS (Prominent Option with LIVE/VIDEO badge) */}
            <button
              onClick={() => {
                setActiveTab('videos');
                setSearch('');
              }}
              className={`py-3.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider relative ${
                activeTab === 'videos'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 scale-[1.01]'
                  : 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Film className={`w-4 h-4 shrink-0 ${activeTab === 'videos' ? 'text-white' : 'text-red-400'}`} />
              <span className="truncate">VIDEOS & REPLAYS ({videos.length})</span>
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping absolute top-2.5 right-2.5 hidden sm:inline-block"></span>
            </button>

          </div>
        </div>

        {/* ====================================================
            3. TAB 1: OFFICIAL CIRCULARS & NOTICES
        ==================================================== */}
        {activeTab === 'circulars' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Circulars Search & Status Bar */}
            <div className="bg-[#0b1329] border border-blue-900/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Official State Directorate Gazettes & Orders
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sanctioned under the authority of Uttar Pradesh Roller Sports Association ({CURRENT_SEASON})
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search circulars by keyword or number..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
                {search && (
                  <button 
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Skeleton Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(idx => (
                  <div key={idx} className="bg-[#0b1329] border border-blue-900/40 rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-60 bg-slate-900/80" />
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-slate-800 rounded w-1/3" />
                      <div className="h-6 bg-slate-800 rounded w-3/4" />
                      <div className="h-4 bg-slate-800 rounded w-full" />
                      <div className="h-4 bg-slate-800 rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredAnnouncements.length === 0 ? (
              /* Empty State */
              <div className="bg-[#0b1329] border border-blue-900/50 rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <FileText className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-black text-white">No circulars match your search</h4>
                <p className="text-xs text-slate-400">
                  Try adjusting your search keywords or clear the search bar to view all official state notices.
                </p>
                <button
                  onClick={() => setSearch('')}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              /* 2-Column Clean Circular Cards Grid */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAnnouncements.map((item) => {
                  const categoryBadge = getCircularCategoryBadge(item.category);
                  const displayImage = item.imageUrl || defaultCircularImages[item.id % defaultCircularImages.length] || defaultCircularImages[0];
                  
                  return (
                    <div
                      key={item.id}
                      id={`circular-${item.id}`}
                      className="bg-[#0b1329] border border-blue-900/50 hover:border-amber-500/60 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                    >
                      <div>
                        {/* Top: Large Thumbnail Image Area */}
                        <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-950">
                          <img
                            src={displayImage}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = defaultCircularImages[0];
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          
                          {/* Dark Vignette Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1329] via-transparent to-black/60 pointer-events-none" />

                          {/* Top Left: Category Badge */}
                          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                            <span className={`text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider shadow-md ${categoryBadge.className}`}>
                              {categoryBadge.label}
                            </span>
                            {item.isImportant && (
                              <span className="text-[10px] font-black bg-red-600/90 text-white px-2.5 py-1 rounded-md uppercase tracking-wider border border-red-500 shadow-md flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                                <span>CRITICAL NOTICE</span>
                              </span>
                            )}
                          </div>

                          {/* Top Right: Date Badge */}
                          <div className="absolute top-4 right-4 z-10">
                            <div className="bg-slate-950/85 backdrop-blur-md text-amber-300 text-[11px] font-mono font-bold px-3 py-1 rounded-lg border border-slate-700/80 shadow-md flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-amber-400" />
                              <span>{item.date}</span>
                            </div>
                          </div>

                          {/* Bottom Image Overlay: Circular Reference Code */}
                          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-300">
                            <span className="font-mono bg-slate-950/90 px-2.5 py-0.5 rounded border border-slate-800 text-amber-300 font-semibold">
                              {item.circularNumber || `UPRSA/CIR/${CURRENT_SEASON.replace('–', '-')}/${item.id.replace(/\D/g, '').padStart(3, '0') || '042'}`}
                            </span>
                          </div>
                        </div>

                        {/* Card Content Padding */}
                        <div className="p-6 space-y-3">
                          {/* Hindi Title (if available) */}
                          {item.hindiTitle && (
                            <h4 className="text-xs font-semibold text-amber-400 font-sans tracking-wide">
                              {item.hindiTitle}
                            </h4>
                          )}

                          {/* Main Title */}
                          <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                            {item.title}
                          </h3>

                          {/* Short Description */}
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 font-normal">
                            {item.content || item.description || 'Official communication published by the State Executive Board of the Uttar Pradesh Roller Sports Association for affiliated athletes, coaches, and district general secretaries.'}
                          </p>

                          {/* Signatory Metadata */}
                          <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
                            <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Issued by: <strong className="text-slate-200">{item.signatory || 'General Secretariat, UPRSA'}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action Buttons */}
                      <div className="p-6 pt-0 border-t border-slate-800/80 mt-4 flex flex-wrap items-center justify-between gap-3">
                        <button
                          onClick={() => setSelectedNotice(item)}
                          className="text-xs font-black text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer group/btn"
                        >
                          <span>READ FULL NOTICE</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleShareNotice(item)}
                            title="Share Notice"
                            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800 transition-colors cursor-pointer"
                          >
                            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                          </button>

                          <a
                            href={item.pdfUrl || item.fileUrl || `/circulars/sample-circular-${item.id}.pdf`}
                            download={`UPRSA-Circular-${item.id}.pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              if (!item.pdfUrl && !item.fileUrl) {
                                e.preventDefault();
                                setSelectedNotice(item);
                              }
                            }}
                            className="bg-slate-900 hover:bg-slate-800 text-slate-100 hover:text-amber-400 font-bold px-4 py-2 rounded-xl text-xs border border-slate-700/80 hover:border-amber-500/40 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5 text-amber-400" />
                            <span>PDF CIRCULAR</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ====================================================
            4. TAB 2: PHOTOS & ACTIVE GALLERY
        ==================================================== */}
        {activeTab === 'gallery' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Filter & Search Bar Row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0b1329] border border-blue-900/50 p-4 rounded-2xl shadow-xl">
              
              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 lg:pb-0 w-full lg:w-auto">
                {galleryCategories.map((cat) => {
                  const isActive = selectedGalleryCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedGalleryCategory(cat)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                          : 'bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Gallery Search Box */}
              <div className="relative w-full lg:w-72 shrink-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search album & photos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
                {search && (
                  <button 
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

            </div>

            {/* Quick banner to switch to videos */}
            <div className="bg-gradient-to-r from-red-950/50 via-slate-900 to-[#0b1329] border border-red-900/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
                  <Film className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                    Looking for High-Definition Race Videos & Replays?
                  </h4>
                  <p className="text-xs text-slate-400">
                    Watch official 200m banked track finals, freestyle battles, and state selection trial recordings.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTab('videos');
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="bg-red-600 hover:bg-red-500 text-white font-black px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/20 shrink-0 transition-all uppercase tracking-wider"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Open Video Replays ({videos.length})</span>
              </button>
            </div>

            {/* Skeleton Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div key={idx} className="bg-[#0b1329] border border-blue-900/40 rounded-2xl overflow-hidden animate-pulse">
                    <div className="aspect-video bg-slate-900" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-slate-800 rounded w-1/3" />
                      <div className="h-5 bg-slate-800 rounded w-3/4" />
                      <div className="h-3 bg-slate-800 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredGallery.length === 0 ? (
              /* Empty State */
              <div className="bg-[#0b1329] border border-blue-900/50 rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-black text-white">No photos available in this category yet.</h4>
                <p className="text-xs text-slate-400">
                  Try selecting another category like 'ALL PHOTOS' or adjusting your search keywords.
                </p>
                <button
                  onClick={() => {
                    setSelectedGalleryCategory('ALL PHOTOS');
                    setSearch('');
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-colors"
                >
                  View All Photos
                </button>
              </div>
            ) : (
              /* 3-Column Gallery Grid on Desktop */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGallery.map((item) => {
                  const categoryBadge = getGalleryCategoryBadge(item.category);
                  const hasVideo = Boolean(item.videoUrl);
                  const hasMultiplePhotos = Boolean(item.images && item.images.length > 1) || Boolean(item.albumCount && item.albumCount > 1);
                  const photoCount = item.images?.length || item.albumCount || 1;

                  return (
                    <div
                      key={item.id}
                      className="bg-[#0b1329] border border-blue-900/50 hover:border-amber-500/60 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                    >
                      <div>
                        {/* Aspect Ratio 16/9 Image Presentation */}
                        <div className="relative aspect-video overflow-hidden bg-slate-950">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80';
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />

                          {/* Subtle dark gradient overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1329] via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                          {/* Top Left: Category Badge */}
                          <div className="absolute top-3 left-3 z-10">
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md ${categoryBadge.className}`}>
                              {categoryBadge.label}
                            </span>
                          </div>

                          {/* Top Right: Multi-photo badge or Video Badge */}
                          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                            {hasVideo && (
                              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1">
                                <Play className="w-2.5 h-2.5 fill-current" />
                                <span>VIDEO</span>
                              </span>
                            )}
                            {hasMultiplePhotos && (
                              <span className="bg-slate-950/80 backdrop-blur-xs text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                                <Layers className="w-3 h-3" />
                                <span>{photoCount} Photos</span>
                              </span>
                            )}
                          </div>

                          {/* Hover Overlay Button to trigger instant View Photo */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                            <button
                              onClick={() => openSingleImageLightbox(item)}
                              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xl transition-transform hover:scale-105 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>VIEW PHOTO</span>
                            </button>
                          </div>
                        </div>

                        {/* Gallery Card Content */}
                        <div className="p-5 space-y-2.5">
                          {/* Date and Venue */}
                          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-amber-400" />
                              <span>{item.date}</span>
                            </div>
                            {item.district && (
                              <span className="bg-blue-950 text-blue-300 px-2 py-0.5 rounded font-sans text-[10px] font-bold border border-blue-800/80">
                                {item.district}
                              </span>
                            )}
                          </div>

                          {/* Album / Event Title */}
                          <h3 className="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors leading-snug">
                            {item.title}
                          </h3>

                          {/* Short Description */}
                          {item.description && (
                            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                              {item.description}
                            </p>
                          )}

                          {/* Venue Location */}
                          {item.venue && (
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className="truncate">{item.venue}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="p-5 pt-0 border-t border-slate-800/80 mt-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openSingleImageLightbox(item)}
                            className="text-xs font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/80 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3 text-amber-400" />
                            <span>VIEW PHOTO</span>
                          </button>

                          {hasVideo && (
                            <button
                              onClick={() => setSelectedVideo({
                                title: item.title,
                                videoUrl: item.videoUrl!,
                                venue: item.venue,
                                date: item.date,
                                description: item.description
                              })}
                              className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/50 px-3 py-1.5 rounded-lg border border-red-800/60 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>WATCH VIDEO</span>
                            </button>
                          )}
                        </div>

                        {hasMultiplePhotos && (
                          <button
                            onClick={() => setSelectedAlbum(item)}
                            className="text-xs font-black text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer group/btn"
                          >
                            <span>FULL ALBUM</span>
                            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ====================================================
            5. TAB 3: VIDEOS & REPLAYS (Dedicated Video Option)
        ==================================================== */}
        {activeTab === 'videos' && (
          <div className="space-y-10 animate-fadeIn">
            
            {/* Featured Video Spotlight Card */}
            {featuredVideo && !search && selectedVideoCategory === 'ALL VIDEOS' && (
              <div className="bg-[#0b1329] border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  
                  {/* Video Stage / Cover */}
                  <div className="lg:col-span-7 relative aspect-video bg-black overflow-hidden group">
                    <img
                      src={featuredVideo.thumbnailUrl}
                      alt={featuredVideo.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

                    {/* Featured Badges */}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                      <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-md uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                        <span>FEATURED MATCH BROADCAST</span>
                      </span>
                      {featuredVideo.hd && (
                        <span className="bg-slate-900/90 text-amber-300 text-xs font-mono font-bold px-2.5 py-1 rounded-md border border-slate-700">
                          HD 1080p
                        </span>
                      )}
                    </div>

                    {/* Large Center Play Button */}
                    <button
                      onClick={() => setSelectedVideo(featuredVideo)}
                      className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer border-2 border-white/80 group-hover:shadow-red-600/50"
                    >
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </button>

                    {/* Bottom overlay: duration & view count */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white font-mono">
                      <span className="bg-black/80 px-2.5 py-1 rounded border border-white/20 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Duration: {featuredVideo.duration}</span>
                      </span>
                      <span className="bg-black/80 px-2.5 py-1 rounded border border-white/20 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{featuredVideo.views.toLocaleString()} Views</span>
                      </span>
                    </div>
                  </div>

                  {/* Video Details & Meta */}
                  <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-gradient-to-b from-[#0b1329] to-[#070d18]">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
                          {featuredVideo.category}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{featuredVideo.date}</span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                        {featuredVideo.title}
                      </h2>

                      {featuredVideo.hindiTitle && (
                        <p className="text-xs text-amber-300/90 font-medium">
                          {featuredVideo.hindiTitle}
                        </p>
                      )}

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {featuredVideo.description}
                      </p>

                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Venue: <strong className="text-white">{featuredVideo.venue}, {featuredVideo.district}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Tv className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Telecast by: <strong className="text-white">{featuredVideo.broadcaster || 'UPRSA Official Media Channel'}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                      <button
                        onClick={() => setSelectedVideo(featuredVideo)}
                        className="flex-1 bg-red-600 hover:bg-red-500 text-white font-black py-3 px-5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>PLAY FULL BROADCAST</span>
                      </button>

                      <button
                        onClick={() => handleShareVideo(featuredVideo)}
                        title="Share Video"
                        className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 rounded-xl border border-slate-700 transition-colors cursor-pointer"
                      >
                        {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Video Filters & Search Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0b1329] border border-blue-900/50 p-4 rounded-2xl shadow-xl">
              
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 lg:pb-0 w-full lg:w-auto">
                {videoCategories.map((cat) => {
                  const isActive = selectedVideoCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedVideoCategory(cat)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider ${
                        isActive
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/20 font-black'
                          : 'bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Video Search Box */}
              <div className="relative w-full lg:w-72 shrink-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search video broadcasts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                />
                {search && (
                  <button 
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

            </div>

            {/* Videos Grid */}
            {filteredVideos.length === 0 ? (
              <div className="bg-[#0b1329] border border-blue-900/50 rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Film className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-black text-white">No video broadcasts match your filter</h4>
                <p className="text-xs text-slate-400">
                  Try switching to 'ALL VIDEOS' or clearing your search term.
                </p>
                <button
                  onClick={() => {
                    setSelectedVideoCategory('ALL VIDEOS');
                    setSearch('');
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-colors"
                >
                  View All Videos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((item) => (
                  <div
                    key={item.id}
                    id={`video-${item.id}`}
                    className="bg-[#0b1329] border border-blue-900/50 hover:border-red-500/60 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                  >
                    <div>
                      {/* Video Thumbnail Stage */}
                      <div className="relative aspect-video overflow-hidden bg-black">
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1329] via-black/30 to-transparent pointer-events-none" />

                        {/* Top Left: Category Badge */}
                        <div className="absolute top-3 left-3 z-10">
                          <span className="text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md bg-red-600 text-white">
                            {item.category}
                          </span>
                        </div>

                        {/* Top Right: HD Badge */}
                        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                          {item.hd && (
                            <span className="bg-black/80 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-white/20">
                              HD
                            </span>
                          )}
                        </div>

                        {/* Center Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                          <button
                            onClick={() => setSelectedVideo(item)}
                            className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-xl transition-transform group-hover:scale-110 cursor-pointer border border-white/60"
                          >
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </button>
                        </div>

                        {/* Bottom Thumbnail Bar: Duration and Views */}
                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-white">
                          <span className="bg-black/80 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>{item.duration}</span>
                          </span>
                          <span className="bg-black/80 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
                            <Eye className="w-3 h-3 text-emerald-400" />
                            <span>{item.views.toLocaleString()}</span>
                          </span>
                        </div>
                      </div>

                      {/* Video Content */}
                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-amber-400" />
                            <span>{item.date}</span>
                          </div>
                          {item.district && (
                            <span className="bg-blue-950 text-blue-300 px-2 py-0.5 rounded font-sans text-[10px] font-bold border border-blue-800/80">
                              {item.district}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-extrabold text-white group-hover:text-red-400 transition-colors leading-snug">
                          {item.title}
                        </h3>

                        {item.hindiTitle && (
                          <p className="text-[11px] text-amber-300/80 line-clamp-1">
                            {item.hindiTitle}
                          </p>
                        )}

                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>

                        {item.venue && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">{item.venue}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Video Card Footer */}
                    <div className="p-5 pt-0 border-t border-slate-800/80 mt-3 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedVideo(item)}
                        className="text-xs font-black text-red-400 hover:text-red-300 flex items-center gap-1.5 cursor-pointer py-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>WATCH REPLAY</span>
                      </button>

                      <button
                        onClick={() => handleShareVideo(item)}
                        title="Share Video Link"
                        className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

      {/* ====================================================
          6. PHOTO LIGHTBOX MODAL (Prompt #12 Requirement)
      ==================================================== */}
      {lightboxData && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fadeIn">
          
          {/* Lightbox Top Bar */}
          <div className="flex items-center justify-between text-white max-w-7xl mx-auto w-full pb-3 border-b border-slate-800">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded uppercase">
                  {lightboxData.category || 'UPRSA GALLERY'}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Photo {lightboxData.currentIndex + 1} of {lightboxData.images.length}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white truncate max-w-2xl">
                {lightboxData.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-xs text-slate-400">
                Use <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">←</kbd> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">→</kbd> or <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">ESC</kbd>
              </span>
              <button
                onClick={() => setLightboxData(null)}
                className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-center border border-slate-700 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Center Image Stage */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {lightboxData.images.length > 1 && (
              <button
                onClick={() => setLightboxData(prev => {
                  if (!prev) return null;
                  const nextIdx = (prev.currentIndex - 1 + prev.images.length) % prev.images.length;
                  return { ...prev, currentIndex: nextIdx };
                })}
                className="absolute left-2 sm:left-6 z-20 w-12 h-12 rounded-full bg-slate-950/80 hover:bg-amber-500 hover:text-slate-950 text-white flex items-center justify-center border border-slate-700 shadow-2xl transition-all cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <div className="max-w-5xl max-h-[75vh] flex items-center justify-center select-none">
              <img
                src={lightboxData.images[lightboxData.currentIndex]}
                alt={lightboxData.title}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300"
              />
            </div>

            {lightboxData.images.length > 1 && (
              <button
                onClick={() => setLightboxData(prev => {
                  if (!prev) return null;
                  const nextIdx = (prev.currentIndex + 1) % prev.images.length;
                  return { ...prev, currentIndex: nextIdx };
                })}
                className="absolute right-2 sm:right-6 z-20 w-12 h-12 rounded-full bg-slate-950/80 hover:bg-amber-500 hover:text-slate-950 text-white flex items-center justify-center border border-slate-700 shadow-2xl transition-all cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Bottom Metadata Bar */}
          <div className="max-w-7xl mx-auto w-full pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              {lightboxData.date && (
                <span className="flex items-center gap-1.5 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lightboxData.date}</span>
                </span>
              )}
              {lightboxData.venue && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lightboxData.venue}</span>
                </span>
              )}
            </div>

            <div className="text-[11px] text-slate-500">
              Uttar Pradesh Roller Sports Association • Official Sports Photography
            </div>
          </div>

        </div>
      )}

      {/* ====================================================
          7. FULL PHOTO ALBUM MODAL
      ==================================================== */}
      {selectedAlbum && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-[#0b1329] border border-blue-900/60 rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Album Modal Header */}
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded uppercase">
                    {selectedAlbum.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {selectedAlbum.images?.length || 1} Total Photos
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {selectedAlbum.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-medium pt-1">
                  <span className="flex items-center gap-1 font-mono text-amber-300">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    {selectedAlbum.date}
                  </span>
                  {selectedAlbum.venue && (
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {selectedAlbum.venue}, {selectedAlbum.district}
                    </span>
                  )}
                </div>
                {selectedAlbum.description && (
                  <p className="text-xs text-slate-400 pt-1 leading-relaxed">
                    {selectedAlbum.description}
                  </p>
                )}
              </div>

              <button
                onClick={() => setSelectedAlbum(null)}
                className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-center border border-slate-700 cursor-pointer transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Album Photos Grid */}
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {(selectedAlbum.images && selectedAlbum.images.length > 0 ? selectedAlbum.images : [selectedAlbum.imageUrl]).map((imgUrl, pIdx) => (
                  <div
                    key={pIdx}
                    onClick={() => openAlbumPhotoLightbox(selectedAlbum, pIdx)}
                    className="group relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-amber-500 cursor-pointer transition-all shadow-md"
                  >
                    <img
                      src={imgUrl}
                      alt={`${selectedAlbum.title} - Photo ${pIdx + 1}`}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye className="w-5 h-5 text-amber-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Album Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Click on any thumbnail to open high-resolution photo viewer</span>
              <button
                onClick={() => setSelectedAlbum(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer transition-colors"
              >
                Close Album
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ====================================================
          8. WATCH VIDEO THEATER MODAL (Full Interactive Player)
      ==================================================== */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-[#0b1329] border border-blue-900/80 rounded-3xl max-w-5xl w-full max-h-[94vh] flex flex-col overflow-hidden shadow-2xl space-y-0">
            
            {/* Video Header */}
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded uppercase">
                    UPRSA VIDEO BROADCAST
                  </span>
                  {selectedVideo.date && (
                    <span className="text-xs font-mono text-slate-400">{selectedVideo.date}</span>
                  )}
                  {('views' in selectedVideo) && (
                    <span className="text-xs font-mono text-emerald-400">
                      • {(selectedVideo as VideoBroadcastItem).views?.toLocaleString()} Views
                    </span>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white mt-1 line-clamp-1">
                  {selectedVideo.title}
                </h3>
              </div>

              <button
                onClick={() => {
                  setSelectedVideo(null);
                  setActiveVideoChapter('');
                }}
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-center border border-slate-700 cursor-pointer transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Stage */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              {selectedVideo.videoUrl.includes('youtube.com') || selectedVideo.videoUrl.includes('youtu.be') ? (
                <iframe
                  src={getYoutubeEmbedUrl(selectedVideo.videoUrl)}
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={selectedVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                >
                  Your browser does not support video playback.
                </video>
              )}
            </div>

            {/* Video Details & Timestamps */}
            <div className="p-5 bg-slate-950 overflow-y-auto max-h-48 space-y-4 text-xs text-slate-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-4">
                  {selectedVideo.venue && (
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{selectedVideo.venue}</span>
                    </span>
                  )}
                  {('duration' in selectedVideo) && (
                    <span className="flex items-center gap-1 text-slate-300 font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{(selectedVideo as VideoBroadcastItem).duration}</span>
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-400">
                  Broadcasted under the authority of Uttar Pradesh Roller Sports Association
                </div>
              </div>

              {/* Description */}
              {selectedVideo.description && (
                <p className="leading-relaxed text-slate-300">
                  {selectedVideo.description}
                </p>
              )}

              {/* Chapters / Timeline Bookmarks (if available) */}
              {selectedVideo.chapters && selectedVideo.chapters.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                    <ListVideo className="w-3.5 h-3.5" />
                    <span>Race Chapters & Key Timestamps</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedVideo.chapters.map((ch, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => setActiveVideoChapter(ch.time)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer border ${
                          activeVideoChapter === ch.time
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                        }`}
                      >
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{ch.time}</span>
                        <span className="font-sans font-medium">{ch.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Video Footer */}
            <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="truncate">UPRSA Media Cell • Official Video Archive ({CURRENT_SEASON})</span>
              <button
                onClick={() => {
                  setSelectedVideo(null);
                  setActiveVideoChapter('');
                }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 rounded-xl text-xs cursor-pointer transition-colors uppercase tracking-wider"
              >
                Close Player
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ====================================================
          9. READ FULL NOTICE MODAL (Gazette Format)
      ==================================================== */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-[#0b1329] border border-blue-900/70 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl text-slate-100">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded uppercase font-mono">
                    {selectedNotice.category || 'OFFICIAL CIRCULAR'}
                  </span>
                  <span className="text-xs font-mono text-amber-300 font-bold bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
                    {selectedNotice.circularNumber || `UPRSA/CIR/${CURRENT_SEASON.replace('–', '-')}/${selectedNotice.id.replace(/\D/g, '').padStart(3, '0') || '042'}`}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {selectedNotice.title}
                </h3>
                {selectedNotice.hindiTitle && (
                  <h4 className="text-xs text-amber-400 font-medium">
                    {selectedNotice.hindiTitle}
                  </h4>
                )}
              </div>

              <button
                onClick={() => setSelectedNotice(null)}
                className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-center border border-slate-700 cursor-pointer transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Gazette Document Style */}
            <div className="p-6 sm:p-8 overflow-y-auto max-h-[60vh] space-y-6 bg-[#070d18] text-sm text-slate-200 leading-relaxed">
              
              {/* Document Subheader Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">DATE OF ISSUANCE</span>
                  <strong className="text-white font-mono">{selectedNotice.date}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">COMPETITION SEASON</span>
                  <strong className="text-amber-400">{CURRENT_SEASON}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">STATUS</span>
                  <strong className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> SANCTIONED & ACTIVE
                  </strong>
                </div>
              </div>

              {/* Full Content */}
              <div className="space-y-4">
                <h5 className="text-xs font-black uppercase tracking-wider text-amber-400">
                  OFFICIAL GAZETTE MEMORANDUM
                </h5>
                <div className="p-5 bg-[#0b1329] border border-blue-900/40 rounded-2xl whitespace-pre-wrap font-sans text-slate-200 text-xs sm:text-sm leading-relaxed space-y-3">
                  {selectedNotice.content || selectedNotice.description || (
                    <p>
                      This official circular is hereby issued by the State Executive Committee of the Uttar Pradesh Roller Sports Association (UPRSA) for immediate notification and compliance by all 75 District Roller Sports Associations, affiliated clubs, academies, coaches, and registered skaters.
                    </p>
                  )}
                  <p className="pt-2 text-xs text-slate-300">
                    All participants must ensure their RSFI and UPRSA annual digital affiliation for the {CURRENT_SEASON} competition season is fully up to date before filing selection entries.
                  </p>
                </div>
              </div>

              {/* Signatory Seal */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">FOR AND ON BEHALF OF</div>
                  <div className="font-bold text-white text-xs">{UPRSA_INFO.name}</div>
                  <div className="text-[11px] text-amber-400">{selectedNotice.signatory || UPRSA_INFO.secretaryGeneral} (Secretary General)</div>
                </div>

                <div className="text-[10px] text-slate-400 font-mono text-right">
                  Affiliated to RSFI & UP Olympic Association<br />
                  Registration No: {UPRSA_INFO.regNumber}
                </div>
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => window.print()}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                <span>Print Circular</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>

                <a
                  href={selectedNotice.pdfUrl || selectedNotice.fileUrl || `/circulars/sample-circular-${selectedNotice.id}.pdf`}
                  download={`UPRSA-Circular-${selectedNotice.id}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Document</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

// ====================================================
// Category Badge Class & Label Resolvers
// ====================================================

function getCircularCategoryBadge(category: string = ''): { label: string; className: string } {
  const c = category.toUpperCase();
  if (c.includes('SELECTION') || c.includes('TRIAL')) {
    return {
      label: 'SELECTION TRIAL',
      className: 'bg-amber-500 text-slate-950 font-black'
    };
  }
  if (c.includes('CHAMPIONSHIP') || c.includes('UPDATE')) {
    return {
      label: 'CHAMPIONSHIP UPDATE',
      className: 'bg-indigo-600 text-white font-bold'
    };
  }
  if (c.includes('TEAM') || c.includes('NATIONAL')) {
    return {
      label: 'STATE TEAM',
      className: 'bg-emerald-600 text-white font-bold'
    };
  }
  if (c.includes('IMPORTANT') || c.includes('ALERT')) {
    return {
      label: 'IMPORTANT NOTICE',
      className: 'bg-red-600 text-white font-bold'
    };
  }
  return {
    label: 'OFFICIAL CIRCULAR',
    className: 'bg-blue-600 text-white font-bold'
  };
}

function getGalleryCategoryBadge(category: string = ''): { label: string; className: string } {
  const c = category.toUpperCase();
  if (c.includes('SPEED') || c.includes('RACING')) {
    return {
      label: 'SPEED RACING',
      className: 'bg-amber-500 text-slate-950 font-black'
    };
  }
  if (c.includes('ARTISTIC')) {
    return {
      label: 'ARTISTIC SKATING',
      className: 'bg-purple-600 text-white font-bold'
    };
  }
  if (c.includes('AWARD') || c.includes('CEREMONY')) {
    return {
      label: 'AWARD CEREMONY',
      className: 'bg-amber-600 text-white font-bold'
    };
  }
  if (c.includes('CAMP') || c.includes('TRAINING')) {
    return {
      label: 'TRAINING CAMP',
      className: 'bg-emerald-600 text-white font-bold'
    };
  }
  if (c.includes('FREESTYLE') || c.includes('SLALOM')) {
    return {
      label: 'INLINE FREESTYLE',
      className: 'bg-sky-500 text-slate-950 font-black'
    };
  }
  return {
    label: 'STATE CHAMPIONSHIP',
    className: 'bg-indigo-600 text-white font-bold'
  };
}

function getYoutubeEmbedUrl(url: string): string {
  try {
    if (url.includes('embed')) return url;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    return url;
  } catch {
    return url;
  }
}

// Default images for circular cards
const defaultCircularImages = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000&q=80',
  'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=1000&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1000&q=80'
];

// Fallback high-impact official circulars if database has initial minimal items
const fallbackAnnouncements: ExtendedAnnouncement[] = [
  {
    id: 'ann-01',
    title: 'Prospectus & Entry Regulations: 36th UP State Roller Skating Championship 2026',
    hindiTitle: '36वीं उत्तर प्रदेश राज्य रोलर स्केटिंग चैंपियनशिप 2026 की नियम पुस्तिका एवं प्रवेश प्रक्रिया',
    circularNumber: 'UPRSA/CIR/2026-27/001',
    date: '2026-02-15',
    category: 'Championship',
    isImportant: true,
    content: 'Official selection trials and technical rule book for the 36th UP State Roller Skating Championship across Speed (Quad/Inline), Inline Freestyle, Artistic Skating, and Roller Hockey events. Qualifying skaters will represent Team Uttar Pradesh at the 63rd National Roller Skating Championship.\n\nAll entries must be submitted through the official UPRSA online portal before October 15, 2026.',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&q=80',
    pdfUrl: '/api/files/private/prospectus-36th-state.pdf',
    signatory: 'Arun Kumar Verma (Technical Director)',
    created_at: '2026-02-15T10:00:00Z'
  },
  {
    id: 'ann-02',
    title: 'Mandatory RSFI & UPRSA Age Cut-off Regulations Updated for 2026–27 Competition Season',
    hindiTitle: 'सत्र 2026–27 हेतु आरएसएफआई एवं यूपीआरएसए की अनिवार्य आयु सीमा निर्धारण नियमावली',
    circularNumber: 'UPRSA/CIR/2026-27/002',
    date: '2026-02-10',
    category: 'Circular',
    isImportant: true,
    content: 'Pursuant to RSFI technical commission directives, age categories for all sanctioned district, zonal, and state championships have been codified for the 2026–27 season. Age calculations will strictly be evaluated as of December 31, 2026.\n\nAadhaar and municipal birth certificate verification is mandatory for all digital athlete ID issuances.',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000&q=80',
    pdfUrl: '/api/files/private/rules-rsfi-2026.pdf',
    signatory: 'Rajesh Kumar Singh (General Secretary)',
    created_at: '2026-02-10T10:00:00Z'
  },
  {
    id: 'ann-03',
    title: 'High-Performance State Speed Skating Coaching Camp Announced at LDA Stadium Rink',
    hindiTitle: 'एलडीए स्टेडियम लखनऊ में उच्च प्रदर्शन राज्य स्पीड स्केटिंग कोचिंग शिविर का आयोजन',
    circularNumber: 'UPRSA/CIR/2026-27/003',
    date: '2026-02-05',
    category: 'Circular',
    isImportant: false,
    content: 'Specialized 10-day state coaching camp for Sub-Junior, Junior, and Senior national probable athletes. The camp will focus on 200m banked track cornering techniques, aerodynamic slipstreaming, and electronic timing starts guided by NIS coaches.',
    imageUrl: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=1000&q=80',
    pdfUrl: '/api/files/private/camp-schedule-2026.pdf',
    signatory: 'Dr. Akhilesh Chandra Sharma (President)',
    created_at: '2026-02-05T10:00:00Z'
  },
  {
    id: 'ann-04',
    title: 'Sanction of Zonal Inter-District Roller Skating Leagues across UP Mandals',
    hindiTitle: 'उत्तर प्रदेश के समस्त मंडलों में क्षेत्रीय अंतर-जिला रोलर स्केटिंग लीग की आधिकारिक स्वीकृति',
    circularNumber: 'UPRSA/CIR/2026-27/004',
    date: '2026-01-28',
    category: 'Championship',
    isImportant: false,
    content: 'Sanctioning of official zonal ranking track cups in Western UP (Noida/Ghaziabad), Central UP (Lucknow/Kanpur), and Eastern UP (Varanasi/Prayagraj). Points accumulated will contribute directly to the State Annual Merit Leaderboard.',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1000&q=80',
    pdfUrl: '/api/files/private/zonal-leagues-2026.pdf',
    signatory: 'Rajesh Kumar Singh (General Secretary)',
    created_at: '2026-01-28T10:00:00Z'
  }
];

// Fallback high-quality gallery items covering all required categories
const fallbackGallery: ExtendedGalleryItem[] = [
  {
    id: 'gal-01',
    title: '36th Uttar Pradesh State Roller Skating Championship 2026',
    category: 'STATE CHAMPIONSHIP',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=80',
      'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=1200&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&q=80'
    ],
    albumCount: 24,
    date: '2026-01-20',
    venue: 'LDA Colony 200m Banked Synthetic Track',
    district: 'Lucknow',
    description: 'High-speed banked track finals, photo-finish sprints, and national selection trials with over 800 skaters from 75 districts of UP.',
    tournamentName: '36th UP State Championship',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: 'gal-02',
    title: 'State Speed Skating Banked Track Sprint Finals',
    category: 'SPEED RACING',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80'
    ],
    albumCount: 16,
    date: '2026-01-21',
    venue: 'Noida Indoor Stadium 200m Banked Track',
    district: 'Gautam Buddha Nagar',
    description: '500m+D and 1000m sprint heats featuring record-breaking times on the newly surfaced synthetic banked rink.',
    tournamentName: 'NCR Zonal Speed League',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: 'gal-03',
    title: 'Speed Slalom Battle & Classic Musical Routines',
    category: 'INLINE FREESTYLE',
    imageUrl: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=1200&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=80'
    ],
    albumCount: 12,
    date: '2026-01-22',
    venue: 'Mahamaya Sports Stadium Rink',
    district: 'Ghaziabad',
    description: 'Precision slalom cones agility contest, Speed Slalom Knockout rounds, and Classic Slalom artistic choreographies.',
    tournamentName: 'UP State Freestyle Championship',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: 'gal-04',
    title: 'Merit Medal & Trophy Felicitation Ceremony',
    category: 'AWARD CEREMONIES',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80'
    ],
    albumCount: 18,
    date: '2026-01-23',
    venue: 'KD Singh Babu Stadium Auditorium',
    district: 'Lucknow',
    description: 'Felicitation of state gold medalists and presentation of the General Championship Trophy to the leading district association.',
    tournamentName: 'State Annual Felicitation'
  },
  {
    id: 'gal-05',
    title: 'UP State Elite High-Performance Training Camp',
    category: 'TRAINING CAMPS',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1200&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=80'
    ],
    albumCount: 14,
    date: '2026-01-25',
    venue: 'Dr. Sampurnanand Sports Stadium',
    district: 'Varanasi',
    description: 'Intensive conditioning, endurance paceline drills, and start gate biomechanical analysis for state squad athletes.',
    tournamentName: 'State Squad Conditioning Camp'
  },
  {
    id: 'gal-06',
    title: 'Solo & Pair Artistic Roller Figure Skating Showcase',
    category: 'ARTISTIC SKATING',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&q=80'
    ],
    albumCount: 15,
    date: '2026-01-26',
    venue: 'Green Park Indoor Skating Complex',
    district: 'Kanpur Nagar',
    description: 'Free Skating jumps, spins, footwork sequences, and synchronized pairs artistic skating routines judged under RSFI artistic code.',
    tournamentName: 'UP State Artistic Championships',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  }
];

// Rich Fallback Video Library with championship broadcasts, highlights & masterclasses
const fallbackVideos: VideoBroadcastItem[] = [
  {
    id: 'vid-01',
    title: '36th UP State Speed Skating Championship — 10,000m Banked Track Elimination Final',
    hindiTitle: '36वीं उत्तर प्रदेश राज्य स्पीड स्केटिंग चैंपियनशिप — 10,000मी एलिमिनेशन फाइनल',
    category: 'CHAMPIONSHIP FINALS',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    duration: '24:18',
    date: '2026-01-20',
    venue: 'LDA Colony 200m Banked Synthetic Track',
    district: 'Lucknow',
    views: 14820,
    featured: true,
    hd: true,
    description: 'Complete official high-definition telecast of the Senior Men & Women 10,000m Point-to-Point Elimination Race. Featuring national champions from Lucknow, Gautam Buddha Nagar, Ghaziabad, and Varanasi.',
    broadcaster: 'UPRSA Media Cell Live Telecast',
    chapters: [
      { time: '00:00', title: 'Lineup & Starting Grid Introduction' },
      { time: '04:15', title: 'Pacing & Early Elimination Heats' },
      { time: '12:30', title: 'Peloton Breakaway at Lap 25' },
      { time: '20:45', title: 'Final Bell Sprint & Photo Finish' },
      { time: '23:10', title: 'Official Electronic Time Confirmation' }
    ]
  },
  {
    id: 'vid-02',
    title: '500m+D Banked Track Sprint Heats & Final — Junior Boys Record Breaker',
    hindiTitle: '500मी+डी बैंकड ट्रैक स्प्रिंट हीट्स एवं फाइनल — जूनियर बालक वर्ग',
    category: 'SPEED RACING',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000&q=80',
    duration: '08:45',
    date: '2026-01-21',
    venue: 'Noida Indoor Stadium 200m Banked Track',
    district: 'Gautam Buddha Nagar',
    views: 8940,
    hd: true,
    description: 'Electrifying 500m+D sprint finals where state junior records were shattered. Multi-angle slow motion replays of start acceleration and corner banking maneuvers.',
    broadcaster: 'NCR Regional Sports Network',
    chapters: [
      { time: '00:00', title: 'Semi-Final Heat 1 & 2' },
      { time: '03:50', title: 'Grand Final Lineup' },
      { time: '06:10', title: 'Gold Medal Dash & Replays' }
    ]
  },
  {
    id: 'vid-03',
    title: 'Inline Freestyle Speed Slalom Battle — 20-Cone Knockout Rounds',
    hindiTitle: 'इनलाइन फ्रीस्टाइल स्पीड स्लैलम बैटल — 20-कोन नॉकआउट राउंड्स',
    category: 'FREESTYLE SLALOM',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=1000&q=80',
    duration: '12:35',
    date: '2026-01-22',
    venue: 'Mahamaya Sports Stadium Rink',
    district: 'Ghaziabad',
    views: 6310,
    hd: true,
    description: 'High-speed footwork slalom race where skaters clock sub-5 second runs through 20 precision cones spaced at 80cm intervals.',
    broadcaster: 'UPRSA Freestyle Technical Commission',
    chapters: [
      { time: '00:00', title: 'Quarter-Final Knockouts' },
      { time: '05:30', title: 'Semi-Final Slalom Runs' },
      { time: '09:40', title: 'Gold Medal Duel' }
    ]
  },
  {
    id: 'vid-04',
    title: 'Solo & Pair Artistic Roller Figure Skating — Gold Routine Showcase',
    hindiTitle: 'एकल एवं युगल आर्टिस्टिक रोलर फिगर स्केटिंग — स्वर्ण पदक प्रदर्शन',
    category: 'ARTISTIC ROUTINES',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1000&q=80',
    duration: '15:20',
    date: '2026-01-26',
    venue: 'Green Park Indoor Skating Complex',
    district: 'Kanpur Nagar',
    views: 5420,
    hd: true,
    description: 'Full choreography routines featuring Axel jumps, camel spins, and synchronized dance sequences judged under RSFI Technical Regulations.',
    broadcaster: 'UPRSA Artistic Skating Board'
  },
  {
    id: 'vid-05',
    title: 'NIS Masterclass: Aerodynamic Cornering & Banked Track Crossover Dynamics',
    hindiTitle: 'एनआईएस मास्टरक्लास: एरोडायनामिक कॉर्नरिंग एवं बैंकड ट्रैक क्रॉसओवर तकनीक',
    category: 'COACHING & MASTERCLASSES',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1000&q=80',
    duration: '18:50',
    date: '2026-01-25',
    venue: 'Dr. Sampurnanand Sports Stadium',
    district: 'Varanasi',
    views: 9200,
    hd: true,
    description: 'Detailed instructional video by Chief State Coach analyzing center-of-gravity management, boot angle, and recovery stroke on synthetic 200m banked surfaces.',
    broadcaster: 'UPRSA Coaching & Development Cell',
    chapters: [
      { time: '00:00', title: 'Biomechanics of Crossover' },
      { time: '06:15', title: 'Lean Angle & Centripetal Balance' },
      { time: '13:00', title: 'Common Drills & Practice Routines' }
    ]
  },
  {
    id: 'vid-06',
    title: 'Annual State Merit Awards & General Championship Trophy Presentation',
    hindiTitle: 'वार्षिक राज्य योग्यता पुरस्कार एवं जनरल चैंपियनशिप ट्रॉफी वितरण समारोह',
    category: 'AWARDS & FELICITATION',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1000&q=80',
    duration: '22:15',
    date: '2026-01-23',
    venue: 'KD Singh Babu Stadium Auditorium',
    district: 'Lucknow',
    views: 7850,
    hd: true,
    description: 'Grand closing ceremony celebrating top athletes from 75 UP districts, presentation of state records citations, and best district trophy handover.',
    broadcaster: 'UPRSA Media Cell'
  }
];
