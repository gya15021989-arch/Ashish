import React, { useState } from 'react';
import {
  Trophy,
  Plus,
  Trash2,
  Edit3,
  Search,
  RotateCcw,
  Sparkles,
  MapPin,
  Calendar,
  Award,
  Medal,
  Star,
  Activity,
  Image as ImageIcon,
  Check,
  X,
  Save,
  Upload,
  ChevronRight,
  ExternalLink,
  Flame,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { AthleteJourneyData, AthleteMilestone, AthleteGalleryPhoto } from '../../types';
import { api } from '../../services/api';
import { ALL_75_UP_DISTRICTS } from '../../data/all75Districts';

interface AthletesCMSManagerProps {
  athletes: AthleteJourneyData[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AthletesCMSManager: React.FC<AthletesCMSManagerProps> = ({
  athletes,
  onRefresh,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<AthleteJourneyData | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<AthleteJourneyData>>({
    name: '',
    hindiName: '',
    district: 'Lucknow',
    discipline: 'Inline Speed Skating (110mm / 3x125)',
    category: 'Junior Men (14 to 17)',
    achievement: '',
    record: '',
    medals: '',
    photo: '',
    tag: 'STATE CHAMPION',
    regNo: 'UPRSA/2026/...',
    dob: '2008-01-01',
    age: 18,
    clubName: '',
    coachName: '',
    startedYear: 2018,
    bioSummary: '',
    personalStory: '',
    specialty: '',
    trainingRegime: '',
    gearSetup: '',
    quote: '',
    stats: {
      stateMedals: 0,
      nationalMedals: 0,
      racesWon: 0,
      personalBest: ''
    },
    careerMilestones: [],
    galleryPhotos: [],
    order: 1,
    status: 'Active'
  });

  // Milestone input temp state
  const [newMilestone, setNewMilestone] = useState<AthleteMilestone>({
    year: '2026',
    event: '',
    level: 'State',
    result: '',
    timingOrScore: '',
    highlight: ''
  });

  // Gallery photo temp state
  const [newGalleryPhoto, setNewGalleryPhoto] = useState<AthleteGalleryPhoto>({
    url: '',
    caption: ''
  });

  // Filtering
  const filteredAthletes = athletes.filter(ath => {
    const matchesSearch = 
      ath.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ath.hindiName && ath.hindiName.includes(searchQuery)) ||
      ath.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ath.discipline.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDiscipline = selectedDiscipline === 'All' || ath.discipline.toLowerCase().includes(selectedDiscipline.toLowerCase());

    return matchesSearch && matchesDiscipline;
  });

  const handleOpenCreate = () => {
    setEditingAthlete(null);
    setFormData({
      name: '',
      hindiName: '',
      district: 'Lucknow',
      discipline: 'Inline Speed Skating (110mm / 3x125)',
      category: 'Junior Men (14 to 17)',
      achievement: 'State Gold Medalist',
      record: 'State Record: 45.00s',
      medals: '3 🥇 Gold • 1 🥈 Silver',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      tag: 'SPEED CHAMPION',
      regNo: `UPRSA/2026/${Math.floor(1000 + Math.random() * 9000)}`,
      dob: '2008-01-01',
      age: 18,
      clubName: 'Awadh Speed Skating Academy, KD Singh Babu Stadium',
      coachName: 'Coach R.K. Yadav (NIS Certified)',
      startedYear: 2018,
      bioSummary: '',
      personalStory: '',
      specialty: 'Explosive cornering and final sprint finish.',
      trainingRegime: '6 days/week: morning cardio, evening bank track drills.',
      gearSetup: 'Bont Carbon Boots, 3x125mm Wheels, Ceramic Bearings.',
      quote: 'सपनों को सच करने के लिए हर दिन पसीना बहाना पड़ता है।',
      stats: {
        stateMedals: 4,
        nationalMedals: 1,
        racesWon: 15,
        personalBest: '44.82s (500m)'
      },
      careerMilestones: [
        {
          year: '2026',
          event: '36th UP State Roller Skating Championship',
          level: 'State',
          result: '🥇 स्वर्ण पदक (Gold)',
          timingOrScore: '44.82s',
          highlight: '500m स्प्रिंट में नया राज्य रिकॉर्ड बनाया।'
        }
      ],
      galleryPhotos: [
        {
          url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
          caption: 'बैंक ट्रैक पर 500m स्प्रिंट'
        }
      ],
      order: athletes.length + 1,
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ath: AthleteJourneyData) => {
    setEditingAthlete(ath);
    setFormData({
      ...ath,
      stats: ath.stats || { stateMedals: 0, nationalMedals: 0, racesWon: 0, personalBest: '' },
      careerMilestones: ath.careerMilestones ? [...ath.careerMilestones] : [],
      galleryPhotos: ath.galleryPhotos ? [...ath.galleryPhotos] : []
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.discipline || !formData.district) {
      showToast('Name, Discipline and District are mandatory fields', 'error');
      return;
    }

    try {
      if (editingAthlete) {
        const res = await api.updateAboutAthlete(editingAthlete.id, formData);
        if (res.success) {
          showToast('Athlete profile updated successfully!');
          setIsModalOpen(false);
          onRefresh();
        } else {
          showToast(res.message || 'Failed to update athlete', 'error');
        }
      } else {
        const res = await api.createAboutAthlete(formData);
        if (res.success) {
          showToast('New athlete profile created successfully!');
          setIsModalOpen(false);
          onRefresh();
        } else {
          showToast(res.message || 'Failed to create athlete', 'error');
        }
      }
    } catch (err) {
      showToast('Error saving athlete profile', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete the profile of "${name}"?`)) {
      return;
    }
    try {
      const res = await api.deleteAboutAthlete(id);
      if (res.success) {
        showToast(`Profile of "${name}" deleted successfully.`);
        onRefresh();
      } else {
        showToast(res.message || 'Failed to delete athlete', 'error');
      }
    } catch (err) {
      showToast('Error deleting athlete', 'error');
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all athlete profiles to the official default roster? Any custom additions will be reverted.')) {
      return;
    }
    try {
      const res = await api.resetAboutAthletes();
      if (res.success) {
        showToast('Athletes roster reset to defaults successfully.');
        onRefresh();
      }
    } catch (err) {
      showToast('Error resetting athletes', 'error');
    }
  };

  // Photo upload
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
          showToast('Athlete photo uploaded successfully');
        } else {
          showToast('Failed to upload image file', 'error');
        }
        setUploadingPhoto(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setUploadingPhoto(false);
      showToast('Upload error', 'error');
    }
  };

  // Milestone helper
  const handleAddMilestone = () => {
    if (!newMilestone.event || !newMilestone.result) {
      showToast('Please enter event name and result', 'error');
      return;
    }
    setFormData(prev => ({
      ...prev,
      careerMilestones: [...(prev.careerMilestones || []), newMilestone]
    }));
    setNewMilestone({
      year: '2026',
      event: '',
      level: 'State',
      result: '',
      timingOrScore: '',
      highlight: ''
    });
  };

  const handleRemoveMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      careerMilestones: (prev.careerMilestones || []).filter((_, i) => i !== index)
    }));
  };

  // Gallery photo helper
  const handleAddGalleryPhoto = () => {
    if (!newGalleryPhoto.url) {
      showToast('Please enter or upload an image URL', 'error');
      return;
    }
    setFormData(prev => ({
      ...prev,
      galleryPhotos: [...(prev.galleryPhotos || []), newGalleryPhoto]
    }));
    setNewGalleryPhoto({ url: '', caption: '' });
  };

  const handleRemoveGalleryPhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      galleryPhotos: (prev.galleryPhotos || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Bar / Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Our Athletes & Champions CMS (आवर एथलीट संपादन)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Manage official state athlete profiles, sports discipline categories, stats, medals, and interactive journey pages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset to default roster"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Athlete Profile (नया एथलीट जोड़ें)</span>
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
            placeholder="Search by athlete name, district, or event..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-amber-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['All', 'Speed', 'Inline', 'Quad', 'Freestyle', 'Artistic', 'Hockey'].map((disc) => (
            <button
              key={disc}
              type="button"
              onClick={() => setSelectedDiscipline(disc)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedDiscipline === disc
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {disc}
            </button>
          ))}
        </div>
      </div>

      {/* Athletes Cards Grid */}
      {filteredAthletes.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-bold text-white">No athletes match your query</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting the search filter or click "+ Add New Athlete Profile".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAthletes.map((ath, idx) => (
            <div
              key={ath.id || idx}
              className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group shadow-lg"
            >
              {/* Card Header & Photo */}
              <div>
                <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={ath.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                    alt={ath.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-md tracking-wider shadow-md">
                      {ath.tag || 'CHAMPION'}
                    </span>
                  </div>

                  {/* Order & Status */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="bg-slate-900/80 backdrop-blur-xs text-slate-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700">
                      #{ath.order || idx + 1}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      ath.status === 'Inactive' 
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {ath.status || 'Active'}
                    </span>
                  </div>

                  {/* Name and Hindi Name on image bottom */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="text-base font-black text-white leading-snug drop-shadow-md">
                      {ath.name}
                    </h4>
                    {ath.hindiName && (
                      <p className="text-xs text-amber-300 font-medium">{ath.hindiName}</p>
                    )}
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {ath.district}
                    </span>
                    <span className="font-mono text-[11px] bg-slate-950 px-2 py-0.5 rounded text-amber-400 border border-slate-800">
                      {ath.regNo || 'UPRSA ID'}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-amber-400 line-clamp-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    {ath.discipline}
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2">
                    {ath.achievement || ath.bioSummary || 'Official State Registered Champion'}
                  </p>

                  {/* Medals & Stats Pill */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-amber-300">{ath.medals || '🥇 State Medals'}</span>
                    <span>{ath.careerMilestones?.length || 0} Milestones • {ath.galleryPhotos?.length || 0} Photos</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 flex items-center gap-2 border-t border-slate-800/60 mt-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(ath)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile & Journey (संपादित करें)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(ath.id, ath.name)}
                  className="p-2 bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl transition-colors cursor-pointer"
                  title="Delete Athlete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FULL ATHLETE EDIT / CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingAthlete ? `Edit Athlete: ${editingAthlete.name}` : 'Create New Athlete Profile & Journey'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Manage profile info, journey page text, photos, milestones, and stats.
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

            {/* Modal Form Scrollable */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 text-slate-200">
              {/* Section 1: Basic Identity */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5" />
                  <span>1. Basic Profile & Identity (मूल जानकारी)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Athlete Name (English) *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Hindi Name (हिंदी में नाम)</label>
                    <input
                      type="text"
                      value={formData.hindiName || ''}
                      onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                      placeholder="उदा. आरव शर्मा"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">District (जनपद) *</label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 outline-none"
                    >
                      {ALL_75_UP_DISTRICTS.map((d) => (
                        <option key={d.name} value={d.name}>{d.name} ({d.hindiName})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Discipline (खेल विधा) *</label>
                    <input
                      type="text"
                      required
                      value={formData.discipline}
                      onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                      placeholder="e.g. Inline Speed Skating (110mm / 3x125)"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Age Category (आयु वर्ग)</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Junior Men (14 to 17)"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={formData.tag}
                      onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                      placeholder="e.g. SPEED RECORD HOLDER"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                {/* Photo Upload / URL */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Profile Photo (फ़ोटो URL / अपलोड)</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={formData.photo}
                      onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 outline-none font-mono"
                    />
                    <label className="bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 border border-slate-700">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingPhoto ? 'Uploading...' : 'Upload Image'}</span>
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
                    <label className="block text-xs font-bold text-slate-300 mb-1">Registration No. (UPRSA ID)</label>
                    <input
                      type="text"
                      value={formData.regNo}
                      onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                      placeholder="UPRSA/2026/LKO/00101"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">DOB / Year</label>
                    <input
                      type="text"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      placeholder="12-Mar-2009"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Age (वर्ष)</label>
                    <input
                      type="number"
                      value={formData.age || ''}
                      onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Skating Since (वर्ष)</label>
                    <input
                      type="number"
                      value={formData.startedYear || ''}
                      onChange={(e) => setFormData({ ...formData, startedYear: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Club / Academy Affiliation</label>
                    <input
                      type="text"
                      value={formData.clubName}
                      onChange={(e) => setFormData({ ...formData, clubName: e.target.value })}
                      placeholder="e.g. Awadh Speed Skating Academy, KD Singh Babu Stadium"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Coach Name</label>
                    <input
                      type="text"
                      value={formData.coachName}
                      onChange={(e) => setFormData({ ...formData, coachName: e.target.value })}
                      placeholder="e.g. Coach R.K. Yadav (NIS Certified)"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Journey Story, Achievements & Quotes */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>2. Journey Story & Achievements (जीवन यात्रा व उपलब्धियां)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Key Achievement Badge</label>
                    <input
                      type="text"
                      value={formData.achievement}
                      onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
                      placeholder="e.g. National Gold Medalist (500m + D Sprint)"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Record / Timing / Score</label>
                    <input
                      type="text"
                      value={formData.record}
                      onChange={(e) => setFormData({ ...formData, record: e.target.value })}
                      placeholder="e.g. State Record: 44.82s (200m Banked Track)"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Medals Summary String</label>
                  <input
                    type="text"
                    value={formData.medals}
                    onChange={(e) => setFormData({ ...formData, medals: e.target.value })}
                    placeholder="e.g. 4 🥇 Gold • 1 🥈 Silver"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Bio Summary (संक्षिप्त परिचय)</label>
                  <textarea
                    rows={2}
                    value={formData.bioSummary}
                    onChange={(e) => setFormData({ ...formData, bioSummary: e.target.value })}
                    placeholder="Brief intro displayed on athlete card..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-amber-500 outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Full Personal Journey Story (संपूर्ण जीवन यात्रा विवरण)</label>
                  <textarea
                    rows={4}
                    value={formData.personalStory}
                    onChange={(e) => setFormData({ ...formData, personalStory: e.target.value })}
                    placeholder="Full written journey displayed on the Athlete Journey modal..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-amber-500 outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Specialty Move</label>
                    <input
                      type="text"
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      placeholder="e.g. Explosive cornering"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Training Routine</label>
                    <input
                      type="text"
                      value={formData.trainingRegime}
                      onChange={(e) => setFormData({ ...formData, trainingRegime: e.target.value })}
                      placeholder="e.g. 6 days/week, 4 hours/day"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Gear / Equipment Specs</label>
                    <input
                      type="text"
                      value={formData.gearSetup}
                      onChange={(e) => setFormData({ ...formData, gearSetup: e.target.value })}
                      placeholder="e.g. Bont Carbon, 3x125mm"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Athlete Inspirational Quote (प्रेरणादायक संदेश)</label>
                  <input
                    type="text"
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    placeholder="e.g. हर लैप में हवा को चीरते हुए आगे बढ़ना ही मेरा जुनून है..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Section 3: Career Milestones */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>3. Career Milestones & Competition History (करियर की प्रमुख उपलब्धियां)</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {formData.careerMilestones?.length || 0} Milestones Added
                  </span>
                </h4>

                {/* List existing milestones */}
                {formData.careerMilestones && formData.careerMilestones.length > 0 && (
                  <div className="space-y-2">
                    {formData.careerMilestones.map((ms, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 font-bold text-white">
                            <span className="text-amber-400 font-mono">[{ms.year}]</span>
                            <span>{ms.event}</span>
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">
                              {ms.level}
                            </span>
                          </div>
                          <p className="text-slate-300 text-[11px]">{ms.result} {ms.timingOrScore && `• ${ms.timingOrScore}`}</p>
                          {ms.highlight && <p className="text-slate-400 text-[11px] italic">{ms.highlight}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestone(i)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new milestone mini-form */}
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                  <p className="text-[11px] font-bold text-slate-300">+ Add A New Milestone:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <input
                      type="text"
                      placeholder="Year (e.g. 2026)"
                      value={newMilestone.year}
                      onChange={(e) => setNewMilestone({ ...newMilestone, year: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Event Name"
                      value={newMilestone.event}
                      onChange={(e) => setNewMilestone({ ...newMilestone, event: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white sm:col-span-2"
                    />
                    <select
                      value={newMilestone.level}
                      onChange={(e) => setNewMilestone({ ...newMilestone, level: e.target.value as any })}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="District">District</option>
                      <option value="State">State</option>
                      <option value="National">National</option>
                      <option value="International">International</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Result (e.g. 🥇 Gold Medal)"
                      value={newMilestone.result}
                      onChange={(e) => setNewMilestone({ ...newMilestone, result: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Timing / Score (Optional)"
                      value={newMilestone.timingOrScore}
                      onChange={(e) => setNewMilestone({ ...newMilestone, timingOrScore: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Highlight note"
                      value={newMilestone.highlight}
                      onChange={(e) => setNewMilestone({ ...newMilestone, highlight: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="mt-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Milestone to Profile</span>
                  </button>
                </div>
              </div>

              {/* Section 4: Journey Action Photos & Gallery */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>4. Journey Photos & Moments Gallery (फोटो गैलरी)</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {formData.galleryPhotos?.length || 0} Photos Added
                  </span>
                </h4>

                {/* List existing gallery photos */}
                {formData.galleryPhotos && formData.galleryPhotos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {formData.galleryPhotos.map((photo, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="w-full h-24 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="p-1.5 text-[10px] text-slate-300 line-clamp-1 bg-slate-950/80">
                          {photo.caption || 'Action Moment'}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryPhoto(i)}
                          className="absolute top-1 right-1 p-1 bg-black/80 hover:bg-rose-500 text-white rounded text-[10px] transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new photo */}
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col sm:flex-row gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Image URL (https://...)"
                    value={newGalleryPhoto.url}
                    onChange={(e) => setNewGalleryPhoto({ ...newGalleryPhoto, url: e.target.value })}
                    className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Caption (e.g. 500m Podium Finish)"
                    value={newGalleryPhoto.caption}
                    onChange={(e) => setNewGalleryPhoto({ ...newGalleryPhoto, caption: e.target.value })}
                    className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryPhoto}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap cursor-pointer"
                  >
                    + Add Photo
                  </button>
                </div>
              </div>

              {/* Section 5: Order and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Display Sort Order</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.order || 1}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Publication Status</label>
                  <select
                    value={formData.status || 'Active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 outline-none"
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
                  className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingAthlete ? 'Save Changes to Athlete' : 'Publish Athlete Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
