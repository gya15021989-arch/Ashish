import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  DollarSign,
  Edit3,
  Search,
  Filter,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  Eye,
  EyeOff,
  X,
  Clock,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Check,
  Layers,
  Users,
  Phone,
  Shield,
  Tag,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
  Coins,
  CheckSquare,
  Square
} from 'lucide-react';
import { Tournament, TournamentEvent, TournamentStatus } from '../../types';
import { api } from '../../services/api';
import { DISCIPLINES, AGE_CATEGORIES_2026 } from '../../data/uprsaKnowledge';

const UP_DISTRICTS_LIST = [
  'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 'Azamgarh',
  'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti',
  'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah',
  'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar (Noida)', 'Ghaziabad',
  'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun',
  'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi',
  'Kheri (Lakhimpur)', 'Kushinagar', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri',
  'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh',
  'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur',
  'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'
];

interface ToastState {
  type: 'success' | 'error' | 'info';
  message: string;
}

const DEFAULT_EVENT_TEMPLATES: TournamentEvent[] = [
  {
    id: 'ev-1',
    tournamentId: '',
    eventName: '500m + D Sprint Rink Race',
    discipline: 'Speed Skating (Inline)',
    ageCategory: 'Sub-Junior (12 to 15)',
    ageCategories: ['Sub-Junior (12 to 15)', 'Junior (15 to 18)'],
    gender: 'All Genders',
    distance: '500m+D',
    entryFee: 0,
    maxParticipants: 80
  },
  {
    id: 'ev-2',
    tournamentId: '',
    eventName: '1000m Sprint Rink Race',
    discipline: 'Speed Skating (Inline)',
    ageCategory: 'Junior (15 to 18)',
    ageCategories: ['Junior (15 to 18)', 'Senior (Above 18)'],
    gender: 'All Genders',
    distance: '1000m',
    entryFee: 0,
    maxParticipants: 80
  },
  {
    id: 'ev-3',
    tournamentId: '',
    eventName: '1 Lap Time Trial (FL)',
    discipline: 'Speed Skating (Quad)',
    ageCategory: 'Cadet (8 to 10)',
    ageCategories: ['Cadet (8 to 10)', 'Cadet (10 to 12)'],
    gender: 'All Genders',
    distance: '200m',
    entryFee: 0,
    maxParticipants: 80
  }
];

export const TournamentEventBuilder: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [expandedEventsTourId, setExpandedEventsTourId] = useState<string | null>(null);

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingTournamentId, setEditingTournamentId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);

  // Delete Target Modal
  const [deleteTarget, setDeleteTarget] = useState<Tournament | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState<ToastState | null>(null);

  // Poster file input ref
  const posterFileInputRef = useRef<HTMLInputElement | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    hindiTitle: string;
    edition: string;
    category: string;
    level: 'State' | 'National' | 'Zonal' | 'District' | 'Invitational';
    status: TournamentStatus;
    venue: string;
    district: string;
    state: string;
    startDate: string;
    endDate: string;
    registrationDeadline: string;
    entryFeeBase: number;
    bannerUrl: string;
    prospectusUrl: string;
    rulesPdfUrl: string;
    organizer: string;
    contactPerson: string;
    contactPhone: string;
    description: string;
    isPublished: boolean;
    events: TournamentEvent[];
  }>({
    title: '',
    hindiTitle: '',
    edition: '',
    category: 'UPRSA STATE CHAMPIONSHIP',
    level: 'State',
    status: 'open',
    venue: '',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    startDate: '2026-10-15',
    endDate: '2026-10-18',
    registrationDeadline: '2026-10-05',
    entryFeeBase: 1000,
    bannerUrl: '',
    prospectusUrl: '',
    rulesPdfUrl: '',
    organizer: 'Uttar Pradesh Roller Sports Association',
    contactPerson: 'Arun Kumar Verma (Technical Director)',
    contactPhone: '+91 94150 21989',
    description: 'Official State Roller Skating Championship and Trials for RSFI Nationals.',
    isPublished: true,
    events: DEFAULT_EVENT_TEMPLATES
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    setLoading(true);
    try {
      const res = await api.getTournaments();
      if (res.success && res.data) {
        setTournaments(res.data);
      }
    } catch (e) {
      console.error('Failed to load tournaments:', e);
      showToast('टूर्नामेंट डेटा लोड करने में समस्या आई।', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 1. Open Create Modal
  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingTournamentId(null);
    setFormData({
      title: '',
      hindiTitle: '',
      edition: '37th UP State Roller Sports Championship 2026',
      category: 'UPRSA STATE CHAMPIONSHIP',
      level: 'State',
      status: 'open',
      venue: 'KD Singh Babu Stadium, Hazratganj, Lucknow',
      district: 'Lucknow',
      state: 'Uttar Pradesh',
      startDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 17 * 86400000).toISOString().split('T')[0],
      registrationDeadline: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      entryFeeBase: 1000,
      bannerUrl: '',
      prospectusUrl: '',
      rulesPdfUrl: '',
      organizer: 'Uttar Pradesh Roller Sports Association',
      contactPerson: 'General Secretary, UPRSA',
      contactPhone: '+91 94150 21989',
      description: 'Official State Roller Skating Championship and selection trials for the National Championships.',
      isPublished: true,
      events: [
        {
          id: `ev-${Date.now()}-1`,
          tournamentId: '',
          eventName: '500m + D Sprint Rink Race',
          discipline: 'Speed Skating (Inline)',
          ageCategory: 'Sub-Junior (12 to 15)',
          ageCategories: ['Sub-Junior (12 to 15)', 'Junior (15 to 18)'],
          gender: 'All Genders',
          distance: '500m+D',
          entryFee: 0,
          maxParticipants: 80
        },
        {
          id: `ev-${Date.now()}-2`,
          tournamentId: '',
          eventName: '1000m Sprint Rink Race',
          discipline: 'Speed Skating (Inline)',
          ageCategory: 'Cadet (8 to 10)',
          ageCategories: ['Cadet (8 to 10)', 'Cadet (10 to 12)'],
          gender: 'All Genders',
          distance: '1000m',
          entryFee: 0,
          maxParticipants: 80
        }
      ]
    });
    setIsModalOpen(true);
  };

  // 2. Open Edit Modal with Complete Data Pre-population
  const handleOpenEdit = (t: Tournament) => {
    setModalMode('edit');
    setEditingTournamentId(t.id);
    
    // Normalize events so all have All Genders, 0 extra fee, and populated ageCategories array
    const normalizedEvents: TournamentEvent[] = (t.events && t.events.length > 0 ? t.events : DEFAULT_EVENT_TEMPLATES).map((ev, idx) => {
      const existingCats = ev.ageCategories && ev.ageCategories.length > 0
        ? ev.ageCategories
        : (ev.ageCategory ? [ev.ageCategory] : ['Cadet (8 to 10)', 'Cadet (10 to 12)']);
      return {
        ...ev,
        gender: 'All Genders', // Every race open to all genders (Boys & Girls)
        entryFee: 0, // No per-race fee (covered in tournament fee)
        ageCategories: existingCats,
        ageCategory: (existingCats[0] || 'Cadet (8 to 10)') as any
      };
    });

    setFormData({
      title: t.title || '',
      hindiTitle: t.hindiTitle || '',
      edition: t.edition || t.title || '',
      category: t.category || 'UPRSA STATE CHAMPIONSHIP',
      level: (t.level as any) || 'State',
      status: t.status || 'open',
      venue: t.venue || '',
      district: t.district || 'Lucknow',
      state: t.state || 'Uttar Pradesh',
      startDate: t.startDate || '',
      endDate: t.endDate || '',
      registrationDeadline: t.registrationDeadline || '',
      entryFeeBase: t.entryFeeBase ?? 1000,
      bannerUrl: t.bannerUrl || '',
      prospectusUrl: t.prospectusUrl || '',
      rulesPdfUrl: t.rulesPdfUrl || '',
      organizer: t.organizer || 'Uttar Pradesh Roller Sports Association',
      contactPerson: t.contactPerson || '',
      contactPhone: t.contactPhone || '',
      description: t.description || '',
      isPublished: t.isPublished ?? true,
      events: normalizedEvents
    });
    setIsModalOpen(true);
  };

  // 3. Handle JPG / Poster Upload
  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      showToast('पोस्टर फ़ाइल 10MB से कम होनी चाहिए (Poster must be under 10MB).', 'error');
      return;
    }

    setUploadingPoster(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await api.uploadFile(file.name, base64, false);
        if (res.success && res.fileUrl) {
          setFormData(prev => ({ ...prev, bannerUrl: res.fileUrl! }));
          showToast('चैंपियनशिप पोस्टर (JPG) सफलतापूर्वक अपलोड हो गया!');
        } else {
          // Fallback to data URL
          setFormData(prev => ({ ...prev, bannerUrl: base64 }));
          showToast('चैंपियनशिप पोस्टर संलग्न कर दिया गया।');
        }
      } catch (err) {
        console.error('Poster upload failed:', err);
        setFormData(prev => ({ ...prev, bannerUrl: base64 }));
        showToast('पोस्टर स्थानीय रूप से संलग्न किया गया।', 'info');
      } finally {
        setUploadingPoster(false);
      }
    };
    reader.onerror = () => {
      setUploadingPoster(false);
      showToast('फ़ाइल पढ़ने में त्रुटि आई। कृपया पुनः प्रयास करें।', 'error');
    };
    reader.readAsDataURL(file);
  };

  // 4. Sub-Event Builder Handlers (No separate fee, All genders, Age group selector)
  const handleAddEvent = () => {
    const newEv: TournamentEvent = {
      id: `ev-${Date.now()}`,
      tournamentId: editingTournamentId || '',
      eventName: '500m + D Sprint',
      discipline: 'Speed Skating (Inline)',
      ageCategory: 'Cadet (8 to 10)',
      ageCategories: ['Cadet (8 to 10)', 'Cadet (10 to 12)'],
      gender: 'All Genders', // All races for all genders
      distance: '500m',
      entryFee: 0, // No per-race fee
      maxParticipants: 60
    };
    setFormData(prev => ({
      ...prev,
      events: [...prev.events, newEv]
    }));
  };

  const handleRemoveEvent = (id: string) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.filter(e => e.id !== id)
    }));
  };

  const handleUpdateEvent = (index: number, field: keyof TournamentEvent, val: any) => {
    const updated = [...formData.events];
    updated[index] = { ...updated[index], [field]: val };
    setFormData(prev => ({
      ...prev,
      events: updated
    }));
  };

  // Toggle specific age category for a race event
  const handleToggleAgeCategory = (evIndex: number, catName: string) => {
    const ev = formData.events[evIndex];
    const currentCats = ev.ageCategories && ev.ageCategories.length > 0
      ? [...ev.ageCategories]
      : (ev.ageCategory ? [ev.ageCategory] : []);

    let updated: string[];
    if (currentCats.includes(catName)) {
      if (currentCats.length <= 1) {
        showToast('रेस में कम से कम एक आयु वर्ग (Age Group) का चयन आवश्यक है।', 'info');
        return;
      }
      updated = currentCats.filter(c => c !== catName);
    } else {
      updated = [...currentCats, catName];
    }

    const updatedEvents = [...formData.events];
    updatedEvents[evIndex] = {
      ...ev,
      ageCategories: updated,
      ageCategory: (updated[0] || 'Cadet (8 to 10)') as any
    };
    setFormData(prev => ({ ...prev, events: updatedEvents }));
  };

  // Apply age preset to a race event
  const handleSetAgeGroupPreset = (evIndex: number, presetType: 'all' | 'cadet' | 'junior' | 'senior' | 'subjunior') => {
    const ev = formData.events[evIndex];
    let selected: string[] = [];
    if (presetType === 'all') {
      selected = AGE_CATEGORIES_2026.map(a => a.category);
    } else if (presetType === 'cadet') {
      selected = ['Tots (Under 6)', 'Minis (6 to 8)', 'Cadet (8 to 10)', 'Cadet (10 to 12)'];
    } else if (presetType === 'subjunior') {
      selected = ['Cadet (10 to 12)', 'Sub-Junior (12 to 15)'];
    } else if (presetType === 'junior') {
      selected = ['Sub-Junior (12 to 15)', 'Junior (15 to 18)'];
    } else if (presetType === 'senior') {
      selected = ['Senior (Above 18)', 'Masters (Above 35)'];
    }

    const updatedEvents = [...formData.events];
    updatedEvents[evIndex] = {
      ...ev,
      ageCategories: selected,
      ageCategory: (selected[0] || 'Cadet (8 to 10)') as any
    };
    setFormData(prev => ({ ...prev, events: updatedEvents }));
  };

  // 5. Save Tournament (Create or Update)
  const handleSaveTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('कृपया टूर्नामेंट का शीर्षक (Title) दर्ज करें।', 'error');
      return;
    }
    if (!formData.venue.trim()) {
      showToast('कृपया वेन्यू / ट्रैक का पता दर्ज करें।', 'error');
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      showToast('कृपया टूर्नामेंट की शुरुआत और समाप्ति तिथि चुनें।', 'error');
      return;
    }
    if (formData.entryFeeBase < 0) {
      showToast('टूर्नामेंट की फिक्स एंट्री फीस मान्य होनी चाहिए।', 'error');
      return;
    }

    // Validate that all events have at least 1 age category
    for (let i = 0; i < formData.events.length; i++) {
      const ev = formData.events[i];
      if (!ev.eventName.trim()) {
        showToast(`कृपया रेस #${i + 1} का नाम दर्ज करें।`, 'error');
        return;
      }
      if (!ev.ageCategories || ev.ageCategories.length === 0) {
        showToast(`कृपया रेस #${i + 1} "${ev.eventName}" हेतु कम से कम एक एज ग्रुप चुनें।`, 'error');
        return;
      }
    }

    // Normalize all race events: All Genders, zero extra fee, and valid ageCategories
    const normalizedEvents: TournamentEvent[] = formData.events.map(ev => ({
      ...ev,
      gender: 'All Genders', // All races for all genders
      entryFee: 0, // No per-race fee
      ageCategories: ev.ageCategories && ev.ageCategories.length > 0 ? ev.ageCategories : [ev.ageCategory],
      ageCategory: (ev.ageCategories && ev.ageCategories[0]) || ev.ageCategory || 'Cadet (8 to 10)'
    }));

    setIsSaving(true);
    try {
      const payload: Partial<Tournament> = {
        title: formData.title.trim(),
        hindiTitle: formData.hindiTitle.trim() || undefined,
        edition: formData.edition.trim() || formData.title.trim(),
        category: formData.category,
        level: formData.level,
        status: formData.status,
        venue: formData.venue.trim(),
        district: formData.district.trim(),
        state: formData.state.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        registrationDeadline: formData.registrationDeadline,
        entryFeeBase: Number(formData.entryFeeBase) || 0,
        bannerUrl: formData.bannerUrl.trim() || undefined,
        prospectusUrl: formData.prospectusUrl.trim() || undefined,
        rulesPdfUrl: formData.rulesPdfUrl.trim() || undefined,
        organizer: formData.organizer.trim(),
        contactPerson: formData.contactPerson.trim(),
        contactPhone: formData.contactPhone.trim(),
        description: formData.description.trim(),
        isPublished: formData.isPublished,
        events: normalizedEvents
      };

      if (modalMode === 'create') {
        const res = await api.createTournament(payload);
        if (res.success && res.data) {
          setTournaments(prev => [res.data!, ...prev]);
          showToast(`नया टूर्नामेंट "${res.data.title}" सफलतापूर्वक बनाया गया!`);
          setIsModalOpen(false);
        } else {
          showToast(res.message || 'टूर्नामेंट बनाने में समस्या आई।', 'error');
        }
      } else if (modalMode === 'edit' && editingTournamentId) {
        const res = await api.updateTournament(editingTournamentId, payload);
        if (res.success && res.data) {
          setTournaments(prev => prev.map(t => (t.id === editingTournamentId ? { ...t, ...res.data } : t)));
          showToast(`टूर्नामेंट "${res.data.title}" सफलतापूर्वक अपडेट किया गया!`);
          setIsModalOpen(false);
        } else {
          showToast(res.message || 'टूर्नामेंट अपडेट करने में समस्या आई।', 'error');
        }
      }
    } catch (err: any) {
      console.error('Failed to save tournament:', err);
      showToast('सहेजने में त्रुटि: ' + (err?.message || 'सर्वर रिस्पॉन्स विफल'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // 6. Delete Tournament Flow
  const handleRequestDelete = (t: Tournament) => {
    setDeleteTarget(t);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await api.deleteTournament(deleteTarget.id);
      if (res.success) {
        setTournaments(prev => prev.filter(t => t.id !== deleteTarget.id));
        showToast(`टूर्नामेंट "${deleteTarget.title}" सफलतापूर्वक हटा दिया गया।`);
        setDeleteTarget(null);
      } else {
        showToast(res.message || 'टूर्नामेंट हटाने में विफल।', 'error');
      }
    } catch (err: any) {
      console.error('Failed to delete tournament:', err);
      showToast('हटाने में समस्या आई: ' + (err?.message || 'अज्ञात त्रुटि'), 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // 7. Quick Status Changer
  const handleQuickStatusChange = async (tournamentId: string, newStatus: TournamentStatus) => {
    try {
      const res = await api.updateTournament(tournamentId, { status: newStatus });
      if (res.success) {
        setTournaments(prev => prev.map(t => (t.id === tournamentId ? { ...t, status: newStatus } : t)));
        showToast(`स्थिति बदलकर "${newStatus.toUpperCase()}" कर दी गई।`);
      } else {
        showToast('स्थिति बदलने में विफल।', 'error');
      }
    } catch (err) {
      showToast('स्थिति अपडेट करने में समस्या आई।', 'error');
    }
  };

  // Filtered List
  const filteredTournaments = tournaments.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.hindiTitle && t.hindiTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      t.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.edition && t.edition.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesLevel = levelFilter === 'ALL' || t.level === levelFilter;

    return matchesSearch && matchesStatus && matchesLevel;
  });

  // Calculate quick stats
  const totalCount = tournaments.length;
  const openCount = tournaments.filter(t => t.status === 'open').length;
  const upcomingCount = tournaments.filter(t => t.status === 'upcoming').length;
  const completedCount = tournaments.filter(t => t.status === 'completed').length;
  const totalAthletesEntered = tournaments.reduce((acc, t) => acc + (t.totalRegisteredSkaters || 0), 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border animate-in slide-in-from-top-4 duration-300 ${
          toast.type === 'success' 
            ? 'bg-emerald-950/95 border-emerald-500 text-emerald-200'
            : toast.type === 'error'
              ? 'bg-red-950/95 border-red-500 text-red-200'
              : 'bg-blue-950/95 border-blue-500 text-blue-200'
        }`}>
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
          {toast.type === 'info' && <AlertTriangle className="w-5 h-5 text-blue-400 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Federation Tournament Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-black bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30 uppercase tracking-wider">
              OFFICIAL TOURNAMENT & CHAMPIONSHIP MASTER
            </span>
            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Full Admin Access (Create, Edit, Delete, Poster JPG)
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-7 h-7 text-amber-400" />
            <span>State Championships & Tournaments Manager</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            राज्य स्तरीय, जोनल व जिला रोलर स्केटिंग प्रतियोगिताओं का संपूर्ण प्रबंधन — नया टूर्नामेंट बनाएं, पूरा विवरण संपादित करें, जेपीजी पोस्टर अपलोड करें एवं हटाएं।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={loadTournaments}
            disabled={loading}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
            title="रिफ्रेश करें"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">रीफ्रेश</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
            <span>+ Add New Championship (नया टूर्नामेंट)</span>
          </button>
        </div>
      </div>

      {/* Quick Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Total Tournaments</span>
          <div className="text-2xl font-black text-white mt-1 font-mono">{totalCount}</div>
          <span className="text-[10px] text-slate-500">राज्य भर में सूचीबद्ध</span>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 p-4 rounded-2xl bg-emerald-950/10">
          <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Open for Entry
          </span>
          <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">{openCount}</div>
          <span className="text-[10px] text-emerald-400/80">रजिस्ट्रेशन चालू</span>
        </div>

        <div className="bg-slate-900 border border-blue-500/30 p-4 rounded-2xl bg-blue-950/10">
          <span className="text-[10px] text-blue-400 uppercase tracking-wider block font-bold">Upcoming</span>
          <div className="text-2xl font-black text-blue-400 mt-1 font-mono">{upcomingCount}</div>
          <span className="text-[10px] text-blue-400/80">प्रतियोगिता आगामी</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Completed</span>
          <div className="text-2xl font-black text-slate-300 mt-1 font-mono">{completedCount}</div>
          <span className="text-[10px] text-slate-500">संपन्न मुकाबले</span>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 p-4 rounded-2xl bg-amber-950/10 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-amber-400 uppercase tracking-wider block font-bold">Total Athletes</span>
          <div className="text-2xl font-black text-amber-400 mt-1 font-mono">{totalAthletesEntered}</div>
          <span className="text-[10px] text-amber-400/80">प्रतियोगी प्रविष्टियां</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by championship, venue, district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl">
            {(['ALL', 'open', 'upcoming', 'completed'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {st === 'ALL' ? 'All Status' : st.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-1.5 focus:border-amber-500 focus:outline-none"
          >
            <option value="ALL">All Levels</option>
            <option value="State">State Championship</option>
            <option value="National">National Games Trials</option>
            <option value="Zonal">Zonal Championship</option>
            <option value="District">District Championship</option>
            <option value="Invitational">State Invitational</option>
          </select>

          {/* Layout Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'cards' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tournaments List Display */}
      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-300">टूर्नामेंट रिकॉर्ड लोड हो रहे हैं...</p>
        </div>
      ) : filteredTournaments.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <Trophy className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">कोई टूर्नामेंट नहीं मिला (No Tournaments Found)</h3>
            <p className="text-xs text-slate-400">
              {searchTerm || statusFilter !== 'ALL' || levelFilter !== 'ALL'
                ? 'फ़िल्टर अथवा खोज शब्द बदल कर पुनः प्रयास करें।'
                : 'अभी तक कोई टूर्नामेंट दर्ज नहीं है। नया टूर्नामेंट जोड़ने के लिए ऊपर दिए गए बटन पर क्लिक करें।'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>+ नया टूर्नामेंट बनाएं</span>
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* ================= CARDS VIEW ================= */
        <div className="space-y-4">
          {filteredTournaments.map((t) => {
            const isEventsExpanded = expandedEventsTourId === t.id;
            return (
              <div
                key={t.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 sm:p-6 shadow-xl transition-all space-y-4 group"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Left info with poster thumbnail */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Poster thumbnail */}
                    <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0 relative flex items-center justify-center group-hover:border-amber-500/40 transition-colors">
                      {t.bannerUrl ? (
                        <img
                          src={t.bannerUrl}
                          alt={t.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <Trophy className="w-6 h-6 text-amber-400/60 mx-auto mb-1" />
                          <span className="text-[8px] text-slate-500 uppercase font-black block">No Poster</span>
                        </div>
                      )}
                      {t.bannerUrl && (
                        <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] text-amber-300 px-1 py-0.5 rounded font-mono">
                          JPG
                        </span>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded border border-blue-500/30 uppercase">
                          {t.level || 'State'}
                        </span>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded border uppercase flex items-center gap-1 ${
                          t.status === 'open'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : t.status === 'upcoming'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : t.status === 'in_progress'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                                : t.status === 'completed'
                                  ? 'bg-slate-700/40 text-slate-300 border-slate-600'
                                  : 'bg-red-500/20 text-red-300 border-red-500/40'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'open' ? 'bg-emerald-400 animate-pulse' : 'bg-current'}`}></span>
                          {t.status.replace('_', ' ')}
                        </span>
                        {t.edition && (
                          <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {t.edition}
                          </span>
                        )}
                        {!t.isPublished && (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-800/40">
                            Draft (Unpublished)
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                        {t.title}
                      </h3>
                      {t.hindiTitle && (
                        <p className="text-xs text-amber-300/80 font-medium">
                          {t.hindiTitle}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1 text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{t.venue}, {t.district}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>{t.startDate} से {t.endDate}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>Deadline: <strong className="text-amber-400 font-mono">{t.registrationDeadline}</strong></span>
                        </span>
                        <span className="flex items-center gap-1 text-emerald-400 font-mono font-bold">
                          <DollarSign className="w-3.5 h-3.5 shrink-0" />
                          <span>कुल फ़ीस: ₹{t.entryFeeBase} (सभी रेस सम्मिलित)</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions & Athletes Counter */}
                  <div className="flex sm:flex-row lg:flex-col items-end justify-between lg:justify-center gap-3 shrink-0 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xl font-mono font-black text-amber-400 leading-none">
                          {t.totalRegisteredSkaters || 0}
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                          Athletes Entered
                        </span>
                      </div>

                      {/* Quick Status Dropdown */}
                      <select
                        value={t.status}
                        onChange={(e) => handleQuickStatusChange(t.id, e.target.value as TournamentStatus)}
                        className="bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300 rounded-xl px-2.5 py-1.5 focus:border-amber-500 focus:outline-none cursor-pointer"
                        title="Quick Status Change"
                      >
                        <option value="open">🟢 Open (चालू)</option>
                        <option value="upcoming">🔵 Upcoming (आगामी)</option>
                        <option value="in_progress">🟠 In Progress (प्रगति पर)</option>
                        <option value="completed">⚪ Completed (संपन्न)</option>
                        <option value="cancelled">🔴 Cancelled (रद्द)</option>
                      </select>
                    </div>

                    {/* Action Buttons: Edit, Delete, View Events */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setExpandedEventsTourId(isEventsExpanded ? null : t.id)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t.events?.length || 0} Events</span>
                        {isEventsExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(t)}
                        className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
                        title="टूर्नामेंट पूरा एडिट करें (Full Edit Tournament)"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit (संपादित करें)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRequestDelete(t)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                        title="टूर्नामेंट हटाएं (Delete Tournament)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete (हटाएं)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sub-Events Drawer (when expanded) */}
                {isEventsExpanded && (
                  <div className="pt-4 border-t border-slate-800 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Championship Race Events & Categories ({t.events?.length || 0}):</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(t)}
                        className="text-amber-400 hover:text-amber-300 text-xs font-bold flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>+ Manage / Add Races in Edit Mode</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {t.events && t.events.length > 0 ? (
                        t.events.map((ev, idx) => {
                          const displayAgeCats = ev.ageCategories && ev.ageCategories.length > 0
                            ? ev.ageCategories
                            : (ev.ageCategory ? [ev.ageCategory] : []);

                          return (
                            <div
                              key={ev.id || idx}
                              className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5"
                            >
                              <div className="font-bold text-white flex items-center justify-between gap-1">
                                <span className="truncate">{ev.eventName}</span>
                                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
                                  फीस में सम्मिलित
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                                <span>{ev.discipline}</span>
                                <span className="text-amber-300 font-medium">👥 सभी जेंडर</span>
                              </div>
                              {ev.distance && (
                                <div className="text-[10px] text-slate-400 font-mono">
                                  दूरी: {ev.distance}
                                </div>
                              )}
                              <div className="pt-1 border-t border-slate-900">
                                <span className="text-[9px] text-slate-500 block mb-0.5 font-bold uppercase tracking-wider">
                                  पात्र आयु वर्ग ({displayAgeCats.length}):
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {displayAgeCats.map((cat, cIdx) => (
                                    <span
                                      key={cIdx}
                                      className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium truncate max-w-full"
                                    >
                                      {cat}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-3 text-center py-3 text-slate-500 text-xs">
                          No sub-events configured yet. Click "Edit" to configure races.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* ================= TABLE VIEW ================= */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-4">Poster</th>
                  <th className="py-3.5 px-4">Championship Title</th>
                  <th className="py-3.5 px-4">Level / Status</th>
                  <th className="py-3.5 px-4">Venue & District</th>
                  <th className="py-3.5 px-4">Dates & Deadline</th>
                  <th className="py-3.5 px-4">Fee / Races</th>
                  <th className="py-3.5 px-4">Athletes</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredTournaments.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-12 h-14 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shrink-0 flex items-center justify-center">
                        {t.bannerUrl ? (
                          <img
                            src={t.bannerUrl}
                            alt=""
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <Trophy className="w-4 h-4 text-amber-400/40" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-white leading-tight">{t.title}</div>
                      {t.edition && <span className="text-[10px] text-slate-400 block">{t.edition}</span>}
                      {t.hindiTitle && <span className="text-[10px] text-amber-400/80 block">{t.hindiTitle}</span>}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 block w-fit mb-1 uppercase">
                        {t.level || 'State'}
                      </span>
                      <select
                        value={t.status}
                        onChange={(e) => handleQuickStatusChange(t.id, e.target.value as TournamentStatus)}
                        className="bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-300 rounded-lg px-2 py-1 focus:border-amber-500 focus:outline-none"
                      >
                        <option value="open">🟢 Open</option>
                        <option value="upcoming">🔵 Upcoming</option>
                        <option value="in_progress">🟠 In Progress</option>
                        <option value="completed">⚪ Completed</option>
                        <option value="cancelled">🔴 Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-white font-medium truncate max-w-[180px]">{t.venue}</div>
                      <span className="text-[10px] text-slate-400 block">{t.district}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-slate-300">{t.startDate} to {t.endDate}</div>
                      <span className="text-[10px] text-amber-400 font-mono block">Deadline: {t.registrationDeadline}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono text-emerald-400 font-bold">₹{t.entryFeeBase} (कुल फ़ीस)</div>
                      <span className="text-[10px] text-slate-400">{t.events?.length || 0} Races (सभी सम्मिलित)</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono font-black text-amber-400 text-sm">
                        {t.totalRegisteredSkaters || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(t)}
                          className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 p-1.5 rounded-lg cursor-pointer"
                          title="संपादित करें (Edit)"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRequestDelete(t)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 p-1.5 rounded-lg cursor-pointer"
                          title="हटाएं (Delete)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT TOURNAMENT (FULL ACCESS WITH JPG POSTER UPLOAD)     */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30 uppercase">
                      {modalMode === 'edit' ? 'TOURNAMENT EDITOR' : 'NEW CHAMPIONSHIP'}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-bold">
                      Full Control & JPG Poster Upload
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                    {modalMode === 'edit' ? 'चैंपियनशिप विवरण संपादित करें (Edit Tournament)' : 'नया राज्य टूर्नामेंट बनाएं (Create Tournament)'}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveTournament} className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-slate-200 text-xs">
              {/* SECTION 1: Titles & Sanction Details */}
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>1. प्रतियोगिता पहचान एवं स्तर (Title & Sanction Level)</span>
                  </h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    <span className="text-xs font-bold text-emerald-400">वेबसाइट पर प्रकाशित (Published)</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      टूर्नामेंट शीर्षक (English Championship Title) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 37th Uttar Pradesh State Roller Skating Championship 2026"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      हिंदी शीर्षक (Hindi Title)
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. 37वीं उत्तर प्रदेश राज्य रोलर स्केटिंग चैंपियनशिप 2026"
                      value={formData.hindiTitle}
                      onChange={(e) => setFormData({ ...formData, hindiTitle: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      संस्करण (Edition Tag / Short Name)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 37th UP State Championship"
                      value={formData.edition}
                      onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      स्वीकृति स्तर (Sanction Level) *
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="State">State Championship (Ranking Points: 5-3-1)</option>
                      <option value="National">National Games & Championship Selection Trials</option>
                      <option value="Zonal">Zonal Championship (North/Central/East UP)</option>
                      <option value="District">District Championship</option>
                      <option value="Invitational">State Invitational Cup</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      प्रतियोगिता स्थिति (Tournament Status) *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as TournamentStatus })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="open">🟢 Open (एथलीट रजिस्ट्रेशन चालू)</option>
                      <option value="upcoming">🔵 Upcoming (आगामी घोषणा)</option>
                      <option value="in_progress">🟠 In Progress (प्रतियोगिता जारी)</option>
                      <option value="completed">⚪ Completed (प्रतियोगिता संपन्न)</option>
                      <option value="cancelled">🔴 Cancelled (रद्द)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Venue & Dates */}
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>2. वेन्यू, जिला एवं तिथियां (Venue, District & Schedule)</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      ट्रैक / एरीना का पूरा पता (Venue Track / Arena) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Synthetic 200m Banked Track, KD Singh Babu Stadium, Lucknow"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      मेजबान जिला (Host District) *
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      {UP_DISTRICTS_LIST.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      प्रारंभ तिथि (Start Date) *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      समाप्ति तिथि (End Date) *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      प्रविष्टि की अंतिम तिथि (Entry Deadline) *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.registrationDeadline}
                      onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-amber-300">
                        पूरे टूर्नामेंट की कुल निश्चित एंट्री फीस (Fixed Championship Entry Fee ₹) *
                      </label>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/40">
                        यूनिफाइड फिक्स फीस
                      </span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.entryFeeBase}
                        onChange={(e) => setFormData({ ...formData, entryFeeBase: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-amber-500/50 rounded-xl pl-7 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono font-bold"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      ✓ <strong>नियम:</strong> पूरे टूर्नामेंट की यह फीस निश्चित (Fixed) होगी। इसके अंतर्गत खिलाड़ी चाहे 1 रेस ले या कई रेस, हर रेस की अलग फीस नहीं होगी।
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      आयोजक (Organizer Body)
                    </label>
                    <input
                      type="text"
                      value={formData.organizer}
                      onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      संपर्क अधिकारी एवं फोन (Contact Person & Phone)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Name"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        className="w-1/2 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        placeholder="Phone"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        className="w-1/2 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* SECTION 3: CHAMPIONSHIP POSTER / BANNER (EXPLICIT JPG UPLOAD OPTION)     */}
              {/* ========================================================================= */}
              <div className="space-y-3 bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-amber-500/30">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <div>
                    <label className="text-sm font-bold text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span>चैंपियनशिप पोस्टर / बैनर फोटो (Upload JPG Poster / Banner)</span>
                    </label>
                    <p className="text-[11px] text-slate-400">
                      टूर्नामेंट का आधिकारिक पोस्टर या बैनर फोटो संलग्न करें (JPG, JPEG, PNG फ़ाइल समर्थित)।
                    </p>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    JPG Support Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Image Preview Box */}
                  <div className="sm:col-span-4 flex items-center justify-center">
                    <div className="w-full h-36 rounded-2xl overflow-hidden bg-slate-900 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center relative group">
                      {formData.bannerUrl ? (
                        <>
                          <img
                            src={formData.bannerUrl}
                            alt="Championship Banner"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => posterFileInputRef.current?.click()}
                              className="bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg text-[10px] font-bold"
                            >
                              बदलें (Change JPG)
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, bannerUrl: '' })}
                              className="bg-red-500 text-white p-1 rounded-lg text-[10px]"
                              title="हटाएं"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-3 space-y-1">
                          <ImageIcon className="w-8 h-8 text-slate-600 mx-auto" />
                          <span className="text-[11px] text-slate-400 font-bold block">
                            कोई पोस्टर नहीं चुना गया
                          </span>
                          <span className="text-[10px] text-slate-500">
                            JPG / PNG फ़ाइल अपलोड करें
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Controls & URL Input */}
                  <div className="sm:col-span-8 space-y-3">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      {/* Hidden File Input for JPG */}
                      <input
                        ref={posterFileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/*"
                        onChange={handlePosterUpload}
                        className="hidden"
                      />

                      {/* Primary JPG Upload Button */}
                      <button
                        type="button"
                        onClick={() => posterFileInputRef.current?.click()}
                        disabled={uploadingPoster}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer shrink-0 transition-all active:scale-95 disabled:opacity-50"
                      >
                        {uploadingPoster ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                            <span>JPG अपलोड हो रहा है...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-slate-950" />
                            <span>चैंपियनशिप पोस्टर अपलोड करें (Upload JPG Poster)</span>
                          </>
                        )}
                      </button>

                      {formData.bannerUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, bannerUrl: '' })}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          पोस्टर हटाएं
                        </button>
                      )}
                    </div>

                    {/* Direct Image URL input */}
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">
                        अथवा सीधे पोस्टर वेब URL (Web Image Link) दर्ज करें:
                      </label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/... or /storage/posters/..."
                        value={formData.bannerUrl}
                        onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>हाई-रेज़ोल्यूशन <strong>.JPG</strong>, <strong>.JPEG</strong>, <strong>.PNG</strong> या <strong>.WebP</strong> पोस्टर फ़ाइल समर्थित हैं (अधिकतम 10MB)।</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Circular & Prospectus Documents */}
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>4. सर्कुलर व नियम विवरण (Circular, Rulebook & Description)</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      सर्कुलर / प्रॉस्पेक्टस पीडीएफ लिंक (Official Prospectus URL)
                    </label>
                    <input
                      type="text"
                      placeholder="https://... or /api/files/prospectus.pdf"
                      value={formData.prospectusUrl}
                      onChange={(e) => setFormData({ ...formData, prospectusUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      तकनीकी नियम पुस्तिका (Rules & Guidelines PDF URL)
                    </label>
                    <input
                      type="text"
                      placeholder="https://... or /api/files/rules-rsfi-2026.pdf"
                      value={formData.rulesPdfUrl}
                      onChange={(e) => setFormData({ ...formData, rulesPdfUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      प्रतियोगिता विवरण एवं नियम निर्देश (Championship Guidelines / Eligibility)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter technical guidelines, age reckoning criteria, reporting time, etc."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: Race Categories / Sub-Events Builder */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span>5. रेस श्रेणियां एवं इवेंट्स (Championship Race Events: {formData.events.length})</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      • पूरे टूर्नामेंट की फिक्स फीस <strong className="text-amber-300">₹{formData.entryFeeBase}</strong> है (हर रेस की अलग फीस नहीं होगी)।<br />
                      • सभी रेस सभी जेंडर (बालक एवं बालिका दोनों) के लिए खुली हैं।<br />
                      • प्रत्येक रेस के नीचे चुनें कि <strong>कौन-कौन से एज ग्रुप</strong> के बच्चे यह मैच खेलेंगे ताकि केवल वही बच्चे इस रेस में रजिस्ट्रेशन कर सकें।
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddEvent}
                    className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0 self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Race Event (रेस जोड़ें)</span>
                  </button>
                </div>

                <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
                  {formData.events.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
                      <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-xs text-slate-400 font-medium">कोई रेस इवेंट नहीं जोड़ा गया है।</p>
                      <button
                        type="button"
                        onClick={handleAddEvent}
                        className="mt-2 text-xs text-amber-400 hover:underline font-bold cursor-pointer"
                      >
                        + पहली रेस जोड़ें
                      </button>
                    </div>
                  ) : (
                    formData.events.map((ev, idx) => {
                      const selectedAgeCats = ev.ageCategories && ev.ageCategories.length > 0
                        ? ev.ageCategories
                        : (ev.ageCategory ? [ev.ageCategory] : []);
                      const isAllAges = selectedAgeCats.length === AGE_CATEGORIES_2026.length;

                      return (
                        <div
                          key={ev.id || idx}
                          className="p-3.5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl space-y-3 transition-colors"
                        >
                          {/* Race Card Top Header */}
                          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center justify-center font-mono">
                                {idx + 1}
                              </span>
                              <span className="text-xs font-bold text-white">
                                {ev.eventName || `Race #${idx + 1}`}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-medium">
                                👥 All Genders (बालक व बालिका)
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/30 font-medium">
                                💰 फीस: ₹{formData.entryFeeBase} में सम्मिलित (₹0 अतिरिक्त)
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveEvent(ev.id)}
                              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                              title="रेस हटाएं (Delete Race)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Row 1: Race Name, Discipline, Distance */}
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                            <div className="sm:col-span-5">
                              <label className="text-[10px] font-bold text-slate-300 block mb-1">
                                Event Name (रेस का नाम) *
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. 500m + D Sprint, 1000m Rink Race, Slalom"
                                value={ev.eventName}
                                onChange={(e) => handleUpdateEvent(idx, 'eventName', e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                              />
                            </div>

                            <div className="sm:col-span-4">
                              <label className="text-[10px] font-bold text-slate-300 block mb-1">
                                Discipline (खेल विधा) *
                              </label>
                              <select
                                value={ev.discipline}
                                onChange={(e) => handleUpdateEvent(idx, 'discipline', e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                              >
                                {DISCIPLINES.map(d => (
                                  <option key={d.id} value={d.name}>{d.name}</option>
                                ))}
                              </select>
                            </div>

                            <div className="sm:col-span-3">
                              <label className="text-[10px] font-bold text-slate-300 block mb-1">
                                Distance / Track (दूरी या ट्रैक)
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. 500m, 1000m, Road, Rink"
                                value={ev.distance || ''}
                                onChange={(e) => handleUpdateEvent(idx, 'distance', e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                              />
                            </div>
                          </div>

                          {/* Row 2: Age Category Selector (कौन कौन से एज ग्रुप यह मैच खेलेंगे) */}
                          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                              <div>
                                <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                                  <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                                  <span>पात्र आयु वर्ग (Select Eligible Age Groups for this Match) *</span>
                                </span>
                                <p className="text-[10px] text-slate-400">
                                  चुनें कि कौन-कौन से आयु वर्ग के बच्चे यह रेस खेलेंगे (वही बच्चे इस रेस को ले पाएंगे):
                                </p>
                              </div>

                              {/* Quick Presets */}
                              <div className="flex items-center gap-1 flex-wrap">
                                <span className="text-[10px] text-slate-500 mr-1">त्वरित चयन:</span>
                                <button
                                  type="button"
                                  onClick={() => handleSetAgeGroupPreset(idx, 'all')}
                                  className={`text-[10px] px-2 py-0.5 rounded-md border font-medium cursor-pointer transition-colors ${
                                    isAllAges 
                                      ? 'bg-amber-500/30 text-amber-200 border-amber-500/60 font-bold'
                                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                                  }`}
                                >
                                  सभी (All)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSetAgeGroupPreset(idx, 'cadet')}
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium cursor-pointer"
                                >
                                  कैडेट (Under 12)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSetAgeGroupPreset(idx, 'junior')}
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium cursor-pointer"
                                >
                                  सब-जूनियर/जूनियर (12-18)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSetAgeGroupPreset(idx, 'senior')}
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium cursor-pointer"
                                >
                                  सीनियर+ (18+)
                                </button>
                              </div>
                            </div>

                            {/* Clickable Age Category Badges Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                              {AGE_CATEGORIES_2026.map(cat => {
                                const isSelected = selectedAgeCats.includes(cat.category);
                                return (
                                  <button
                                    key={cat.category}
                                    type="button"
                                    onClick={() => handleToggleAgeCategory(idx, cat.category)}
                                    className={`px-2.5 py-1.5 rounded-lg text-left text-[11px] border transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                                      isSelected
                                        ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold shadow-xs'
                                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                                    }`}
                                  >
                                    <div className="truncate">
                                      <div className="truncate">{cat.category}</div>
                                      <div className="text-[9px] text-slate-500 truncate">{cat.cutoffDescription}</div>
                                    </div>
                                    {isSelected ? (
                                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                    ) : (
                                      <Square className="w-3 h-3 text-slate-600 shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Summary text */}
                            <div className="pt-1 flex items-center justify-between text-[10px]">
                              {selectedAgeCats.length > 0 ? (
                                <span className="text-emerald-400 font-medium flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  <span>
                                    {selectedAgeCats.length} आयु वर्ग चयनित: {selectedAgeCats.join(', ')}
                                  </span>
                                </span>
                              ) : (
                                <span className="text-red-400 font-bold flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 text-red-400" />
                                  <span>कोई आयु वर्ग नहीं चुना गया! कम से कम 1 वर्ग चुनें।</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Info Footer for this Race */}
                          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-1 border-t border-slate-900">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                              <span>लिंग पात्रता: <strong>सभी जेंडर (बालक व बालिका) मान्य</strong></span>
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
                              <span>प्रविष्टि शुल्क: <strong>टूर्नामेंट फीस (₹{formData.entryFeeBase}) में पूर्णतः सम्मिलित</strong></span>
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors disabled:opacity-50"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>सहेजा जा रहा है...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{modalMode === 'edit' ? 'अपडेट सेव करें (Save Changes)' : 'टूर्नामेंट प्रकाशित करें (Save & Publish)'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE CONFIRMATION (IN-APP MODAL TO BYPASS IFRAME RESTRICTIONS)   */}
      {/* ========================================================================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-red-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-slate-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-base font-bold text-white">टूर्नामेंट स्थायी रूप से हटाएं?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  क्या आप वाकई यह टूर्नामेंट डेटाबेस से हटाना चाहते हैं? यह क्रिया सार्वजनिक पोर्टल और रजिस्ट्रेशन से इस प्रतियोगिता को हटा देगी।
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>टूर्नामेंट नाम:</span>
                <span className="font-bold text-white text-right max-w-[220px] truncate">{deleteTarget.title}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>वेन्यू / जिला:</span>
                <span className="text-slate-200">{deleteTarget.district}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>दिनांक:</span>
                <span className="font-mono text-amber-400">{deleteTarget.startDate} to {deleteTarget.endDate}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>पंजीकृत खिलाड़ी:</span>
                <span className="font-mono font-bold text-emerald-400">{deleteTarget.totalRegisteredSkaters || 0}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>हटाया जा रहा है...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>हाँ, टूर्नामेंट हटाएं (Delete)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
