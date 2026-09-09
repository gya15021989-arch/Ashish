import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  X,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  Search,
  Filter,
  Trophy,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Hash,
  Building,
  MapPin,
  Calendar,
  Layers,
  ChevronDown,
  RefreshCw,
  Edit2,
  Save,
  Tag
} from 'lucide-react';
import { Tournament, TournamentRegistration } from '../../types';
import { api } from '../../services/api';

interface TournamentEntriesModalProps {
  tournament: Tournament | null; // If null, can show all tournaments or selected one
  allTournaments: Tournament[];
  isOpen: boolean;
  onClose: () => void;
}

export const TournamentEntriesModal: React.FC<TournamentEntriesModalProps> = ({
  tournament,
  allTournaments,
  isOpen,
  onClose
}) => {
  const [selectedTourId, setSelectedTourId] = useState<string>(tournament?.id || 'ALL');
  const [registrations, setRegistrations] = useState<TournamentRegistration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterDiscipline, setFilterDiscipline] = useState('ALL');
  const [filterGender, setFilterGender] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Inline editing of chest number / bib
  const [editingRegId, setEditingRegId] = useState<string | null>(null);
  const [tempChestNo, setTempChestNo] = useState('');

  useEffect(() => {
    if (tournament) {
      setSelectedTourId(tournament.id);
    } else if (allTournaments.length > 0 && selectedTourId === 'ALL') {
      setSelectedTourId('ALL');
    }
  }, [tournament, allTournaments]);

  useEffect(() => {
    if (isOpen) {
      loadRegistrations();
    }
  }, [isOpen, selectedTourId]);

  const loadRegistrations = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = selectedTourId && selectedTourId !== 'ALL' ? { tournamentId: selectedTourId } : {};
      const res = await api.getRegistrations(params);
      if (res.success && res.data) {
        setRegistrations(res.data);
      } else {
        setRegistrations([]);
      }
    } catch (e: any) {
      console.error('Failed to load tournament entries:', e);
      setError('प्रविष्टियां लोड करने में समस्या आई।');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentTour = allTournaments.find(t => t.id === selectedTourId) || tournament;

  // Extract events list for columns
  const getEventNames = (reg: TournamentRegistration): string[] => {
    if (Array.isArray(reg.selectedEvents)) {
      return reg.selectedEvents.map((ev: any) => {
        if (typeof ev === 'string') {
          // If it's an ID, try matching or format
          return ev.replace('ev-', 'Event ');
        }
        return ev.eventName || ev.distance || ev.title || 'Race';
      });
    }
    return [];
  };

  // Find max event count among registrations to determine dynamic event column headers
  const maxEventsCount = registrations.reduce((max, reg) => {
    const count = getEventNames(reg).length;
    return count > max ? count : max;
  }, 2); // Minimum 2 event columns as in user prompt: "Events / Races (500m+D)", "Events / Races (1000m)"

  // Filtered registrations
  const filteredRegistrations = registrations.filter(r => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.skaterName.toLowerCase().includes(q) ||
      (r.fatherName && r.fatherName.toLowerCase().includes(q)) ||
      (r.club && r.club.toLowerCase().includes(q)) ||
      (r.district && r.district.toLowerCase().includes(q)) ||
      (r.bibNumber && r.bibNumber.toLowerCase().includes(q)) ||
      (r.chestNumber && r.chestNumber.toLowerCase().includes(q)) ||
      (r.skaterRegNo && r.skaterRegNo.toLowerCase().includes(q));

    const matchesDistrict = filterDistrict === 'ALL' || r.district === filterDistrict;
    const matchesCategory = filterCategory === 'ALL' || r.ageCategory === filterCategory;
    const matchesDiscipline = filterDiscipline === 'ALL' || (r.discipline && r.discipline.toLowerCase().includes(filterDiscipline.toLowerCase()));
    const matchesGender = filterGender === 'ALL' || r.gender === filterGender;
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;

    return matchesSearch && matchesDistrict && matchesCategory && matchesDiscipline && matchesGender && matchesStatus;
  });

  // Unique dropdown values
  const uniqueDistricts = Array.from(new Set(registrations.map(r => r.district).filter(Boolean))).sort();
  const uniqueCategories = Array.from(new Set(registrations.map(r => r.ageCategory).filter(Boolean))).sort();
  const uniqueDisciplines = Array.from(new Set(registrations.map(r => r.discipline).filter(Boolean))).sort();

  // Helper to format DOB to DD-MM-YYYY
  const formatDOB = (dateStr?: string) => {
    if (!dateStr) return '';
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts[0].length === 4) {
        // YYYY-MM-DD -> DD-MM-YYYY
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      return dateStr;
    }
    return dateStr;
  };

  // Helper: Get clean category string (e.g., "10-12 year", "12-15 year", "Ab-18")
  const formatCategory = (cat: string) => {
    if (!cat) return '';
    if (cat.includes('10 to 12')) return '10-12 year';
    if (cat.includes('12 to 15')) return '12-15 year';
    if (cat.includes('8 to 10')) return '8-10 year';
    if (cat.includes('5 to 7') || cat.includes('Under 5')) return 'Under 8';
    if (cat.includes('15 to 17') || cat.includes('Junior')) return '15-17 year';
    if (cat.includes('Above 17') || cat.includes('Senior') || cat.includes('Masters')) return 'Ab-18';
    return cat;
  };

  // Helper: Get clean discipline string (e.g., "Speed Inline", "Toy Inline", "Speed Quad")
  const formatDiscipline = (disc: string) => {
    if (!disc) return 'Speed Inline';
    if (disc.includes('Inline') && disc.includes('Speed')) return 'Speed Inline';
    if (disc.includes('Quad')) return 'Speed Quad';
    if (disc.includes('Toy') || disc.includes('Tenacity')) return 'Toy Inline';
    if (disc.includes('Freestyle')) return 'Inline Freestyle';
    if (disc.includes('Artistic')) return 'Artistic Skating';
    return disc;
  };

  // 1. Export Exact CSV in the user's requested specification:
  // Chest No,Name,Father Name,Category,Gender,DOB,Club / Academy,District,Discipline (Speed Inline),Events / Races (500m+D),Events / Races (1000m)
  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) {
      setError('डाउनलोड करने के लिए कोई प्रविष्टि नहीं है।');
      return;
    }

    // Build dynamic header
    const headers = [
      'Chest No',
      'Name',
      'Father Name',
      'Category',
      'Gender',
      'DOB',
      'Club / Academy',
      'District',
      'Discipline (Speed Inline)'
    ];

    const eventCount = Math.max(maxEventsCount, 2);
    for (let i = 1; i <= eventCount; i++) {
      if (i === 1) headers.push('Events / Races (500m+D)');
      else if (i === 2) headers.push('Events / Races (1000m)');
      else headers.push(`Events / Races (Race ${i})`);
    }

    const csvRows: string[] = [];
    csvRows.push(headers.join(','));

    filteredRegistrations.forEach((r, idx) => {
      const chestNo = r.chestNumber || r.bibNumber || String(idx + 1);
      const name = r.skaterName || '';
      const father = r.fatherName || '';
      const category = formatCategory(r.ageCategory);
      const gender = r.gender || '';
      const dob = formatDOB(r.dob);
      const club = r.club || '';
      const district = r.district || '';
      const discipline = formatDiscipline(r.discipline);
      const eventNames = getEventNames(r);

      const rowValues = [
        `"${chestNo}"`,
        `"${name}"`,
        `"${father}"`,
        `"${category}"`,
        `"${gender}"`,
        `"${dob}"`,
        `"${club}"`,
        `"${district}"`,
        `"${discipline}"`
      ];

      for (let i = 0; i < eventCount; i++) {
        const evName = eventNames[i] || (i === 0 ? '500m+D' : (i === 1 ? '1000m Sprint' : ''));
        rowValues.push(`"${evName}"`);
      }

      csvRows.push(rowValues.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const tourSlug = currentTour?.title ? currentTour.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30) : 'Tournament';
    link.setAttribute('href', url);
    link.setAttribute('download', `UPRSA_Tournament_Entries_${tourSlug}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSuccessMessage(`CSV फ़ाइल (${filteredRegistrations.length} छात्र/एथलीट) सफलतापूर्वक डाउनलोड हो गई!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // 2. Export Excel (.xlsx)
  const handleExportExcel = () => {
    if (filteredRegistrations.length === 0) {
      setError('डाउनलोड करने के लिए कोई प्रविष्टि नहीं है।');
      return;
    }

    const eventCount = Math.max(maxEventsCount, 2);

    const rows = filteredRegistrations.map((r, idx) => {
      const chestNo = r.chestNumber || r.bibNumber || String(idx + 1);
      const eventNames = getEventNames(r);

      const rowObj: Record<string, any> = {
        'Chest No': chestNo,
        'Name': r.skaterName || '',
        'Father Name': r.fatherName || '',
        'Category': formatCategory(r.ageCategory),
        'Gender': r.gender || '',
        'DOB': formatDOB(r.dob),
        'Club / Academy': r.club || '',
        'District': r.district || '',
        'Discipline (Speed Inline)': formatDiscipline(r.discipline)
      };

      for (let i = 0; i < eventCount; i++) {
        const headerKey = i === 0 ? 'Events / Races (500m+D)' : (i === 1 ? 'Events / Races (1000m)' : `Events / Races (Race ${i + 1})`);
        rowObj[headerKey] = eventNames[i] || (i === 0 ? '500m+D' : (i === 1 ? '1000m Sprint' : ''));
      }

      // Also append extra operational columns for tournament desk
      rowObj['State Reg No'] = r.skaterRegNo || '';
      rowObj['Payment UTR'] = r.paymentUtr || 'N/A';
      rowObj['Fee Amount (₹)'] = r.totalFee || 800;
      rowObj['Status'] = (r.status || 'pending').toUpperCase();

      return rowObj;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tournament_Entries');

    worksheet['!cols'] = [
      { wch: 10 }, // Chest No
      { wch: 22 }, // Name
      { wch: 20 }, // Father Name
      { wch: 14 }, // Category
      { wch: 10 }, // Gender
      { wch: 14 }, // DOB
      { wch: 24 }, // Club / Academy
      { wch: 16 }, // District
      { wch: 18 }, // Discipline
      { wch: 22 }, // Race 1
      { wch: 22 }, // Race 2
      { wch: 20 }, // State Reg No
      { wch: 20 }, // UTR
      { wch: 14 }, // Fee
      { wch: 12 }  // Status
    ];

    const tourSlug = currentTour?.title ? currentTour.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30) : 'Tournament';
    XLSX.writeFile(workbook, `UPRSA_Tournament_Entries_${tourSlug}_${new Date().toISOString().split('T')[0]}.xlsx`);

    setSuccessMessage(`Excel फ़ाइल (.xlsx) सफलतापूर्वक डाउनलोड हो गई (${filteredRegistrations.length} एथलीट रिकॉर्ड्स)!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // 3. Auto-assign sequential Chest/Bib Numbers
  const handleAutoAssignChestNumbers = async () => {
    if (filteredRegistrations.length === 0) return;
    if (!window.confirm(`क्या आप फ़िल्टर किए गए ${filteredRegistrations.length} एथलीटों को 1 से क्रमवार चेस्ट नंबर (1, 2, 3...) असाइन करना चाहते हैं?`)) {
      return;
    }

    setLoading(true);
    try {
      for (let i = 0; i < filteredRegistrations.length; i++) {
        const reg = filteredRegistrations[i];
        const newChest = String(i + 1);
        await api.updateRegistrationStatus(reg.id, reg.status, newChest);
      }
      await loadRegistrations();
      setSuccessMessage(`सभी ${filteredRegistrations.length} एथलीटों को चेस्ट नंबर 1 से ${filteredRegistrations.length} तक असाइन कर दिए गए!`);
    } catch (e) {
      setError('चेस्ट नंबर असाइन करने में त्रुटि हुई।');
    } finally {
      setLoading(false);
    }
  };

  // 4. Save individual chest number
  const handleSaveChestNumber = async (regId: string) => {
    try {
      const reg = registrations.find(r => r.id === regId);
      if (!reg) return;
      await api.updateRegistrationStatus(regId, reg.status, tempChestNo.trim());
      setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, chestNumber: tempChestNo.trim(), bibNumber: tempChestNo.trim() } : r));
      setEditingRegId(null);
    } catch (e) {
      setError('चेस्ट नंबर सहेजने में विफल।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-7xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-5 sm:p-6 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-black bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded border border-amber-500/30 uppercase">
                  CHAMPIONSHIP ENTRY ROSTER DESK
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  {filteredRegistrations.length} Athlete Entries
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                टूर्नामेंट फॉर्म भरने वाले एथलीट व छात्रों की सूची (Download Details)
              </h2>
            </div>
          </div>

          {/* Action Buttons: CSV, Excel, Print, Close */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={handleExportCSV}
              disabled={loading || filteredRegistrations.length === 0}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer"
              title="दी गई फॉर्मेट में CSV फ़ाइल डाउनलोड करें (Chest No, Name, Father Name, Category, Gender, DOB, Club, District, Discipline, Events...)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV (Requested Format)</span>
            </button>

            <button
              onClick={handleExportExcel}
              disabled={loading || filteredRegistrations.length === 0}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all cursor-pointer"
              title="एक्सेल (.xlsx) फ़ाइल डाउनलोड करें"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Excel (.xlsx)</span>
            </button>

            <button
              onClick={() => window.print()}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="प्रिंट निकालें"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feedback messages */}
        {successMessage && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/40 text-emerald-200 px-6 py-2.5 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-950/90 border-b border-red-500/40 text-red-200 px-6 py-2.5 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tournament Selector & Filter Bar */}
        <div className="bg-slate-950/90 p-4 border-b border-slate-800 space-y-3 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Tournament Selector */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-400" />
                <span>चैंपियनशिप चुनें (Select Tournament)</span>
              </label>
              <select
                value={selectedTourId}
                onChange={(e) => setSelectedTourId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="ALL">🏆 सभी प्रतियोगिताएं (All Tournaments - Consolidated)</option>
                {allTournaments.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.status.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Search query */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
                <Search className="w-3 h-3 text-blue-400" />
                <span>एथलीट, पिता, क्लब या चेस्ट नं. खोजें</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Aarav, Rajesh Sharma, Apex Club, Lucknow..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Quick Auto-Assign Chest Numbers Button */}
            <div className="flex items-end">
              <button
                onClick={handleAutoAssignChestNumbers}
                disabled={loading || filteredRegistrations.length === 0}
                className="w-full bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 hover:border-amber-500 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="सभी को क्रमवार चेस्ट नंबर (1, 2, 3...) दें"
              >
                <Hash className="w-3.5 h-3.5 text-amber-400" />
                <span>Auto-Assign Chest No (1, 2, 3...)</span>
              </button>
            </div>
          </div>

          {/* Sub-Filters: District, Category, Discipline, Gender */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">सभी जिले (All Districts)</option>
              {uniqueDistricts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">सभी आयु वर्ग (All Categories)</option>
              {uniqueCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={filterDiscipline}
              onChange={(e) => setFilterDiscipline(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">सभी खेल विधाएं (All Disciplines)</option>
              {uniqueDisciplines.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">सभी जेंडर (All Genders)</option>
              <option value="Male">Male (बालक / पुरुष)</option>
              <option value="Female">Female (बालिका / महिला)</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-4 min-h-[350px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
              <p className="text-xs font-semibold">एथलीट प्रविष्टियां लोड हो रही हैं...</p>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <Users className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">कोई प्रविष्टि नहीं मिली</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                इस टूर्नामेंट के लिए अभी कोई फॉर्म प्राप्त नहीं हुआ है या आपके खोजे गए फिल्टर में कोई एथलीट उपलब्ध नहीं है।
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  <th className="py-3 px-3 text-center w-16">Chest No</th>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Father Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Gender</th>
                  <th className="py-3 px-3">DOB</th>
                  <th className="py-3 px-3">Club / Academy</th>
                  <th className="py-3 px-3">District</th>
                  <th className="py-3 px-3">Discipline</th>
                  <th className="py-3 px-3">Race 1 (500m+D)</th>
                  <th className="py-3 px-3">Race 2 (1000m)</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredRegistrations.map((reg, idx) => {
                  const chestNo = reg.chestNumber || reg.bibNumber || String(idx + 1);
                  const eventNames = getEventNames(reg);
                  const isEditingThis = editingRegId === reg.id;

                  return (
                    <tr key={reg.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Chest No (Editable) */}
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-400">
                        {isEditingThis ? (
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="text"
                              autoFocus
                              value={tempChestNo}
                              onChange={(e) => setTempChestNo(e.target.value)}
                              className="w-14 bg-slate-950 border border-amber-500 rounded px-1.5 py-0.5 text-center text-xs text-white"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveChestNumber(reg.id);
                                if (e.key === 'Escape') setEditingRegId(null);
                              }}
                            />
                            <button
                              onClick={() => handleSaveChestNumber(reg.id)}
                              className="text-emerald-400 hover:text-emerald-300"
                              title="Save"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setEditingRegId(reg.id);
                              setTempChestNo(chestNo);
                            }}
                            className="cursor-pointer hover:bg-slate-800 px-2 py-0.5 rounded flex items-center justify-center gap-1 group"
                            title="क्लिक करके चेस्ट नंबर बदलें"
                          >
                            <span>{chestNo}</span>
                            <Edit2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-slate-400" />
                          </div>
                        )}
                      </td>

                      {/* Name */}
                      <td className="py-2.5 px-3 text-white font-bold whitespace-nowrap">
                        {reg.skaterName}
                        {reg.skaterRegNo && (
                          <span className="block text-[10px] text-slate-500 font-mono font-normal">
                            {reg.skaterRegNo}
                          </span>
                        )}
                      </td>

                      {/* Father Name */}
                      <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">
                        {reg.fatherName || '—'}
                      </td>

                      {/* Category */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="bg-slate-800 text-amber-300 px-2 py-0.5 rounded font-mono text-[11px] border border-slate-700">
                          {formatCategory(reg.ageCategory)}
                        </span>
                      </td>

                      {/* Gender */}
                      <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">
                        {reg.gender}
                      </td>

                      {/* DOB */}
                      <td className="py-2.5 px-3 font-mono text-slate-300 whitespace-nowrap">
                        {formatDOB(reg.dob) || '—'}
                      </td>

                      {/* Club / Academy */}
                      <td className="py-2.5 px-3 text-slate-300 max-w-[180px] truncate" title={reg.club}>
                        {reg.club || 'Independent'}
                      </td>

                      {/* District */}
                      <td className="py-2.5 px-3 text-slate-300 font-medium whitespace-nowrap">
                        {reg.district}
                      </td>

                      {/* Discipline */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="text-amber-400 font-medium">
                          {formatDiscipline(reg.discipline)}
                        </span>
                      </td>

                      {/* Race 1 */}
                      <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px] whitespace-nowrap">
                        {eventNames[0] || '500m+D'}
                      </td>

                      {/* Race 2 */}
                      <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px] whitespace-nowrap">
                        {eventNames[1] || '1000m Sprint'}
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase border ${
                          reg.status === 'confirmed'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        }`}>
                          {reg.status || 'PENDING'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>
              कुल प्रविष्टियां: <strong className="text-white font-mono">{filteredRegistrations.length}</strong> छात्र/एथलीट
            </span>
            <span className="text-slate-600">|</span>
            <span>
              UPRSA State Secretariat Official Competition Master
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={filteredRegistrations.length === 0}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV (Requested Format)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
